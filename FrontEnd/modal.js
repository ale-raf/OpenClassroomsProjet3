const modalGallery = document.querySelector('.modal-works');
var validTitle = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
var works;
let modal = null;


const openModalWindow = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.setAttribute('aria-hidden', false);
    target.setAttribute('aria-modal', true);
    modal = target;
    modal.addEventListener('click', closeModalWindow);
    modal.querySelector('.modal-close-js').addEventListener('click', closeModalWindow);
    modal.querySelector('#modal-add').addEventListener('click', switchModalWindow);
    modal.querySelector('.back-modal').addEventListener('click', switchModalWindow);
    modal.querySelector('.modal-stop').addEventListener('click', focusModal);
    document.querySelector('#modal-valid').setAttribute('disabled', "");
    document.querySelector('#file').value = null;
    document.querySelector('#add-work-title').value = null;
    document.querySelector('#add-work-category').value = "";
    document.querySelector('.modal-add-img').style.display = null;
    document.querySelector('.modal-add-img-2').style.display = "none";
}

const closeModalWindow = function (e) {
    if (modal === null) return
    e.preventDefault();
    window.setTimeout(function() {
        modal.style.display = "none";
        modal = null;
    }, 600);
    modal.setAttribute('aria-hidden', true);
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModalWindow);
    modal.querySelector('.modal-close-js').removeEventListener('click', closeModalWindow);
    modal.querySelector('.modal-stop').removeEventListener('click', focusModal);
}



// On aperçoit la transition se faire mais la modale disparait sans vraiment se fermer
// const switchModalWindow = function (e) {
//     e.preventDefault();
//     const firstModal = document.querySelector('#modal-1');
//     const secondModal = document.querySelector('#modal-2');
//     if (firstModal.style.display == "none" && secondModal.style.display == null) {
//         secondModal.style.display = "none";
//         firstModal.style.display = null;
//     } else {
//         firstModal.style.display = "none";
//         secondModal.style.display = null;
//     }
// }



const focusModal = function (e) {
    e.stopPropagation();
}

document.querySelectorAll('.modal-js').forEach(a => {
    a.addEventListener('click', openModalWindow);
})


window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModalWindow(e);
    }
})


// GET WORKS FROM SERVER
async function getModalWorks() {   
    const response = await fetch ("http://localhost:5678/api/works");
    works = await response.json();
    showModalGallery(works);
    sendWork();
    return works;
};


// RESET GALLERY THEN REVEAL WORKS WITH FIGURE ELEMENTS
function showModalGallery(works) {
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
                    } else {
                        alert("Vous devez être authentifié pour supprimer ce travail")
                    }
                })
                .then(value => {
                    console.log(value);
                })
                .catch(err => console.log(err))
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
            } else {
                alert("Vous devez être authentifié pour effectuer cette opération")
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
        let image = e.target.querySelector('#file');
        let title = e.target.querySelector('#add-work-title').value;
        let category = e.target.querySelector('#add-work-category').value;
        if (title === "" || validTitle.test(title) == false || image.files === "" || category === "") {
            alert("Veuillez vérifier les champs renseignés");
        } else {
            const formData = new FormData()
            formData.append('image', image.files[0])
            formData.append('title', title);
            formData.append('category', category);
            fetch("http://localhost:5678/api/works", {
            method : 'POST',
            headers : {
                    'Authorization' : 'Bearer ' + token
                    },
            body : formData
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    alert("Veuillez vérifier les champs renseignés");
                }
            })
            .then(value => {
                console.log(value);
            })
            .catch(err => console.log(err))
        }
    });
};


works = getModalWorks();