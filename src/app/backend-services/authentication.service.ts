import { Injectable } from '@angular/core';
import { BASE_API_URL, httpOptions } from './global-backend';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map } from 'rxjs/operators';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


//input
export interface LoginInput {
  username: string;
  password: string;
}
//output
export interface LoginOutput {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

export interface RevokeTokenInput {
  token: string;
}

export interface RefreshTokenInput {
  refresh_token: string;
}

export interface UserInfos {
  username: string;
  email: string;
}

const ClientId = 'Ox6fGyhvY39MpuQcKc9MJd0SJcIs4kBLbDH4qoIu';
const ClientSecret = 'pVo4dYr3elkTbmTV6C4CFHugQ08HaH2y13YFky2zrbVc2m0q2QQq9jPFUpAyssS3eSK0VvX1v4EAnQL0iiOUFj2OWEud2yq1VC1JwM5urvgnWmjhelKwdPBrjVrTS4xl';


/////////////////////////
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
////////////////////////



@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // URLs
  private AuthenticationUrl = BASE_API_URL + '/user/authentication/token';
  private RevokeTokenUrl = BASE_API_URL + '/user/authentication/revoke-token';
  private InfosUrl = BASE_API_URL + '/user/infos';
  // BehaviorSubject
  public loggedInPriority = new BehaviorSubject<boolean>(this.isAuthenticated());
  public loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());
  public username = new BehaviorSubject<string>(this.getUsername());

  constructor(private http: HttpClient,
              private cookieService: CookieService
              ) {
    this.loggedInPriority.next(this.isAuthenticated());
    this.loggedIn.next(this.isAuthenticated());
    this.username.next(this.getUsername());
  }

  isAuthenticated(): boolean {
    return !!this.cookieService.check('username');
  }

  getUsername(): string {
    if(this.isAuthenticated()) {
      return this.cookieService.get('username');
    }
    else {
      return "UnloggedUser";
    }
  }
  get_token_type(): string {
    return this.cookieService.get("token_type");
  }
  get_token(): string {
    return this.cookieService.get("access_token");
  }

  isExpired() {
    return !!this.cookieService.check('access_token');
  }

  private UpdateAuthenticationAccess(authentication:LoginOutput) {
    this.cookieService.set("access_token",authentication.access_token,this.ExpirationDate(authentication.expires_in),undefined,undefined,false,"Lax");
    this.cookieService.set("refresh_token",authentication.refresh_token);
    this.cookieService.set("token_type",authentication.token_type);
  }

  private ExpirationDate(expiresIn:number){
    let date = new Date();
    date.setSeconds(date.getSeconds() + expiresIn);
    return date;
  }

  get_username() {
    return this.http.get<UserInfos>(this.InfosUrl, httpOptions)
      .pipe(
        map(infos => {
          this.username.next(infos.username);
          this.cookieService.set("username",infos.username);
        }),
        catchError(err => {
          return throwError("Failed to get user infos");
        })
      );
  }

  login(credentials: LoginInput) {
    let totalcredentials = {
      grant_type: "password",
      client_id: ClientId,
      client_secret: ClientSecret,
      username: credentials.username,
      password: credentials.password
    }
    return this.http.post<LoginOutput>(this.AuthenticationUrl, totalcredentials, httpOptions)
      .pipe(
        map(LoginOutput => {
          this.UpdateAuthenticationAccess(LoginOutput);
          this.loggedInPriority.next(true);
          this.get_username().subscribe();
          this.loggedIn.next(true);
        }),
        catchError(err => {
          return throwError("Login failed");
        })
      );
  }

  refreshtoken(INrefreshtoken: RefreshTokenInput){
    let completeinput = {
      grant_type: "refresh_token",
      client_id: ClientId,
      client_secret: ClientSecret,
      refresh_token: INrefreshtoken.refresh_token
    }
    return this.http.post<LoginOutput>(this.AuthenticationUrl, completeinput, httpOptions)
      .pipe(
        map(LoginOutput => {
          this.UpdateAuthenticationAccess(LoginOutput);
        }),
        catchError(err => {
          return throwError("Failed to refresh token");
        })
      );
  }

  logout() {
    let completeinput = {
      client_id: ClientId,
      client_secret: ClientSecret,
      token: this.get_token()
    }
    this.cookieService.deleteAll();
    this.loggedInPriority.next(false);
    this.loggedIn.next(false);
    this.username.next(this.getUsername());
    this.http.post(this.RevokeTokenUrl, completeinput, httpOptions).subscribe();
  }


}



@Injectable()
export class AuthGuardService implements CanActivate {
  loggedIn: boolean;
  constructor( public router: Router, private authenticationService: AuthenticationService) {
    this.authenticationService.loggedIn.subscribe( value => {this.loggedIn = value;});
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (this.loggedIn) {
          return true;
      }
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
      return false;
  }
}


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor{
  loggedIn: boolean;

  constructor(private authenticationService: AuthenticationService){
    this.authenticationService.loggedInPriority.subscribe( value => {this.loggedIn = value;});
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.loggedIn) {
      let tokentype:string = this.authenticationService.get_token_type();
      let token:string = this.authenticationService.get_token();
      request = request.clone({ headers: request.headers.set('Authorization', tokentype + " " + token) });
    }
    
    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request);
  }
}
