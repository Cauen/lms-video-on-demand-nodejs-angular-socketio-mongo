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
export class CourseService {

  uri = protocol + '://' + appip + ':' + appport + '/course';
  token = { headers: { Authorization: `Bearer ${this.as.getToken()}` } };

  constructor(private http: HttpClient, private as: AuthService) { }

  addCourse(name, description, tags, modules) {
    if (modules == "") modules = undefined;
    const obj = {
      name: name,
      description: description,
      tags: tags,
      modules: modules
    };
    console.log(obj);
    this.http.post(`${this.uri}/`, obj)
      .subscribe(res => console.log(res));
  }


  getCourses() {
    return this.http.get(`${this.uri}/`);
  }

  getCourseByID(id) {
    return this.http.get(`${this.uri}/`+ id);
  }

  getCourseAndVideosByID(id) {
    return this.http.get(`${this.uri}/courseandvideo/`+ id);
  }

  putCourseReorder(id, videos) {
    var data = {
      id:id,
      videos: videos
    }
    return this.http.put(`${this.uri}/reorder/`, data);
  }

  putCourseDetails(id, name, description, tags) {
    var data = {
      id:id,
      name: name,
      description: description,
      tags: tags
    }
    return this.http.put(`${this.uri}/update/`, data);
  }

  getCoursesAndData() {
    return this.http.get(`${this.uri}/getall`);
  }

  getVideosFromCourses(id) {
    return this.http.get(`${this.uri}/ofcourse/` + id);
  }

  getCoursesByQuery(query): any {
    return this.http.get(`${this.uri}/search/` + query);
  }
}