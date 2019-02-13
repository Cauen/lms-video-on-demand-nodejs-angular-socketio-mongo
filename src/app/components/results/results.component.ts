import { Component, OnInit } from '@angular/core';

import { VideoService } from '../../services/video.service';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';

import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(private vs: VideoService, private route: ActivatedRoute, private router: Router) { }
  query: String = '';
  results: any = [];
  ngOnInit() {
    this.route.queryParams
      .filter(params => params.query)
      .subscribe(params => {
        console.log(params); // {query: "popular"}

        this.query = params.query;
        if (this.query)
          this.searching();
      });
  }
  searching() {
    console.log(this.query);
    if (this.query)
      this.vs.getVideosByQuery(this.query).subscribe(res => {
        this.results = res;
        this.router.navigate(['results'], { queryParams: { query: this.query } });
      });
    else
      this.results = [];
  }
  getThumbURL() {

  }
}
