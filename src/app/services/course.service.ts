import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService, TokenPayload } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  uri = 'http://localhost:4000/course';
  token = { headers: { Authorization: `Bearer ${this.as.getToken()}` }};

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
    this.http.post(`${this.uri}/add`, obj, this.token)
        .subscribe(res => console.log(res));
  }


  getCourses() {
    return this.http.get(`${this.uri}/`, this.token);
  }

  getCoursesAndData() {
    return this.http.get(`${this.uri}/getall`, this.token);
  }

  getVideosFromCourses(id) {
    return this.http.get(`${this.uri}/ofcourse/`+id);
  }
}