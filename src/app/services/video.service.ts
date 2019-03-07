import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

import { AuthService, TokenPayload } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { callbackify } from 'util';

const ipconfig = require('./config');
var appip = ipconfig.ip;
var appport = ipconfig.port;

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  uri = 'http://' + appip + ':' + appport + '/video';

  token = { headers: { Authorization: `Bearer ${this.as.getToken()}` } };
  constructor(private http: HttpClient, private as: AuthService) { }
  /*
  addVideo(name, description, tags, file) {
    const obj = {
      name: name,
      description: description,
      tags: tags,
      file: file
    };
    console.log(obj);
    var resultado;
    this.http.post(`${this.uri}/upload`, formData, options)
        .subscribe(res => {
          resultado = res;
        });
        

    return resultado;
  }
  */
  addVideo(name, description = "", tags, fileToUpload: File, fileThumbToUpload: File, course, duration) {
    console.log({ name, description, tags, fileToUpload });
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('filethumb', fileThumbToUpload, fileThumbToUpload.name);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('course', course);
    formData.append('duration', duration);

    var config = { headers: {}, transformRequest: 'Angular' };
    config.headers['Content-Type'] = undefined;

    return this.http.post(`${this.uri}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  addComment(user, content, id) {
    return this.http.post(`${this.uri}/comment/` + id, { user: user, content: content });
  }

  getComments(id): any {
    return this.http.get(`${this.uri}/comments/` + id);
  }

  getData(id): any {
    return this.http.get(`${this.uri}/data/` + id);
  }

  getThumb(id): any {
    return this.http.get(`${this.uri}/thumb/` + id);
  }

  getVideosByQuery(query): any {
    return this.http.get(`${this.uri}/search/` + query);
  }

  deleteVideoByID(id): any {
    return this.http.delete(`${this.uri}/delete/` + id);
  }

  putVideoDetails(id, name, description, tags) {
    var data = {
      id:id,
      name: name,
      description: description,
      tags: tags
    }
    return this.http.put(`${this.uri}/update/`, data);
  }

}