import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {Router} from '@angular/router';

import { MaterialModule } from '../../material.modules';

import {MatSnackBar} from '@angular/material';

import { AuthService, TokenPayload } from '../../services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class UserLoginComponent implements OnInit {
  constructor(private router: Router,public snackBar: MatSnackBar, private as: AuthService) { }
  credentials: TokenPayload = {
    email: '',
    password: ''
  };
  ngOnInit() {
  }
  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.login();
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  login() : void {    
    this.as.login(this.credentials).subscribe(() => {
      this.openSnackBar('Success', 'close');
      this.router.navigateByUrl('/courses');
    }, (err) => {
      this.openSnackBar(err, 'close');
      console.error(err);
    });
  }
}