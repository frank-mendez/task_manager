/**
 * Created by frank on 20/10/2016.
 */

(function() {
    'use strict';


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

        $scope.initializeData = function(){

            $scope.formTitle = 'Create Task';

            $scope.data = {
                status: 'to-do',
                priority: 'low',
                title: ' '
            };


            $scope.data.labels = [
                {
                    text:''
                }
            ];

            $scope.updateBtn = true;
            $scope.saveBtn = false;

            $scope.status = {
                todo: 'to-do',
                completed: 'completed',
                inProgress: 'on the process'
            }

            $scope.panelColor = 'panel-info';

        }

        $scope.addLabel = function(){
            $scope.data.labels.push({
                text:''
            });
        };

        $scope.firebase = function(){

            var database = firebase.database();

            database.ref('/task').once('value').then(function(snapshot) {


                $scope.$apply(function(){

                    vm.items = snapshot.val();

                })

            });

            //counter
            database.ref('counter').once('value').then(function(snapshot) {

                $scope.counter = snapshot.val();

            });


        }


        $scope.initializeData();
        $scope.firebase();



        $scope.submit = function(){

            //console.log($scope.data.labels);

            var counter = $scope.counter + 1;

            var rootRef = firebase.database().ref();
            var storesRef = rootRef.child('task');
            var newStoreRef = storesRef.push();
            newStoreRef.set({
                description: $scope.data.description,
                order: counter,
                status: $scope.data.status,
                priority: $scope.data.priority,
                title: $scope.data.title
            });

            var newID = newStoreRef.getKey();

            var label = rootRef.child('task/' + newID + '/labels');

            angular.forEach($scope.data.labels, function(value){

                label.push(value.text);

            });

            var insertID = rootRef.child('task/' + newID + '/id' );
            insertID.set(newID);

            var rootCounter = rootRef.child('counter');
            rootCounter.set(counter);

            $scope.firebase();
            $scope.initializeData();


        }

        $scope.cancel = function(){

            $scope.initializeData();

        }

        $scope.update = function(taskID){

            $scope.formTitle = 'Update Task';
            $scope.updateBtn = false;
            $scope.saveBtn = true;
            $scope.panelColor = 'panel-warning';

            console.log(taskID);

            var root = firebase.database().ref();
            root.child('task/' + taskID).once('value').then(function(snapshot){

                var queryData = snapshot.val();

                //console.log(queryData.labels);

                $scope.$apply(function(){

                    $scope.data = {
                        description: queryData.description,
                        id: queryData.id,
                        order: queryData.order,
                        status: queryData.status,
                        priority: queryData.priority,
                        title: queryData.title
                    };

                    $scope.data.labels = [];

                    angular.forEach(queryData.labels, function(value){

                        $scope.data.labels.push({
                            text: value
                        });

                    });

                });

            });

        }

        $scope.save = function(){

            //console.log($scope.data);

            var root = firebase.database().ref();
            var updateData = root.child('task/' + $scope.data.id);
            updateData.set({

                description: $scope.data.description,
                order: $scope.data.order,
                id: $scope.data.id,
                status: $scope.data.status,
                priority: $scope.data.priority,
                title: $scope.data.title

            });

            var updateLabels = root.child('task/' + $scope.data.id + '/labels');

            angular.forEach($scope.data.labels, function(value){

                updateLabels.push(value.text);

            });

            $scope.firebase();
            $scope.initializeData();


        }

        $scope.inProgress = function(taskID){

            var root = firebase.database().ref();
            root.child('task/' + taskID + '/status').set('on the process');

            $scope.firebase();
            $scope.initializeData();

        }

        $scope.completed = function(taskID){

            var root = firebase.database().ref();
            root.child('task/' + taskID + '/status').set('completed');

            $scope.firebase();
            $scope.initializeData();

        }

        $scope.delete = function(taskID){

            var root = firebase.database().ref();
            var deleteData = root.child('task/' + taskID);
            deleteData.remove();

            $scope.firebase();
            $scope.initializeData();

        }

        /*Google Chart*/
        $scope.myChartObject = {};

        $scope.myChartObject.type = "PieChart";

        $scope.inProg = [
            {v: "In Progress"},
            {v: 3},
        ];

        $scope.complete = [
            {v: "Completed"},
            {v: 3},
        ];


        $scope.toDo = [
            {v: "To do"},
            {v: 3},
        ];

        $scope.myChartObject.data = {"cols": [
            {id: "t", label: "High", type: "string"},
            {id: "s", label: "Low", type: "string"}
        ], "rows": [
            {c: $scope.toDo},
            {c: $scope.inProg},
            {c: $scope.complete}
        ]};

        $scope.myChartObject.options = {
            'title': 'Task List Chart'
        };

    }




})();