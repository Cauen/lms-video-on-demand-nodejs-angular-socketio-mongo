import { Component, OnInit } from '@angular/core';

import {Router} from '@angular/router';

import { MaterialModule } from '../../material.modules';

import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent implements OnInit {
  constructor(private router: Router,public snackBar: MatSnackBar) { }
  username: string;
  password: string;
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
    if(this.username == 'admin' && this.password == 'admin'){
      
      this.openSnackBar('Success', 'close');
     this.router.navigate(["classes"]);
    } else {
      //alert('Wrong login or pass')
      this.openSnackBar('Wrong login or pass', 'close');
    }
  }
}