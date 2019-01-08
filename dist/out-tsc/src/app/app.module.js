import * as tslib_1 from "tslib";
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
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib_1.__decorate([
        NgModule({
            declarations: [
                AppComponent,
                ClassesListComponent,
                UserLoginComponent,
                VideoUploadComponent,
                CreateCourseComponent,
                WatchVideoComponent
            ],
            imports: [
                BrowserModule,
                AppRoutingModule,
                FormsModule,
                MaterialModule,
                BrowserAnimationsModule,
                NguCarouselModule
            ],
            providers: [],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map