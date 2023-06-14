function login() {
    const form = document.querySelector('#form');
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let user = {
            email : e.target.querySelector('#email').value,
            password : e.target.querySelector('#password').value,
        };
        fetch("http://localhost:5678/api/users/login", {
            method : 'POST',
            headers : {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                    },
            body : JSON.stringify(user)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    alert("Les informations renseignées sont incorrectes");
                }
            })
            .then(value => {
                sessionStorage.setItem("token", value.token);
                window.location.href = "index.html";
            })
            .catch(err => console.log(err))
    });
};

login();