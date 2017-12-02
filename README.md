
# PubChart

This project is developed on Angular(v5). It basically query EuropePMC with the help of thier RESTful services and visualizes the data into a Histogram based on Highcharts.


*Note: This Application will display data based on First Publication date and PubYear. As there are lakhs and lakhs of data reading them all will tamper the app and applying filters over them would be hectic and slow down the app. So I followed a different approach to meet the requirement for this challange*

## Getting Started

You can clone this project into your local and follow the instructions or visit the instance for a quick [demo] (http://europepmc.herokuapp.com)
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

## Built With

* [Angular](https://angular.io/) - The web framework used
* [EuropePMC Restful API's](https://europepmc.org/RestfulWebService) - A Restful services Library powering with data.
* [Highcharts](https://highcharts.com/) - A data Visualization Library.


## Author

* **Kader Mohideen Fasid** - *Web Developer* - [Visit my Website](https://fasid.herokuapp.com)

