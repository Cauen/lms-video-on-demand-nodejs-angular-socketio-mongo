import { Component, OnInit, Input } from '@angular/core';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent implements OnInit {
  @Input() video;
  @Input() subcard;
  @Input() percent : number = 0;
  constructor(private vs: VideoService) { }

  ngOnInit() {
    if (!this.percent)
      this.percent = 0;
  }

  private millisToMinutesAndSeconds(millis) {
    millis = parseInt(millis);
    var minutes = Math.floor(millis / 60);
    var seconds = ((millis % 60) / 1).toFixed(0);
    var sseconds = parseInt(seconds);
    return minutes + ":" + (sseconds < 10 ? '0' : '') + seconds;
  }
}
