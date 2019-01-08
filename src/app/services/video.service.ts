import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  uri = 'http://localhost:4000/video';

  constructor(private http: HttpClient) { }
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
  addVideo(name, description, tags, fileToUpload: File, fileThumbToUpload: File, course){
    console.log({name, description, tags, fileToUpload});
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('filethumb', fileThumbToUpload, fileThumbToUpload.name);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('course', course);

    var config = {headers: {}, transformRequest: 'Angular'};
    config.headers['Content-Type'] = undefined;
  
    //this.http.post(`${this.uri}/upload`, {name: name});

    this.http.post(`${this.uri}/upload`, formData)
        .subscribe(res => console.log(res));
}

addComment(user, content, id) {
  this.http.post(`${this.uri}/comment/`+id, {user: user, content:content})
        .subscribe(res => console.log(res));
}

getComments(id) : any {
  return this.http.get(`${this.uri}/comments/`+id);
}



}