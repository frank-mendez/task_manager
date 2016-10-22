/**
 * Created by frank on 20/10/2016.
 */

(function() {
    'use strict';

    angular.module('taskManager')
        .config(function($routeProvider) {

            $routeProvider
                .when('/',{
                    templateUrl: 'views/task-view.html',
                    controller: 'TaskListController as taskList',
                    resolve: {

                    }
                })
                .when('/task',{
                    templateUrl: 'views/task.html',
                    controller: 'TaskListController as taskList'
                })
                .when('/all-list',{
                    templateUrl: 'views/all-list.html',
                    controller: 'TaskListController as taskList'
                });

        });


})();