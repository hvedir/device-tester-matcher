import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {Device} from '../device';
import {BehaviorSubject, forkJoin, Subject, Subscription, take} from 'rxjs';
import {SearchResultItem} from '../search-result-item';
import {SearchFilters} from '../search-filters';

@Component({
  selector: 'app-tester-search-panel',
  templateUrl: './tester-search-panel.component.html',
  styleUrls: ['./tester-search-panel.component.css']
})
export class TesterSearchPanelComponent implements OnInit, OnDestroy {

  devices$: Subject<Device[]> = new Subject<Device[]>();
  countries$: Subject<string[]> = new Subject<string[]>();
  searchFilters$: Subject<SearchFilters> = new Subject<SearchFilters>();
  searchResults$: BehaviorSubject<SearchResultItem[]> = new BehaviorSubject<SearchResultItem[]>([]);

  private searchFiltersSubscription!: Subscription;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.searchFiltersSubscription = this.searchFilters$.subscribe(filters => this.search(filters));
    forkJoin([this.apiService.getCountries(), this.apiService.getDevices()])
      .pipe(take(1))
      .subscribe(([countries, devices]) => {
        this.devices$.next(devices);
        this.countries$.next(countries);
        this.searchFilters$.next({
          devices: devices.map(d => d.deviceId),
          countries
        });
      });
  }

  ngOnDestroy(): void {
    this.searchFiltersSubscription.unsubscribe();
  }

  onFiltersChange(searchFilters: SearchFilters): void {
    this.searchFilters$.next(searchFilters);
  }

  private search(searchFilters: SearchFilters): void {
    this.apiService.executeSearch(searchFilters.countries, searchFilters.devices)
      .pipe(take(1))
      .subscribe(result => this.searchResults$.next(result));
  }

}
