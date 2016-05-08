
var route = angular.module('route',['ngRoute','ui.router']);


app.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

		.state('home',{
			url:'/home',
			templateUrl:'templates/section1/home.html'
		})
    

});