import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './backend-services/authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  loggedIn: boolean;
  username: string;
  public isCollapsed = true;

  constructor(private authenticationService: AuthenticationService){
    this.authenticationService.loggedIn.subscribe( value => {this.loggedIn = value;});
    this.authenticationService.username.subscribe( value => {this.username = value;});
  }
  logout() {
    this.authenticationService.logout();
  }
}
