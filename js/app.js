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

    $scope.initializeData = function(){

        $scope.formTitle = 'Create Task';

        $scope.data = {
            status: 'to-do',
            priority: 'low'
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

    }

    $scope.initializeData();
    $scope.firebase();


    $scope.submit = function(){

        console.log($scope.data.labels);

        var rootRef = firebase.database().ref();
        var storesRef = rootRef.child('task');
        var newStoreRef = storesRef.push();
        newStoreRef.set({
            description: $scope.data.description,
            order: 3,
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

            queryData = snapshot.val();

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

        $scope.save = function(){

            //console.log($scope.data);

            var root = firebase.database().ref();
            var updateData = root.child('task/' + $scope.data.id);
            updateData.set({

                description: $scope.data.description,
                order: 3,
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

    }


}


