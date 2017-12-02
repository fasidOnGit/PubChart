import {Component} from '@angular/core';
import {SearchService} from './search.service';
import {Subject} from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import async from 'async';
import { MatSnackBar } from '@angular/material';
// import { Highcharts } from 'highcharts';
var Highcharts = require('highcharts');

@Component({
	selector : 'home',
	 templateUrl: './home.component.html',
	  styleUrls: ['./home.component.css'],
	  providers: [SearchService]
	})
export class HomeComponent {

	results: Object;
	searchTerms = new Subject<string>();
	subSearchTerm = new Subject<string>();
	loading = false;
	constructor(private searchService : SearchService , public snackBar: MatSnackBar){}
	query ={
		search : '',
		from : null,
		to : null
	};

	post() {
		this.loading = true;
		let hitCount = [] , year = [] , mostCited = {};
		this.query.from = (this.query.from) ? this.query.from : new Date('1970-01-01');
		this.query.to = (this.query.to) ? this.query.to : new Date();
		if(this.query.from.getFullYear() == this.query.to.getFullYear()){
			this.searchService.searchEntries(this.query.search , `( FIRST_PDATE:[${this.query.from.yyyymmdd()} TO ${this.query.to.yyyymmdd()}])`)
				.subscribe(results => {
					console.log(results)
					hitCount.push(results.hitCount);
					year.push(results.resultList.result[0].pubYear);
					mostCited[results.resultList.result[0].pubYear] = results.resultList.result;
					getHistogram({query : this.query.search , from : this.query.from , to : this.query.to ,mostCited : mostCited, hitCount : hitCount , year : year});
					}, error => {
											this.loading = false;
											console.log('error' , error);
											this.snackBar.open('Error in fetching data!!' , 'CLOSE')
											})
			} else {
				var topRangeEnd = new Date(`${this.query.from.getFullYear()}-12-31`);
				var botRangeStart = new Date(`${this.query.to.getFullYear()}-01-01`);
				var topRange = `[${this.query.from.yyyymmdd()} TO ${this.query.from.getFullYear()}-12-31]`;
				var botRange = `[${this.query.to.getFullYear()}-01-01 TO ${this.query.to.yyyymmdd()}]`;
				this.searchService.searchEntries(this.query.search , `( FIRST_PDATE:${topRange})`)
					.subscribe(resultsTop => {
						if(resultsTop.hitCount !=0) {
						hitCount.push(resultsTop.hitCount);
						year.push(resultsTop.resultList.result[0].pubYear);
						mostCited[resultsTop.resultList.result[0].pubYear] = resultsTop.resultList.result;
						}
						let pubYearStart = this.query.from.getFullYear()+1;
						async.whilst(
							() => {
								return pubYearStart < this.query.to.getFullYear()
							} ,
							(callback) => {
								this.searchService.searchEntries(this.query.search , `( PUB_YEAR:${pubYearStart})`)
									.subscribe(resultsYr => {
										if(resultsYr.hitCount!=0) {
											// code...
										hitCount.push(resultsYr.hitCount);
										year.push(resultsYr.resultList.result[0].pubYear);
										mostCited[resultsYr.resultList.result[0].pubYear] = resultsYr.resultList.result;
										}
										pubYearStart++;
										callback(undefined , pubYearStart);
										} , error => {
											console.log('error' , error)
											this.snackBar.open('Error in fetching data!!' , 'CLOSE')
											})
							},
							(err , n) => {
								this.searchService.searchEntries(this.query.search , `( FIRST_PDATE:${botRange})`)
									.subscribe(resultsBot => {
										if(resultsBot.hitCount!=0) {
											// code...
										hitCount.push(resultsBot.hitCount);
										year.push(resultsBot.resultList.result[0].pubYear);
										mostCited[resultsBot.resultList.result[0].pubYear] = resultsBot.resultList.result;
										}
										console.log(hitCount , year)
										this.loading = false;
										getHistogram({query : this.query.search , from : this.query.from , to : this.query.to ,mostCited : mostCited, hitCount : hitCount , year : year});
										} , error => {
											this.loading = false;
											console.log('error' , error);
											this.snackBar.open('Error in fetching data!!' , 'CLOSE')
											})
							}
							)
						} , error => {
							this.loading = false;
							console.log('error' , error);
							this.snackBar.open('Error in fetching data!!' , 'CLOSE')
							})
			}
	}

}
function getHistogram(data){
	Highcharts.chart('container', {
    title: {
        text: 'For the Query : '+data.query
    },
    xAxis: [{
        title: { text: 'Years' } , categories: data.year
    }],

    yAxis: [{
        title: { text: 'No of Publications' }
    }],
      tooltip: {
        formatter: function () {
            return `
            	<h2>${this.x}</h2><br>		
				<span style="font-weight : bolder;">Most cited: ${data.mostCited[this.x][0].title}</span><br>
				<span>Cited Count : ${data.mostCited[this.x][0].citedByCount}</span>
            `
        }
    },

    series: [ {
        name: 'No of Publications',
        type: 'histogram',
        data: data.hitCount,
        id: 's1',
        marker: {
            radius: 1.5
        },
        state : 'h1'
    }]
});
}

//Replicating toISOString()
Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('-');
};
class Date extends Date {
    get yyyymmdd(): Date {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
  		var dd = this.getDate();

	  return [this.getFullYear(),
	          (mm>9 ? '' : '0') + mm,
	          (dd>9 ? '' : '0') + dd
	         ].join('-');
	    }
}