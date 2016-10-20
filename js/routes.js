/**
 * Created by frank on 20/10/2016.
 */

(function() {
    'use strict';

    angular.module('taskManager')
        .config(function($routeProvider) {

            $routeProvider
                .when('/',{
                    templateUrl: 'task-view.html',
                    controller: 'TaskListController as taskList'
                })
                .when('/task',{
                    templateUrl: 'task.html',
                    controller: 'TaskListController as taskList'
                })
                .when('/login',{
                    templateUrl: 'login.html'
                });

        });


})();