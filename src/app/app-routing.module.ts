import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassesListComponent } from './components/classes-list/classes-list.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { VideoUploadComponent } from './components/video-upload/video-upload.component';
import { CreateCourseComponent } from './components/create-course/create-course.component';
import { WatchVideoComponent } from './components/watch-video/watch-video.component';

const routes: Routes = [
  {
    path: 'courses',
    component: ClassesListComponent
  },
  {
    path: 'login',
    component: UserLoginComponent
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
    component: ClassesListComponent
  },
  {
    path: 'video/:id',
    component: WatchVideoComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
