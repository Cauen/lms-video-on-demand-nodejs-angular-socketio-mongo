import { Component, OnInit } from '@angular/core';
import { UserDetails, AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { VideoService } from '../../services/video.service';
import { UserService } from '../../services/user.service'
import { MaterialModule } from '../../material.modules';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
const url = 'https://cdn.rawgit.com/asvd/dragscroll/master/dragscroll.js';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {

  userDetails: UserDetails;
  details: UserDetails;
  course: any = {};
  id: string;
  percents: any = [];

  constructor(
    private auth: AuthService,
    private cs: CourseService,
    private vs: VideoService,
    private us: UserService,
    public as: AuthService,
    public _location: Location,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadscrollScript();
    this.userDetails = this.as.getUserDetails();
    this.getVideoPercents();

    this.details = this.auth.getUserDetails();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.cs.getCourseAndVideosByID(params['id']).subscribe(res => {
        this.course = res;
        console.log(this.course);
      });
    });
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

  getVideoPercents() {
    this.route.params.subscribe(params => {
      this.us.getUserTimings(this.userDetails._id).subscribe(res => {
        console.log("PERCENTS");
        console.log(res);


        var percentages : any = res;
        var percents = [];
        percentages.map(video => { 
          percents[video.videoid] = video.percent;
        })
        this.percents = percents;
        console.log(this.percents);
      });
    });
  }

}
