const gallery = document.querySelector('.gallery');
const filters = document.querySelector('.filters-container');
var works;


// GET WORKS FROM SERVER
async function getWorks() {
    const response = await fetch ("http://localhost:5678/api/works");
    works = await response.json();
    showGallery(works);
    return works;
};


// RESET GALLERY THEN REVEAL WORKS WITH FIGURE ELEMENTS
function showGallery(works) {
    gallery.innerHTML = "";
    for (let work of works) {
    let figure = document.createElement('figure');
    let img = document.createElement('img');
    let figcaption = document.createElement('figcaption');
    figure.setAttribute('id', work.category.id);
    img.src = work.imageUrl;
    img.setAttribute('alt', work.title);
    img.setAttribute('crossorigin', 'anonymous');
    figcaption.innerHTML = work.title;
    gallery.appendChild(figure);
    figure.append(img, figcaption);
    };
};


// GET CATEGORIES FROM SERVER
function getCategories(works) {
    fetch("http://localhost:5678/api/categories")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(showCategories);
};


// SORT AND REVEAL CATEGORIES BY CREATING BUTTONS
function showCategories(categories) {
    let btn = document.createElement('button');
    btn.innerHTML = "Tous";
    btn.classList.add('btn');
    btn.setAttribute('id', 0);
    btn.addEventListener("click", () => {
        showGallery(works);
    });
    filters.appendChild(btn);
    for (let category of categories) {
        let btn = document.createElement('button');
        btn.innerHTML = category.name;
        btn.classList.add('btn');
        btn.setAttribute('id', category.id);
        btn.addEventListener("click", () => {
            let sortWorks = works.filter(work => work.categoryId == category.id);
            showGallery(sortWorks);
        });
        filters.appendChild(btn);
    };
};

works = getWorks();
getCategories();

// GET TOKEN TO DISPLAY ADMINISTRATOR ACTIONS
const token = sessionStorage.getItem('token');
const modalBtn = document.querySelector('.modal-js');
function edit() {
        if (token !== null) {
        modalBtn.style.display = null;
        let login = document.querySelector("#login");
        login.innerHTML = "logout";
        login.classList.add('login-active');
    } else {
        modalBtn.style.display = "none";
        login.innerHTML = "login";
    }
}
edit();