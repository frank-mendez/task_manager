/**
 * Created by frank on 12/10/2016.
 */

//set the module
angular.module('taskManager', []);

angular
    .module('taskManager')
    .controller('TaskListController', TaskListController);

function TaskListController($scope){

    var database = firebase.database();

    database.ref('/task/task').once('value').then(function(snapshot) {

        $scope.items = snapshot.val();

        console.log($scope.items);

        $scope.$apply();

    });


}

