import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren } from '@angular/core';

import { VideoService } from '../../services/video.service';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';

import { Location } from '@angular/common';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, AfterViewInit {

  constructor(private vs: VideoService, private route: ActivatedRoute, private router: Router,
    private _location: Location, ) { }
  query: String = '';
  results: any = [];
  ngOnInit() {
    this.route.queryParams
      .filter(params => params.query)
      .subscribe(params => {
        console.log(params); // {query: "popular"}

        this.query = params.query;
        this.searching();
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
