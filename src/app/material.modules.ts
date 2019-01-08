
import {NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';

import {
  MatToolbarModule,
  MatButtonModule, 
  MatCardModule,
  MatInputModule,
  MatDialogModule,
  MatTableModule,
  MatMenuModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule,
  MatChipsModule,
  MatGridListModule,
  MatListModule,
} from '@angular/material';

@NgModule({

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
    MatTableModule,

    MatChipsModule,
    MatGridListModule,

    MatListModule,
  ]
})

export class MaterialModule {
 
}