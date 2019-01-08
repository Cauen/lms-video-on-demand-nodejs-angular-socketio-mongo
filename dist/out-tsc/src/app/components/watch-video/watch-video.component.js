import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
var WatchVideoComponent = /** @class */ (function () {
    function WatchVideoComponent(route, router) {
        this.route = route;
        this.router = router;
        this.id = 0;
    }
    WatchVideoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.id = (params['id']);
        });
    };
    WatchVideoComponent = tslib_1.__decorate([
        Component({
            selector: 'app-watch-video',
            templateUrl: './watch-video.component.html',
            styleUrls: ['./watch-video.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute,
            Router])
    ], WatchVideoComponent);
    return WatchVideoComponent;
}());
export { WatchVideoComponent };
//# sourceMappingURL=watch-video.component.js.map