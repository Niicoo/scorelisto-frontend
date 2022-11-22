import { Injectable } from '@angular/core';
import { BASE_API_URL, httpOptions } from './global-backend';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


// Manage Parameters
export interface GlobalParameter {
  namepitchdetectionparam: string;
  namerythmdetectionparam: string;
  namestepdetectionparam: string;
}
export interface GlobalParameterOutput extends GlobalParameter {
  id: number;
  name: string;
}
export interface GlobalParameterInput extends GlobalParameter {
  name: string;
}



export interface PitchParameter {
  windowtimesize_s: number;
  sonogramperiod_s: number;
  f0_hz: number;
  freqmin_hz: number;
  freqmax_hz: number;
  cutoff: number;
  smallcutoff: number;
}
export interface PitchParameterOutput extends PitchParameter {
  id: number;
  name: string;
}
export interface PitchParameterInput extends PitchParameter {
  name: string;
}



export interface StepParameter {
  medianfiltersize_s: number;
  thresholdenergyon_db: number;
  thresholdenergyoff_db: number;
  maxpitchvariation_st: number;
  minimumtimesize_s: number;
  minnotesize_s: number;
  minnotediff_st: number;
  lmhgaussian_st: number;
}
export interface StepParameterOutput extends StepParameter {
  id: number;
  name: string;
}
export interface StepParameterInput extends StepParameter {
  name: string;
}



export interface RythmParameter {
  delaymin_s: number;
  delaymax_s: number;
  maxdelayvar: number;
  errormax: number;
  onenoteonebeat: boolean;
  onenotetwobeat: boolean;
  onenotethreebeat: boolean;
  onenotefourbeat: boolean;
  onenotefivebeat: boolean;
  onenotesixbeat: boolean;
  onenotesevenbeat: boolean;
  onenoteeightbeat: boolean;
  onerestonebeat: boolean;
  oneresttwobeat: boolean;
  onerestthreebeat: boolean;
  onerestfourbeat: boolean;
  onerestfivebeat: boolean;
  onerestsixbeat: boolean;
  onerestsevenbeat: boolean;
  oneresteightbeat: boolean;
  en_en: boolean;
  er_en: boolean;
  en_er: boolean;
  den_sn: boolean;
  sn_den: boolean;
  dqn_en: boolean;
  qr_er_en: boolean;
  dqn_er: boolean;
  en_en_qn: boolean;
  qn_dqn_en: boolean;
  qr_qr_er_en: boolean;
  qn_dqn_er: boolean;
  en_en_hn: boolean;
  hn_dqn_en: boolean;
  qr_qr_qr_er_en: boolean;
  hn_dqn_er: boolean;
  en_en_dhn: boolean;
  en_sn_sn: boolean;
  er_sn_sn: boolean;
  sn_sn_en: boolean;
  sn_sn_er: boolean;
  sn_en_sn: boolean;
  t_en_en_en: boolean;
  t_en_den_sn: boolean;
  t_en_sn_den: boolean;
  t_sn_en_den: boolean;
  t_sn_den_en: boolean;
  t_den_en_sn: boolean;
  t_den_sn_en: boolean;
  en_qn_en: boolean;
  dqn_sn_sn: boolean;
  qn_dqn_sn_sn: boolean;
  hn_dqn_sn_sn: boolean;
  sn_sn_sn_sn: boolean;
}
export interface RythmParameterOutput extends RythmParameter {
  id: number;
  name: string;
}
export interface RythmParameterInput extends RythmParameter {
  name: string;
}


@Injectable({
  providedIn: 'root'
})
export class ParametersManagerService {
  // URLs
  private GlobalParameterUrl = BASE_API_URL + '/parameter/global';
  private PitchParameterUrl = BASE_API_URL + '/parameter/pitchdetection';
  private StepParameterUrl = BASE_API_URL + '/parameter/stepdetection';
  private RythmParameterUrl = BASE_API_URL + '/parameter/rythmdetection';
  // BehaviorSubject
  public pitch = new BehaviorSubject<PitchParameterOutput[]>([]);
  public step = new BehaviorSubject<StepParameterOutput[]>([]);
  public rythm = new BehaviorSubject<RythmParameterOutput[]>([]);
  public global = new BehaviorSubject<GlobalParameterOutput[]>([]);

  constructor(private http: HttpClient,
              private authentication: AuthenticationService) { 
    this.authentication.loggedIn.subscribe( value => {this.LoggedInChange(value);} );
  }

  private LoggedInChange(LoggedIn:boolean) {
    if(LoggedIn) {
      this.get_listpitchparameters().subscribe();
      this.get_liststepparameters().subscribe();
      this.get_listrythmparameters().subscribe();
      this.get_listglobalparameters().subscribe();
    }
    else {
      this.ClearParameters();
    }
  }

  private ClearParameters() {
    this.pitch.next([]);
    this.step.next([]);
    this.rythm.next([]);
    this.global.next([]);
  }

  private getURLglobalparameter(id:number): string{
    return(this.GlobalParameterUrl + "/" + id.toString());
  }

