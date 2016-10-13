/**
 * Created by frank on 12/10/2016.
 */

//set the module
angular.module('taskManager', []);

angular
    .module('taskManager')
    .controller('TaskListController', TaskListController)
    .filter('toArray', function() {
        return function(obj) {
            const result = [];
            angular.forEach(obj, function(val) {
                result.push(val);
            });
            return result;
        }
    });


function TaskListController($scope){

    var vm = this;

    var database = firebase.database();

    database.ref('/task').once('value').then(function(snapshot) {


        $scope.$apply(function(){

            vm.items = snapshot.val();

            console.log(vm.items);

        })

    });




}

