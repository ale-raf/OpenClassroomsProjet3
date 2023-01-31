var modalGallery = document.querySelector('.modal-works');
var validTitle = /^[^123456789@&()!_$*€£`+=\/;?#]+$/;
var works;


document.querySelector('[data-toggle=modal]').addEventListener('click', (e) => {
    e.preventDefault();
    createFirstModal();
    document.querySelector('.close-modal').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('aside').classList.add('modal');
    });
});

function createFirstModal() {
    const modalContainer = document.querySelector('#modal-windows');
    const modal = document.createElement('aside');
    modal.setAttribute('id', "modal-1");
    modal.setAttribute('role', 'dialog');
    modal.classList.add('modal');
    modal.innerHTML = `<div class="modal-container modal-stop">
        <div class="modal-close-container-1">
            <button class="close-modal modal-close-js"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <h1 id="modal-title">Galerie photo</h1>
        <div class="modal-works"></div>
        <div class="modal-breakline"></div>
        <a href="#" class="modal-js" data-target="#modal-2" data-toggle="modal"><button id="modal-add">Ajouter une photo</button></a>
        <p id="modal-delete">Supprimer la galerie</p>
    </div>`
    modalContainer.appendChild(modal);
};


function createSecondModal() {
    const modalContainer = document.querySelector('#modal-windows');
    const modal = document.createElement('aside');
    modal.setAttribute('id', "modal-2");
    modal.setAttribute('role', 'dialog');
    modal.classList.add('modal');
    modal.innerHTML = `<div class="modal-container modal-stop">
    <div class="modal-close-container-2">
        <a href="#" class="modal-js" data-target="#modal-1" data-toggle="modal"><button class="back-modal modal-close-js"><i class="fa-solid fa-arrow-left"></i></button></a>
        <button class="close-modal modal-close-js"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <h1 id="modal-title">Ajout photo</h1>
    <form class="modal-form" method="post">
        <div class="modal-add-img">
            <i class="fa-regular fa-image"></i>
            <label for="file">+ Ajouter photo</label>
            <input name="file" type="file" id="file" accept="image/*">
            <p>jpg, png : 4mo max</p>
        </div>
        <div class="modal-add-img-2" style="display:none">
            <img id="modal-preview-img">
        </div>
        <label for="add-work-title">Titre</label>
        <input type="text" name="add-work-title" id="add-work-title">
        <label for="add-work-category">Catégorie</label>
        <select name="add-work-category" id="add-work-category">
            <option value=""></option>
            <option value="1">Objets</option>
            <option value="2">Appartements</option>
            <option value="3">Hotels & restaurants</option>
        </select>
        <div class="modal-breakline"></div>
        <div class="submit-container">
            <input type="submit" id="modal-valid" value="Valider">
        </div>
    </form>
</div>`
    modalContainer.appendChild(modal);
};



// GET WORKS FROM SERVER
async function getModalWorks() {   
    const response = await fetch ("http://localhost:5678/api/works");
    works = await response.json();
    showModalGallery(works);
    return works;
};

works = getModalWorks();

// RESET GALLERY THEN REVEAL WORKS WITH FIGURE ELEMENTS
function showModalGallery(works) {
    modalGallery.innerHTML = "";
    for (let work of works) {
        let figure = document.createElement('figure');
        let img = document.createElement('img');
        let figcaption = document.createElement('figcaption');
        let btn1 = document.createElement('button');
        let btn2 = document.createElement('button');
        figure.setAttribute('id', work.category.id);
        figure.classList.add('figure-works');
        btn1.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
        btn2.innerHTML = `<i class="fa-solid fa-up-down-left-right"></i>`;
        btn1.classList.add('modal-works-btn1');
        btn2.classList.add('modal-works-btn2');
        img.src = work.imageUrl;
        img.setAttribute('alt', work.title);
        img.setAttribute('crossorigin', 'anonymous');
        figcaption.innerText = "éditer";
        figcaption.style.textAlign = "left";
        modalGallery.appendChild(figure);
        figure.append(btn1, btn2, img, figcaption);

        // DELETE CHOSEN WORK
        btn1.addEventListener("click", () => {
            let id = work.id;
            if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
                fetch(`http://localhost:5678/api/works/${id}`, {
                method : 'DELETE',
                headers : {
                        'Accept' : 'application/json',
                        'Content-Type' : 'application/json',
                        'Authorization' : 'Bearer ' + token
                        },
                body : null
                })
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then(value => {
                    getWorks();
                    getModalWorks();
                })
                .catch(err => console.log(err));
            }
        });
    }
}


// DELETE ALL WORKS
const deleteGalleryBtn = document.querySelector('#modal-delete');
deleteGalleryBtn.addEventListener("click", () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer l'ensemble des projets ?")) {
        fetch("http://localhost:5678/api/works", {
        method : 'DELETE',
        headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + token
                },
        body : null
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(value => {
            console.log(value);
        })
        .catch(err => console.log(err))
    }
});


// PREVIEW PHOTO BEFORE POSTING IT
const input = document.getElementById('file');
const previewPhoto = () => {
    const file = input.files; 
    if (file) {
        const fileReader = new FileReader();
        const preview = document.getElementById('modal-preview-img');
        fileReader.onload = function (event) {
            preview.setAttribute('src', event.target.result);
        }
        fileReader.readAsDataURL(file[0]);
        document.querySelector('.modal-add-img').style.display = "none";
        document.querySelector('.modal-add-img-2').style.display = null;
    }
}
input.addEventListener("change", previewPhoto);


// ACTIVE FORM BUTTON IF EVERY INPUT IS CHECKED
const form = document.querySelector('.modal-form');
const formBtn = document.querySelector('#modal-valid');
formBtn.setAttribute('disabled', true);
form.addEventListener('change', enableFormBtn);
function enableFormBtn() {
    if (document.querySelector('#file').value === "" || document.querySelector('#add-work-title').value === "" || document.querySelector('#add-work-category').value === "") {
        formBtn.setAttribute('disabled', true);
    } else {
        formBtn.removeAttribute('disabled');
    }
}


// DOWNLOAD NEW WORK
function sendWork() {
    const form = document.querySelector('.modal-form');
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let image = e.target.querySelector('#file').files[0];
        let title = e.target.querySelector('#add-work-title').value;
        let category = e.target.querySelector('#add-work-category').value;
        if (image === "" || title === "" || validTitle.test(title) == false || category === "") {
            alert("Veuillez vérifier les champs renseignés");
        } else {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('title', title);
            formData.append('category', category);
            fetch("http://localhost:5678/api/works", {
            method : 'POST',
            headers : {
                'Accept' : 'application/json', 
                'Authorization' : 'Bearer ' + token
            },
            body : formData
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    alert("Une erreur s'est produite");
                }
            })
            .then(value => {
                let currentModal = document.querySelector("#modal-2");
                currentModal.classList.remove('modal-active');
                getWorks();
                getModalWorks();
                let nextModal = document.querySelector("#modal-1");
                nextModal.classList.add('modal-active');
            })
            .catch(err => console.log(err));
        }
    });
};

sendWork();

