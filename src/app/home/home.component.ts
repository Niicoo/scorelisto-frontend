import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpRequest, HttpEventType,HttpClient,HttpHeaders } from '@angular/common/http';
import { RecorderComponent } from '../recorder/recorder.component';
import { ProgressionBarComponent } from 'src/app/progression-bar/progression-bar.component';
import { Subscription } from 'rxjs';
import { TaskManagerService, TaskState } from 'src/app/backend-services/task-manager.service';
import { ProjectManagerService } from 'src/app/backend-services/project-manager.service';
import { FileInputComponent } from 'src/app/file-input/file-input.component';

import * as Highcharts from "highcharts";

//Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isUploadCollapsed:boolean = false;
  isRecordCollapsed:boolean = true;
  isFirstTimeAskingRecording:boolean = true;
  isConversionRunning:boolean = false;
  isConversionSuccess:boolean = false;
  isConversionError:boolean = false;
  selectedFile:any = null;

  // Subscription to task
  stateSubscription:Subscription;
  // Creating project attributes
  FreeConverterForm = this.fb.group({
    email: ['']
  });

  @ViewChild(RecorderComponent) childRecorder:RecorderComponent;
  @ViewChild(FileInputComponent) childFileInput:FileInputComponent;
  @ViewChild(ProgressionBarComponent) childProgression:ProgressionBarComponent;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private projectManager: ProjectManagerService,
              public taskManager: TaskManagerService) { }

  ngOnInit() {
    this.childRecorder.file.subscribe(file => this.updateFile(file));
    this.childFileInput.file.subscribe(file => this.updateFile(file));
  }

  updateFile(file) {
    this.selectedFile = file;
  }

  clickOnRecord() {
    if(this.isFirstTimeAskingRecording){
      this.childRecorder.AskUserMedia();
    }
    this.isRecordCollapsed = !this.isRecordCollapsed;
    this.isUploadCollapsed = true;
  }
  clickOnUpload() {
    this.isUploadCollapsed = !this.isUploadCollapsed;
    this.isRecordCollapsed = true;
  }
  onSubmitFreeConversion() {
    let formData: FormData = new FormData();
    formData.append("email", this.FreeConverterForm.value.email);
    formData.append("file", this.selectedFile);
    this.projectManager.run_free_conversion(formData)
      .subscribe(
        task => {this.followTask(task.task_id);},
        error => {console.log("Failed to run free converter")}
      );
  }

  followTask(task_id:string){
    this.isConversionRunning = true;
    this.taskManager.addTaskToFollow(task_id, true);
    this.stateSubscription = this.taskManager.tasks[task_id]
      .subscribe(
        value => {this.updateProgression(task_id, value);}
      );
  }
  updateProgression(taskId:string, task:TaskState){
    this.childProgression.task = task;
    if((task.status != "STARTED") && (task.status != "PENDING") && (task.status != "")){
      this.stateSubscription.unsubscribe();
      this.isConversionRunning = false;
    }
    if(task.status == "SUCCESS"){
      this.childProgression.task.progression = 100;
      this.childProgression.task.total = 100;
      this.isConversionSuccess = true;
    }
    if(task.status == "FAILURE"){
      this.isConversionError = true;
    }
  }

    //console.log("kikou");
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'enctype':  'multipart/form-data',
    //     'Access-Control-Allow-Origin': 'localhost:4200',
    //   }),
    //   reportProgress: true,
    //   //reportProgress: true,
    // };
    // const formData = new FormData();

    // // Append files to the virtual form.
    // for (const file of files) {
    //   formData.append("audiofile", file)
    // }
    // formData.append("name", "nomproject5");

    // // Send it.
    // return this.http.post(`http://127.0.0.1:8000/project/`, formData, httpOptions)
    //   .subscribe(
    //     (res)=> {
    //       console.log(res);
    //     },
    //     event => {
    //     if (event.type === HttpEventType.UploadProgress)
    //       console.log(Math.round(100 * event.loaded / event.total));
    //     else if (event.type === HttpEventType.Response)
    //       console.log(event.body.toString());
    //     }
    //   );
  // }

  // onSubmitFreeConversion() {
  //   console.log(this.FreeConverterForm.value);
  //   this.backend.post_newproject(this.FreeConverterForm.value)
  //     .subscribe(
  //       // success path
  //       response => {
  //         console.log(response);
  //         // this.router.navigate(['/home']);
  //       }, 
  //       // error path
  //       error => {
  //         console.log(error);
  //       }
  //     );
  // }

}
