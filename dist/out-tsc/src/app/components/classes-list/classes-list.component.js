import * as tslib_1 from "tslib";
import { Component, ChangeDetectorRef } from '@angular/core';
import 'hammerjs';
var ClassesListComponent = /** @class */ (function () {
    function ClassesListComponent(_cdr) {
        this._cdr = _cdr;
        this.imgags = [
            'assets/bg.jpg',
            'assets/car.png',
            'assets/canberra.jpg',
            'assets/holi.jpg'
        ];
        this.carouselTileItems = [0, 1, 2, 3, 4, 5, 6];
        this.carouselTiles = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
        };
        this.carouselTile = {
            grid: { xs: 2, sm: 3, md: 5, lg: 6, all: 0 },
            slide: 3,
            speed: 250,
            point: {
                visible: true
            },
            load: 2,
            velocity: 0,
            touch: true,
            easing: 'cubic-bezier(0, 0, 0.2, 1)'
        };
    }
    ClassesListComponent.prototype.ngAfterViewInit = function () {
        this._cdr.detectChanges();
    };
    ClassesListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.carouselTileItems.forEach(function (el) {
            _this.carouselTileLoad(el);
        });
    };
    ClassesListComponent.prototype.carouselTileLoad = function (j) {
        var len = this.carouselTiles[j].length;
        if (len <= 30) {
            for (var i = len; i < len + 15; i++) {
                this.carouselTiles[j].push(this.imgags[Math.floor(Math.random() * this.imgags.length)]);
            }
        }
    };
    ClassesListComponent = tslib_1.__decorate([
        Component({
            selector: 'app-classes-list',
            templateUrl: './classes-list.component.html',
            styleUrls: ['./classes-list.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef])
    ], ClassesListComponent);
    return ClassesListComponent;
}());
export { ClassesListComponent };
//# sourceMappingURL=classes-list.component.js.map