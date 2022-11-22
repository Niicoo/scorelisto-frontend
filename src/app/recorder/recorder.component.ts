import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as FileSaver from "file-saver";
import { Subject, Observable, Subscription, timer } from 'rxjs';
import WaveSurfer from 'wavesurfer.js'

export const audioContext = new AudioContext();

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent implements OnInit {
  // Creating project attributes
  public file = new Subject();
  wavesurfer:any;

  // Media constraints
  mediaConstraints:MediaStreamConstraints = {
    video: false,
    audio: {
      sampleRate: {
        min: 8000
      }
    }
  }

  // recorder.js
  recorder:AudioRecorder = null;
  timeserieAnalyser:AudioTimeSerie = null;

  // States
  isRecording:boolean = false;
  isSoundReady:boolean = false;

  // Timer
  TimerSubscription:Subscription = null;
  TimerObservable:Observable<number> = null;

  NbSecTicks:number = 0;
  seconds:string = "";
  minutes:string = "";

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.isRecording = false;
    this.isSoundReady = false;
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      progressColor: '#fe215d',
      cursorColor: '#ffffff',
      cursorWidth: 2
    });
  }

  AskUserMedia(){
    if(audioContext.state === 'suspended'){
      audioContext.resume().then(value => console.log("audioContext Resumed!"));
    }
    navigator.mediaDevices.getUserMedia(this.mediaConstraints)
      .then(stream => {this.initStream(stream);})
      .catch(err => console.log('Uh oh... unable to get stream...', err));
  }
  initStream(stream:MediaStream) {
    this.isSoundReady = false;
    let input = audioContext.createMediaStreamSource(stream);
    let config = {
      bufferLen: 4096,
      numChannels: 1,
      mimeType: 'audio/wav'
    }
    //let canvasWaveform = <HTMLCanvasElement>document.getElementById('canvaswaveform');
    let canvasTimeserie = <HTMLCanvasElement>document.getElementById('canvastimeserie');
    this.timeserieAnalyser = new AudioTimeSerie(input, audioContext, canvasTimeserie)
    this.recorder = new AudioRecorder(this.timeserieAnalyser.analyser, config);
  }

  onResizeWaveform(event:any){
    this.wavesurfer.drawer.containerWidth = this.wavesurfer.drawer.container.clientWidth;
    this.wavesurfer.drawBuffer();
  }

  clickResetButton() {
    if(this.isRecording){
      this.recorder.stop();
      this.TimerSubscription.unsubscribe();
    }
    this.recorder.clear();
    this.timeserieAnalyser.stop();
    this.timeserieAnalyser.clear();
    this.isRecording = false;
    this.isSoundReady = false;
    this.NbSecTicks = 0;
  }
  clickStartButton() {
    if(!this.isRecording){
      // User is not recording
      this.recorder.clear();
      this.isRecording = true;
      this.isSoundReady = false;
      this.NbSecTicks = 0;
      this.recorder.record();
      this.TimerObservable = timer(0,1000);
      this.timeserieAnalyser.start();
      this.TimerSubscription = this.TimerObservable.subscribe(
        t => {
          this.NbSecTicks = t;
          let NbMinutes = Math.floor(t/60);
          let NbSeconds = t % 60
          this.minutes = NbMinutes.toString();
          this.seconds = ("0" + NbSeconds).slice(-2);
          
        }
      );
    }
  }
  clickStopButton() {
    if(this.isRecording){
      // User is being recording
      this.recorder.stop();
      this.timeserieAnalyser.stop();
      this.TimerSubscription.unsubscribe();
      this.recorder.exportWAV(this.onSave,this);
      this.isRecording = false;
      this.isSoundReady = true;
    }
  }
  onSave(blob:Blob,_this:any) {
    _this.file.next(blob);
    _this.wavesurfer.loadBlob(blob);
  }
  clickDownloadButton() {
    this.recorder.exportWAV(this.onDownload,this);
  }
  onDownload(blob:Blob,_this:any) {
    FileSaver.saveAs(blob, "audio.wav")
  }
}











export interface configRecorder {
  bufferLen: number;
  numChannels: number;
  mimeType: string;
}


class AudioRecorder {
  config = {
      bufferLen: 4096,
      numChannels: 1,
      mimeType: 'audio/wav'
  };
  recording = false;
  callbacks = {
      getBuffer: [],
      exportWAV: []
  };
  callbacks_this = {
      getBuffer: [],
      exportWAV: []
  };
  context:BaseAudioContext;
  node:ScriptProcessorNode;
  worker:Worker;

