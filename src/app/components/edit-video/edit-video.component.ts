import { Component, OnInit } from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.css']
})
export class EditVideoComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vs: VideoService,
    private _location: Location,
    private sbs: SnackBarService,
  ) { }
  id: Number;
  video: any = { name: '', description: '' };
  
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
      this.editingVideo();
  }

  remove(tagVideo: TagVideo): void {
    const index = this.tagVideos.indexOf(tagVideo);

    if (index >= 0) {
      this.tagVideos.splice(index, 1);
      this.editingVideo();
    }
  }

  editingVideo() {
    console.log('Editing');
    var tags = [];
    for (var key in this.tagVideos) {
      tags.push(this.tagVideos[key].name)
    }

    this.vs.putVideoDetails(this.id, this.video.name, this.video.description, tags).subscribe(res => {
      console.log(res);

      this.sbs.openSnackBar('Successfully Updated', 'Close');
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = (params['id']);

      this.vs.getData(this.id).subscribe(res => {
        if (!res)
          return console.log('Video not found');
        this.video = res;
        if (this.video.tags) {
          console.log(this.video.tags)
          for (var i = 0; i < this.video.tags.length; i++)
            this.pushTag(this.video.tags[i], false);

        }
        console.log(this.video);
      });
    });


  }

}
