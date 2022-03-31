import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Device} from "./device";
import {SearchResultItem} from "./search-result-item";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private static API_URL_DEVICES = 'api/v1/devices';
  private static API_URL_COUNTRIES = 'api/v1/countries';
  private static API_URL_SEARCH = 'api/v1/search';

  constructor(private http: HttpClient) { }

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(ApiService.API_URL_DEVICES);
  }

  getCountries(): Observable<string[]> {
    return this.http.get<string[]>(ApiService.API_URL_COUNTRIES);
  }

  executeSearch(countries: string[], deviceIds: string[]): Observable<SearchResultItem[]> {
    return this.http.post<SearchResultItem[]>(ApiService.API_URL_SEARCH, {countries, deviceIds});
  }

}
