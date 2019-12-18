import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren } from '@angular/core';

import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';

import { Location } from '@angular/common';
import 'rxjs/add/operator/filter';

const url = 'https://cdn.rawgit.com/asvd/dragscroll/master/dragscroll.js';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, AfterViewInit {

  constructor(
    private vs: VideoService,
    private cs: CourseService,
    private us: UserService,
    private as: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public _location: Location,
  ) { }
  query: String = '';
  results: any = [];
  percents: any = [];
  coursesResults: any = [];
  ngOnInit() {
    this.loadscrollScript();
    this.route.queryParams
      .filter(params => params.query)
      .subscribe(params => {
        console.log(params); // {query: "popular"}

        this.query = params.query;
        this.searching();
      });

    this.us.getUserTimings(this.as.getUserDetails()._id).subscribe(res => {
      this.percents = res;
      var percents = [];
      this.percents.map(video => {
        percents[video.videoid] = video.percent;
      })
      this.percents = percents;
      console.log(this.percents);
    });
  }
  @ViewChildren('searchquery') queryElement;
  ngAfterViewInit() {
    setTimeout(() => {
      this.queryElement.first.nativeElement.focus();
    }, 200);
  }
  searching() {
    console.log(this.query);
    if (this.query) {
      this.router.navigate(['results'], { queryParams: { query: this.query } });
      this.vs.getVideosByQuery(this.query).subscribe(res => {
        this.results = res;
      });
      this.cs.getCoursesByQuery(this.query).subscribe(res => {
        this.coursesResults = res;
        console.log(this.coursesResults);
      });
    }
    else
      this.results = [];
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
}
