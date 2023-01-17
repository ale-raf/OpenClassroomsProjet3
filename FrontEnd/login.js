let user = {
    email : "",
    password : ""
};

let response = await fetch("http://localhost:5678/api/users/login", {
    method : 'POST',
    headers : {
        'Content-type': 'application/json;charset=utf-8'
    },
    body : JSON.stringify(user)
});

let result = await response.json();