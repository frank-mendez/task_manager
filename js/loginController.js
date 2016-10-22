/**
 * Created by frank on 20/10/2016.
 */

(function() {
    'use strict';

    angular
        .module('taskManager')
        .controller('LoginController', LoginController);

    function LoginController () {

        var vm = this;

         vm.auth = function(){

             var uiConfig = {
                 'signInSuccessUrl': '/',
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
                 'tosUrl': 'https://firebase.google.com/docs/auth/',
             };

             // Initialize the FirebaseUI Widget using Firebase.
             var ui = new firebaseui.auth.AuthUI(firebase.auth());
             // The start method will wait until the DOM is loaded.
             ui.start('#firebaseui-auth-container', uiConfig);



        }

        vm.initAuth = function(){

            vm.login = true;

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    // User is signed in.

                    console.log('User is signed in');

                    vm.login = false;
                    vm.app = true;

                    var displayName = user.displayName;
                    var email = user.email;
                    var emailVerified = user.emailVerified;
                    var photoURL = user.photoURL;
                    var uid = user.uid;
                    var providerData = user.providerData;
                    user.getToken().then(function(accessToken) {
                        document.getElementById('sign-in-status').textContent = 'Signed in';
                        document.getElementById('sign-in').textContent = 'Sign out';
                        document.getElementById('account-details').textContent = JSON.stringify({
                            displayName: displayName,
                            email: email,
                            emailVerified: emailVerified,
                            photoURL: photoURL,
                            uid: uid,
                            accessToken: accessToken,
                            providerData: providerData
                        }, null, '  ');
                    });
                } else {
                    // User is signed out.

                    console.log('User is signed out');

                    vm.app = true;

                    vm.auth();

                    document.getElementById('sign-in-status').textContent = 'Signed out';
                    document.getElementById('sign-in').textContent = 'Sign in';
                    document.getElementById('account-details').textContent = 'null';
                }
            }, function(error) {
                console.log(error);
            });

        }

    }


})();