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

    //test for Firebase Unique ID
    function _push(){

        var rootRef = firebase.database().ref();
        var storesRef = rootRef.child('task');
        var newStoreRef = storesRef.push();
        newStoreRef.set({
            description: 'Science Homework',
            id: 1,
            order: 1,
            status: 'to-do',
            priority: 'low',
            title: 'Homework'
        });

        var newID = newStoreRef.getKey();

        var label = rootRef.child('task/' + newID + '/labels');
        label.push('test 1');
        label.push('test 2');


        console.log(newID);

    }

    return{
        init: init,
        create: create,
        _push: _push
    }

})();


$(document).ready(function(){

    //Module.Firebase.create();
    //Module.Firebase._push();

});