import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule, MatDialogModule, MatTableModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
var MaterialModule = /** @class */ (function () {
    function MaterialModule() {
    }
    MaterialModule = tslib_1.__decorate([
        NgModule({
            exports: [
                MatButtonModule,
                MatCardModule,
                MatInputModule,
                MatMenuModule,
                MatIconModule,
                MatToolbarModule,
                MatProgressSpinnerModule,
                MatSelectModule,
                MatSnackBarModule,
                CommonModule,
                MatDialogModule,
                MatTableModule
            ]
        })
    ], MaterialModule);
    return MaterialModule;
}());
export { MaterialModule };
//# sourceMappingURL=material.modules.js.map