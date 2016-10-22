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


    function authState() {

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

                console.log('userDetails', userDetails);

                console.log('User is signed in');

                $('.login-container').css('display', 'none');
                $('.app-container').css('display', 'block');

                if(userDetails.displayName == null){

                    console.log('test');

                    $.each(userDetails.providerData, function(key, value){

                        $.each(value, function(index, data){

                            //console.log( index, data);
                            if(index == 'displayName' ){
                                $('.username').html(data);
                            }
                            if(index == 'photoURL'){
                                $('.user-photo').attr('src', data);
                            }

                        })

                    });

                }else{

                    $('.username').html(userDetails.displayName);
                    $('.user-photo').attr('src', userDetails.photoURL);
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

                document.getElementById('sign-in-status').textContent = 'Signed out';
                document.getElementById('sign-in').textContent = 'Sign in';
                document.getElementById('account-details').textContent = 'null';
            }
        }, function (error) {
            console.log(error);
        });


    }

    function signOut(){

        $('#sign-out').on('click', function(){

            firebase.auth().signOut();

            location.reload();

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
    //Module.Firebase.authState();
    Module.Firebase.signOut();

});