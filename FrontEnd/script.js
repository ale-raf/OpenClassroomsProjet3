const gallery = document.querySelector('.gallery');
const filters = document.querySelector('.filters-container');


// GET WORKS FROM SERVER
async function getWorks() {
    await fetch ("http://localhost:5678/api/works")
        .then(res => res.json())
        .then(showGallery)
        .then(btnEvent)
        .catch(function(err) {
            // Error
        })
};


// REVEAL GALLERY WITH FIGURE ELEMENTS
function showGallery(works) {
    /*works.filter(work => {
        if (work.category.id === 0) {
            return work;
        } else {
            return work.category.id;
        }
    })*/
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
async function getCategories() {
    await fetch("http://localhost:5678/api/categories")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(showCategories)
};


// REVEAL CATEGORIES AND CREATE BUTTONS IN THE DOM
function showCategories(categories) {
    let btn = document.createElement('button');
    btn.innerHTML = "Tous";
    btn.classList.add('btn');
    btn.setAttribute('id', 0);
    filters.appendChild(btn);
        for (let category of categories) {
            let btn = document.createElement('button');
            btn.innerHTML = category.name;
            btn.classList.add('btn');
            btn.setAttribute('id', category.id);
            filters.appendChild(btn);
        };
};


/*function btnEvent() {
    document.querySelectorAll(".btn")
        .forEach(btn => {
            btn.addEventListener('click', (e) => {
                
            });
        });
};*/


getWorks();
getCategories();