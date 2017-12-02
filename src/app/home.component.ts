import {Component} from '@angular/core';
import {SearchService} from './search.service';
import {Subject} from 'rxjs/Subject';
import { Chart } from 'angular-highcharts';
import async from 'async';
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
	constructor(private searchService : SearchService){}
	query ={
		search : '',
		from : null,
		to : null
	};

	post() {
		let hitCount = [] , year = [] , mostCited = {};
		this.query.from = (this.query.from) ? this.query.from : new Date('1970-01-01');
		this.query.to = (this.query.to) ? this.query.to : new Date();
		console.log(this.query);

		// this.searchService.queryEPMC(this.query);
		if(this.query.from.getFullYear() == this.query.to.getFullYear()){
			this.searchService.searchEntries(this.query.search , `(%20FIRST_PDATE:[${this.query.from.getTime()}%20TO%20${this.query.to.getTime()}])`)
				.subscribe(results => {
					console.log(results)
					hitCount.push(results.hitCount);
					year.push(results.resultList.result[0].pubYear);
					mostCited[results.resultList.result[0].pubYear] = results.resultList.result;
					getHistogram({query : this.query.search , from : this.query.from , to : this.query.to ,mostCited : mostCited, hitCount : hitCount , year : year});
					})
			} else {
				var topRangeEnd = new Date(`${this.query.from.getFullYear()}-12-31`);
				var botRangeStart = new Date(`${this.query.to.getFullYear()}-01-01`);
				var topRange = `[${this.query.from.getTime()}%20TO%20${topRangeEnd.getTime()}]`;
				var botRange = `[${botRangeStart.getTime()}%20TO%20${this.query.to.getTime()}]`;
				this.searchService.searchEntries(this.query.search , `(%20FIRST_PDATE:${topRange})`)
					.subscribe(resultsTop => {
						if(resultsTop.hitCount !=0) {
							// code...
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
								this.searchService.searchEntries(this.query.search , `(%20PUB_YEAR:${pubYearStart})`)
									.subscribe(resultsYr => {
										if(resultsYr.hitCount!=0) {
											// code...
										hitCount.push(resultsYr.hitCount);
										year.push(resultsYr.resultList.result[0].pubYear);
										mostCited[resultsYr.resultList.result[0].pubYear] = resultsYr.resultList.result;
										}
										pubYearStart++;
										callback(undefined , 'done');
										} , error => {
											console.log('error' , error)
											})
							},
							(err , n) => {
								console.log('asd' , n)
								console.log(botRangeStart , this.query.to)
								this.searchService.searchEntries(this.query.search , `(%20FIRST_PDATE:${botRange})`)
									.subscribe(resultsBot => {
										if(resultsBot.hitCount!=0) {
											// code...
										hitCount.push(resultsBot.hitCount);
										year.push(resultsBot.resultList.result[0].pubYear);
										mostCited[resultsBot.resultList.result[0].pubYear] = resultsBot.resultList.result;
										}
										getHistogram({query : this.query.search , from : this.query.from , to : this.query.to ,mostCited : mostCited, hitCount : hitCount , year : year});
										} , error => {
											console.log('error' , error)
											})
							}
							)
						} , error => {
							console.log('error' , error)
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
				<span style="font-weight : bolder;">Most citedc${this.x} : ${data.mostCited[this.x][0].title}</span><br>
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
// 		var results;
// 		this.searchService.search(this.searchTerms)
// 			.subscribe( results => {
// 				if(typeof results.resultList !='undefined'){

// 				this.results = results;
// 				// dataByYear(this.results.resultList.result);
				

// 				var check = '';
				
// 				    	// this.searchService.search.bind(this);

// 				    	// async.whilst.bind(this);
// 			async.whilst(
// 				    () => { console.log('resultsCheck' , check , results.nextCursorMark , results.resultList.result.length); return (check != results.nextCursorMark && results.resultList.result.length >=1000); },
// 				    (callback) => {
						
// 				    	check = results.nextCursorMark;
// 				    	console.log('check' , results.nextCursorMark)
// 				    	this.subSearchTerm.next(results.request.query);
// 				        this.searchService.searchEntries(results.request.query, `&cursorMark=${check}`)
// 				        	.subscribe(subResult => {
// 				        		console.log(subResult);
// 				        		results.nextCursorMark = subResult.nextCursorMark;
// 				        		results.request = subResult.request;
// 				        		console.log('next length',subResult.resultList.result.length , results.resultList.result.length);
// 				        		// results.resultList.result.concat(subResult.resultList.result);
// 				        		 Array.prototype.push.apply(results.resultList.result,subResult.resultList.result);
// 				        		console.log('coe da' ,results.resultList.result.length);
// 				        		callback(undefined , results);
// 				        		})
// 				    },
// 				     (err, n) => {
// 				        // 5 seconds have passed, n = 5
// 				        // this.results = n;
// 				        console.log(err , n)
// 				        console.log('done' , results);
// 				        var data = dataByYear(results.resultList.result);

// Highcharts.chart('container', {
//     title: {
//         text: 'For the Query : '+results.request.query
//     },
//     xAxis: [{
//         title: { text: 'Years' } , categories: data.yAxis
//     }],

//     yAxis: [{
//         title: { text: 'No of Publications' }
//     }],
//       tooltip: {
//         formatter: function () {
//             return `
// 				<span style="font-weight : bolder;">Most citedc${this.x} : ${data.seriesYear[this.x][0].title}</span><br>
// 				<span>Cited Count : ${data.seriesYear[this.x][0].citedByCount}</span>
//             `
//         }
//     },

//     series: [ {
//         name: 'No of Publications',
//         type: 'histogram',
//         data: data.count,
//         id: 's1',
//         marker: {
//             radius: 1.5
//         },
//         state : 'h1'
//     }]
// });
// 				    }
// 				);

		
// 				} else {
// 					this.results = [];

// 				}
// 				});

// 			function dataByYear(result){
// 				var series = [] , yr = [] , maxCount=[];
// 				var yearfilter = [];
// 				var seriesJson = {};
// 				for (var i = 0; i < result.length; i++) {
// 					var eachResult = result[i]; var arr = [];
// 					console.log(eachResult.pubYear)
// 					if(yearfilter.indexOf(eachResult.pubYear)!=-1){
// 						seriesJson[eachResult.pubYear].push(eachResult);
// 					}else{
// 						yearfilter.push(eachResult.pubYear)
// 						arr.push(eachResult)
// 						seriesJson[eachResult.pubYear] = arr;
// 					}
// 				}
// 				console.log('deii' , seriesJson)
// 				for (var key in seriesJson) {
// 					// code...
// 					seriesJson[key].sort((a , b) => b.citedByCount - a.citedByCount);
// 					yr.push(key);
// 					maxCount.push(seriesJson[key].length)
// 					series.push(seriesJson[key]);

					
// 				}

// 				console.log('The JSON',seriesJson)
// 				return {
// 					yAxis : yr,
// 					series : series,
// 					count : maxCount,
// 					seriesYear : seriesJson
// 				};
// 			}
// 	}
// }