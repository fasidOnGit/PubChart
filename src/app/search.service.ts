import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import whilst from 'async/whilst';

@Injectable()

export class SearchService {
	baseUrl : string = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search';
	queryUrl: string = '?query=';
	formatUrl: string = '&format=json&synonym=true&pageSize=1&sort=CITED desc';

	constructor(private http : Http){}
	queryEPMC(query){
		console.log(query , 'lol')
	}
	search(terms : Observable<string> , cursorMark?){
		if(cursorMark){
			console.log('hiyep')
		return terms.debounceTime(50)
		.distinctUntilChanged()
		.switchMap(term => this.searchEntries(term , cursorMark));
		} else {
		return terms.debounceTime(400)
		.distinctUntilChanged()
		.switchMap(term => this.searchEntries(term));
		}
	} 

	searchEntries(term , filter?) {
		if(filter) {
			console.log(this.baseUrl+this.queryUrl+term+filter+this.formatUrl)
		return this.http.get(this.baseUrl+this.queryUrl+term+filter+this.formatUrl).map((res) => res.json());
	
		}else {
			filter = '';
		return this.http.get(this.baseUrl+this.queryUrl+term+this.formatUrl+filter).map(res => res.json())
		}
	}
}	
