import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GoInIfLoggedService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate() {
    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/courses');
      return false;
    }
    return true;
  }
}
