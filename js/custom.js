/**
 * Created by frank on 12/10/2016.
 */

//Module pattern
var Module = {};

Module.Firebase = (function(){

    function init(){
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyC1mir7krdyGHx5jqE8yqWLLCL_4cAAQNg",
            authDomain: "real-time-task-manager.firebaseapp.com",
            databaseURL: "https://real-time-task-manager.firebaseio.com",
            storageBucket: "real-time-task-manager.appspot.com",
            messagingSenderId: "1058531001319"
        };
        firebase.initializeApp(config);
    }


    function authState(){

        var uiConfig = {
            'callbacks': {
                // Called when the user has been successfully signed in.
                'signInSuccess': function(user, credential, redirectUrl) {
                    handleSignedInUser(user);
                    // Do not redirect.
                    return false;
                }
            },
            'signInFlow': 'popup',
            'signInOptions': [
                // TODO(developer): Remove the providers you don't need for your app.
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    scopes: ['https://www.googleapis.com/auth/plus.login']
                },
            ],
            // Terms of service url.
            'tosUrl': 'https://www.google.com',
        };

        // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());

        var currentUid = null;

        var handleSignedInUser = function(user) {

            console.log('user is sign in');

            currentUid = user.uid;
            document.getElementById('user-signed-in').style.display = 'block';
            document.getElementByClass('user-signed-out').style.display = 'none';
            document.getElementById('name').textContent = user.displayName;
            document.getElementById('email').textContent = user.email;
            if (user.photoURL){
                document.getElementById('photo').src = user.photoURL;
                document.getElementById('photo').style.display = 'block';
            } else {
                document.getElementById('photo').style.display = 'none';
            }
        };

        /**
         * Displays the UI for a signed out user.
         */
        var handleSignedOutUser = function() {

            console.log('user is sign out');

            document.getElementById('user-signed-in').style.display = 'none';
            document.getElementById('user-signed-out').style.display = 'block';
            // The start method will wait until the DOM is loaded.
            ui.start('#firebaseui-auth-container', uiConfig);
        };


        firebase.auth().onAuthStateChanged(function(user) {

            if (user && user.uid == currentUid) {
                return;
            }

            user ? handleSignedInUser(user) : handleSignedOutUser();


        }, function(error) {
            console.log(error);
        });


    }

    function signOut(){

        $('.sign-out').on('click', function(){

            firebase.auth().signOut();

        });

    }

    return{
        init: init,
        authState: authState,
        signOut: signOut
    }

})();

$(document).ready(function(){

    Module.Firebase.init();
    /*Module.Firebase.authState();
    Module.Firebase.signOut();*/

});