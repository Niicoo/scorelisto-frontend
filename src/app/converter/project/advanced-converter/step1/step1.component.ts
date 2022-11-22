import {
    Component,
    OnInit,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    ViewChild
} from '@angular/core';

import { GenericConversion } from '../../../converter-common';

import { ParametersManagerService, PitchParameterOutput } from 'src/app/backend-services/parameters-manager.service';
import { ProjectManagerService, ProjectOutput, PitchResultOutput } from 'src/app/backend-services/project-manager.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { TaskManagerService, TaskState, DefaultTaskState } from 'src/app/backend-services/task-manager.service';
import { Subscription } from 'rxjs';

import { PitchParametersComponent } from 'src/app/pitch-parameters/pitch-parameters.component';

import { chart } from "highcharts";
import * as Highcharts from "highcharts";

import WaveSurfer from 'wavesurfer.js'
import { PitchChartOpts } from '../../../converter-common';



@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1Component extends GenericConversion implements OnInit{
  // Chart Element in the template
  @ViewChild('chartPitch') public chartElPitch: ElementRef;

  private _chartPitch:any;
  // Project Wav File
  WavFile:Blob;
  wavesurfer:any;
  isWavFilePlotted:boolean = false;
  isWavFileReady:boolean = false;

  @ViewChild(PitchParametersComponent) childParameters:PitchParametersComponent;

  constructor(public parametersManager: ParametersManagerService,
              public projectManager: ProjectManagerService,
              public formBuilder: FormBuilder,
              public taskManager: TaskManagerService,
              public route: ActivatedRoute){
    super("pitch",
          parametersManager,
          projectManager,
          formBuilder,
          taskManager,
          route);
  }
  ngOnInit() {
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      progressColor: '#fe215d',
      cursorColor: '#ffffff',
      cursorWidth: 2
    });
  }

  plotWavFile() {
    if(!this.isWavFilePlotted){
      this.isWavFilePlotted = true;
      this.projectManager.download_audio(this.id_project)
        .subscribe(value => {
          this.WavFile = value;
          this.wavesurfer.loadBlob(this.WavFile);
          this.isWavFileReady = true;
        });
    }
  }
  onResizeWaveform(event:any){
    this.wavesurfer.drawer.containerWidth = this.wavesurfer.drawer.container.clientWidth;
    this.wavesurfer.drawBuffer();
  }

  projectActualizedAction(){
    if(this.project.state > 0){
      this.projectManager.get_pitchresult(this.id_project).subscribe(value => {this.update_graph_data(value);});
    }
  }


  update_graph_data(data:PitchResultOutput) {
    let chartopt = PitchChartOpts;
    chartopt.series = [{
      type: 'line',
      name: 'Brut Pitch',
      pointInterval: data['te_s'],
      data: data['pitch_st'],
      color: "red"
    }];
    if (this.chartElPitch && this.chartElPitch.nativeElement) {
      chartopt.chart.renderTo = this.chartElPitch.nativeElement
    }
    this._chartPitch = new Highcharts.Chart(chartopt);
  }
}
