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

        $scope.firebaseInit = function(){

            var config = {
                apiKey: "AIzaSyC1mir7krdyGHx5jqE8yqWLLCL_4cAAQNg",
                authDomain: "real-time-task-manager.firebaseapp.com",
                databaseURL: "https://real-time-task-manager.firebaseio.com",
                storageBucket: "real-time-task-manager.appspot.com",
                messagingSenderId: "1058531001319"
            };
            firebase.initializeApp(config);

        }

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
            $scope.addCompleted = true;
            $scope.addToDo = true;
            $scope.addInProgress = true;

            var date = new Date();
            $scope.FromDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        }

        $scope.addLabel = function(){

            $scope.data.labels.push({
                text:''
            });
        };

        $scope.firebase = function(){

            var database = firebase.database();

            database.ref('/task').once('value').then(function(snapshot) {


                $scope.todoLengthTest = 0;
                $scope.completedLength = 0;
                $scope.inProgressLength = 0;

                $scope.$apply(function(){

                    vm.items = snapshot.val();

                    angular.forEach(vm.items, function(value) {

                        angular.forEach(value, function(index) {

                            if(index == 'to-do'){
                                $scope.todoLengthTest++;
                            }
                            if(index == 'completed'){
                                $scope.completedLength++;
                            }if(index == 'on the process'){
                                $scope.inProgressLength++;
                            }

                        });

                    });


                    /*Google Chart*/
                    $scope.myChartObject = {};

                    $scope.myChartObject.type = "PieChart";

                    $scope.inProg = [
                        {v: "In Progress"},
                        {v: $scope.inProgressLength},
                    ];


                    $scope.toDo = [
                        {v: "To do"},
                        {v: $scope.todoLengthTest},
                    ];

                    $scope.complete = [
                        {v: "Completed"},
                        {v: $scope.completedLength},
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
                        'title': 'Task List Chart',
                        'is3D': true,
                        'colors': ['#e74c3c', '#f1c40f', '#2ecc71'],
                        'pieSliceText': 'label',
                        'legend': { position: 'none' },
                    };


                })

            });

            //counter
            database.ref('counter').once('value').then(function(snapshot) {

                $scope.counter = snapshot.val();

            });


        }

        $scope.initializeData();
        $scope.firebase();

        $scope.addTodoTask = function(){

            $scope.initializeData();

            $scope.data.status = 'to-do';
            $scope.addToDo = false;
            $scope.addInProgress = true;
            $scope.addCompleted = true;
            $scope.addTodoBtn = false;
            $scope.updateTodoBtn = true;

        }

        $scope.addInProgressTask = function(){

            $scope.initializeData();

            $scope.data.status = 'on the process';
            $scope.addInProgress = false;
            $scope.addToDo = true;
            $scope.addCompleted = true;
        }

        $scope.addCompletedTask = function(){

            $scope.initializeData();

            $scope.data.status = 'completed';
            $scope.addCompleted = false;
            $scope.addToDo = true;
            $scope.addInProgress = true;
        }


        $scope.submit = function(){

            console.log($scope.data);


            var counter = $scope.counter + 1;

            var rootRef = firebase.database().ref();
            var storesRef = rootRef.child('task');
            var newStoreRef = storesRef.push();
            newStoreRef.set({
                description: $scope.data.description,
                order: counter,
                status: $scope.data.status,
                priority: $scope.data.priority,
                title: $scope.data.title,
                created_by: $scope.username,
                modified_by: $scope.username,
                date_added: $scope.FromDate,
                date_modified: $scope.FromDate
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

        $scope.updateToDo = function(taskID){
            $scope.addToDo = false;
            $scope.addInProgress = true;
            $scope.addCompleted = true;
            $scope.updateTodoBtn = false;
            $scope.addTodoBtn = true;

            $scope.update(taskID);

        }

        $scope.updateInProgress = function(taskID){
            $scope.data.status = 'on the process';
            $scope.addInProgress = false;
            $scope.addToDo = true;
            $scope.addCompleted = true;
            $scope.updateTodoBtn = false;
            $scope.addTodoBtn = true;

            $scope.update(taskID);

        }

        $scope.updateCompleted = function(taskID){

            $scope.data.status = 'completed';
            $scope.addCompleted = false;
            $scope.addToDo = true;
            $scope.addInProgress = true;
            $scope.updateTodoBtn = false;
            $scope.addTodoBtn = true;

            $scope.update(taskID);

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
                        title: queryData.title,
                        created_by: queryData.created_by,
                        modified_by: queryData.modified_by,
                        date_added: queryData.date_added,
                        date_modified: queryData.date_modified
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
                title: $scope.data.title,
                created_by: $scope.data.created_by,
                modified_by: $scope.username,
                date_added: $scope.data.date_added,
                date_modified: $scope.FromDate

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
            root.child('task/' + taskID + '/date_modified').set($scope.FromDate);
            root.child('task/' + taskID + '/modified_by').set($scope.username);

            $scope.firebase();
            $scope.initializeData();

        }

        $scope.completed = function(taskID){

            var root = firebase.database().ref();
            root.child('task/' + taskID + '/status').set('completed');
            root.child('task/' + taskID + '/date_modified').set($scope.FromDate);
            root.child('task/' + taskID + '/modified_by').set($scope.username);

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

        $scope.authentication = function(){

            var uiConfig = {
                'callbacks': {
                    // Called when the user has been successfully signed in.
                    'signInSuccess': function(user, credential, redirectUrl) {
                        //handleSignedInUser(user);
                        // Do not redirect.
                        return false;
                    }
                },
                'signInFlow': 'popup',
                'signInOptions': [
                    // Leave the lines as is for the providers you want to offer your users.
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                    firebase.auth.GithubAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID
                ],
                // Terms of service url.
                'tosUrl': 'https://console.firebase.google.com/project/real-time-task-manager/overview',
            };


            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.

                    $scope.userHandler(user);

                    var displayName = user.displayName;
                    var email = user.email;
                    var emailVerified = user.emailVerified;
                    var photoURL = user.photoURL;
                    var uid = user.uid;
                    var providerData = user.providerData;

                    var userDetails = {

                        displayName: displayName,
                        email: email,
                        emailVerified: emailVerified,
                        photoURL: photoURL,
                        uid: uid,
                        providerData: providerData

                    }


                    $('.login-container').css('display', 'none');
                    $('.app-container').css('display', 'block');

                    if(userDetails.displayName == null){


                        $.each(userDetails.providerData, function(key, value){

                            $.each(value, function(index, data){

                                //console.log( index, data);
                                if(index == 'displayName' ){
                                    $('.username').html(data);
                                }

                                if(index == 'photoURL'){
                                    $('.user-photo').attr('src', data);

                                    if(data == null){
                                        $('.user-photo').attr('src', 'images/user.jpg');
                                    }

                                }

                            })

                        });

                    }else{

                        $('.username').html(userDetails.displayName);
                        $('.user-photo').attr('src', userDetails.photoURL);

                        if(userDetails.photoURL == null){
                            $('.user-photo').attr('src', 'images/user.jpg');
                        }
                    }





                } else {
                    // User is signed out.

                    console.log('User is signed out');

                    // Initialize the FirebaseUI Widget using Firebase.
                    var ui = new firebaseui.auth.AuthUI(firebase.auth());
                    // The start method will wait until the DOM is loaded.
                    ui.start('#firebaseui-auth-container', uiConfig);

                    $('.login-container').css('display', 'block');
                    $('.app-container').css('display', 'none');

                }
            }, function (error) {
                console.log(error);
            });

        }



        $scope.userHandler = function(user){

            $scope.username = '';

            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var providerData = user.providerData;

            var userDetails = {

                displayName: displayName,
                email: email,
                emailVerified: emailVerified,
                photoURL: photoURL,
                uid: uid,
                providerData: providerData

            }


            if(userDetails.displayName == null){

                $.each(userDetails.providerData, function(key, value){

                    $.each(value, function(index, data){

                        if(index == 'displayName' ){
                            $scope.username = data;
                            $scope.$apply();
                        }

                    })

                });

            }else{

                $scope.username = userDetails.displayName;
                $scope.$apply();

            }


        }


    }




})();