const modalGallery = document.querySelector('.modal-works');
const deleteGallery = document.querySelector('#modal-delete');
const modalBtn = document.querySelector('.modal-js');
const token = localStorage.getItem('token');
var works;
let modal = null;

// function editWorks() {
//     if (token) {
//         modalBtn.style.display = null
//     } else {
//         modalBtn.style.display = "none"
//     }
// }

// editWorks();


const openModalWindow = function (e) {
    e.preventDefault();
    // const firstModal = document.querySelector('.modal-js');
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.setAttribute('aria-hidden', false);
    target.setAttribute('aria-modal', true);
    modal = target;
    modal.addEventListener('click', closeModalWindow);
    modal.querySelector('.modal-close-js').addEventListener('click', closeModalWindow);
    modal.querySelector('.modal-stop').addEventListener('click', focusModal);
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

const focusModal = function (e) {
    e.stopPropagation();
}

document.querySelectorAll('.modal-js').forEach(a => {
    a.addEventListener('click', openModalWindow);
});

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

        // DELETE WORK
        btn1.addEventListener("click", () => {
            let id = work.id;
            console.log(id);
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

works = getModalWorks();

// // deleteGallery.addEventListener('click', () => {
// //     modalGallery.innerHTML = "";
// // })


// DOWNLOAD NEW WORK
// function sendWork() {
//     const form = document.querySelector('.modal-form');
//     form.addEventListener("submit", (e) => {
//         e.preventDefault();
//         let work = {
//             image : e.target.querySelector('#file').value,
//             title : e.target.querySelector('#add-work-title').value,
//             category : e.target.querySelector('#add-work-category').value
//         };
//         // const formData = new formData();
//         // formData.append('work', work[0])
//         fetch("http://localhost:5678/api/works", {
//             method : 'POST',
//             headers : {
//                     'Accept' : 'application/json',
//                     'Content-Type' : 'application/json',
//                     'Authorization' : `Bearer ${+ token} `
//                     },
//             body : JSON.stringify(work)
//         })
//             .then(res => {
//                 if (res.ok) {
//                     return res.json();
//                 } else {
//                     alert("Veuillez vérifier les champs renseignés");
//                 }
//             })
//             .then(value => {
//                 window.localStorage.setItem('image', value.imageUrl);
//                 window.localStorage.setItem('title', value.title);
//                 window.localStorage.setItem('category', value.category.name);
//             })
//             .catch(err => console.log(err))
//     });
// };

// sendWork();

