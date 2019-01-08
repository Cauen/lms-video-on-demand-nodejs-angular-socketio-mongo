import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import 'hammerjs';

import { ActivatedRoute, Router } from '@angular/router';

import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service'



export interface Courses {
  name: string;
  videos: [{fileThumbDirURL, fileDirURL, _id}];
}

@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.component.html',

  styleUrls: ['./classes-list.component.css']
})
export class ClassesListComponent implements OnInit {
  videoURL : string;
  videoThumb : string;
  coursesAndData: Courses[] = [];
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
    private cs: CourseService) { }

  ngAfterViewInit() {
    this._cdr.detectChanges();
  }

  ngOnInit() {
    this.carouselTileItems.forEach(el => {
      this.carouselTileLoad(el);
    });

    this.videoURL = 'http://localhost:4000/video/watch/5c32e3c5ceebfc49586d9e5f';
    this.videoThumb = 'http://localhost:4000/video/thumb/5c32e3c5ceebfc49586d9e5f';

    this.getCourses();
  }

 getCourses() {
    this.route.params.subscribe(params => {
      this.cs.getCoursesAndData().subscribe(res => {
        Array.prototype.push.apply(this.coursesAndData, res);
        console.log(this.coursesAndData);
        this.coursesAndDataWithVideos = this.coursesAndData.filter(this.filterByID);
        console.log(this.coursesAndDataWithVideos.length)
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

  public getThumbURL (couseKey, videoKey)  : string{
    return 'url('+this.vs.uri+'/thumb/'+this.coursesAndData[couseKey].videos[videoKey]._id+')';
  }

  public getVideoURL (couseKey, videoKey)  : string{
    return ''+this.vs.uri+'/watch/'+this.coursesAndData[couseKey].videos[videoKey]._id+'';
  }

  public getVideoID (courseKey, videoKey) : string {
    return this.coursesAndData[courseKey].videos[videoKey]._id;
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
