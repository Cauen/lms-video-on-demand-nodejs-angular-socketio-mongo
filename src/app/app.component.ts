import { Component, OnInit } from '@angular/core';

import { AuthService, UserDetails } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  constructor(public auth: AuthService) {}
  public ngOnInit() {
    this.username = this.auth.getUserDetails();
  }
  username = {name: "User"} as UserDetails;
  title = 'NeadTV';
}
