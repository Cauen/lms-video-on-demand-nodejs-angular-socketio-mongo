import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import 'hammerjs';

import { ActivatedRoute, Router } from '@angular/router';

import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service'
import { UserService } from '../../services/user.service'
import {UserDetails, AuthService} from '../../services/auth.service';


export interface Courses {
  name: string;
  videos: [{fileThumbDirURL, fileDirURL, _id, videoDuration}];
}

@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.component.html',

  styleUrls: ['./classes-list.component.css']
})
export class ClassesListComponent implements OnInit {
  
  userDetails: UserDetails;
  videoURL : string;
  videoThumb : string;
  coursesAndData: Courses[] = [];
  videosWatching;
  percents: any = [];
  coursesAndDataWithVideos: Courses[] = [];
  imgags = [
    'assets/bg.jpg',
    'assets/car.png',
    'assets/canberra.jpg',
    'assets/holi.jpg'
  ];
  public carouselTileItems: Array<any> = [0, 1, 2, 3, 4, 5, 6];
  public carouselTiles = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };
  public carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 2, md: 4, lg: 6, all: 0 },
    slide: 3,
    speed: 250,
    point: {
      visible: true
    },
    load: 2,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };
  constructor(private _cdr: ChangeDetectorRef, private vs:VideoService, 
    private route: ActivatedRoute,
    private router: Router,
    private cs: CourseService,
    private us: UserService,
    private as: AuthService,
    ) { }

  ngAfterViewInit() {
    this._cdr.detectChanges();
  }

  ngOnInit() {
    this.carouselTileItems.forEach(el => {
      this.carouselTileLoad(el);
    });

    this.userDetails = this.as.getUserDetails();

    this.videoURL = 'http://localhost:4000/video/watch/5c32e3c5ceebfc49586d9e5f';
    this.videoThumb = 'http://localhost:4000/video/thumb/5c32e3c5ceebfc49586d9e5f';

    this.getCourses();
    this.getVideoPercents();
  }

 getCourses() {
    this.route.params.subscribe(params => {
      this.cs.getCoursesAndData().subscribe(res => {
        Array.prototype.push.apply(this.coursesAndData, res);
        console.log("All courses");
        console.log(this.coursesAndData);
        this.coursesAndDataWithVideos = this.coursesAndData.filter(this.filterByID);
        console.log("Only with videos")
        console.log(this.coursesAndDataWithVideos);
      });
    });
  }

  getVideoPercents() {
    this.route.params.subscribe(params => {
      this.us.getUserTimings(this.userDetails._id).subscribe(res => {
        console.log("PERCENTS");
        console.log(res);

        this.percents = res;
      });
    });
  }

  filterByID(obj) {
    if (obj.videos && obj.videos.length) {
      return true;
    } else {
      return false;
    }
  }

  public getThumbURL (courseKey, videoKey)  : string{
    if (this.coursesAndDataWithVideos[courseKey].videos[videoKey])
    return 'url('+this.vs.uri+'/thumb/'+this.coursesAndDataWithVideos[courseKey].videos[videoKey]._id+')';
  }

  public getVideoURL (courseKey, videoKey)  : string{
    if (this.coursesAndDataWithVideos[courseKey].videos[videoKey])
    return ''+this.vs.uri+'/watch/'+this.coursesAndDataWithVideos[courseKey].videos[videoKey]._id+'';
  }

  public getVideoID (courseKey, videoKey) : string {
    if (this.coursesAndDataWithVideos[courseKey].videos[videoKey])
      return this.coursesAndDataWithVideos[courseKey].videos[videoKey]._id;
  }

  private millisToMinutesAndSeconds(millis) {
    millis = parseInt(millis);
    var minutes = Math.floor(millis / 60);
    console.log(minutes);
    var seconds = ((millis % 60) / 1).toFixed(0);
    var sseconds = parseInt(seconds);
    return minutes + ":" + (sseconds < 10 ? '0' : '') + seconds;
  }
  
  public getVideoDuration (courseKey, videoKey) : string {
    var durat;
    if (this.coursesAndDataWithVideos[courseKey].videos[videoKey] && this.coursesAndDataWithVideos[courseKey].videos[videoKey].videoDuration) {
      durat = this.coursesAndDataWithVideos[courseKey].videos[videoKey].videoDuration;
      return this.millisToMinutesAndSeconds(durat);
    }
    return "00:00";
      
  }

  public getWatchingPercent(courseKey, videoKey) : Number {
    var videoKey;
    if (this.coursesAndDataWithVideos[courseKey].videos[videoKey])
      videoKey = this.coursesAndDataWithVideos[courseKey].videos[videoKey]._id;
    for (var i = 0; i < this.percents.length; i++) {
      if (videoKey == this.percents[i].videoid && this.percents[i].percent)
        return this.percents[i].percent;
    }
    return 0;
  }

  public carouselTileLoad(j) {
    const len = this.carouselTiles[j].length;
    if (len <= 30) {
      for (let i = len; i < len + 15; i++) {
        this.carouselTiles[j].push(
          this.imgags[Math.floor(Math.random() * this.imgags.length)]
        );
      }
    }
  }

}