  private getURLpitchparameter(id:number): string{
    return(this.PitchParameterUrl + "/" + id.toString());
  }

  private getURLstepparameter(id:number): string{
    return(this.StepParameterUrl + "/" + id.toString());
  }

  private getURLrythmparameter(id:number): string{
    return(this.RythmParameterUrl + "/" + id.toString());
  }


  // PITCH PARAMETERS
  get_listpitchparameters() {
    return this.http.get<PitchParameterOutput[]>(this.PitchParameterUrl)
      .pipe(
        map(response => {this.pitch.next(response);}),
        catchError(err => {return throwError("Failed to get pitch detection parameters");})
      );
  }

  delete_pitchparameter(id:number){
    return this.http.delete(this.getURLpitchparameter(id))
      .pipe(
        map(response => {this.removePitchParameter(id);}),
        catchError(err => {return throwError("Failed to delete this pitch detection parameter");})
      );
  }

  put_pitchparameter(id:number, pitchparam:Partial<PitchParameterInput>) {
    return this.http.put<PitchParameterOutput>(this.getURLpitchparameter(id),pitchparam)
      .pipe(
        map(response => {this.modifyPitchParameter(id,response);}),
        catchError(err => {return throwError("Failed to modify this pitch detection parameter");})
      );
  }

  post_pitchparameter(pitchparam:PitchParameterInput) {
    return this.http.post<PitchParameterOutput>(this.PitchParameterUrl,pitchparam)
      .pipe(
        map(response => {this.createPitchParameter(response);return response.id;}),
        catchError(err => {return throwError("Failed to create this pitch detection parameter");})
      );
  }
  ///////////////
  ///////////////


  // STEP PARAMETERS
  get_liststepparameters() {
    return this.http.get<StepParameterOutput[]>(this.StepParameterUrl)
      .pipe(
        map(response => {this.step.next(response);}),
        catchError(err => {return throwError("Failed to get step detection parameters");})
      );
  }
  delete_stepparameter(id:number){
    return this.http.delete(this.getURLstepparameter(id))
      .pipe(
        map(response => {this.removeStepParameter(id);}),
        catchError(err => {return throwError("Failed to delete this step detection parameter");})
      );
  }

  put_stepparameter(id:number, stepparam:Partial<StepParameterInput>) {
    return this.http.put<StepParameterOutput>(this.getURLstepparameter(id),stepparam)
      .pipe(
        map(response => {this.modifyStepParameter(id,response);}),
        catchError(err => {return throwError("Failed to modify this step detection parameter");})
      );
  }

  post_stepparameter(stepparam:StepParameterInput) {
    return this.http.post<StepParameterOutput>(this.StepParameterUrl,stepparam)
      .pipe(
        map(response => {this.createStepParameter(response);return response.id;}),
        catchError(err => {return throwError("Failed to create this step detection parameter");})
      );
  }
  ///////////////
  ///////////////




  // RYTHM PARAMETERS
  get_listrythmparameters() {
    return this.http.get<RythmParameterOutput[]>(this.RythmParameterUrl)
      .pipe(
        map(response => {this.rythm.next(response);}),
        catchError(err => {return throwError("Failed to get rythm detection parameters");})
      );
  }
  delete_rythmparameter(id:number){
    return this.http.delete(this.getURLrythmparameter(id))
      .pipe(
        map(response => {this.removeRythmParameter(id);}),
        catchError(err => {return throwError("Failed to delete this rythm detection parameter");})
      );
  }
  put_rythmparameter(id:number, rythmparam:Partial<RythmParameterInput>) {
    return this.http.put<RythmParameterOutput>(this.getURLrythmparameter(id),rythmparam)
      .pipe(
        map(response => {this.modifyRythmParameter(id,response);}),
        catchError(err => {return throwError("Failed to modify this rythm detection parameter");})
      );
  }
  post_rythmparameter(rythmparam:RythmParameterInput) {
    return this.http.post<RythmParameterOutput>(this.RythmParameterUrl,rythmparam)
      .pipe(
        map(response => {this.createRythmParameter(response);return response.id;}),
        catchError(err => {return throwError("Failed to create this rythm detection parameter");})
      );
  }
  ///////////////
  ///////////////


  // GLOBAL PARAMETERS
  get_listglobalparameters() {
    return this.http.get<GlobalParameterOutput[]>(this.GlobalParameterUrl)
      .pipe(
        map(response => {this.global.next(response);}),
        catchError(err => { return throwError("Failed to refresh token"); })
      );
  }
  delete_globalparameter(id:number){
    return this.http.delete(this.getURLglobalparameter(id))
      .pipe(
        map(response => {this.removeGlobalParameter(id);}),
        catchError(err => {return throwError("Failed to delete this global parameter");})
      );
  }
  put_globalparameter(id:number, globalparam:Partial<GlobalParameterInput>) {
    return this.http.put<GlobalParameterOutput>(this.getURLglobalparameter(id),globalparam)
      .pipe(
        map(response => {this.modifyGlobalParameter(id,response);}),
        catchError(err => {return throwError("Failed to modify this global parameter");})
      );
  }
  post_globalparameter(globalparam:GlobalParameterInput) {
    return this.http.post<GlobalParameterOutput>(this.GlobalParameterUrl,globalparam)
      .pipe(
        map(response => {this.createGlobalParameter(response);return response.id;}),
        catchError(err => {return throwError("Failed to create this global parameter");})
      );
  }
  ///////////////
  ///////////////

