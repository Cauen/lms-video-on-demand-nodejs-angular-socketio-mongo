import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService, TokenPayload } from '../../services/auth.service';

import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserRegisterComponent implements OnInit {
  constructor(private router: Router, public snackBar: MatSnackBar, private as: AuthService) { }
  name: string;
  email: string;
  password: string;
  username: string;
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
    username: ''
  };
  ngOnInit() {
  }
  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.register();
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  register() {
    this.as.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/');
    }, (err) => {
      this.openSnackBar(err, 'close');
      console.error(err);
    });
  }
}