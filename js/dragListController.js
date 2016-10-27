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

        $scope.init = function() {

            vm.items = {};
            vm.todoList = [];
            vm.inProgList = [];
            vm.completedList = [];

            vm.data = {
                title: '',
                description: '',
                status: 'to-do',
                priority: 'low'
            }

            vm.data.labels = [
                {
                    text:''
                }
            ];

            vm.addTodo = true;

            var date = new Date();
            $scope.FromDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        }/*End of init function*/

        $scope.firebase = function(){

            var database = firebase.database();
            database.ref('/todo').once('value').then(function(snapshot) {
                //console.log(snapshot.val());
                $scope.$apply(function(){
                    vm.todoItems = snapshot.val();
                    angular.forEach(vm.todoItems, function(value) {
                        vm.todoList.push(value);
                    });
                });
            });
            database.ref('/inprog').once('value').then(function(snapshot) {
                //console.log(snapshot.val());
                $scope.$apply(function(){
                    vm.todoItems = snapshot.val();
                    angular.forEach(vm.todoItems, function(value) {
                        vm.inProgList.push(value);
                    });
                });
            });
            database.ref('/completed').once('value').then(function(snapshot) {
                //console.log(snapshot.val());
                $scope.$apply(function(){
                    vm.todoItems = snapshot.val();
                    angular.forEach(vm.todoItems, function(value) {
                        vm.completedList.push(value);
                    });
                });
            });

            var containers = $('.containerVertical');
            dragularService([containers[0],containers[1], containers[2]],{
                containersModel: [vm.todoList, vm.inProgList, vm.completedList],
                scope: $scope
            });

            $scope.$on('dragulardrop', function(){

                var rootRef = firebase.database().ref();
                rootRef.child('todo').set(null);
                rootRef.child('inprog').set(null);
                rootRef.child('completed').set(null);

                angular.forEach(vm.todoList, function(value){

                    var newVal = angular.fromJson(angular.toJson(value));
                    var storesRef = rootRef.child('todo');
                    var newStoreRef = storesRef.push();
                    newStoreRef.set(newVal);

                    var newID = newStoreRef.getKey();
                    var label = rootRef.child('todo/' + newID + '/labels');

                    angular.forEach(newVal.labels, function(data){
                        label.push(data.text);
                    });

                    var insertID = rootRef.child('todo/' + newID + '/id' );
                    insertID.set(newID);

                    var newStatus = rootRef.child('todo/' + newID + '/status');
                    newStatus.set('to-do');

                });

                angular.forEach(vm.inProgList, function(value){

                    var newVal = angular.fromJson(angular.toJson(value));
                    var storesRef = rootRef.child('inprog');
                    var newStoreRef = storesRef.push();
                    newStoreRef.set(newVal);

                    var newID = newStoreRef.getKey();
                    var label = rootRef.child('inprog/' + newID + '/labels');

                    angular.forEach(newVal.labels, function(data){
                        label.push(data.text);
                    });

                    var insertID = rootRef.child('inprog/' + newID + '/id' );
                    insertID.set(newID);

                    var newStatus = rootRef.child('inprog/' + newID + '/status');
                    newStatus.set('on the process');

                });

                angular.forEach(vm.completedList, function(value){

                    var newVal = angular.fromJson(angular.toJson(value));
                    var storesRef = rootRef.child('completed');
                    var newStoreRef = storesRef.push();
                    newStoreRef.set(newVal);

                    var newID = newStoreRef.getKey();
                    var label = rootRef.child('completed/' + newID + '/labels');

                    angular.forEach(newVal.labels, function(data){
                        label.push(data.text);
                    });

                    var insertID = rootRef.child('completed/' + newID + '/id' );
                    insertID.set(newID);

                    var newStatus = rootRef.child('completed/' + newID + '/status');
                    newStatus.set('completed');

                });

            });

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

        $scope.init();
        $scope.firebase();
        $scope.authentication();

        vm.addLabel = function(){
            vm.data.labels.push({
                text:''
            });
        }

        vm.cancel = function(){

            $scope.init();

        }

        vm.create = function(){

            console.log(vm.data);

            var dynamicChild = '';

            switch(vm.data.status){
                case 'to-do':
                    dynamicChild = 'todo';
                    break;
                case 'on the process':
                    dynamicChild = 'inprog';
                    break;
                case 'completed':
                    dynamicChild = 'completed';
                    break;
            }

            //console.log(dynamicChild);

            var rootRef = firebase.database().ref();
            var storesRef = rootRef.child(dynamicChild);
            var newStoreRef = storesRef.push();
            newStoreRef.set({
                description: vm.data.description,
                status: vm.data.status,
                priority: vm.data.priority,
                title: vm.data.title,
                created_by: $scope.username,
                modified_by: $scope.username,
                date_added: $scope.FromDate,
                date_modified: $scope.FromDate
            });

            var newID = newStoreRef.getKey();
            var label = rootRef.child(dynamicChild + '/' + newID + '/labels');

            angular.forEach(vm.data.labels, function(value){
                label.push(value.text);
            });

            var insertID = rootRef.child(dynamicChild+'/' + newID + '/id' );
            insertID.set(newID);

            $scope.init();
            $scope.firebase();

        }


    }



})();