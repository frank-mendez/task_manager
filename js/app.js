/**
 * Created by frank on 12/10/2016.
 */

//set the module
angular.module('taskManager', []);

angular
    .module('taskManager')
    .controller('TaskListController', TaskListController);

function TaskListController(){

    var database = firebase.database();

    database.ref('/task/').once('value').then(function(snapshot) {

        var tasks = snapshot.val();

        console.log(tasks);

    });

}

