import {
    Component,
    OnInit,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    ViewChild
} from '@angular/core';

import { GenericConversion, PitchChartOpts, EnergyChartOpts } from '../../../converter-common';

import { ParametersManagerService, StepParameterOutput } from 'src/app/backend-services/parameters-manager.service';
import { ProjectManagerService, ProjectOutput, PitchResultOutput, StepResultOutput } from 'src/app/backend-services/project-manager.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { TaskManagerService, TaskState, DefaultTaskState } from 'src/app/backend-services/task-manager.service';
import { Subscription } from 'rxjs';

import { chart } from "highcharts";
import * as Highcharts from "highcharts";

import { StepParametersComponent } from 'src/app/step-parameters/step-parameters.component';

/**
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */

export function ChartsSynchro(e){
  var chart, point, i, event;
  for (i = 0; i < Highcharts.charts.length; i = i + 1) {
      chart = Highcharts.charts[i];
      if(chart !== undefined){
        // Find coordinates within the chart
        event = chart.pointer.normalize(e);
        // Get the hovered point
        point = chart.series[0].searchPoint(event, true);

        if (point) {
            point.highlight(e);
        }
      }
  }
}


/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

declare module 'highcharts' {
    interface Point {
        highlight: (event: Highcharts.PointerEventObject) => void;
    }
}


/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};


/**
 * Synchronize zooming through the setExtremes event handler.
 * IMPORTANT:
 *  In node_modules/highcharts/highcharts.d.ts , modify this line:
 *      export function each(arr: Array<any>, fn: () => void, ctx?: any): void;
 *  into 
 *      export function each(arr: Array<any>, fn: (chart?:any) => void, ctx?: any): void;
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if ((chart !== thisChart) && (chart !== undefined)) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(
                        e.min,
                        e.max,
                        undefined,
                        false,
                        { trigger: 'syncExtremes' }
                    );
                }
            }
        });
    }
}
export function SyncronizedChartOption(chartopt:any){
  chartopt.xAxis.events = { setExtremes: syncExtremes }
  chartopt.tooltip = {
    positioner: function () {
        return {
            // right aligned
            x: this.chart.chartWidth - this.label.width,
            y: 10 // align to title
        };
    }
  }
}


@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component extends GenericConversion implements OnInit {
  // Chart Element in the template
  @ViewChild('chartPitch') public chartElPitch: ElementRef;
  @ViewChild('chartEnergy') public chartElEnergy: ElementRef;
  @ViewChild(StepParametersComponent) childParameters:StepParametersComponent;
  private _chartPitch:any;
  private _chartEnergy:any;
  // Pitch result
  pitchresult:PitchResultOutput;

  constructor(public parametersManager: ParametersManagerService,
              public projectManager: ProjectManagerService,
              public formBuilder: FormBuilder,
              public taskManager: TaskManagerService,
              public route: ActivatedRoute){
    super("step",
          parametersManager,
          projectManager,
          formBuilder,
          taskManager,
          route);
  }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
    ['mousemove', 'touchmove', 'touchstart'].forEach(
      function (eventType) {
        document.getElementById('chart_row').addEventListener(eventType,ChartsSynchro);
      }
    );
     this.projectActualizedAction();
  }

  projectActualizedAction(){
    this.projectManager.get_pitchresult(this.id_project).subscribe(pitch_result => {
      if(this.project.state <= 1){
        this.update_graph_data(pitch_result);
      }
      else {
        this.projectManager.get_stepresult(this.id_project).subscribe(step_result => {
          this.update_graph_data(pitch_result,step_result);
        });
      }
    });
  }

  buildStepArray(step_data:StepResultOutput,sampling_period:number) {
    let dataOut:number[] = [];
    let tempValue:number = 0;
    let nbPoints:number = 0;

    nbPoints = Math.round(step_data['offset_s']/sampling_period);
    for (let j = 0; j < nbPoints; j++) {
      dataOut.push(NaN);
    }
    for(let i=0; i<step_data['length_s'].length; i++){
      nbPoints = Math.round(step_data['length_s'][i]/sampling_period);
      if(step_data['type_b'][i]) {
        tempValue = step_data['pitch_st'][i];
      }
      else {
        tempValue = NaN;
      }
      for (let j = 0; j < nbPoints; j++) {
        dataOut.push(tempValue);
      }
    }
    return dataOut;
  }

  update_graph_data(pitch_data:PitchResultOutput, step_data?:StepResultOutput) {
    let chartopt = PitchChartOpts;
    chartopt.series = [];
    chartopt.series.push({
      type: 'line',
      name: 'Brut Pitch',
      pointInterval: pitch_data['te_s'],
      data: pitch_data['pitch_st'],
      color:'blue'
    });
    if(step_data != null) {
      let stepArray = this.buildStepArray(step_data,pitch_data['te_s']);
      chartopt.series.push({
        type: 'line',
        name: 'Pitch formalized',
        pointInterval: pitch_data['te_s'],
        turboThreshold: 0,
        data: stepArray,
        color:'red'
      });
    }
    SyncronizedChartOption(chartopt);
    if (this.chartElPitch && this.chartElPitch.nativeElement) {
      chartopt.chart.renderTo = this.chartElPitch.nativeElement
    }
    this._chartPitch = new Highcharts.Chart(chartopt);

    chartopt = EnergyChartOpts;
    chartopt.series = [{
      type: 'line',
      name: 'Brut Energy',
      data: pitch_data['energy_db'],
      pointInterval: pitch_data['te_s'],
      color:'green'
    }];
    SyncronizedChartOption(chartopt);
    if (this.chartElEnergy && this.chartElEnergy.nativeElement) {
      chartopt.chart.renderTo = this.chartElEnergy.nativeElement
    }
    this._chartEnergy = new Highcharts.Chart(chartopt);
  }

  ngOnDestroy() {
    if(this._chartPitch != null){
      this._chartPitch.destroy();
    }
    if(this._chartEnergy != null){
      this._chartEnergy.destroy();
    }
  }
}
