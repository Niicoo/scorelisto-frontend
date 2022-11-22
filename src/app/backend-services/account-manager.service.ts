import { Injectable } from '@angular/core';
import { BASE_API_URL, httpOptions } from './global-backend';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';


export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface SendActivationLinkInput {
  email: string;
}

export interface ActivateAccountInput {
  uidb64: string;
  token: string;
}

export interface DeleteUserInput {
  password: string;
}
export interface RestoreUserInput {
  email: string;
}
export interface UpdatePasswordInput {
  old_password: string;
  new_password: string;
}
export interface RequestNewPasswordInput {
  email: string;
}
export interface SetNewPasswordInput {
  uidb64: string;
  token: string;
  password: string;
}

export interface Quotas {
  memory_max: number;
  memory_used: number;
  projects_max: number;
  projects_remaining: number;
}

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  body: string;
}


@Injectable({
  providedIn: 'root'
})
export class AccountManagerService {
  // URLs
  private RegistrationUrl = BASE_API_URL + '/user/register';
  private SendActivationLinkUrl = BASE_API_URL + '/user/register/retry';
  private ActivateAccountUrl = BASE_API_URL + '/user/activate';
  private DeleteUserUrl = BASE_API_URL + '/user/delete';
  private RestoreUserUrl = BASE_API_URL + '/user/restore';
  private UpdatePasswordUserUrl = BASE_API_URL + '/user/update_password';
  private RequestNewPasswordUrl = BASE_API_URL + '/user/reset_password';
  private SetNewPasswordUrl = BASE_API_URL + '/user/set_new_password';
  private QuotasUrl = BASE_API_URL + '/user/quotas';
  private ContactUrl = BASE_API_URL + '/user/contact';
  // Quotas
  public quotas = new BehaviorSubject<Quotas>({memory_max:0, memory_used:0, projects_max:0, projects_remaining:0});

  constructor(  private http: HttpClient,
                private authentication: AuthenticationService) {
    this.authentication.loggedIn.subscribe( value => {this.LoggedInChange(value);} );
  }

  private LoggedInChange(LoggedIn:boolean) {
    if(LoggedIn) {
      this.get_quotas().subscribe();
    }
    else {
      this.ClearQuotas();
    }
  }

  private ClearQuotas() {
    this.quotas.next({memory_max:0,memory_used:0,projects_max:0,projects_remaining:0});
  }

  register(registration: RegisterInput){
    return this.http.post(this.RegistrationUrl, registration, httpOptions)
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError({registration:"Failed"});})
      );
  }

  sendactivationlink(INsendactivationlink: SendActivationLinkInput){
    return this.http.post(this.SendActivationLinkUrl, INsendactivationlink, httpOptions)
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to send activation link");})
      );
  }
  
  activateaccount(INactivateaccount: ActivateAccountInput){
    return this.http.post(this.ActivateAccountUrl, INactivateaccount, httpOptions)
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to activate account");})
      );
  }

  deleteuser(INdeleteuser:DeleteUserInput){
    return this.http.post(this.DeleteUserUrl, INdeleteuser, httpOptions)
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to delete user");
        })
      );
  }

  restoreuser(INrestoreuser:DeleteUserInput){
    return this.http.post(this.RestoreUserUrl, INrestoreuser, httpOptions)
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to restore user");})
      );
  }

  updatepassword(INupdatepassword:UpdatePasswordInput){
    return this.http.post(this.UpdatePasswordUserUrl, INupdatepassword, httpOptions)
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to update user password");})
      );
  }

  requestnewpassword(INrequestnewpassword:RequestNewPasswordInput){
    return this.http.post(this.RequestNewPasswordUrl, INrequestnewpassword, httpOptions)
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to send request");})
      );
  }

  setnewpassword(INnewpassword:SetNewPasswordInput){
    return this.http.post(this.SetNewPasswordUrl, INnewpassword, httpOptions)
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to set new password");})
      );
  }

  get_quotas() {
    return this.http.get<Quotas>(this.QuotasUrl)
      .pipe(
        map(response => {this.quotas.next(response);}),
        catchError(err => {return throwError("Failed to get quotas");})
      );
  }

  post_contact(INcontact:ContactInput) {
    return this.http.post(this.ContactUrl, INcontact, httpOptions)
      .pipe(
        map(response => {return response;}),
        catchError(err => {return throwError("Failed to send message");})
      );
  }
}
