import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClassesListComponent } from './components/classes-list/classes-list.component';
import { UserLoginComponent } from './components/user-login/user-login.component';

import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.modules';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VideoUploadComponent } from './components/video-upload/video-upload.component';

import { NguCarouselModule } from '@ngu/carousel';
import { CreateCourseComponent } from './components/create-course/create-course.component';
import { WatchVideoComponent } from './components/watch-video/watch-video.component';


import { HttpClientModule } from '@angular/common/http';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { ProfileComponent } from './components/profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    ClassesListComponent,
    UserLoginComponent,
    VideoUploadComponent,
    CreateCourseComponent,
    WatchVideoComponent,
    UserRegisterComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    NguCarouselModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