  constructor(source:MediaStreamAudioSourceNode | AnalyserNode, cfg?:configRecorder) {
    if(cfg != null){
      Object.assign(this.config, cfg);
    }
    this.context = source.context;
    this.node = this.context.createScriptProcessor
      .call(this.context, this.config.bufferLen, this.config.numChannels, this.config.numChannels);

    let _this = this;
    this.node.onaudioprocess = function (e) {
        if (!_this.recording) return;

        let buffer = [];
        for (let channel = 0; channel < _this.config.numChannels; channel++) {
            buffer.push(e.inputBuffer.getChannelData(channel));
        }
        _this.worker.postMessage({
            command: 'record',
            buffer: buffer
        });
    };

    source.connect(this.node);
    this.node.connect(this.context.destination); //this should not be necessary

    let self = {};
    this.worker = new Worker("assets/js/recorder-worker.js");

    this.worker.postMessage({
        command: 'init',
        config: {
            sampleRate: this.context.sampleRate,
            numChannels: this.config.numChannels
        }
    });

    this.worker.onmessage = function (e) {
        let cb = _this.callbacks[e.data.command].pop();
        let cb_this = _this.callbacks_this[e.data.command].pop();
        if (typeof cb == 'function') {
            cb(e.data.data, cb_this);
        }
    };
  }

  record(){
    this.recording = true;
  }
  stop(){
    this.recording = false;
  }
  clear(){
    this.worker.postMessage({ command: 'clear' });
  }
  getBuffer(cb, cb_this){
    this.callbacks.getBuffer.push(cb);
    this.callbacks_this.getBuffer.push(cb_this);
    this.worker.postMessage({ command: 'getBuffer' });
  }
  exportWAV(cb, cb_this){
    let mimeType = this.config.mimeType;
    this.callbacks.exportWAV.push(cb);
    this.callbacks_this.exportWAV.push(cb_this);
    this.worker.postMessage({
        command: 'exportWAV',
        type: mimeType
    });
  }
}

















class AudioTimeSerie {
  fftsize:number = 8192;
  pause:boolean = true;
  // Attributes defined in the constructor
  canvas:HTMLCanvasElement = null;
  canvasCtx:CanvasRenderingContext2D = null;
  // Period of the input array
  period:number = 1;
  // Scale of the graph
  xScale:number = 0;
  yScale:number = 0;
  // Position of the center of the graph
  x_offset:number = 0;
  y_offset:number = 0;
  // Last position of the line
  y_last:number = 0;
  // Size of the buffer
  bufferLength:number = 0;
  // Vector of data analysed
  dataArray:Float32Array;
  // Other attributes
  node:any;
  context:any;
  analyser:AnalyserNode;7
  // For performance
  _buffer_x_offset:number = 0;

  constructor(source:MediaStreamAudioSourceNode, audioCtx:AudioContext, canvas:HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasCtx = this.canvas.getContext("2d");
    // Color of the plot
    this.canvasCtx.strokeStyle="#FE215D";
    this.canvasCtx.fillStyle = "#131618";
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);


    this.analyser = audioCtx.createAnalyser();
    this.analyser.fftSize = this.fftsize;
    source.connect(this.analyser);
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Float32Array(this.bufferLength);

    // 100 bufferlen sur la largeur du canvas
    this.xScale = this.canvas.width /(200*this.bufferLength);
    //-1/1 = Max <==> Bas/Haut du canvas
    this.yScale = this.canvas.height / 2;
    // Window parameters
    this.x_offset = this.canvas.width / 2;
    this.y_offset = this.canvas.height / 2;
    this.y_last = 0;

    // For executing quicker
    this._buffer_x_offset = this.bufferLength*this.xScale;
  }

  start() {
    this.pause = false;
    this.updatePlot();
  }

  stop() {
    this.pause = true;
  }

  clear() {
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updatePlot() {
    // Acquiring data
    this.analyser.getFloatTimeDomainData(this.dataArray);
    // Translate of 1 buffersize to the left to plot the new array
    this.canvasCtx.save();
    this.canvasCtx.translate(-this._buffer_x_offset, 0);
    this.canvasCtx.drawImage(this.canvas, 0, 0);
    this.canvasCtx.restore();

    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(this.x_offset - this._buffer_x_offset, this.y_offset + this.y_last);
    for(let i=1; i<this.bufferLength+1 ; i++) {
      this.canvasCtx.lineTo(this.x_offset - this._buffer_x_offset + i*this.xScale, this.y_offset + this.dataArray[i]*this.yScale);
    }
    this.canvasCtx.moveTo(this.x_offset, this.y_offset);
    this.canvasCtx.lineTo(this.canvas.width, this.y_offset);

    this.canvasCtx.stroke();


    //this.canvasCtx.translate(dataSet.length*this.xScale, 0);
    this.y_last = this.dataArray[this.bufferLength -1]*this.yScale;
    
    // Check if pause requested
    if(!this.pause) {
      let drawVisual = requestAnimationFrame(() => this.updatePlot());
    }
  }
}



