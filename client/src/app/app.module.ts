import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { TesterSearchPanelComponent } from './tester-search-panel/tester-search-panel.component';
import { TesterSearchResultsComponent } from './tester-search-results/tester-search-results.component';
import { TesterSearchFiltersComponent } from './tester-search-filters/tester-search-filters.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatListModule} from "@angular/material/list";

@NgModule({
  declarations: [
    AppComponent,
    TesterSearchPanelComponent,
    TesterSearchResultsComponent,
    TesterSearchFiltersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
