import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PitchParameterOutput } from 'src/app/backend-services/parameters-manager.service';

@Component({
  selector: 'app-pitch-parameters',
  templateUrl: './pitch-parameters.component.html',
  styleUrls: ['./pitch-parameters.component.css']
})
export class PitchParametersComponent implements OnInit {
  ParametersForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9 ]{2,32}[a-zA-Z0-9]$')]
    ],
    windowtimesize_ms: ['',[
      Validators.required,
      Validators.min(0.1),
      Validators.max(1000)]
    ],
    sonogramperiod_ms: ['',[
      Validators.required,
      Validators.min(1e-3),
      Validators.max(1000)]
    ],
    f0_hz: ['',[
      Validators.required,
      Validators.min(1e-6),
      Validators.max(1e6)]
    ],
    freqmin_hz: ['',[
      Validators.required,
      Validators.min(1e-3),
      Validators.max(1e6)]
    ],
    freqmax_hz: ['',[
      Validators.required,
      Validators.min(1e-3),
      Validators.max(1e6)]
    ],
    cutoff: ['',[
      Validators.required,
      Validators.min(0),
      Validators.max(1)]
    ],
    smallcutoff: ['',[
      Validators.required,
      Validators.min(0),
      Validators.max(1)]
    ]
  });

  constructor(private fb:FormBuilder) {
  }

  ngOnInit() {
  }
  setValues(param:any) {
    this.ParametersForm.patchValue(param);
    this.ParametersForm.patchValue({windowtimesize_ms: 1000*param.windowtimesize_s});
    this.ParametersForm.patchValue({sonogramperiod_ms: 1000*param.sonogramperiod_s});
  }
  getValues() {
    let temp = {
      name: this.ParametersForm.value.name,
      windowtimesize_s: this.ParametersForm.value.windowtimesize_ms / 1e3,
      sonogramperiod_s: this.ParametersForm.value.sonogramperiod_ms / 1e3,
      f0_hz: this.ParametersForm.value.f0_hz,
      freqmin_hz: this.ParametersForm.value.freqmin_hz,
      freqmax_hz: this.ParametersForm.value.freqmax_hz,
      cutoff: this.ParametersForm.value.cutoff,
      smallcutoff: this.ParametersForm.value.smallcutoff
    }
    return(temp)
  }

}
