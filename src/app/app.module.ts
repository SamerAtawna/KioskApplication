import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResturantsComponent } from './Components/resturants/resturants.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './Components/menu/menu.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatInputModule,
  MatDialogModule,
  MatChipsModule
} from '@angular/material';
import { PaymentComponent } from './Components/payment/payment.component';
import { MatRadioModule } from '@angular/material/radio';
import { AngularInputFocusModule } from 'angular-input-focus';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RemoveNumberPipe } from './Pipes/remove-number.pipe';
import { BorderDirective } from './Directives/border.directive';
import { UserIdleModule } from 'angular-user-idle';
import { LightboxModule } from 'ngx-lightbox';
import { NewLinePipe } from './Pipes/new-line.pipe';
import { NoRightClickDirective } from './Directives/no-right-click.directive';

@NgModule({
  declarations: [
    AppComponent,
    ResturantsComponent,
    MenuComponent,
    NewLinePipe,
    PaymentComponent,
    RemoveNumberPipe,
    BorderDirective,
    NoRightClickDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UserIdleModule.forRoot({ idle: 59, timeout: 6 }),
    MatCardModule,
    AppRoutingModule,
    MatRadioModule,
    LightboxModule,
    MatChipsModule,
    MatDialogModule,
    MatButtonModule,
    MatStepperModule,
    MatDividerModule,
    AngularInputFocusModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    LazyLoadImageModule,
    MatBadgeModule,
    MatListModule,
    [SweetAlert2Module.forRoot()],
    [SweetAlert2Module],
    [
      SweetAlert2Module.forChild({
        /* options */
      })
    ],
    BrowserAnimationsModule
  ],
  providers: [SwalComponent],
  bootstrap: [AppComponent],
  entryComponents: [PaymentComponent]
})
export class AppModule {}
