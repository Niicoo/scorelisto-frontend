import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StepParameterOutput } from 'src/app/backend-services/parameters-manager.service';


@Component({
  selector: 'app-step-parameters',
  templateUrl: './step-parameters.component.html',
  styleUrls: ['./step-parameters.component.css']
})
export class StepParametersComponent implements OnInit {
  ParametersForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9 ]{3,32}[a-zA-Z0-9]$')]
    ],
    medianfiltersize_ms: ['',[
      Validators.required,
      Validators.min(1),
      Validators.max(1000)]
    ],
    thresholdenergyon_db: ['',[
      Validators.required,
      Validators.min(0.1),
      Validators.max(200)]
    ],
    thresholdenergyoff_db: ['',[
      Validators.required,
      Validators.min(0.1),
      Validators.max(200)]
    ],
    maxpitchvariation_st: ['',[
      Validators.required,
      Validators.min(0.01),
      Validators.max(12)]
    ],
    minimumtimesize_ms: ['',[
      Validators.required,
      Validators.min(1),
      Validators.max(1000)]
    ],
    minnotesize_ms: ['',[
      Validators.required,
      Validators.min(1),
      Validators.max(1000)]
    ],
    minnotediff_st: ['',[
      Validators.required,
      Validators.min(1e-3),
      Validators.max(12)]
    ],
    lmhgaussian_st: ['',[
      Validators.required,
      Validators.min(1e-3),
      Validators.max(12)]
    ]
  });

  constructor(private fb:FormBuilder) { }

  ngOnInit() {
  }
  setValues(param:any) {
    this.ParametersForm.patchValue(param);
    this.ParametersForm.patchValue({medianfiltersize_ms: 1000*param.medianfiltersize_s});
    this.ParametersForm.patchValue({minimumtimesize_ms: 1000*param.minimumtimesize_s});
    this.ParametersForm.patchValue({minnotesize_ms: 1000*param.minnotesize_s});
  }
  getValues() {
    let temp = {
      name: this.ParametersForm.value.name,
      medianfiltersize_s: this.ParametersForm.value.medianfiltersize_ms / 1e3,
      thresholdenergyon_db: this.ParametersForm.value.thresholdenergyon_db,
      thresholdenergyoff_db: this.ParametersForm.value.thresholdenergyoff_db,
      maxpitchvariation_st: this.ParametersForm.value.maxpitchvariation_st,
      minimumtimesize_s: this.ParametersForm.value.minimumtimesize_ms / 1e3,
      minnotesize_s: this.ParametersForm.value.minnotesize_ms / 1e3,
      minnotediff_st: this.ParametersForm.value.minnotediff_st,
      lmhgaussian_st: this.ParametersForm.value.lmhgaussian_st
    }
    return(temp)
  }

}
