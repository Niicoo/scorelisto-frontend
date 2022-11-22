import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { RythmParameterOutput } from 'src/app/backend-services/parameters-manager.service';


@Component({
  selector: 'app-rhythm-parameters',
  templateUrl: './rhythm-parameters.component.html',
  styleUrls: ['./rhythm-parameters.component.css']
})
export class RhythmParametersComponent implements OnInit {
  ParametersForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9 ]{2,32}[a-zA-Z0-9]$')]
    ],
    bpm_max: ['', [
      Validators.required,
      Validators.min(40),
      Validators.max(200)]
    ],
    bpm_min: ['', [
      Validators.required,
      Validators.min(40),
      Validators.max(200)]
    ],
    maxdelayvar: ['', [
      Validators.required,
      Validators.min(1e-3),
      Validators.max(1)]
    ],
    errormax: ['', [
      Validators.required,
      Validators.min(1e-3),
      Validators.max(100)]
    ],
    onenoteonebeat: ['', Validators.required],
    onenotetwobeat: ['', Validators.required],
    onenotethreebeat: ['', Validators.required],
    onenotefourbeat: ['', Validators.required],
    onenotefivebeat: ['', Validators.required],
    onenotesixbeat: ['', Validators.required],
    onenotesevenbeat: ['', Validators.required],
    onenoteeightbeat: ['', Validators.required],
    onerestonebeat: ['', Validators.required],
    oneresttwobeat: ['', Validators.required],
    onerestthreebeat: ['', Validators.required],
    onerestfourbeat: ['', Validators.required],
    onerestfivebeat: ['', Validators.required],
    onerestsixbeat: ['', Validators.required],
    onerestsevenbeat: ['', Validators.required],
    oneresteightbeat: ['', Validators.required],
    en_en: ['', Validators.required],
    er_en: ['', Validators.required],
    en_er: ['', Validators.required],
    den_sn: ['', Validators.required],
    sn_den: ['', Validators.required],
    dqn_en: ['', Validators.required],
    qr_er_en: ['', Validators.required],
    dqn_er: ['', Validators.required],
    en_en_qn: ['', Validators.required],
    qn_dqn_en: ['', Validators.required],
    qr_qr_er_en: ['', Validators.required],
    qn_dqn_er: ['', Validators.required],
    en_en_hn: ['', Validators.required],
    hn_dqn_en: ['', Validators.required],
    qr_qr_qr_er_en: ['', Validators.required],
    hn_dqn_er: ['', Validators.required],
    en_en_dhn: ['', Validators.required],
    en_sn_sn: ['', Validators.required],
    er_sn_sn: ['', Validators.required],
    sn_sn_en: ['', Validators.required],
    sn_sn_er: ['', Validators.required],
    sn_en_sn: ['', Validators.required],
    t_en_en_en: ['', Validators.required],
    t_en_den_sn: ['', Validators.required],
    t_en_sn_den: ['', Validators.required],
    t_sn_en_den: ['', Validators.required],
    t_sn_den_en: ['', Validators.required],
    t_den_en_sn: ['', Validators.required],
    t_den_sn_en: ['', Validators.required],
    en_qn_en: ['', Validators.required],
    dqn_sn_sn: ['', Validators.required],
    qn_dqn_sn_sn: ['', Validators.required],
    hn_dqn_sn_sn: ['', Validators.required],
    sn_sn_sn_sn: ['', Validators.required]
  });
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
  }

  setValues(param:any) {
    this.ParametersForm.patchValue(param);
    this.ParametersForm.patchValue({bpm_min: 60.0/param.delaymax_s});
    this.ParametersForm.patchValue({bpm_max: 60.0/param.delaymin_s});
  }
  getValues() {
    let temp = {
      name: this.ParametersForm.value.name,
      delaymin_s: 60.0/ this.ParametersForm.value.bpm_max,
      delaymax_s: 60.0/ this.ParametersForm.value.bpm_min,
      maxdelayvar: this.ParametersForm.value.maxdelayvar,
      errormax: this.ParametersForm.value.errormax,
      onenoteonebeat: this.ParametersForm.value.onenoteonebeat,
      onenotetwobeat: this.ParametersForm.value.onenotetwobeat,
      onenotethreebeat: this.ParametersForm.value.onenotethreebeat,
      onenotefourbeat: this.ParametersForm.value.onenotefourbeat,
      onenotefivebeat: this.ParametersForm.value.onenotefivebeat,
      onenotesixbeat: this.ParametersForm.value.onenotesixbeat,
      onenotesevenbeat: this.ParametersForm.value.onenotesevenbeat,
      onenoteeightbeat: this.ParametersForm.value.onenoteeightbeat,
      onerestonebeat: this.ParametersForm.value.onerestonebeat,
      oneresttwobeat: this.ParametersForm.value.oneresttwobeat,
      onerestthreebeat: this.ParametersForm.value.onerestthreebeat,
      onerestfourbeat: this.ParametersForm.value.onerestfourbeat,
      onerestfivebeat: this.ParametersForm.value.onerestfivebeat,
      onerestsixbeat: this.ParametersForm.value.onerestsixbeat,
      onerestsevenbeat: this.ParametersForm.value.onerestsevenbeat,
      oneresteightbeat: this.ParametersForm.value.oneresteightbeat,
      en_en: this.ParametersForm.value.en_en,
      er_en: this.ParametersForm.value.er_en,
      en_er: this.ParametersForm.value.en_er,
      den_sn: this.ParametersForm.value.den_sn,
      sn_den: this.ParametersForm.value.sn_den,
      dqn_en: this.ParametersForm.value.dqn_en,
      qr_er_en: this.ParametersForm.value.qr_er_en,
      dqn_er: this.ParametersForm.value.dqn_er,
      en_en_qn: this.ParametersForm.value.en_en_qn,
      qn_dqn_en: this.ParametersForm.value.qn_dqn_en,
      qr_qr_er_en: this.ParametersForm.value.qr_qr_er_en,
      qn_dqn_er: this.ParametersForm.value.qn_dqn_er,
      en_en_hn: this.ParametersForm.value.en_en_hn,
      hn_dqn_en: this.ParametersForm.value.hn_dqn_en,
      qr_qr_qr_er_en: this.ParametersForm.value.qr_qr_qr_er_en,
      hn_dqn_er: this.ParametersForm.value.hn_dqn_er,
      en_en_dhn: this.ParametersForm.value.en_en_dhn,
      en_sn_sn: this.ParametersForm.value.en_sn_sn,
      er_sn_sn: this.ParametersForm.value.er_sn_sn,
      sn_sn_en: this.ParametersForm.value.sn_sn_en,
      sn_sn_er: this.ParametersForm.value.sn_sn_er,
      sn_en_sn: this.ParametersForm.value.sn_en_sn,
      t_en_en_en: this.ParametersForm.value.t_en_en_en,
      t_en_den_sn: this.ParametersForm.value.t_en_den_sn,
      t_en_sn_den: this.ParametersForm.value.t_en_sn_den,
      t_sn_en_den: this.ParametersForm.value.t_sn_en_den,
      t_sn_den_en: this.ParametersForm.value.t_sn_den_en,
      t_den_en_sn: this.ParametersForm.value.t_den_en_sn,
      t_den_sn_en: this.ParametersForm.value.t_den_sn_en,
      en_qn_en: this.ParametersForm.value.en_qn_en,
      dqn_sn_sn: this.ParametersForm.value.dqn_sn_sn,
      qn_dqn_sn_sn: this.ParametersForm.value.qn_dqn_sn_sn,
      hn_dqn_sn_sn: this.ParametersForm.value.hn_dqn_sn_sn,
      sn_sn_sn_sn: this.ParametersForm.value.sn_sn_sn_sn
    }
    return(temp)
  }

}