function logIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    document.getElementById('loader').style.display = "block";
    document.getElementById('afterLoad').style.display = "none";
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref(`users/${uid}`).once('value').then((e) => {
            let obj = e.val();
            window.localStorage.setItem('user', JSON.stringify(obj))
            document.getElementById('loader').style.display = "none";
            document.getElementById('afterLoad').style.display = "block";
            swal({
                title: "Successfully LogIn",
                text: "Click button to go Task page",
                icon: "success",
                button: "continue",
                closeOnClickOutside: false,
                closeOnEsc: false,
            }).then(() => {
                window.location = './main.html'
            })
        })
    })
        .catch((err) => {
            document.getElementById('loader').style.display = "none";
            document.getElementById('afterLoad').style.display = "block";
            swal({
                title: "Error",
                text: err.message,
                icon: "error",
                button: "OK",
                closeOnClickOutside: false,
                closeOnEsc: false,
            })
        })
}
function logout() {
    firebase.auth().signOut().then(() => {
        window.localStorage.setItem('user', 'null')
        swal({
            title: "LogOut Success",
            icon: "info",
            button: "OK",
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then(() => {
            window.location = './logIn.html'
        })
    })
        .catch((err) => {
            swal({
                title: "Opx",
                icon: "info",
                text: err.massege,
                button: "Ok",
                closeOnClickOutside: false,
                closeOnEsc: false,
            })
        })
}