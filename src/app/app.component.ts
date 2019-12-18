import { Component, OnInit, HostListener } from '@angular/core';

import { AuthService, UserDetails } from './services/auth.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { trigger, transition, animate, style } from '@angular/animations'

import {
  NavigationCancel,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    public auth: AuthService,
    private _loadingBar: SlimLoadingBarService,
    private _router: Router,
    public _location: Location,
    private route: ActivatedRoute,

  ) {
    this._router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
  }
  public ngOnInit() {
    this.username = this.auth.getUserDetails();
    console.log('ON INIT APPCOMPONENT');
  }
  username = { name: "User" } as UserDetails;
  title = 'NeadTV';
  showBack: boolean = false;

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    console.log($event);
    console.log("scrolling");
    console.log(window.pageYOffset);
    if (window.pageYOffset > 60) {
      this.showBack = true;
    } else {
      this.showBack = false;
    }
  }

  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this._loadingBar.start();
    }
    if (event instanceof NavigationEnd) {
      this._loadingBar.complete();
    }
    if (event instanceof NavigationCancel) {
      this._loadingBar.stop();
    }
    if (event instanceof NavigationError) {
      this._loadingBar.stop();
    }
  }
}
