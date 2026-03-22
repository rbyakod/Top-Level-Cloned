/**
 * Created by ravib on 11/10/15.
 */
var app = angular.module('myApp', []);

app.run(function($rootScope) {
    $rootScope.name = "Ravi Byakod";
});


app.controller( "MyController", function($scope){
    $scope.person = {
        name : " Ravi Byakod from controller",
        address : "Villa 376 Adarsh Palm Retreat, Bellandur, Bangalore",
        phone : " +91 9740100664"
    };

    $scope.person.greeted = false ;
});

app.controller("MyChildController", function($scope){
    $scope.sayHello = function() {
        $scope.person.greeted = true;
    }
});

app.controller("CountController", function($scope){
    $scope.currentCount = 0;

    $scope.add = function(amount) {
        $scope.currentCount += amount;
    }
    $scope.subtract = function(amount) {
        $scope.currentCount -= amount;
    }
});

app.controller("CountAmountController", function($scope){
    $scope.currentCount = 0;
    $scope.amount = 1;
    $scope.add = function(amount) {
        $scope.currentCount += parseInt(amount, 10);
    }
    $scope.subtract = function(amount) {
        $scope.currentCount -= parseInt(amount);
    }
});



/**  parent child relationship in scope variable  */
app.controller( "ParentController", function($scope){
    $scope.title = "Title set in PARENT";
});

app.controller( "ChildController", function($scope){
    $scope.title = "Title set in CHILD";
    $scope.childTitle = "CHILDtitle set in CHILD"
});


/**  show with inheritance and object properties */
app.controller( "ParentController2", function($scope){
    $scope.model = { title : "Title set in PARENT2"} ;
});

app.controller( "ChildController2", function($scope){
    $scope.childTitle = "CHILDtitle set in CHILD2";
    $scope.model.title = "xyx efg";
});



