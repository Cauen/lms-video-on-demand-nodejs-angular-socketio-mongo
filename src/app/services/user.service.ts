import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService, TokenPayload } from '../services/auth.service';

const ipconfig = require('./config');
var appip = ipconfig.ip;
var appport = ipconfig.port;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri = 'http://' + appip + ':' + appport + '/user';
  token = { headers: { Authorization: `Bearer ${this.as.getToken()}` } };

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
    const obj = {
      userid: userid,
      videoid: videoid,
    };
    return this.http.post(`${this.uri}/getvideotimings`, obj);
  }

  getUserTimings(userid) {
    const obj = {
      userid: userid,
    };
    return this.http.post(`${this.uri}/getvideostimings`, obj);
  }


}