  namepitchdetectionparam: string;
  namerythmdetectionparam: string;
  namestepdetectionparam: string;

  private removePitchParameter(id:number) {
    let params = this.pitch.getValue();
    let paramtodelete = params.find(element => element.id == id)
    params = params.filter(obj => obj !== paramtodelete);
    this.pitch.next(params);

    let globalparams = this.global.getValue();
    let OneGlobalParamModified:boolean = false;
    globalparams.forEach( (element) => {
      if(element.namepitchdetectionparam == paramtodelete.name) {
        element.namepitchdetectionparam = "default";
        OneGlobalParamModified = true;
      }
    });
    if(OneGlobalParamModified){
      this.global.next(globalparams);
    }

  }
  private removeStepParameter(id:number) {
    let params = this.step.getValue();
    let paramtodelete = params.find(element => element.id == id)
    params = params.filter(obj => obj !== paramtodelete);
    this.step.next(params);
  }
  private removeRythmParameter(id:number) {
    let params = this.rythm.getValue();
    let paramtodelete = params.find(element => element.id == id)
    params = params.filter(obj => obj !== paramtodelete);
    this.rythm.next(params);
  }
  private removeGlobalParameter(id:number) {
    let params = this.global.getValue();
    let paramtodelete = params.find(element => element.id == id)
    params = params.filter(obj => obj !== paramtodelete);
    this.global.next(params);
  }

  private modifyPitchParameter(id:number, newparam:PitchParameterOutput) {
    let params = this.pitch.getValue();
    let indexparamtomodify = params.findIndex(element => element.id == id)
    params[indexparamtomodify] = newparam;
    this.pitch.next(params);
  }
  private modifyStepParameter(id:number, newparam:StepParameterOutput) {
    let params = this.step.getValue();
    let indexparamtomodify = params.findIndex(element => element.id == id)
    params[indexparamtomodify] = newparam;
    this.step.next(params);
  }
  private modifyRythmParameter(id:number, newparam:RythmParameterOutput) {
    let params = this.rythm.getValue();
    let indexparamtomodify = params.findIndex(element => element.id == id)
    params[indexparamtomodify] = newparam;
    this.rythm.next(params);
  }
  private modifyGlobalParameter(id:number, newparam:GlobalParameterOutput) {
    let params = this.global.getValue();
    let indexparamtomodify = params.findIndex(element => element.id == id)
    params[indexparamtomodify] = newparam;
    this.global.next(params);
  }
  


  private createPitchParameter(newparam:PitchParameterOutput) {
    let params = this.pitch.getValue();
    params.push(newparam);
    this.pitch.next(params);
  }
  private createStepParameter(newparam:StepParameterOutput) {
    let params = this.step.getValue();
    params.push(newparam);
    this.step.next(params);
  }
  private createRythmParameter(newparam:RythmParameterOutput) {
    let params = this.rythm.getValue();
    params.push(newparam);
    this.rythm.next(params);
  }
  private createGlobalParameter(newparam:GlobalParameterOutput) {
    let params = this.global.getValue();
    params.push(newparam);
    this.global.next(params);
  }
}




  // get_rythmparameter(id:number): Observable<RythmParameterOutput>{
  //   return this.http.get<RythmParameterOutput>(this.getURLglobalparameter(id))
  //     .pipe(
  //       map(RythmParameterOutput => {
  //         return RythmParameterOutput;
  //       }),
  //       catchError(err => {
  //         return throwError("Failed to get this rythm detection parameter");
  //       })
  //     );
  // }

  // get_stepparameter(id:number): Observable<StepParameterOutput>{
  //   return this.http.get<StepParameterOutput>(this.getURLglobalparameter(id))
  //     .pipe(
  //       map(StepParameterOutput => {
  //         return StepParameterOutput;
  //       }),
  //       catchError(err => {
  //         return throwError("Failed to get this step detection parameter");
  //       })
  //     );
  // }

  // get_pitchparameter(id:number): Observable<PitchParameterOutput>{
  //   return this.http.get<PitchParameterOutput>(this.getURLglobalparameter(id))
  //     .pipe(
  //       map(PitchParameterOutput => {
  //         return PitchParameterOutput;
  //       }),
  //       catchError(err => {
  //         return throwError("Failed to get this pitch detection parameter");
  //       })
  //     );
  // }

  // get_globalparameter(id:number): Observable<GlobalParameterOutput>{
  //   return this.http.get<GlobalParameterOutput>(this.getURLglobalparameter(id))
  //     .pipe(
  //       map(GlobalParameterOutput => {
  //         return GlobalParameterOutput;
  //       }),
  //       catchError(err => {
  //         return throwError("Failed to get this global parameter");
  //       })
  //     );
  // }