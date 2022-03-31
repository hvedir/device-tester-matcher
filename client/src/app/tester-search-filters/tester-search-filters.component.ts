import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Device} from "../device";
import {SearchFilters} from "../search-filters";

@Component({
  selector: 'app-tester-search-filters',
  templateUrl: './tester-search-filters.component.html',
  styleUrls: ['./tester-search-filters.component.css']
})
export class TesterSearchFiltersComponent implements OnInit, OnChanges {

  @Input()
  countries: string[] | null = null;

  @Input()
  devices: Device[] | null = null;

  @Input()
  searchFilters: SearchFilters | null = null;

  @Output()
  filtersChange = new EventEmitter<SearchFilters>();

  get allCountriesSelected(): boolean {
    return this.selectedCountries.size === this.countries?.length;
  }

  get allDevicesSelected(): boolean {
    return this.selectedDevices.size === this.devices?.length;
  }

  get clearButtonDisabled(): boolean {
    return !this.filtersChanged();
  }

  get searchButtonDisabled(): boolean {
    return !this.filtersChanged() || !this.selectedCountries.size || !this.selectedDevices.size;
  }

  private selectedCountries: Set<string> = new Set<string>();
  private selectedDevices: Set<string> = new Set<string>();

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(changes:SimpleChanges): void {
    if (changes['searchFilters'] && changes['searchFilters'].currentValue) {
      this.setSelectedFilters(changes['searchFilters'].currentValue['countries'], changes['searchFilters'].currentValue['devices']);
    }
  }

  isDeviceSelected(deviceId: string): boolean {
    return this.selectedDevices.has(deviceId);
  }

  isCountrySelected(country: string): boolean {
    return this.selectedCountries.has(country);
  }

  toggleCountry(country: string) {
    if (this.selectedCountries.has(country)) {
      this.selectedCountries.delete(country);
    } else {
      this.selectedCountries.add(country);
    }
  }

  toggleDevice(deviceId: string) {
    if (this.selectedDevices.has(deviceId)) {
      this.selectedDevices.delete(deviceId);
    } else {
      this.selectedDevices.add(deviceId);
    }
  }

  toggleAllDevices() {
    if (this.allDevicesSelected) {
      this.selectedDevices.clear();
    } else {
      this.devices!.forEach(device => {
        if (!this.selectedDevices.has(device.deviceId)) {
          this.selectedDevices.add(device.deviceId)
        }
      });
    }
  }

  toggleAllCountries() {
    if (this.allCountriesSelected) {
      this.selectedCountries.clear();
    } else {
      this.countries!.forEach(country => {
        if (!this.selectedCountries.has(country)) {
          this.selectedCountries.add(country);
        }
      });
    }
  }

  filtersChanged(): boolean {
    if (this.searchFilters?.countries && this.searchFilters?.devices) {
      const countriesNotChanged = this.searchFilters.countries.length === this.selectedCountries.size &&
        this.searchFilters.countries.every(country => this.selectedCountries.has(country));
      const devicesNotChanged = this.searchFilters.devices.length === this.selectedDevices.size &&
        this.searchFilters.devices.every(device => this.selectedDevices.has(device));
      return !countriesNotChanged || !devicesNotChanged;
    }
    return false;
  }

  submitFilters(): void {
    this.filtersChange.emit({
      devices: Array.from(this.selectedDevices),
      countries: Array.from(this.selectedCountries)
    });
  }

  clearFilterChanges() {
    if (this.searchFilters?.countries, this.searchFilters?.devices) {
      this.setSelectedFilters(this.searchFilters.countries, this.searchFilters.devices);
    }
  }

  private setSelectedFilters(countries: string[], devices: string[]): void {
    this.selectedCountries = new Set<string>(countries);
    this.selectedDevices = new Set<string>(devices);
  }
}
