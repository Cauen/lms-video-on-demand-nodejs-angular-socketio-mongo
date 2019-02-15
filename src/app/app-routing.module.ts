import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassesListComponent } from './components/classes-list/classes-list.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { VideoUploadComponent } from './components/video-upload/video-upload.component';
import { CreateCourseComponent } from './components/create-course/create-course.component';
import { WatchVideoComponent } from './components/watch-video/watch-video.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResultsComponent } from './components/results/results.component';
import { ClassComponent } from './components/class/class.component';
import { EditCourseComponent } from './components/edit-course/edit-course.component';


import { AuthGuardService } from './services/onlinecheck.service';
import { GoInIfLoggedService } from './services/goiniflogged.service';

const routes: Routes = [
  {
    path: 'courses',
    component: ClassesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: UserLoginComponent,
    canActivate: [GoInIfLoggedService]
  },
  {
    path: 'register',
    component: UserRegisterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'video/upload',
    component: VideoUploadComponent
  },
  {
    path: 'course/create',
    component: CreateCourseComponent
  },
  {
    path: '',
    component: ClassesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'video/:id',
    component: WatchVideoComponent
  },
  {
    path: 'results',
    component: ResultsComponent
  },
  {
    path: 'class/:id',
    component: ClassComponent
  },
  {
    path: 'course/edit/:id',
    component: EditCourseComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
