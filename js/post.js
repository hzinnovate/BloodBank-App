window.addEventListener('load', () => {
    let recieversPosts = document.getElementById('recieversPosts');
    let donerPosts = document.getElementById('donerPosts');
    let usr = window.localStorage.getItem('user');
    let user = JSON.parse(usr)
    if (user !== null) {
        document.getElementById('pdisp').style.display = "block"
        donerPosts.innerHTML = " ";
        donerPosts.innerHTML = `<h3 style="text-align: center;"> Donater Posts </h3>`
        firebase.database().ref(`posts/Donate/`).once("value", (e) => {
            let obj = e.val()
            for (let key in obj) {
                if (key !== user.usrUid) {
                    for (let key2 in obj[key]) {
                        if (obj[key][key2].component.search(">Donate<") !== -1) {
                            var done = obj[key][key2].component
                            donerPosts.style.display = "block";
                            donerPosts.innerHTML += done.replace(">Donate<", ">Profile<")
                        }
                    }
                }
            }
        })
        recieversPosts.innerHTML = " ";
        recieversPosts.innerHTML = `<h3 style="text-align: center;"> Reciver Posts </h3>`
        firebase.database().ref(`posts/Receive/`).once("value", (e) => {
            let obj = e.val()
            for (let key in obj) {
                if (key !== user.usrUid) {
                    for (let key2 in obj[key]) {
                        if (obj[key][key2].component.search(">Receive<") !== -1) {

                            var done2 = obj[key][key2].component

                            recieversPosts.style.display = "block";
                            recieversPosts.innerHTML += done2.replace(">Receive<", ">Profile<")
                        }
                    }
                }
            }
        })
    } else {
        swal({
            title: "Error",
            text: "Pleas Login First to use this app",
            icon: "Error",
            button: "OK",
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then(() => {
            window.location = './logIn.html'
        })
    }
})

function btn(ths) {
    let key = ths.parentNode.getAttribute("key");
    firebase.database().ref(`users/${key}`).once("value", (e) => {
        let tempUsr = e.val();
        document.getElementById('tmpImg').setAttribute('src', tempUsr.ProfileImage);
        document.getElementById('tmpName').innerHTML = tempUsr.fullName;
        document.getElementById('tmpEmail').innerHTML = tempUsr.email;
        document.getElementById('tmpNum').innerHTML = tempUsr.number;
        document.getElementById('tmpCity').innerHTML = tempUsr.address;
        document.getElementById('tmpDob').innerHTML = tempUsr.dob;
        document.getElementById('tmpBgroup').innerHTML = tempUsr.bloodGroup;
    }).then(() => {
        document.getElementById('pdisp').style.display = "none";
        document.getElementById('tmpProfile').style.display = "block";
    }).catch((error) => {
        swal({
            title: "Error",
            icon: "error",
            text: error.message,
            button: "OK",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
    })
}

function tempProfHide() {
    document.getElementById('tmpProfile').style.display = "none";
    document.getElementById('pdisp').style.display = "block";
}