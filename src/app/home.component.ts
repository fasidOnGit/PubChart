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
	loading = false;
	constructor(private searchService : SearchService , public snackBar: MatSnackBar){}
	query ={
		search : '',
		from : null,
		to : null
	};
	reset() {
		this.query.from = null;
		this.query.to = null;
	}

	post() {
		this.loading = true;
		this.query.to = (this.query.to) ? this.query.to : new Date();
		if(this.query.from==null){
			this.searchService.searchEntries(this.query.search)
				.subscribe(foundStartYear => {
					if(foundStartYear.hitCount !=0){
					this.query.from = new Date(foundStartYear.resultList.result[0].firstPublicationDate);
					this.queryEMC();
		
					}
					else {
						this.loading=false;
						this.snackBar.open('There is no Data!!' , 'CLOSE');
					}
				} , error => {
						console.log('error' , error);
						this.snackBar.open('Error in fetching data!!' , 'CLOSE')
					})
		} else {
			this.queryEMC();
		}
	}

	queryEMC = () => {
				let hitCount = [] , year = [] , mostCited = {} , totalCount = {};
		if(this.query.from.getFullYear() == this.query.to.getFullYear()){
			this.searchService.searchEntries(this.query.search , `( FIRST_PDATE:[${yyyymmdd(this.query.from)} TO ${yyyymmdd(this.query.to)}])`)
				.subscribe(results => {
					var firstPubYear =new Date(results.resultList.result[0].firstPublicationDate).getFullYear(); 
					hitCount.push(results.hitCount);
					year.push(firstPubYear);
					mostCited[firstPubYear] = results.resultList.result;
					totalCount[firstPubYear] = results.hitCount;
					getHistogram({query : this.query.search , from : this.query.from , to : this.query.to ,mostCited : mostCited, hitCount : hitCount , year : year , totalCount : totalCount});
					}, error => {
											this.loading = false;
											console.log('error' , error);
											this.snackBar.open('Error in fetching data!!' , 'CLOSE')
											})
			} else {
				var topRangeEnd = new Date(`${this.query.from.getFullYear()}-12-31`);
				var botRangeStart = new Date(`${this.query.to.getFullYear()}-01-01`);
				var topRange = `[${yyyymmdd(this.query.from)} TO ${this.query.from.getFullYear()}-12-31]`;
				var botRange = `[${this.query.to.getFullYear()}-01-01 TO ${yyyymmdd(this.query.to)}]`;
				this.searchService.searchEntries(this.query.search , `( FIRST_PDATE:${topRange})`)
					.subscribe(resultsTop => {
						if(resultsTop.hitCount !=0) {
						var firstPubYear =new Date(resultsTop.resultList.result[0].firstPublicationDate).getFullYear(); 
						hitCount.push(resultsTop.hitCount);
						year.push(firstPubYear);
						mostCited[firstPubYear] = resultsTop.resultList.result;
						totalCount[firstPubYear] = resultsTop.hitCount;
						}
						let pubYearStart = this.query.from.getFullYear()+1;
						async.whilst(
							() => {
								return pubYearStart < this.query.to.getFullYear()
							} ,
							(callback) => {
								// this.searchService.searchEntries(this.query.search , `( PUB_YEAR:${pubYearStart})`)
								this.searchService.searchEntries(this.query.search ,  `( FIRST_PDATE:[${pubYearStart}-01-01 TO ${pubYearStart}-12-31])`)
									.subscribe(resultsYr => {
										if(resultsYr.hitCount!=0) {
										var firstPubYear =new Date(resultsYr.resultList.result[0].firstPublicationDate).getFullYear(); 
										hitCount.push(resultsYr.hitCount);
										year.push(firstPubYear);
										mostCited[firstPubYear] = resultsYr.resultList.result;
										totalCount[firstPubYear] = resultsYr.hitCount;
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
										var firstPubYear =new Date(resultsBot.resultList.result[0].firstPublicationDate).getFullYear(); 
										hitCount.push(resultsBot.hitCount);
										year.push(firstPubYear);
										mostCited[firstPubYear] = resultsBot.resultList.result;
										totalCount[firstPubYear] = resultsBot.hitCount;
										}
										this.loading = false;
										getHistogram({query : this.query.search , from : this.query.from , to : this.query.to ,mostCited : mostCited, hitCount : hitCount , year : year , totalCount : totalCount});
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
				<span style="font-weight : bolder;">Total Publications: ${data.totalCount[this.x]}</span><br>
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

function yyyymmdd(date) {
	return date.toISOString().substring(0, 10);
}
// //Replicating toISOString()
// interface Date {
//     yyyymmdd: Date;
// }
// Date.yyyymmdd  = function() {
//   var mm = this.getMonth() + 1; // getMonth() is zero-based
//   var dd = this.getDate();
// var ret : Date;
// ret = [this.getFullYear(),
//           (mm>9 ? '' : '0') + mm,
//           (dd>9 ? '' : '0') + dd
//          ].join('-')
//   return  ret;
// };
// declare var Date: {
//     new (): Date;
//     new (value: number): Date;
//     new (value: string): Date;
//     new (year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): Date;
//     (): string;
//     prototype: Date;
//     parse(s: string): number;
//     UTC(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;
//     now(): number;
//     yyyymmdd: Date;
// }
// class MyDate extends Date {
//     get yyyymmdd(): Date {
//         var mm = this.getMonth() + 1; // getMonth() is zero-based
//   		var dd = this.getDate();

// 	  return [this.getFullYear(),
// 	          (mm>9 ? '' : '0') + mm,
// 	          (dd>9 ? '' : '0') + dd
// 	         ].join('-');
// 	    }
// }