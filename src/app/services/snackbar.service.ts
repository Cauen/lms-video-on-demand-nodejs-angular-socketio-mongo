import {MatSnackBar} from '@angular/material';
import { Injectable, NgZone } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {
    constructor(public snackBar: MatSnackBar, private zone: NgZone) {

    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}