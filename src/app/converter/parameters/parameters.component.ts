import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ParametersManagerService } from '../../backend-services/parameters-manager.service';
import { GlobalParameterOutput, PitchParameterOutput } from '../../backend-services/parameters-manager.service';
import { StepParameterOutput, RythmParameterOutput } from '../../backend-services/parameters-manager.service';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';


import { PitchParametersComponent } from 'src/app/pitch-parameters/pitch-parameters.component';
import { StepParametersComponent } from 'src/app/step-parameters/step-parameters.component';
import { RhythmParametersComponent } from 'src/app/rhythm-parameters/rhythm-parameters.component';

export function isEmpty(ArrayToCheck: Array<any>) {
  return(!Array.isArray(ArrayToCheck) || !ArrayToCheck.length)
}

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements AfterViewInit {

  @ViewChild(PitchParametersComponent)
  private childPitchParameters:PitchParametersComponent;

  @ViewChild(StepParametersComponent)
  private childStepParameters:StepParametersComponent;

  @ViewChild(RhythmParametersComponent)
  private childRhythmParameters:RhythmParametersComponent;

  // Parameters
  PitchParameters:PitchParameterOutput[] = [];
  StepParameters:StepParameterOutput[] = [];
  RythmParameters:RythmParameterOutput[] = [];
  GlobalParameters:GlobalParameterOutput[] = [];
  // Id parameters currently displayed
  IdPitchParameterDisplayed:number = -1;
  IdStepParameterDisplayed:number = -1;
  IdRythmParameterDisplayed:number = -1;
  IdGlobalParameterDisplayed:number = -1;
  // Name parameters currently displayed
  NamePitchParameterDisplayed:string = "";
  NameStepParameterDisplayed:string = "";
  NameRythmParameterDisplayed:string = "";
  NameGlobalParameterDisplayed:string = "";
  // Is the default parameter selected ?
  GlobalDefaultParameterSelected:boolean = false;
  PitchDefaultParameterSelected:boolean = false;
  StepDefaultParameterSelected:boolean = false;
  RythmDefaultParameterSelected:boolean = false;
  // Variable to change the view (parameters to print)
  // 0 = global parameters
  // 1 = pitch parameters
  // 2 = step parameters
  // 3 = rythm parameters
  ParametersToDisplay:number = 0;
  // Status of the Forms
  PitchParametersvalid:boolean = false;
  StepParametersvalid:boolean = false;
  RhythmParametersvalid:boolean = false;
  GlobalParametersvalid:boolean = false;

  // Forms
  GlobalParameterForm = this.fb.group({
    name: [''],
    namepitchdetectionparam: [''],
    namestepdetectionparam: [''],
    namerythmdetectionparam: ['']
  });

  constructor(private parametersManager: ParametersManagerService,
              private fb: FormBuilder) {
  }

  ngAfterViewInit() {
    // Subscribe to Parameters
    this.parametersManager.pitch.subscribe( value => {this.updatePitchParameters(value);});
    this.parametersManager.step.subscribe( value => {this.updateStepParameters(value);});
    this.parametersManager.rythm.subscribe( value => {this.updateRythmParameters(value);});
    this.parametersManager.global.subscribe( value => {this.updateGlobalParameters(value);});
    // Subscribe to Form Status
    this.childPitchParameters.ParametersForm.statusChanges.subscribe(status => {this.PitchParametersvalid = (status === "VALID");})
    this.childStepParameters.ParametersForm.statusChanges.subscribe(status => {this.StepParametersvalid = (status === "VALID");})
    this.childRhythmParameters.ParametersForm.statusChanges.subscribe(status => {this.RhythmParametersvalid = (status === "VALID");})
    this.GlobalParameterForm.statusChanges.subscribe( status => {this.GlobalParametersvalid = (status === "VALID");})
  }

  getObjectByName(ArrayOfParameters: Array<any>,name:string) {
    return(ArrayOfParameters.find(element => element.name === name))
  }

  //PitchParameterOutput[] | StepParameterOutput[] | RythmParameterOutput[] | GlobalParameterOutput[],
  getObjectById(ArrayOfParameters: Array<any>,id:number) {
    return(ArrayOfParameters.find(element => element.id == id))
  }

  updatePitchParameters(NewParameters:Array<PitchParameterOutput>){
    let CurrentParameters = isEmpty(this.PitchParameters);
    this.PitchParameters = NewParameters.sort((a, b) => a.id - b.id);
    let ParamBeingDisplay = this.getObjectById(this.PitchParameters,this.IdPitchParameterDisplayed)
    // If the parameters in this component are empty
    let Condition1 = !isEmpty(NewParameters) && CurrentParameters
    // If the parameter being display has been deleted
    let Condition2 = (ParamBeingDisplay == undefined) && (this.IdPitchParameterDisplayed != -1)
    if(Condition1 || Condition2 ){
      let paramtemp = this.getObjectByName(this.PitchParameters,'default');
      if(paramtemp != undefined ){
        this.setPitchParameter(paramtemp);
      }
      else {
        console.log("Error: Pitch parameters should always have a 'default' parameter")
      }
    }
  }
  updateStepParameters(NewParameters:Array<StepParameterOutput>){
    let CurrentParameters = isEmpty(this.StepParameters);
    this.StepParameters = NewParameters.sort((a, b) => a.id - b.id);
    let ParamBeingDisplay = this.getObjectById(this.StepParameters,this.IdStepParameterDisplayed)
    // If the parameters in this component are empty
    let Condition1 = !isEmpty(NewParameters) && CurrentParameters
    // If the parameter being display has been deleted
    let Condition2 = (ParamBeingDisplay == undefined) && (this.IdStepParameterDisplayed != -1)
    if(Condition1 || Condition2 ){
      let paramtemp = this.getObjectByName(this.StepParameters,'default');
      if(paramtemp != undefined ){
        this.setStepParameter(paramtemp);
      }
      else {
        console.log("Error: Step parameters should always have a 'default' parameter")
      }
    }
  }
  updateRythmParameters(NewParameters:Array<RythmParameterOutput>){
    let CurrentParameters = isEmpty(this.RythmParameters);
    this.RythmParameters = NewParameters.sort((a, b) => a.id - b.id);
    let ParamBeingDisplay = this.getObjectById(this.RythmParameters,this.IdRythmParameterDisplayed)
    // If the parameters in this component are empty
    let Condition1 = !isEmpty(NewParameters) && CurrentParameters
    // If the parameter being display has been deleted
    let Condition2 = (ParamBeingDisplay == undefined) && (this.IdRythmParameterDisplayed != -1)
    if(Condition1 || Condition2 ){
      let paramtemp = this.getObjectByName(this.RythmParameters,'default');
      if(paramtemp != undefined ){
        this.setRythmParameter(paramtemp);
      }
      else {
        console.log("Error: Rythm parameters should always have a 'default' parameter")
      }
    }
  }
  updateGlobalParameters(NewParameters:Array<GlobalParameterOutput>){
    let CurrentParameters = isEmpty(this.GlobalParameters);
    this.GlobalParameters = NewParameters.sort((a, b) => a.id - b.id);
    let ParamBeingDisplay = this.getObjectById(this.GlobalParameters,this.IdGlobalParameterDisplayed)
    // If the parameters in this component are empty
    let Condition1 = !isEmpty(NewParameters) && CurrentParameters
    // If the parameter being display has been deleted
    let Condition2 = (ParamBeingDisplay == undefined) && (this.IdGlobalParameterDisplayed != -1)
    if(Condition1 || Condition2 ){
      let paramtemp = this.getObjectByName(this.GlobalParameters,'default');
      if(paramtemp != undefined ){
        this.setGlobalParameter(paramtemp);
      }
      else {
        console.log("Error: Global parameters should always have a 'default' parameter")
      }
    }
    else {
      if((this.IdGlobalParameterDisplayed != -1)) {
        this.setGlobalParameter(this.getObjectById(this.GlobalParameters,this.IdGlobalParameterDisplayed));
      }
    }
  }



  onSubmitCreatePitchParameter() {
    let param = this.childPitchParameters.ParametersForm.value
    if(this.IdPitchParameterDisplayed === -1){
      this.parametersManager.post_pitchparameter(param)
        .subscribe(
          response => {this.IdPitchParameterDisplayed = response;},
          error => {console.log("Failed to create pitch parameter")}
        );
    }
    else {
      this.parametersManager.put_pitchparameter(this.IdPitchParameterDisplayed,param)
        .subscribe(
          response => {console.log("Modifying pitch parameter ok");},
          error => {console.log("Failed to modify pitch parameter")}
        );
    }
  }

  onSubmitCreateStepParameter() {
    let param = this.childStepParameters.ParametersForm.value
    if(this.IdStepParameterDisplayed === -1){
      this.parametersManager.post_stepparameter(param)
        .subscribe(
          response => {this.IdStepParameterDisplayed = response;},
          error => {console.log("Failed to create step parameter")}
        );
    }
    else {
      this.parametersManager.put_stepparameter(this.IdStepParameterDisplayed,param)
        .subscribe(
          response => {console.log("Modifying step parameter ok");},
          error => {console.log("Failed to modify step parameter")}
        );
    }
  }

  onSubmitCreateRythmParameter() {
    let param = this.childRhythmParameters.ParametersForm.value
    if(this.IdRythmParameterDisplayed === -1){
      this.parametersManager.post_rythmparameter(param)
        .subscribe(
          response => {this.IdRythmParameterDisplayed = response;},
          error => {console.log("Failed to create rythm parameter")}
        );
    }
    else {
      this.parametersManager.put_rythmparameter(this.IdRythmParameterDisplayed,param)
        .subscribe(
          response => {console.log("Modifying rythm parameter ok");},
          error => {console.log("Failed to modify rythm parameter")}
        );
    }
  }

  onSubmitCreateGlobalParameter() {
    let param = this.GlobalParameterForm.value
    if(this.IdGlobalParameterDisplayed === -1){
      this.parametersManager.post_globalparameter(param)
        .subscribe(
          response => {this.IdGlobalParameterDisplayed = response;},
          error => {console.log("Failed to create global parameter")}
        );
    }
    else {
      this.parametersManager.put_globalparameter(this.IdGlobalParameterDisplayed,param)
        .subscribe(
          response => {console.log("Modifying global parameter ok");},
          error => {console.log("Failed to modify global parameter")}
        );
    }
  }



  onClickOnDeletePitchParameter() {
    this.parametersManager.delete_pitchparameter(this.IdPitchParameterDisplayed)
    .subscribe(
      response => {console.log("Deleting pitch parameter ok");},
      error => {console.log("Failed to delete pitch parameter")}
    );
  }
  onClickOnDeleteStepParameter() {
    this.parametersManager.delete_stepparameter(this.IdStepParameterDisplayed)
    .subscribe(
      response => {console.log("Deleting step parameter ok");},
      error => {console.log("Failed to delete step parameter")}
    );
  }
  onClickOnDeleteRythmParameter() {
    this.parametersManager.delete_rythmparameter(this.IdRythmParameterDisplayed)
    .subscribe(
      response => {console.log("Deleting rythm parameter ok");},
      error => {console.log("Failed to delete rythm parameter")}
    );
  }
  onClickOnDeleteGlobalParameter() {
    this.parametersManager.delete_globalparameter(this.IdGlobalParameterDisplayed)
    .subscribe(
      response => {console.log("Deleting global parameter ok");},
      error => {console.log("Failed to delete global parameter")}
    );
  }



  onClickOnPitchParameter(id:number){
    let paramtemp = this.getObjectById(this.PitchParameters,id);
    this.setPitchParameter(paramtemp);
  }
  onClickOnStepParameter(id:number){
    let paramtemp = this.getObjectById(this.StepParameters,id);
    this.setStepParameter(paramtemp);
  }
  onClickOnRythmParameter(id:number){
    let paramtemp = this.getObjectById(this.RythmParameters,id);
    this.setRythmParameter(paramtemp);
  }
  onClickOnGlobalParameter(id:number){
    let paramtemp = this.getObjectById(this.GlobalParameters,id);
    this.setGlobalParameter(paramtemp);
  }



  setPitchParameter(param:PitchParameterOutput){
    this.IdPitchParameterDisplayed = param.id;
    this.NamePitchParameterDisplayed = param.name;
    if(param.name === 'default'){
      this.PitchDefaultParameterSelected = true;
    }
    else {
      this.PitchDefaultParameterSelected = false;
    }
    this.childPitchParameters.setValues(param);
  }
  setStepParameter(param:StepParameterOutput){
    this.IdStepParameterDisplayed = param.id;
    this.NameStepParameterDisplayed = param.name;
    if(param.name === 'default'){
      this.StepDefaultParameterSelected = true;
    }
    else {
      this.StepDefaultParameterSelected = false;
    }
    this.childStepParameters.setValues(param);
  }
  setRythmParameter(param:RythmParameterOutput){
    this.IdRythmParameterDisplayed = param.id;
    this.NameRythmParameterDisplayed = param.name;
    if(param.name === 'default'){
      this.RythmDefaultParameterSelected = true;
    }
    else {
      this.RythmDefaultParameterSelected = false;
    }
    this.childRhythmParameters.setValues(param);
  }
  setGlobalParameter(param:GlobalParameterOutput){
    this.IdGlobalParameterDisplayed = param.id;
    this.NameGlobalParameterDisplayed = param.name;
    if(param.name === 'default'){
      this.GlobalDefaultParameterSelected = true;
    }
    else {
      this.GlobalDefaultParameterSelected = false;
    }
    this.GlobalParameterForm.patchValue(param);
  }
  

  onClickOnAddPitchParameter() {
    this.IdPitchParameterDisplayed = -1;
    let defaultparam = this.getObjectByName(this.PitchParameters,'default');
    this.childPitchParameters.setValues(defaultparam);
    this.childPitchParameters.ParametersForm.patchValue({'name':''});
  }
  onClickOnAddStepParameter() {
    this.IdStepParameterDisplayed = -1;
    let defaultparam = this.getObjectByName(this.StepParameters,'default');
    this.childStepParameters.setValues(defaultparam);
    this.childStepParameters.ParametersForm.patchValue({'name':''});
  }
  onClickOnAddRythmParameter() {
    this.IdRythmParameterDisplayed = -1;
    let defaultparam = this.getObjectByName(this.RythmParameters,'default');
    this.childRhythmParameters.setValues(defaultparam);
    this.childRhythmParameters.ParametersForm.patchValue({'name':''});
  }
  onClickOnAddGlobalParameter() {
    this.IdGlobalParameterDisplayed = -1;
    let defaultparam = this.getObjectByName(this.GlobalParameters,'default');
    this.GlobalParameterForm.patchValue(defaultparam);
    this.GlobalParameterForm.patchValue({'name':''})
  }
}




















