
# PubChart

This project is developed on Angular(v5). It basically query EuropePMC with the help of thier RESTful services and visualizes the data into a Histogram based on Highcharts.

## Getting Started

You can clone this project into your local and follow the instructions or visit the instance for a quick [demo](http://europepmc.herokuapp.com)
### Prerequisites
You should have the latest stable version of Node installed (anything above v6.11 should be fine.).

### Installing
Use the following commands in your command/terminal to get started with the app in your local.

```
git clone https://github.com/fasidOnGit/PubChart.git
npm install
npm run-script start local
```

## Running the tests

Run `ng test` to execute the unit tests via Karma.

### Break down into end to end tests
Run `ng e2e` to execute the end-to-end tests via Protractor. Before running the tests make sure you are serving the app via ng serve.

## Deployment

This repo is deployed on Heroku. You can go ahead and deploy it on any cloud streams I have made it generic enough to work with all the cloud hosters.

## Detailed Design
### Requirement
   * The bottom line of this application is to query the [Europe PMC](https://europepmc.org) by using thier [Restful API](https://europepmc.org/RestfulWebService) and transform the data into Histogram with Highcharts to display the number of publications and most cited publication each year.
### Caveats/Known issues
   * We can't query all the data for any specific query as we are dealing with a huge database.
   * For any given search the user need not to give the start and the end date as it is clearly mentioned in the [requirement](https://gist.github.com/gxa/38ebff10dbd41e314dc8389bcb8fe1e4) that the date ranges are optional.
   * We can't blindly give a start date as this database holds data even before 1800 and also if for example the data for a search is available only from 2000 but the user din't give the date ranges in this case we cant query from some random date.
### Possible Solution
   * As we can't query the database at one go because manipulating the data would choke the web browser we try to make this more I/O less CPU intensive. So this application query year wise and expect only one record as we only need one record to display i.e the most cited.
   
   * With data that has returned as API results this application will print the most cited publication and the number of time that is cited in the tooltip of each bar in histogram chart.
### How it Works?
   * User enters the query in the search and specify the date range then on Submit the application will fire a Restful API with the query and date ranges.
   * If the user didn't specify the date ranges now we have the TO date is assigned as the current date with `new Date()` and for the FROM date we fire an API request which will give us the date of the starting year in database for that search so now that we have got the FROM date we already have the TO date we will fire API for each year with the filter `FIRST_PDATE`.
   * This application uses the tooltip formatter from Highcharts to display the most cited publication
   
## Built With

* [Angular](https://angular.io/) - The web framework used
* [EuropePMC Restful API's](https://europepmc.org/RestfulWebService) - A Restful services Library powering with data.
* [Highcharts](https://highcharts.com/) - A data Visualization Library.


## Author

* **Kader Mohideen Fasid** - *Web Developer* - [Visit my Website](https://fasid.herokuapp.com)

