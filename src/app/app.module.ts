//Angular Module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import histogram from 'highcharts/modules/histogram-bellcurve.src';
//Angular Material
import { MaterialModule} from './material.module';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';

//Custom Module
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

//Serivces

import {SearchService} from './search.service';
export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [ histogram ];
}

var routes = [
	{
		path : '',
		component : HomeComponent
	}
];

@NgModule({
  declarations: [
    AppComponent , HomeComponent
  ],
  imports: [
    ChartModule , BrowserModule , BrowserAnimationsModule ,MaterialModule, HttpModule , FormsModule , RouterModule.forRoot(routes)
  ],
  providers: [SearchService , { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
