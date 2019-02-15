import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import 'hammerjs';

import { ActivatedRoute, Router } from '@angular/router';

import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service'
import { UserService } from '../../services/user.service'
import { UserDetails, AuthService } from '../../services/auth.service';

const url = 'https://cdn.rawgit.com/asvd/dragscroll/master/dragscroll.js';
@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.component.html',

  styleUrls: ['./classes-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClassesListComponent implements OnInit {

  userDetails: UserDetails;
  videoURL: string;
  videoThumb: string;
  coursesAndData: any = [];
  videosWatching;
  percents: any = [];
  percentsIdIndex: any = [];
  coursesAndDataWithVideos: any = [];
  constructor(private vs: VideoService,
    private route: ActivatedRoute,
    private router: Router,
    private cs: CourseService,
    private us: UserService,
    private as: AuthService,
  ) { }

  ngAfterViewInit() {
  }

  ngOnInit() {

    this.userDetails = this.as.getUserDetails();

    this.getVideoPercents();
    this.loadscrollScript();
    
  }

  getCourses() {
    this.route.params.subscribe(params => {
      this.cs.getCoursesAndData().subscribe(res => {
        Array.prototype.push.apply(this.coursesAndData, res);

        // Delete videos that already watched at 90%
        var maxPercent = 90;
        for (var i = 0; i<this.coursesAndData.length; i++) {
          this.coursesAndData[i].totalVideos = this.coursesAndData[i].videos.length;
          this.coursesAndData[i].watchedCount = 0;
          var courseVideos = [];
          for (var j=0; j<this.coursesAndData[i].videos.length; j++) {
            if (this.percents[this.coursesAndData[i].videos[j]._id] < maxPercent || !this.percents[this.coursesAndData[i].videos[j]._id] ) {
              courseVideos.push(this.coursesAndData[i].videos[j]);
            } else {
              this.coursesAndData[i].watchedCount++;
            }
          }
          this.coursesAndData[i].videos = courseVideos;
        }

        // If have videos, go to CourseAndDataWithVideos
        this.coursesAndDataWithVideos = this.coursesAndData.filter(this.filterByID);
      });
    });
  }

  getVideoPercents() {
    this.route.params.subscribe(params => {
      this.us.getUserTimings(this.userDetails._id).subscribe(res => {
        var percentages: any = res;
        var percents = [];
        percentages.map(video => {
          percents[video.videoid] = video.percent;
        })
        this.percents = percents;
        this.getCourses();
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

  loadAPI: Promise<any>;

  public loadscrollScript() {
    this.loadAPI = new Promise((resolve) => {
      console.log('resolving promise...');
      this.loadScript();
    });
  }

  public loadScript() {
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  private millisToMinutesAndSeconds(millis) {
    millis = parseInt(millis);
    var minutes = Math.floor(millis / 60);
    var seconds = ((millis % 60) / 1).toFixed(0);
    var sseconds = parseInt(seconds);
    return minutes + ":" + (sseconds < 10 ? '0' : '') + seconds;
  }

}
