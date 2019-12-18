import { Component, OnInit } from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service'
import { VideoService } from '../../services/video.service'

import { Location } from '@angular/common';

import { SnackBarService } from '../../services/snackbar.service';

//Tags
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
export interface TagVideo {
  name: string;
}


@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cs: CourseService,
    private vs: VideoService,
    public _location: Location,
    private sbs: SnackBarService,
  ) { }
  id: Number;
  course: any = { name: '', description: '' };

  //Tags
  tags: [string];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagVideos: TagVideo[] = [];
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tagVideo
    if ((value || '').trim()) {
      this.pushTag(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  pushTag(value, isediting = true) {
    this.tagVideos.push({ name: value });
    if (isediting)
      this.editingCourse();
  }

  remove(tagVideo: TagVideo): void {
    const index = this.tagVideos.indexOf(tagVideo);

    if (index >= 0) {
      this.tagVideos.splice(index, 1);
      this.editingCourse();
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = (params['id']);

      this.cs.getCourseAndVideosByID(params['id']).subscribe(res => {
        if (!res)
          return console.log('Video not found');
        this.course = res;
        if (this.course.tags) {
          console.log(this.course.tags)
          for (var i = 0; i < this.course.tags.length; i++)
            this.pushTag(this.course.tags[i], false);

        }
        console.log(this.course);
      });


    });
  }

  editingCourse() {
    console.log('Editing');
    var tags = [];
    for (var key in this.tagVideos) {
      tags.push(this.tagVideos[key].name)
    }

    this.cs.putCourseDetails(this.id, this.course.name, this.course.description, tags).subscribe(res => {
      console.log(res);

      this.sbs.openSnackBar('Successfully Updated', 'Close');
    });
  }

  drop(event: CdkDragDrop<{ title: string, poster: string }[]>) {
    moveItemInArray(this.course.videos, event.previousIndex, event.currentIndex);
    console.log(this.course.videos);
    this.cs.putCourseReorder(this.id, this.course.videos).subscribe(res => {
      console.log(this.course);
      
      this.sbs.openSnackBar('Successfully Reordered', 'Close');
    });
  }

  deleteVideo(videoID) {
    this.vs.deleteVideoByID(videoID).subscribe(res => {
      if (res.success) {
        this.sbs.openSnackBar('Successfully Removed', 'Close');
        var elem = document.getElementById(videoID);
        elem.parentNode.removeChild(elem);
      } else {
        
        this.sbs.openSnackBar('Error at Removing', 'Close');
      }
    })
  }
}
