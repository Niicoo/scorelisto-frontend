import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

@Component({
  selector: 'app-score-printer',
  templateUrl: './score-printer.component.html',
  styleUrls: ['./score-printer.component.css']
})
export class ScorePrinterComponent implements OnInit {
  openSheetMusicDisplay:OpenSheetMusicDisplay;

  constructor() { }

  ngOnInit() {
  }
  
  ShowScore(musicXML:any) {
    let self = this;
    this.openSheetMusicDisplay.load(musicXML)
    .then(
        function() {
            // This gives you access to the osmd object in the console. Do not use in productive code
            //window.osmd = openSheetMusicDisplay;
            self.openSheetMusicDisplay.render();
        }
    )
  }

  ngAfterViewInit() {
    let canvas = document.getElementById('ScoreDiv')
    this.openSheetMusicDisplay = new OpenSheetMusicDisplay(canvas, {
        autoResize: true,
        backend: "SVG",
        disableCursor: false,
        drawingParameters: "default", // try compact (instead of default)
        drawPartNames: true, // try false
        // drawTitle: false,
        // drawSubtitle: false,
        drawFingerings: true,
        fingeringPosition: "auto", // left is default. try right. experimental: auto, above, below.
        // fingeringInsideStafflines: "true", // default: false. true draws fingerings directly above/below notes
        setWantedStemDirectionByXml: true, // try false, which was previously the default behavior
        // drawUpToMeasureNumber: 3, // draws only up to measure 3, meaning it draws measure 1 to 3 of the piece.

        // coloring options
        coloringEnabled: true,
        // defaultColorNotehead: "#CC0055", // try setting a default color. default is black (undefined)
        // defaultColorStem: "#BB0099",

        autoBeam: false, // try true, OSMD Function Test AutoBeam sample
        autoBeamOptions: {
            beam_rests: false,
            beam_middle_rests_only: false,
            //groups: [[3,4], [1,1]],
            maintain_stem_directions: false
        },

        // tupletsBracketed: true, // creates brackets for all tuplets except triplets, even when not set by xml
        // tripletsBracketed: true,
        // tupletsRatioed: true, // unconventional; renders ratios for tuplets (3:2 instead of 3 for triplets)
    });
  }
}
