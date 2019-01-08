import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { VideoService } from '../../services/video.service';

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

  name:String;
  comment:String;

  videoURL : string;
  videoThumb : string;

  id: Number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vs:VideoService) { }

  ngOnInit() {
    
    this.route.params.subscribe(params => {
      this.id = (params['id']);

      
      this.videoURL = 'http://127.0.0.1:4000/video/watch/'+this.id;
      this.videoThumb = 'http://127.0.0.1:4000/video/thumb/'+this.id;

      console.log(this.videoURL);
      this.setComments();
     
    });

    
  }

setComments() {
  this.route.params.subscribe(params => {
    this.vs.getComments(params['id']).subscribe(res => {
      this.comments = res;
    });
  });
}

create_comment() {
  console.log('Comment');
  console.log(this.comments);
  this.vs.addComment(this.name, this.comment, this.id);
  this.comments.push({user: this.name, content: this.comment})
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
