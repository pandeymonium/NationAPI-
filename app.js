var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
        templateUrl: "signup.html",
        controller: "SignupController"
      }).when("/login", {
      templateUrl: "login.html",
      controller: "LoginController"
    }).when("/dashboard", {
      templateUrl: "dashboard.html",
      controller: "myController"
    })
    .otherwise({
      templateUrl: "signup.html",
      controller: "SignupController"
    });
});

//
app.controller("LoginController", function($scope, $location, $http) {
    $scope.login = function() {
      // Take / fetch data from db.json without backend

      $http.get("db.json").then(function(response) {
        var users = response.data.users;
        console.log(users);
        var flag=true;
        for(let obj of users){
            if(obj.email===$scope.user.email && obj.password===$scope.user.password){
                
                alert('Congratulation you login sucessfully');
                flag=false;
                $location.path("/dashboard");
            }
        }
        if(flag){
            alert('Invalid Creditional');
        }
      });
    };
  });
  
  
  app.controller("SignupController", function($scope, $location, $http) {
    $scope.signup = function() {

      // Fetch and send user data to JSON file 
      $http.get("db.json").then(function(response) {
        var users = response.data;
            $http({
            method:'POST',
            url:("http://localhost:3000/users"),
            data:$scope.user
        }).then(function (response) {
          alert("Signup successful");
            console.log(response);
             $location.path("/login");
        },function(error) {
            console.log(error)
        })
          });
        }});


	  app.controller('myController', function($scope, $http) {
      $scope.countries = [];
      $scope.filteredCountries = [];
      $scope.selectedAlphabet = '';
      $scope.selectedRegion = '';
      $scope.selectedSubregion = '';
      $scope.searchQuery = '';
      $scope.searchType = 'country';
      $scope.alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
      $scope.regions = [];
      $scope.subregions = [];

      // logout function 
      $scope.logout = function(){
	    window.location.href = "index.html";
    }

      // Fetch country data from the API
      $scope.fetchCountryData = function() {
        $http.get('https://restcountries.com/v3.1/all')
          .then(function(response) {
            $scope.countries = response.data;
            $scope.filteredCountries = $scope.countries;
            $scope.extractRegions();
            $scope.extractSubregions();
          })
          .catch(function(error) {
            console.error('Error:', error);
          });
      };

      // filter countries by contitents 
      $scope.extractRegions = function() {
        var regions = [];
        $scope.countries.forEach(function(country) {
          if (country.region && !regions.includes(country.region)) {
            regions.push(country.region);
          }
        });
        $scope.regions = regions;
      };

      // filter countries by subregions 
      $scope.extractSubregions = function() {
        var subregions = [];
        $scope.countries.forEach(function(country) {
          if (country.subregion && !subregions.includes(country.subregion)) {
            subregions.push(country.subregion);
          }
        });
        $scope.subregions = subregions;
      };

      // Filter countries based on a-z, region, subregion, and search
      $scope.filterCountries = function() {
        var filteredCountries = $scope.countries;

        if ($scope.selectedAlphabet !== '') {
          filteredCountries = filteredCountries.filter(function(country) {
            return country.name.common.charAt(0).toUpperCase() === $scope.selectedAlphabet;
          });
        }

        if ($scope.selectedRegion !== '') {
          filteredCountries = filteredCountries.filter(function(country) {
            return country.region === $scope.selectedRegion;
          });
        }

        if ($scope.selectedSubregion !== '') {
          filteredCountries = filteredCountries.filter(function(country) {
            return country.subregion === $scope.selectedSubregion;
          });
        }

        if ($scope.searchQuery !== '') {
          var query = $scope.searchQuery.toLowerCase();
          filteredCountries = filteredCountries.filter(function(country) {
            if ($scope.searchType === 'country') {
              return country.name.common.toLowerCase().includes(query);
            } else if ($scope.searchType === 'capital') {
              return country.capital && country.capital[0].toLowerCase().includes(query);
            }
          });
        }

        $scope.filteredCountries = filteredCountries;
      };

      // Get language names for each country
      $scope.getLanguageNames = function(country) {
        if (country.languages) {
          return Object.values(country.languages).join(', ');
        }
        return '';
      };

      // Get capital for each country
      $scope.getCapital = function(country) {
        if (country.capital) {
          return country.capital[0];
        }
        return '';
      };

      // Get currency for each country
      $scope.getCurrency = function(country) {
        if (country.currencies) {
          var currencies = Object.values(country.currencies).map(function(currency) {
            return currency.name;
          });
          return currencies.join(', ');
        }
        return '';
      };

      // Initialize the country data
      $scope.fetchCountryData();
    });