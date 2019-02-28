function signUp() {
    const fullName = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const address = document.getElementById('address').value;
    const number = document.getElementById('number').value;
    const dob = document.getElementById('dob').value;
    const bloodGroup = document.getElementById('bGrp').value;
    let imageFile = document.getElementById('image').files[0];
    var form = formValidate(fullName, email, password, address, number, dob, bloodGroup, imageFile)
    if (form) {
        let usrObj = {
            fullName,
            email,
            password,
            address,
            number,
            dob,
            bloodGroup,
        }
        document.getElementById('loader').style.display = "block"
        document.getElementById('aftrLoad').style.display = "none"
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((success) => {
                let usrUid = success.user.uid;
                usrObj.usrUid = usrUid;
                firebase.storage().ref(`profileImg/${usrUid}`).put(imageFile)
                    .then((url) => {
                        url.ref.getDownloadURL()
                            .then((urlRef) => {
                                usrObj.ProfileImage = urlRef
                                firebase.database().ref(`users/${usrUid}`).set(usrObj)
                                    .then(() => {
                                        document.getElementById('loader').style.display = "none"
                                        document.getElementById('aftrLoad').style.display = "block"
                                        swal({
                                            title: `Account Created`,
                                            text: "Click button to go Login page",
                                            icon: "success",
                                            button: "continue",
                                            closeOnClickOutside: false,
                                            closeOnEsc: false,
                                        }).then(() => {
                                            window.location = "./logIn.html"
                                        })
                                    })
                            })
                    })
            })
            .catch((e) => {
                document.getElementById('aftrLoad').style.display = "block"
                document.getElementById('emailLbl').innerHTML = e.message;
                document.getElementById('emailLbl').style.display = "block";
            })
    }
}

function formValidate(fullName, email, password, address, number, dob, bloodGroup, imageFile) {
    let nameLbl = document.getElementById('nameLbl');
    let emailLbl = document.getElementById('emailLbl');
    let passwordLbl = document.getElementById('passwordLbl');
    let addressLbl = document.getElementById('addressLbl');
    let numberLbl = document.getElementById('numberLbl');
    let dobLbl = document.getElementById('dobLbl');
    let bloodGroupLbl = document.getElementById('bGrpLbl');
    let imgLbl = document.getElementById('imgLbl');
    var a, b, c, d, e, f, g, h;
    if (fullName === "") {
        nameLbl.style.display = "block";
        a = 0;
    } else if (!fullName.replace(/\s/g, '').length) {
        nameLbl.style.display = "block";
        nameLbl.innerHTML = 'Pleas Enter some text';
        a = 0;
    } else {
        a = 1;
    }
    if (email === "") {
        emailLbl.style.display = "block";
        b = 0;
    } else if (!email.replace(/\s/g, '').length) {
        emailLbl.style.display = "block";
        emailLbl.innerHTML = 'Pleas Enter some text';
        b = 0;
    } else {
        b = 1;
    }
    if (password === "") {
        passwordLbl.style.display = "block";
        c = 0;
    } else if (!password.replace(/\s/g, '').length) {
        passwordLbl.style.display = "block";
        passwordLbl.innerHTML = 'Pleas Enter some text';
        c = 0;
    } else if (password.length < 7) {
        passwordLbl.innerHTML = "Pasword length atleast 8"
        passwordLbl.style.display = "block"
        c = 0;
    } else {
        passwordLbl.style.display = "none";
        c = 1;
    }
    if (address === "") {
        addressLbl.style.display = "block";
        d = 0;
    } else if (!address.replace(/\s/g, '').length) {
        addressLbl.style.display = "block";
        addressLbl.innerHTML = 'Pleas Enter some text';
        d = 0;
    } else {
        d = 1;
    }
    if (number === "") {
        numberLbl.style.display = "block";
        e = 0;
    } else if (number.length !== 11) {
        numberLbl.innerHTML = "Enter Number in 11 digits formate";
        numberLbl.style.display = "block";
        e = 0;
    } else {
        e = 1;
    }
    if (dob === "") {
        dobLbl.style.display = "block";
        f = 0;
    } else {
        f = 1;
    }
    if (bloodGroup === "null") {
        bloodGroupLbl.style.display = "block";
        g = 0;
    } else {
        g = 1;
    }
    if (imageFile === undefined) {
        imgLbl.style.display = "block";
        h = 0;
    } else {
        h = 1;
    }
    var tst = a + b + c + d + e + f + g + h;
    if (tst === 8) {
        var flag = true;
    } else {
        var flag = false;
    }
    return (flag);
}

function hide(b) {
    let src = document.getElementById(b);
    src.innerHTML = "* Required";
    src.style.display = "none";
}