// import { BehaviorSubject } from 'rxjs';


// export class GenericParameters {
//   // Parameters
//   Parameters:PitchParameterOutput[] | StepParameterOutput[] | RythmParameterOutput[] = [];

//   // Id parameters currently displayed
//   IdParameterDisplayed:number = -1;
//   NameParameterDisplayed:string = "";
//   DefaultParameterSelected:boolean = false;

//   // Parameters needed as input
//   childParametersComponent:PitchParametersComponent | StepParametersComponent | RhythmParametersComponent ;

//   constructor(childParameters:PitchParametersComponent | StepParametersComponent | RhythmParametersComponent,
//               parameterToSubscribe: BehaviorSubject<any> ,
//               private parametersManager: ParametersManagerService,
//               private fb: FormBuilder) {
//     this.childParametersComponent = childParameters;
//     parameterToSubscribe.subscribe(value => {this.updateParameters(value);});
//   }

//   ngOnInit() { 
//   }
  
//   getObjectByName(ArrayOfParameters: Array<any>,name:string) {
//     return(ArrayOfParameters.find(element => element.name === name))
//   }

//   //PitchParameterOutput[] | StepParameterOutput[] | RythmParameterOutput[] | GlobalParameterOutput[],
//   getObjectById(ArrayOfParameters: Array<any>,id:number) {
//     return(ArrayOfParameters.find(element => element.id == id))
//   }

