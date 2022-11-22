import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { ProjectManagerService, ProjectOutput } from '../../../backend-services/project-manager.service';
import { Router } from '@angular/router';
import { RecorderComponent } from 'src/app/recorder/recorder.component';
import { FileInputComponent } from 'src/app/file-input/file-input.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  // Existing projects
  ListOfProjects:ProjectOutput[];

  // Creating project attributes
  CreateNewProjectForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9 ]{2,32}[a-zA-Z0-9]$')]
    ],
    instrument: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9 ]{2,32}[a-zA-Z0-9]$')]
    ]
  });

  // Recorder attributes
  isUploadCollapsed:boolean = false;
  isRecordCollapsed:boolean = true;
  isFirstTimeAskingRecording:boolean = true;
  selectedFile:any = null;

  // Recorder
  @ViewChild(RecorderComponent) childRecorder:RecorderComponent;
  @ViewChild(FileInputComponent) childFileInput:FileInputComponent;

  constructor(private projectManager: ProjectManagerService,
              private fb: FormBuilder,
              private router: Router) {
    this.projectManager.projects.subscribe( value => {this.ListOfProjects = value;});
  }

  ngOnInit() {
    this.childRecorder.file.subscribe(file => this.updateFile(file));
    this.childFileInput.file.subscribe(file => this.updateFile(file));
  }

  updateFile(file) {
    this.selectedFile = file;
  }

  onSubmitCreateProject() {
    let formData: FormData = new FormData();
    formData.append("name", this.CreateNewProjectForm.value.name);
    formData.append("instrument", this.CreateNewProjectForm.value.instrument);
    formData.append("audiofile",this.selectedFile);
    this.projectManager.post_newproject(formData)
      .subscribe(
        id => {this.router.navigateByUrl("converter/project/" + id );},
        error => {console.log("Failed to create project")}
      );
  }
  
  // Recorder
  ///////////////////////////////////////////
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
  ///////////////////////////////////////////
}
