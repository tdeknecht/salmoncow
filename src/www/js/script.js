// credit for this example (https://epsagon.com/tools/a-quickstart-guide-to-aws-cognito-lambda-and-ses/)
// cognito javascript SDK install (https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup)

const poolData = {
    UserPoolId: 'us-east-1_vM9ZeVvX6',
    ClientId: '1kpdb8dcjqpv7i9fhh1859rkbu'
}

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const form = document.querySelector('#sign-up-form'); // put the form into variable

form.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent unnecessary navigate on submit
    // get the form data as a plain object
    const formData = Object.fromEntries(new FormData(form).entries());
    signUp(formData);
});

function signUp(formData) {
    // attributes that should be placed onto user object
    // I have no additional attributes, but this is a good reference for how
    const attributes = [
        // { Name: 'name', Value: formData.name }
    ]
    userPool.signUp(formData.email, formData.password, attributes, null, onSignUp);
}

function onSignUp(err, userData) {
    if (err) {
        // alert (JSON.stringify(err)); // page alert if there's an error (invalid password, user exists, etc.)
        return alert (JSON.stringify(err));
    } else {
        console.log(userData); // log if user was created successfully. useful for debugging
        confirmUser(userData.user);
    }
}

// allow user to put in their confirmation code if user is successfully created
function confirmUser(user) {
    const confirmCode = prompt('Confirmation code:'); // quick and dirty prompt box
    // user here is an instance of CognitoUser, so it already inherits necessary method
    user.confirmRegistration(confirmCode, true, onConfirmed);
}

function onConfirmed(err) {
    if (err) {
        return alert (JSON.stringify(err));
    } else {
        alert('Success');
    }
}
