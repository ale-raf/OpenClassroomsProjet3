const form = document.querySelector('#form');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const one = new FormData(form);
    const two = new URLSearchParams(one);
    fetch("http://localhost:5678/api/users/login", {
        method : 'POST',
        body : one,
        headers : {
                'Content-Type': 'application/json'
                }
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => alert('error'))
});

