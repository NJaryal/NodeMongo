document.getElementById('loginBtn').addEventListener('click', loginWithFacebook, false)

function loginWithFacebook() {
    FB.login(response => {
        const {authResponse:{accessToken, userId}} = response
        console.log(response)

        fetch('/login-with-facebook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({accessToken, userId})
        }).then(res => {
            console.log(res)
        })
    },{
        scope: 'public_profile, email'
    })
    return false;
}
