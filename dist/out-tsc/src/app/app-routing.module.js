import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClassesListComponent } from './components/classes-list/classes-list.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { VideoUploadComponent } from './components/video-upload/video-upload.component';
import { CreateCourseComponent } from './components/create-course/create-course.component';
import { WatchVideoComponent } from './components/watch-video/watch-video.component';
var routes = [
    {
        path: 'classes',
        component: ClassesListComponent
    },
    {
        path: 'login',
        component: UserLoginComponent
    },
    {
        path: 'upload',
        component: VideoUploadComponent
    },
    {
        path: 'create-course',
        component: CreateCourseComponent
    },
    {
        path: '',
        component: ClassesListComponent
    },
    {
        path: 'watch/:id',
        component: WatchVideoComponent
    },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map