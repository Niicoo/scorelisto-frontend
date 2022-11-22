import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService, LoginOutput, LoginInput } from '../backend-services/authentication.service';
import { AccountManagerService } from '../backend-services/account-manager.service';



export function matchOtherValidator (otherControlName: string) {

  let thisControl: FormControl;
  let otherControl: FormControl;

  return function matchOtherValidate (control: FormControl) {

    if (!control.parent) {
      return null;
    }

    // Initializing the validator.
    if (!thisControl) {
      thisControl = control;
      otherControl = control.parent.get(otherControlName) as FormControl;
      if (!otherControl) {
        throw new Error('matchOtherValidator(): other control is not found in parent group');
      }
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity();
      });
    }

    if (!otherControl) {
      return null;
    }

    if (otherControl.value !== thisControl.value) {
      return {
        matchOther: true
      };
    }

    return null;

  }

}




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  displayForgotPasswordForm:boolean = false;
  displayRegistrationOK:boolean = false;
  displayRegisterForm:boolean = false;
  displayLoginForm:boolean = true;

  ForgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
  SignInForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  RegisterForm = this.fb.group({
    register_username: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_]{6,20}$')]
    ],
    register_email: ['', [
      Validators.required,
      Validators.email]
    ],
    register_confirmemail: ['', [
      matchOtherValidator('register_email')]
    ],
    register_password: ['', [
      Validators.required,
      Validators.pattern('^.{8,32}$')]
    ],
    register_confirmpassword: ['', [
      matchOtherValidator('register_password')]
    ]
  });

  returnUrl:string;
  emailRegistrationOK:string = "";
  usernameRegistrationOK:string = "";
  WaitingForAnAnswer:boolean = false;

  constructor(  private accountManager: AccountManagerService, 
                private fb: FormBuilder, 
                private authenticationService: AuthenticationService, 
                private route: ActivatedRoute,
                private router: Router) {}

  ngOnInit() {
    this.resetForms();
    this.emailRegistrationOK = "";
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/converter';
    this.WaitingForAnAnswer = false;
  }

  resetForms() {
    this.ForgotPasswordForm.reset();
    this.SignInForm.reset();
    this.RegisterForm.reset();
  }

  showLoginForm(){
    this.resetForms();
    this.displayForgotPasswordForm = false;
    this.displayRegistrationOK = false;
    this.displayRegisterForm = false;
    this.displayLoginForm = true;
  }
  showRegisterForm(){
    this.resetForms();
    this.displayForgotPasswordForm = false;
    this.displayRegistrationOK = false;
    this.displayLoginForm = false;
    this.displayRegisterForm = true;
  }
  showForgotPasswordForm(){
    this.resetForms();
    this.displayRegistrationOK = false;
    this.displayRegisterForm = false;
    this.displayLoginForm = false;
    this.displayForgotPasswordForm = true;
  }
  showRegistrationOk(){
    this.resetForms();
    this.displayForgotPasswordForm = false;
    this.displayRegisterForm = false;
    this.displayLoginForm = false;
    this.displayRegistrationOK = true;
  }

  onSubmitSignIn() {
    this.WaitingForAnAnswer = true;
    this.authenticationService.login(this.SignInForm.value)
      .subscribe(
        // success path
        response => {
          this.router.navigateByUrl(this.returnUrl);
        }, 
        // error path
        error => {
          this.WaitingForAnAnswer = false;
          console.log(error);
        }
      );
  }

  onSubmitRegister(){
    let registration = {
      username: this.RegisterForm.value.register_username,
      email: this.RegisterForm.value.register_email,
      password: this.RegisterForm.value.register_password
    }
    this.WaitingForAnAnswer = true;
    this.accountManager.register(registration)
      .subscribe(
        // success path
        response => {
          this.emailRegistrationOK = this.RegisterForm.value.register_email;
          this.usernameRegistrationOK = this.RegisterForm.value.register_username;
          this.resetForms();
          this.WaitingForAnAnswer = false;
          this.showRegistrationOk();
        }, 
        // error path
        error => {
          this.WaitingForAnAnswer = false;
          console.log(error);
        }
      );
  }

  onSubmitResetPassword() {
    this.accountManager.requestnewpassword(this.ForgotPasswordForm.value)
      .subscribe(
        // success path
        response => {
          this.router.navigate(['/home']);
        }, 
        // error path
        error => {
          console.log(error);
        }
      );
  }

  reSendActivationLink() {
    this.accountManager.sendactivationlink({"email": this.emailRegistrationOK}).subscribe(
      response => {console.log("voila");},
      error => {console.log("erreur");}
      );
  }
}
