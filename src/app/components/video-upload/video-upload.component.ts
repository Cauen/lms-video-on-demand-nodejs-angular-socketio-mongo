import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';//Tags
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service';

import { DomSanitizer } from '@angular/platform-browser';
import {Location} from '@angular/common';

export interface TagVideo {
  name: string;
}

// Declare lib video.js as external of angular
declare let videojs: any;

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})
export class VideoUploadComponent implements OnInit {
  
  videoUrl;
  name : string;
  description : string;
  tags : [string];
  file: File = null;
  fileThumb: File = null;
  course: string;
  duration: Number;

  courses = [];

  //Tags
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagVideos: TagVideo[] = [];

  //Upload
  percentage : Number = 0;
  videoPreviewURL : string;
  videoLoaded : boolean = false;
  imageUploadText: string;
  vidObj: any;
  @ViewChild('videopreview') vid: ElementRef;
  @ViewChild('uploadvideo') uploadvideo: ElementRef;
  @ViewChild('uploadphoto') uploadphoto: ElementRef;

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
    private cs: CourseService,
    private sanitizer: DomSanitizer,
    private _location: Location,
    ) { }

  ngOnInit() {
    this.getCourses();
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

    this.vs.addVideo(this.name, this.description, tags, this.file, this.fileThumb, this.course, this.duration).subscribe((res) => {
      var progress: any = res;
      var type = progress.type;
      var loaded = progress.loaded;
      var total = progress.total;
      this.percentage = loaded/total*100;
      console.log(progress);

    });
  }

  setPercentage(value) {
    this.percentage = value;
  }
  
  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.upload_video();
    }
  }

  ngAfterViewInit() {
    const options = {
      controls: true,
      preload: 'auto',
      techOrder: ['html5']
    };

    this.route.params.subscribe(params => {
      this.vidObj = new videojs(this.vid.nativeElement, options, function onPlayerReady() {
        videojs.log('Your player is ready!');
      });
    });

  }
  
 
  onFileChange(event){
    this.file = event.target.files[0];
    const files = event.target.files;
    if (files && files[0]) {
      var fileUrl = URL.createObjectURL(files[0]);
      var fileType = event.target.files[0].type;
      console.log(fileUrl);
      this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(files[0]));
      this.vidObj.src({ type: fileType, src: fileUrl });
      this.videoLoaded = true;
    }


  } 
  
  onFileChangeThumb(event){
    this.fileThumb = event.target.files[0];
    var fileThumbUrl = URL.createObjectURL(this.fileThumb);
    this.vidObj.poster(fileThumbUrl);
    
    this.imageUploadText = 'Reupload image'
  } 

  getDuration(e) {
    const durationz = e.target.duration;
    this.duration = durationz;
  }

  openUpload() {
    if (!this.videoLoaded)
      this.uploadvideo.nativeElement.click()
  }

  openReUploadVideo() {
    this.uploadvideo.nativeElement.click()
  }

  openUploadPhoto() {
    this.uploadphoto.nativeElement.click()
  }


  /*onFileChange(files: FileList) {
    this.file = files.item(0);
  }*/

}