//   updateParameters(NewParameters:Array<PitchParameterOutput> | Array<StepParameterOutput> | Array<RythmParameterOutput>){
//     let CurrentParameters = isEmpty(this.Parameters);
//     this.Parameters = NewParameters.sort((a, b) => a.id - b.id);
//     let ParamBeingDisplay = this.getObjectById(this.Parameters,this.IdParameterDisplayed)
//     // If the parameters in this component are empty
//     let Condition1 = !isEmpty(NewParameters) && CurrentParameters
//     // If the parameter being display has been deleted
//     let Condition2 = (ParamBeingDisplay == undefined) && (this.IdParameterDisplayed != -1)
//     if(Condition1 || Condition2 ){
//       let paramtemp = this.getObjectByName(this.Parameters,'default');
//       if(paramtemp != undefined ){
//         this.setParameter(paramtemp);
//       }
//       else {
//         console.log("Error: Parameters should always have a 'default' parameter")
//       }
//     }
//   }


//   onSubmitCreateParameter() {
//     let param = this.childParametersComponent.ParametersForm.value
//     if(this.IdParameterDisplayed === -1){
//       this.parametersManager.post_pitchparameter(param)
//         .subscribe(
//           response => {this.IdParameterDisplayed = response;},
//           error => {console.log("Failed to create parameter")}
//         );
//     }
//     else {
//       this.parametersManager.put_pitchparameter(this.IdParameterDisplayed,param)
//         .subscribe(
//           response => {console.log("Modifying parameter ok");},
//           error => {console.log("Failed to modify parameter")}
//         );
//     }
//   }

//   onClickOnDeleteParameter() {
//     this.parametersManager.delete_pitchparameter(this.IdParameterDisplayed)
//     .subscribe(
//       response => {console.log("Deleting parameter ok");},
//       error => {console.log("Failed to delete parameter")}
//     );
//   }

//   onClickOnParameter(id:number){
//     let paramtemp = this.getObjectById(this.Parameters,id);
//     this.setParameter(paramtemp);
//   }

//   setParameter(param:PitchParameterOutput | StepParameterOutput | RythmParameterOutput){
//     this.IdParameterDisplayed = param.id;
//     this.NameParameterDisplayed = param.name;
//     if(param.name === 'default'){
//       this.DefaultParameterSelected = true;
//     }
//     else {
//       this.DefaultParameterSelected = false;
//     }
//     this.childParametersComponent.ParametersForm.patchValue(param);
//   }

//   onClickOnAddParameter() {
//     this.IdParameterDisplayed = -1;
//     let defaultparam = this.getObjectByName(this.Parameters,'default');
//     this.childParametersComponent.ParametersForm.patchValue(defaultparam);
//     this.childParametersComponent.ParametersForm.patchValue({'name':''});
//   }
// }





