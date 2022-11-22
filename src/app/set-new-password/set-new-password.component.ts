import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountManagerService } from '../backend-services/account-manager.service';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

import { matchOtherValidator } from 'src/app/login/login.component'

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.css']
})
export class SetNewPasswordComponent implements OnInit {
  SecondsBeforeRedirecting:number;
  isPasswordOk: boolean;
  NewPasswordForm:FormGroup;

  constructor(  private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private accountManager: AccountManagerService,
                private router: Router) { }

  countDown() {
    let self = this;
    this.SecondsBeforeRedirecting = this.SecondsBeforeRedirecting - 1;
    if(this.SecondsBeforeRedirecting>0){
      setTimeout(() => self.countDown.apply(this),1000);
    }
    else
    {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.isPasswordOk = false;
    this.SecondsBeforeRedirecting = 5;
    this.NewPasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.pattern('^.{8,32}$')]
      ],
      password_check: ['', [Validators.required, matchOtherValidator('password')]],
    });
  }

  onSubmitNewPassword() {
    let newpasswordinput = {
      token : this.activatedRoute.snapshot.params['token'],
      uidb64 : this.activatedRoute.snapshot.params['uidb64'],
      password: this.NewPasswordForm.value.password
    }
    this.accountManager.setnewpassword(newpasswordinput)
      .subscribe(
        // success path
        response => {
          this.isPasswordOk = true;
          setTimeout(this.countDown.apply(this),1000);
        }, 
        // error path
        error => {
          this.isPasswordOk = false;
        }
      );
  }

}
