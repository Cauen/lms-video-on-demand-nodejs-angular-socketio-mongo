import { Component, OnInit } from '@angular/core';
import { UserDetails, AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../material.modules';

import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  details: UserDetails;

  constructor(private auth: AuthService, public _location: Location) { }

  ngOnInit() {
    this.details = this.auth.getUserDetails();
  }

}
