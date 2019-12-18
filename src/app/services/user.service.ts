import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService, TokenPayload } from '../services/auth.service';

const ipconfig = require('./config');
var appip = ipconfig.ip;
var appport = ipconfig.port;
var protocol = ipconfig.protocol;
@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri = protocol + '://' + appip + ':' + appport + '/user';
  user = this.as.getUserDetails();

  constructor(private http: HttpClient, private as: AuthService) { }

  setUserTiming(userid, timing, videoid, duration) {
    const obj = {
      userid: userid,
      timing: timing,
      videoid: videoid,
      duration: duration,
    };
    console.log(obj);
    return this.http.post(`${this.uri}/setvideotiming`, obj)
      .subscribe(res => console.log(res));
  }

  getUserTiming(userid, videoid) {
    return this.http.get(`${this.uri}/videotime/` + userid + '/' + videoid);
  }

  getLastWatchedVideo() {
    return this.http.get(`${this.uri}/lastwatched/` + this.user._id);
  }

  getUserTimings(userid) {
    return this.http.get(`${this.uri}/getvideostimings/` + userid);
  }


}