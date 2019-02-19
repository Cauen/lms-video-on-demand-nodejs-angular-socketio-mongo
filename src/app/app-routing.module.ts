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
import { EditVideoComponent } from './components/edit-video/edit-video.component';

import { AuthGuardService } from './services/onlinecheck.service';
import { GoInIfLoggedService } from './services/goiniflogged.service';
import { ProtectAdminService } from './services/protectadmin.service';

const routes: Routes = [
  { path: 'courses',          component: ClassesListComponent,    canActivate: [AuthGuardService]  },
  { path: 'login',            component: UserLoginComponent,      canActivate: [GoInIfLoggedService] },
  { path: 'register',         component: UserRegisterComponent,   canActivate: [GoInIfLoggedService] }, 
  { path: 'profile',          component: ProfileComponent ,       canActivate: [AuthGuardService] },
  { path: 'video/upload',     component: VideoUploadComponent,    canActivate: [ProtectAdminService] },
  { path: 'course/create',    component: CreateCourseComponent,   canActivate: [ProtectAdminService] },
  { path: '',                 component: ClassesListComponent,    canActivate: [AuthGuardService] },
  { path: 'video/:id',        component: WatchVideoComponent ,    canActivate: [AuthGuardService] },
  { path: 'results',          component: ResultsComponent ,       canActivate: [AuthGuardService] },
  { path: 'class/:id',        component: ClassComponent,          canActivate: [AuthGuardService] },
  { path: 'course/edit/:id',  component: EditCourseComponent,     canActivate: [ProtectAdminService] },
  { path: 'video/edit/:id',   component: EditVideoComponent,      canActivate: [ProtectAdminService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
