/**
 * Created by frank on 12/10/2016.
 */

//Module pattern
var Module = {};

Module.Firebase = (function(){

    function init(){

        var database = firebase.database();

        database.ref('/task/').once('value').then(function(snapshot) {

            var tasks = snapshot.val();

            console.log(tasks);

        });


    }

    function create() {

        //var database = firebase.database();

        var add = firebase.database().ref('task').set({

            counter: 5,
            task: {
                1: {
                    description: 'Science Homework',
                    id: 1,
                    labels: {
                        1: 'test',
                        2: 'test 2'
                    },
                    order: 1,
                    status: 'to-do',
                    priority: 'low',
                    title: 'Homework'
                },
                2: {
                    description: 'Math Project',
                    id: 2,
                    labels: {
                        1: 'test',
                        2: 'test 2'
                    },
                    order: 2,
                    status: 'to-do',
                    priority: 'high',
                    title: 'Project'
                },
                3:{
                    description: 'Weekend',
                    id: 3,
                    labels: {
                        1: 'Bathroom',
                        2: 'Kictchen',
                        3: 'Bedroom'
                    },
                    order: 3,
                    status: 'completed',
                    priority: 'high',
                    title: 'Household Chores'
                },
                4:{
                    description: 'Exam for English',
                    id: 4,
                    labels: {
                        1: 'Chapter 1',
                        2: 'Chapter 2'
                    },
                    order: 4,
                    status: 'on the process',
                    priority: 'high',
                    title: 'Study Exam'
                },
                5:{
                    description: 'Family Gathering',
                    id: 5,
                    labels: {
                        1: 'test',
                        2: 'test 2'
                    },
                    order: 5,
                    status: 'to-do',
                    priority: 'low',
                    title: 'Dinner Party'
                }
            }

        });

        return add;

    }

    return{
        init: init,
        create: create
    }

})();


$(document).ready(function(){

    //Module.Firebase.create();

});