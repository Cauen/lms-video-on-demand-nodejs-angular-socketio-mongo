import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { VideoService } from '../../services/video.service';
import { UserService } from '../../services/user.service';
import {UserDetails, AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-watch-video',
  templateUrl: './watch-video.component.html',
  styleUrls: ['./watch-video.component.css']
})
export class WatchVideoComponent implements OnInit {
  public comments: [{
    user: String,
    content: String
  }] = [{user: 'Teste', content: "Teste"}];

  videoName: String;
  comment:String;
  
  videoURL : string;
  videoThumb : string;
  
  id: Number = 0;
  userDetails: UserDetails;
  username: String;
  whereVideoStart: Number = 3;
  
  //Get time and update time of video
  currentTime = Number;
  duration = Number;
  lastTimeUpdate: Date;
  startfrom: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vs:VideoService,
    private as: AuthService,
    private us: UserService,
  ) { }

  ngOnInit() {
    
    this.route.params.subscribe(params => {
    this.id = (params['id']);

    this.lastTimeUpdate = new Date();
    this.videoThumb = 'http://127.0.0.1:4000/video/thumb/'+this.id;
    
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
  var now : Date = new Date();
  var secondsWithoutUpdate = (now.getTime() - this.lastTimeUpdate.getTime())/1000;
  var saveEach = 10; //Save each 10 seconds
  if ( secondsWithoutUpdate > saveEach) {
    this.lastTimeUpdate = new Date();
    console.log('Updating time saved on user: ' + this.currentTime);
    this.us.setUserTiming(this.userDetails._id, this.currentTime, this.id, this.duration);
  } 
  
}

setVideoInitialTime() {
  this.route.params.subscribe(params => {
    this.us.getUserTiming(this.userDetails._id, this.id).subscribe(res => {
      var startfrom = 0;
      if (res) {
        console.log("Começando video em" + res);
        this.startfrom = res;
      }
      this.videoURL = 'http://127.0.0.1:4000/video/watch/'+this.id+'#t='+this.startfrom;
    });
  });
}

setData() {
  this.route.params.subscribe(params => {
    this.vs.getData(params['id']).subscribe(res => {
      this.videoName = res.name;
      this.whereVideoStart = res.videoDuration/2;
      //this.videoURL = 'http://127.0.0.1:4000/video/watch/'+this.id+'#t='+this.whereVideoStart;
    });
  });
}

create_comment() {
  console.log('Comment');
  console.log(this.comments);
  this.vs.addComment(this.userDetails.name, this.comment, this.id);
  this.comments.push({user: this.userDetails.name, content: this.comment});
  this.comment = "";
}

keyDownFunction(event) {
  if(event.keyCode == 13) {
    this.create_comment();
  }
}

  public getThumbURL ()  : string{
    return 'url('+this.videoThumb+')';
  }
}
