import {Component, Input, OnInit} from '@angular/core';
import {SearchResultItem} from "../search-result-item";

@Component({
  selector: 'app-tester-search-results',
  templateUrl: './tester-search-results.component.html',
  styleUrls: ['./tester-search-results.component.css']
})
export class TesterSearchResultsComponent implements OnInit {

  @Input()
  searchResultItems: SearchResultItem[] | null = [];

  constructor() { }

  ngOnInit(): void {}

}
