import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
