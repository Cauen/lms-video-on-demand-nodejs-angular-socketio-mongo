import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  uri = 'http://localhost:4000/course';

  constructor(private http: HttpClient) { }

  addCourse(name, description, tags, modules) {
    if (modules == "") modules = undefined;
    const obj = {
      name: name,
      description: description,
      tags: tags,
      modules: modules
    };
    console.log(obj);
    this.http.post(`${this.uri}/add`, obj)
        .subscribe(res => console.log(res));
  }

  getCourses() {
    return this.http.get(`${this.uri}/`);
  }

  getCoursesAndData() {
    return this.http.get(`${this.uri}/getall`);
  }

  getVideosFromCourses(id) {
    return this.http.get(`${this.uri}/ofcourse/`+id);
  }
}