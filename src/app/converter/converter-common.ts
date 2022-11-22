import { ParametersManagerService } from 'src/app/backend-services/parameters-manager.service';
import { Subscription } from 'rxjs';
import { TaskManagerService, TaskState, DefaultTaskState } from 'src/app/backend-services/task-manager.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectManagerService, ProjectOutput, TaskOutProject } from 'src/app/backend-services/project-manager.service';
import { ActivatedRoute } from "@angular/router";
import * as Highcharts from "highcharts";
import { ProgressionBarComponent } from 'src/app/progression-bar/progression-bar.component';
import { ViewChild } from '@angular/core';

import { PitchParametersComponent } from 'src/app/pitch-parameters/pitch-parameters.component';
import { StepParametersComponent } from 'src/app/step-parameters/step-parameters.component';
import { RhythmParametersComponent } from 'src/app/rhythm-parameters/rhythm-parameters.component';

import { PitchParameterOutput } from 'src/app/backend-services/parameters-manager.service';
import { StepParameterOutput } from 'src/app/backend-services/parameters-manager.service';
import { RythmParameterOutput } from 'src/app/backend-services/parameters-manager.service';
import { GlobalParameterOutput } from 'src/app/backend-services/parameters-manager.service';


// export const PitchChartOpts: any = {
//   chart: {zoomType: 'x'},
//   boost: {useGPUTranslations: true},
//   title: {text: 'Pitch along time'},
//   xAxis: {title: {text: 'Time [s]'}},
//   yAxis: {title: {text: 'Pitch [SemiTone]'}},
//   legend: {enabled: false},
//   plotOptions: {
//       area: {
//           fillColor: {
//               linearGradient: {
//                   x1: 0,
//                   y1: 0,
//                   x2: 0,
//                   y2: 1
//               },
//               stops: [
//                   [0, Highcharts.getOptions().colors[0]],
//                   [1, 'rgba(100, 80, 50, 0.0)']
//               ]
//           },
//           marker: {radius: 2},
//           lineWidth: 1,
//           states: {hover: {lineWidth: 1}},
//           threshold: null
//       }
//   }
// };

export const PitchChartOpts: any = {
  chart: {zoomType: 'xy', panning: true},
  boost: {useGPUTranslations: true},
  title: {text: 'Pitch along time'},
  xAxis: {title: {text: 'Time [s]'}},
  yAxis: {title: {text: 'Pitch [SemiTone]'}},
  legend: {enabled: false}
};

export const EnergyChartOpts: any = {
  chart: {zoomType: 'xy', panning: true},
  boost: {useGPUTranslations: true},
  title: {text: 'Energy along time'},
  xAxis: {title: {text: 'Time [s]'}},
  yAxis: {title: {text: 'Energy [dB]'}},
  legend: {enabled: false}
};


export class GenericConversion {
  // Conversion type "direct", "pitch" , "step" or "rythm"
  conversionType:string;
  id_project:number;
  project:ProjectOutput = {id: -1, name: "", instrument: "", date_created: "", state:-1, task_id:"", task_name:""};
  // Parameters available
  ListParameters: PitchParameterOutput[] | StepParameterOutput[] | RythmParameterOutput[] | GlobalParameterOutput[];
  // Parameters to use for the pitch detection
  ParameterForm:FormGroup;
  StartStopForm:FormGroup;
  // Progress bar
  @ViewChild(ProgressionBarComponent) childProgression:ProgressionBarComponent;
  childParameters:PitchParametersComponent | StepParametersComponent | RhythmParametersComponent;
  // Subscription to task
  stateSubscription:Subscription;
  // To know if a pitch conversion is already running
  isConversionRunning:boolean = false;
  idTaskRunning:string = "";


  constructor(conversionType:string,
              public parametersManager: ParametersManagerService,
              public projectManager: ProjectManagerService,
              public formBuilder: FormBuilder,
              public taskManager: TaskManagerService,
              public route: ActivatedRoute){
    this.conversionType = conversionType;
    if(this.conversionType === "direct"){
      this.id_project = Number(this.route.snapshot.paramMap.get("id"));
      this.ParameterForm = this.formBuilder.group({
        namepitchdetectionparam: ['', Validators.required],
        namestepdetectionparam: ['', Validators.required],
        namerythmdetectionparam: ['', Validators.required]
      });
      this.parametersManager.global.subscribe(value => {this.updateListParameters(value);});
    }
    if(this.conversionType === "pitch"){
      this.id_project = Number(this.route.parent.snapshot.paramMap.get("id"));
      this.StartStopForm = this.formBuilder.group({
        timestart_s: [''],
        timestop_s: ['']
      });
      this.parametersManager.pitch.subscribe(value => {this.updateListParameters(value);});
    }
    if(this.conversionType === "step"){
      this.id_project = Number(this.route.parent.snapshot.paramMap.get("id"));
      this.parametersManager.step.subscribe(value => {this.updateListParameters(value);});
    }
    if(this.conversionType === "rythm"){
      this.id_project = Number(this.route.parent.snapshot.paramMap.get("id"));
      this.parametersManager.rythm.subscribe(value => {this.updateListParameters(value);});
    }
    this.projectManager.projects.subscribe(value => {this.update_project(value);});
    this.idTaskRunning = "";
  }

