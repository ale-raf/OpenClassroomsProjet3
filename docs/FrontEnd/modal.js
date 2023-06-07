const modalGallery = document.querySelector('.modal-works');
var validTitle = /^[^123456789@&()!_$*€£`+=\/;?#]+$/;
var works;


// DISPLAY MODALS AND SWITCH BETWEEN THEY
window.onload = () => {
    const modalBtn = document.querySelectorAll('[data-toggle=modal]');
    for (let btn of modalBtn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            let target = this.dataset.target;
            let modal = document.querySelector(target);
            modal.classList.add('modal-active');
            modal.setAttribute('aria-hidden', 'false');
            if (target == "#modal-2") {
                let previousModal = document.querySelector("#modal-1");
                previousModal.classList.remove('modal-active');
                previousModal.setAttribute('aria-hidden', 'true');
            };
            document.querySelectorAll('.modal-close-js').forEach(close => {
                close.addEventListener('click', () => {
                    modal.classList.remove('modal-active');
                    modal.setAttribute('aria-hidden', 'true');
                })
            });
            modal.addEventListener('click', function() {
                if (modal === document.querySelector('#modal-1')) {
                    this.classList.remove('modal-active');
                    this.setAttribute('aria-hidden', 'true');
                } else {
                    document.querySelectorAll('.modal').forEach(mod => {
                        mod.classList.remove('modal-active');
                        mod.setAttribute('aria-hidden', 'true');
                    });
                }
            });
            modal.children[0].addEventListener('click', function(e) {
                e.stopPropagation();
            });
            window.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' || e.key === 'Esc') {
                    modal.classList.remove('modal-active');
                    modal.setAttribute('aria-hidden', 'true');
                }
            });
            if (modal === document.querySelector('#modal-2')) {
                modal.querySelector('#file').value = null;
                modal.querySelector('#add-work-title').value = null;
                modal.querySelector('#add-work-category').value = "";
                modal.querySelector('#modal-valid').setAttribute('disabled', true);
                modal.querySelector('.modal-add-img').style.display = null;
                modal.querySelector('.modal-add-img-2').style.display = "none";
            }
        });
    };
}


// GET MODAL WORKS FROM SERVER
async function getModalWorks() {   
    const response = await fetch ("http://localhost:5678/api/works");
    works = await response.json();
    showModalGallery(works);
    return works;
};

works = getModalWorks();

// RESET MODAL GALLERY THEN REVEAL WORKS WITH FIGURE ELEMENTS
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
        for (let work of works) {
            fetch(`http://localhost:5678/api/works/${work.id}`, {
            method : 'DELETE',
            headers : {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json',
                    'Authorization' : 'Bearer ' + token
                    },
            body : null
            })
            .then(value => {
                getWorks();
                getModalWorks();
            })
            .catch(err => console.log(err))
        }
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