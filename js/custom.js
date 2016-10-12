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

    return{
        init: init
    }

})();


$(document).ready(function(){

    Module.Firebase.init();

});