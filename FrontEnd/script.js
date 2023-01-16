const gallery = document.querySelector('.gallery');
const filters = document.querySelector('.filters-container');
const vryBtn = document.querySelector('.btn');

async function showGallery() {
    await fetch ("http://localhost:5678/api/works")
        .then(res => res.json())
        .then(function(value) {
            const works = value;
            for (let i = 0; i < works.length; i++) {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');

            figure.setAttribute('id', works[i].category.id);
            img.src = works[i].imageUrl;
            img.setAttribute('crossorigin', 'anonymous');
            img.setAttribute('alt', works[i].title);
            figcaption.innerText = works[i].title;
            gallery.appendChild(figure);
            figure.append(img, figcaption);
            }
        })
        .catch(function(err) {
            // error
        })
};

showGallery();

async function setCategories() {
    await fetch("http://localhost:5678/api/categories")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            const categories = value;
            for (let i = 0; i < categories.length; i++) {
                let btn = document.createElement('button');
                btn.innerText = categories[i].name;
                btn.classList.add('btn');
                btn.setAttribute('id', categories[i].id);
                filters.appendChild(btn);
            };
        })
};

setCategories();

function getWorks() {
    fetch("http://localhost:5678/api/works")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            const works = value;
            const allWorks = works.filter(work => work.category.id == '1');
            const firstWorks = works.filter(work => work.category.id == '1');
            const secondWorks = works.filter(work => work.category.id == '1');
            const thirdWorks = works.filter(work => work.category.id == '1');
            let getBtnId = vryBtn.getAttribute('id');
            gallery.innerHTML = "";
            if (getBtnId === '0') {
                for (let i = 0; i < firstWorks.length; i++) {
                    const figure = document.createElement('figure');
                    const img = document.createElement('img');
                    const figcaption = document.createElement('figcaption');
                    img.src = firstWorks[i].imageUrl;
                    img.setAttribute('crossorigin', 'anonymous');
                    img.setAttribute('alt', firstWorks[i].title);
                    figcaption.innerText = firstWorks[i].title;
                    gallery.appendChild(figure);
                    figure.append(img, figcaption);
                }
            } else if (getBtnId === '1') {
                gallery.innerHTML = firstWorks;
            } else if (getBtnId === '2') {
                gallery.innerHTML = secondWorks;
            } else if (getBtnId === '3') {
                gallery.innerHTML = thirdWorks;
            }
        })
        .catch(function(err) {
        // Une erreur est survenue
        })
};

vryBtn.addEventListener('click', getWorks);

