/**
 * Created by frank on 26/10/2016.
 */
( function () {
    'use strict';

    angular
        .module('taskManager')
        .controller('DragListController', DragListController);

    DragListController.$inject = ['$scope', 'dragularService'];

    function DragListController($scope, dragularService){

        var vm = this;
        vm.items = {};

        vm.todoList = [];
        vm.inProgList = [];
        vm.completedList = [];

        $scope.items = [];

        vm.init = function() {

            var database = firebase.database();
            database.ref('/task').once('value').then(function(snapshot) {

                $scope.$apply(function(){

                    vm.items = snapshot.val();
                    //Manipulating data from Firebase
                    angular.forEach(vm.items, function(value) {
                        angular.forEach(value, function(data){
                            if(data == 'completed'){
                                vm.completedList.push(value);
                            }
                            if(data == 'to-do'){

                                vm.todoList.push(value);
                            }
                            if(data == 'on the process'){
                                vm.inProgList.push(value);
                            }
                        });
                    });


                    var containers = $('.containerVertical');

                    //console.log('containers', containers);

                    dragularService([containers[0],containers[1], containers[2]],{
                        containersModel: [vm.todoList, vm.inProgList, vm.completedList]
                    });


                });

            });


        }/*End of init function*/


        vm.init();

    }



})();