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
// https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=lol(%20PUB_YEAR:2015)&format=json&sort=CITED%20desc&pageSize=1
// https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=malaria(%20FIRST_PDATE:2003-11-05)&format=json&pageSize=1&sort_cited:y
	searchEntries(term , filter?) {
		console.log('hi da')
		// filter = (filter) ? filter : '';
		if(filter) {
			// code...
		return this.http.get(this.baseUrl+this.queryUrl+term+filter+this.formatUrl).map((res) => res.json());
	
		}else {
			filter = '';
		return this.http.get(this.baseUrl+this.queryUrl+term+this.formatUrl+filter).map(res => res.json())
		}
						// .map((res) => {
						// 	console.log('Hi')

						// 	res = res.json();
						// 	var check = '', count=0;
						// 	return whilst(
						// 	    function() { return count < 5; },
						// 	    function(callback) {
						// 	        count++;
						// 	        setTimeout(function() {
						// 	            callback(null, count);
						// 	        }, 1000);
						// 	    },
						// 	    function (err, n) {
						// 	        // 5 seconds have passed, n = 5
						// 	        console.log(n)
						// 	        return res
						// 	    }
						// 	);



						// 	});
	}
}	
