import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { VideoService } from '../../services/video.service';
import { UserService } from '../../services/user.service';
import { UserDetails, AuthService } from '../../services/auth.service';

const ipconfig = require('../../services/config');
var appip = ipconfig.ip;
var appport = ipconfig.port;

// Declare lib video.js as external of angular
declare let videojs: any;

@Component({
  selector: 'app-watch-video',
  templateUrl: './watch-video.component.html',
  styleUrls: ['./watch-video.component.css']
})
export class WatchVideoComponent implements OnInit, AfterViewInit {
  public comments: [{
    user: String,
    content: String
  }] = [{ user: 'Teste', content: "Teste" }];


  id: String;
  videoName: String;
  comment: String;
  tags: String;
  description: String;

  videoThumb: string;

  videoURL: string;
  userDetails: UserDetails;
  username: String;
  whereVideoStart: Number = 3;

  //Get time and update time of video
  currentTime = Number;
  duration = Number;
  lastTimeUpdate: Date;
  startfrom: any = {};

  vidObj: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vs: VideoService,
    private as: AuthService,
    private us: UserService,
    private _location: Location,
  ) { }

  @ViewChild('myvid') vid: ElementRef;
  ngAfterViewInit() {
    const options = {
      controls: true,
      autoplay: true,
      preload: 'auto',
      techOrder: ['html5']
    };

    this.route.params.subscribe(params => {
      this.id = (params['id']);

      this.vidObj = new videojs(this.vid.nativeElement, options, function onPlayerReady() {
        videojs.log('Your player is ready!');
      });
    });



  }
  ngOnInit() {

    this.route.params.subscribe(params => {
      this.id = (params['id']);

      this.lastTimeUpdate = new Date();
      this.videoThumb = 'http://' + appip + ':' + appport + '/video/thumb/' + this.id;

      console.log(this.videoURL);
      this.setComments();
      this.setData();

      this.userDetails = this.as.getUserDetails();
      this.username = this.userDetails ? this.userDetails.name : 'Anonymous';
      this.setVideoInitialTime();

    });



  }

  videoLoaded(e) {
    console.log('Video carregado')
    console.log(e);
  }

  setComments() {
    this.route.params.subscribe(params => {
      this.vs.getComments(params['id']).subscribe(res => {
        this.comments = res;
      });
    });
  }

  onTimeUpdate(event) {
    this.currentTime = event.target.currentTime;
    this.duration = event.target.duration;
    var now: Date = new Date();
    var secondsWithoutUpdate = (now.getTime() - this.lastTimeUpdate.getTime()) / 1000;
    var saveEach = 10; //Save each 10 seconds
    if (secondsWithoutUpdate > saveEach) {
      this.lastTimeUpdate = new Date();
      console.log('Updating time saved on user: ' + this.currentTime);
      this.us.setUserTiming(this.userDetails._id, this.currentTime, this.id, this.duration);
    }

  }

  setVideoInitialTime() {
    this.route.params.subscribe(params => {
      if (!this.userDetails) {
        this.router.navigate(['/login']);
        return;
      }

      this.us.getUserTiming(this.userDetails._id, this.id).subscribe(res => {
        var startfrom = 0;
        if (res) {
          console.log("Começando video em" + res);
          this.startfrom = res;
        }
        this.videoURL = 'http://' + appip + ':' + appport + '/video/watch/' + this.id + '#t=' + this.startfrom;
      });
    });
  }

  setData() {
    this.route.params.subscribe(params => {
      this.vs.getData(params['id']).subscribe(res => {
        this.videoName = res.name;
        this.whereVideoStart = res.videoDuration / 2;
        this.tags = res.tags;
        this.description = res.description;
        //this.videoURL = 'http://'+appip+':'+appport+'/video/watch/'+this.id+'#t='+0;
      });
    });
  }

  @ViewChild('commentList') commentList: any;
  create_comment() {
    console.log('Comment');
    console.log(this.comments);
    this.vs.addComment(this.userDetails.name, this.comment, this.id).subscribe(res => { this.commentList._elementRef.nativeElement.scrollTop = this.commentList._elementRef.nativeElement.scrollHeight; });
    this.comments.push({ user: this.userDetails.name, content: this.comment });
    this.comment = "";

    console.log(this.commentList);

  }

  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.create_comment();
    }
  }

  public getThumbURL(): string {

    return 'url(' + this.videoThumb + ')';
  }
}
