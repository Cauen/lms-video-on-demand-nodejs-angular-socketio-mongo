import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
var UserLoginComponent = /** @class */ (function () {
    function UserLoginComponent(router, snackBar) {
        this.router = router;
        this.snackBar = snackBar;
    }
    UserLoginComponent.prototype.ngOnInit = function () {
    };
    UserLoginComponent.prototype.keyDownFunction = function (event) {
        if (event.keyCode == 13) {
            this.login();
        }
    };
    UserLoginComponent.prototype.openSnackBar = function (message, action) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    };
    UserLoginComponent.prototype.login = function () {
        if (this.username == 'admin' && this.password == 'admin') {
            this.openSnackBar('Success', 'close');
            this.router.navigate(["classes"]);
        }
        else {
            //alert('Wrong login or pass')
            this.openSnackBar('Wrong login or pass', 'close');
        }
    };
    UserLoginComponent = tslib_1.__decorate([
        Component({
            selector: 'app-user-login',
            templateUrl: './user-login.component.html',
            styleUrls: ['./user-login.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [Router, MatSnackBar])
    ], UserLoginComponent);
    return UserLoginComponent;
}());
export { UserLoginComponent };
//# sourceMappingURL=user-login.component.js.map