  update_project(project_list:ProjectOutput[]) {
    let TempProject = project_list.find(element => element.id == this.id_project)
    if(TempProject != null){
      this.project = TempProject;
      this.projectActualizedAction();
      if(this.project.task_id != ""){
        if(this.idTaskRunning != this.project.task_id){
          if(this.project.task_name === this.conversionType){
            this.followTask(this.project.task_id);
          }
        }
      }
      else{
        this.idTaskRunning == "";
      }
    }
  }

  projectActualizedAction() {}

  updateListParameters(parameters:any[]) {
    this.ListParameters = parameters.sort((a, b) => a.id - b.id);
  }

  followTask(task_id:string){
    this.isConversionRunning = true;
    this.taskManager.addTaskToFollow(task_id);
    this.stateSubscription = this.taskManager.tasks[task_id]
      .subscribe(
        value => {this.updateProgression(task_id,value);}
      );
  }
  updateProgression(taskId:string, task:TaskState){
    this.childProgression.task = task;
    if((task.status != "STARTED") && (task.status != "PENDING") && (task.status != "")){
      this.stateSubscription.unsubscribe();
      this.isConversionRunning = false;
    }
    if(task.status == "SUCCESS"){
      if(this.conversionType === "direct"){
        this.childProgression.task.progression = 9;
        this.childProgression.task.total = 9;
      }
      if(this.conversionType === "pitch"){
        this.childProgression.task.progression = 100;
        this.childProgression.task.total = 100;
      }
      if(this.conversionType === "step"){
        this.childProgression.task.progression = 8;
        this.childProgression.task.total = 8;
      }
      if(this.conversionType === "rythm"){
        this.childProgression.task.progression = 9;
        this.childProgression.task.total = 9;
      }
    }
  }
  //getObjectById(ArrayOfParameters: Array<PitchParameterOutput> | Array<StepParameterOutput> | Array<RythmParameterOutput> | Array<GlobalParameterOutput>,id:number) {
  //getObjectById(ArrayOfParameters: PitchParameterOutput[] | StepParameterOutput[] | RythmParameterOutput[] | GlobalParameterOutput[], id:number) {
  getObjectById(ArrayOfParameters: Array<any>, id:number) {
    return(ArrayOfParameters.find(element => element.id == id))
  }

  changeParameter(id_parameter:string) {
    if(Number(id_parameter) !== -1){
      let param = this.getObjectById(this.ListParameters,Number(id_parameter))
      if(this.conversionType === "direct"){
        this.ParameterForm.patchValue(param);
      }
      else {
        this.childParameters.setValues(param);
      }
    }
    else{
      this.childParameters.ParametersForm.reset();
    }
  }

  onSubmitConversion() {
    if(this.conversionType === "direct"){
      let formValue:any = this.ParameterForm.value;
      this.projectManager.run_direct_conversion(this.id_project,formValue)
        .subscribe(
          response => {this.ConversionRunningOk(response);},
          error => {console.log("Failed to run conversion");this.isConversionRunning = false;}
        );
    }
    if(this.conversionType === "pitch"){
      this.isConversionRunning = true;
      let formValue:any = this.childParameters.getValues();

      // Aussi tester si ils sont valid avant
      if (this.StartStopForm.value.timestart_s) {
        formValue.timestart_s = Number(this.StartStopForm.value.timestart_s);
      }
      if (this.StartStopForm.value.timestop_s) {
        formValue.timestop_s = Number(this.StartStopForm.value.timestart_s);
      }
      this.projectManager.run_pitch_detection(this.id_project,formValue)
        .subscribe(
          response => {this.ConversionRunningOk(response);},
          error => {console.log("Failed to run conversion");this.isConversionRunning = false;}
        );
    }
    if(this.conversionType === "step"){
      this.isConversionRunning = true;
      let formValue:any = this.childParameters.getValues();
      this.projectManager.run_step_detection(this.id_project,formValue)
        .subscribe(
          response => {this.ConversionRunningOk(response);},
          error => {console.log("Failed to run conversion");this.isConversionRunning = false;}
        );
    }
    if(this.conversionType === "rythm"){
      this.isConversionRunning = true;
      let formValue:any = this.childParameters.getValues();
      this.projectManager.run_rythm_detection(this.id_project,formValue)
        .subscribe(
          response => {this.ConversionRunningOk(response);},
          error => {console.log("Failed to run conversion");this.isConversionRunning = false;}
        );
    }
  }
  ConversionRunningOk(task:TaskOutProject){
    this.idTaskRunning = task.task_id;
    this.followTask(task.task_id);
    
  }
}
