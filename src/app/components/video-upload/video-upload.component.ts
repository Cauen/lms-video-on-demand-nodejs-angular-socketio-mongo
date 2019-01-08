import { Component, OnInit } from '@angular/core';//Tags
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service';

export interface TagVideo {
  name: string;
}

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})
export class VideoUploadComponent implements OnInit {
  name : string;
  description : string;
  tags : [string];
  file: File = null;
  fileThumb: File = null;
  course: string;

  courses = [];

  //Tags
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagVideos: TagVideo[] = [
  ];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tagVideo
    if ((value || '').trim()) {
      this.tagVideos.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tagVideo: TagVideo): void {
    const index = this.tagVideos.indexOf(tagVideo);

    if (index >= 0) {
      this.tagVideos.splice(index, 1);
    }
  }

  constructor(private vs:VideoService, 
    private route: ActivatedRoute,
    private router: Router,
    private cs: CourseService) { }

  ngOnInit() {
    this.getCourses()
  }

  getCourses() {
    this.route.params.subscribe(params => {
      this.cs.getCourses().subscribe(res => {
        //this.courses.push(res);
        Array.prototype.push.apply(this.courses, res);
        console.log(this.courses);
      });
    });
  }

  upload_video() {
    
    var tags = [];
    for (var key in this.tagVideos) {
      tags.push(this.tagVideos[key].name)
    }
    //this.vs.addVideo(this.name, this.description, tags, this.file[0]);

    this.vs.addVideo(this.name, this.description, tags, this.file, this.fileThumb, this.course);

    
  }
  
  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.upload_video();
    }
  }
  
  onFileChange(event){
    this.file = event.target.files[0];
    console.log(event);
  } 
  onFileChangeThumb(event){
    this.fileThumb = event.target.files[0];
    console.log(event);
  } 

  /*onFileChange(files: FileList) {
    this.file = files.item(0);
  }*/

}
