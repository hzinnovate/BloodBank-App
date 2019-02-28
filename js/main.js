window.addEventListener('load', () => {
    document.getElementById('loader').style.display = "block"
    let usr = window.localStorage.getItem('user');
    let user = JSON.parse(usr)
    if (user !== null) {
        document.getElementById('loader').style.display = "none"
        profile(user)
        showMyPosts()
    } else {
        document.getElementById('loader').style.display = "none"
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
function profile(user) {
    let pImg = document.getElementById('pImg').setAttribute('src', user.ProfileImage);
    let pName = document.getElementById('pName').innerHTML = user.fullName;
    let pEmail = document.getElementById('pEmail').innerHTML = user.email;
    let pNum = document.getElementById('pNum').innerHTML = user.number;
    let pCity = document.getElementById('pCity').innerHTML = user.address;
    let pDob = document.getElementById('pDob').innerHTML = user.dob;
    let pBgroup = document.getElementById('pBgroup').innerHTML = user.bloodGroup;
    document.getElementById('disp').style.display = 'block';
}
function addPost() {
    let postMsg = document.getElementById('postMsg').value;
    let postType = document.getElementById('postType').value;
    if (postType === "null") {
        swal({
            title: "Info",
            text: "Pleas Select post type Doner / Reciever",
            icon: "info",
            button: "OK",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
    }
    else if (postType !== "null") {
        let usr = window.localStorage.getItem('user');
        let user = JSON.parse(usr)

        let obj = {
            component: "",
        }
        firebase.database().ref(`${'posts'}/${postType}/${user.usrUid}/`).push(obj)
            .then((success) => {
                let key = success.key
                firebase.database().ref(`${'posts'}/${postType}/${user.usrUid}/${key}`).once("value", (e) => {
                    let obj = e.val()
                    let component =
                        `                        <div class="col-sm-6 col-md-4">
            <div style="height: 525px; border-radius: 10px;" class="thumbnail" >
                <img id="postImg" src="../images/donate.gif" style="width:100%; border-radius: 10px;" alt="Donate Blood Save Life">
                <div key="${user.usrUid}" class="caption">
                    <h4 style="text-align: center;">${user.fullName}</h4>
                    <h6>${postMsg}</h6>
                    <h5>${user.email}</h5>
                    <h5>${user.number}</h5>
                    <h5>${user.dob}</h5>
                    <h5>${user.address}</h5>
                    <h5>${user.bloodGroup}</h5>
                    <button key="${key}" onClick="btn(this)" style="float: right;"  class="btn btn-primary">${postType}</button>
                </div>
            </div>
        </div>`
                    obj.key = key;
                    obj.component = component;
                    firebase.database().ref(`${'posts'}/${postType}/${user.usrUid}/${key}`).set(obj)
                }).then((success) => {
                    swal({
                        title: "New Post Created",
                        icon: "success",
                        button: "continue",
                        closeOnClickOutside: false,
                        closeOnEsc: false,
                    }).then(() => {
                        showMyPosts()
                    })
                })
            })
    }
}
var afterPost = document.getElementById('afterPost');
afterPost.style.display = "none";
function showMyPosts() {
    let usr = window.localStorage.getItem('user');
    let user = JSON.parse(usr)
    document.getElementById('myPosts').innerHTML = " ";
    document.getElementById('myPosts').style.display = "block";
    firebase.database().ref(`${'posts'}`).once('value', (e) => {
        let obj = e.val();
        for (var key in obj) {
            for (var key2 in obj[key]) {
                if (key2 === user.usrUid) {
                    for (var key3 in obj[key][key2]) {
                        if (obj[key][key2][key3].component.search(">Donate<") !== -1 || obj[key][key2][key3].component.search(">Receive<") !== -1) {
                            document.getElementById('myPosts').innerHTML += obj[key][key2][key3].component
                        }
                        else if (obj[key][key2][key3].component.search(">Donated<") !== -1 || obj[key][key2][key3].component.search(">Received<") !== -1) {
                            afterPost.style.display = "block";
                            document.getElementById('after').innerHTML += obj[key][key2][key3].component
                        }
                    }
                }
            }
        }
    })

}

function btn(ths) {
    var usr = window.localStorage.getItem('user');
    var user = JSON.parse(usr)
    var key = ths.getAttribute('key');

    if (ths.innerHTML === "Donate") {
        firebase.database().ref(`posts/${ths.innerHTML}/${user.usrUid}/${key}`).once("value", (e) => {
            let obj = e.val()
            var component = obj.component.replace(">Donate<", ">Donated<");
            obj.component = component
            obj.key = key

            firebase.database().ref(`posts/${ths.innerHTML}/${user.usrUid}/${key}`).set(obj)
        }).then((success) => {
            showMyPosts()
        })
    }
    else if (ths.innerHTML === "Donated") {
        swal({
            title: "Info",
            text: "You already donate blood from ths post",
            icon: "info",
            button: "OK",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
    }
    else if (ths.innerHTML === "Receive") {
        firebase.database().ref(`posts/${ths.innerHTML}/${user.usrUid}/${key}`).once("value", (e) => {
            let obj = e.val()
            var component = obj.component.replace(">Receive<", ">Received<");
            obj.component = component
            obj.key = key

            firebase.database().ref(`posts/${ths.innerHTML}/${user.usrUid}/${key}`).set(obj)
        }).then((success) => {
            showMyPosts()
        })

    }
    else if (ths.innerHTML === "Received") {
        swal({
            title: "Info",
            text: "You already receive blood from ths post",
            icon: "info",
            button: "OK",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
    }

}
function editImg() {
    document.getElementById('disp').style.display = "none"
    document.getElementById('imgUpld').style.display = "block"
}
function cancle() {
    document.getElementById('imgUpld').style.display = "none"
    document.getElementById('disp').style.display = "block"
}
function upload() {
    document.getElementById('loader').style.display = "block"
    document.getElementById('imgUpld').style.display = "none"
    let imgupldLbl = document.getElementById('imgupldLbl');
    let imgfile = document.getElementById('imgfile').files[0];
    if (imgfile === undefined) {
        document.getElementById('loader').style.display = "none"
        document.getElementById('imgUpld').style.display = "block"
        imgupldLbl.innerHTML = "Pleas upload Image then click upload button to process"
        imgupldLbl.style.display = "block"
    }
    else if (imgfile !== undefined) {

        document.getElementById('loader').style.display = "block"
        document.getElementById('imgUpld').style.display = "none"
        var usr = window.localStorage.getItem('user');
        var user = JSON.parse(usr)
        firebase.storage().ref(`profileImg/${user.usrUid}`).put(imgfile)
            .then((url) => {
                url.ref.getDownloadURL()
                    .then((urlRef) => {
                        user.ProfileImage = urlRef
                        window.localStorage.setItem('user', JSON.stringify(user))
                        firebase.database().ref(`users/${user.usrUid}`).set(user)
                            .then(() => {
                                document.getElementById('loader').style.display = "none"
                                document.getElementById('imgUpld').style.display = "block"
                                location.reload();
                            })
                    })
            })
    }

}
function hide() {
    document.getElementById('imgupldLbl').style.display = "none";
}