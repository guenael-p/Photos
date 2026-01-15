/* =====================
   STATE
===================== */

let currentPerson = null;

const MAX_PHOTOS = 12;

const photoCount = {
    A: 0,
    B: 0
};

const selectedImage = {
    A: null,
    B: null
};


/* =====================
   UPLOAD
===================== */

function openFile(person) {
    if (photoCount[person] >= MAX_PHOTOS) return;

    currentPerson = person;
    document.getElementById('fileInput').click();
}

function addImage(input) {
    if (!input.files || !currentPerson) return;

    const files = Array.from(input.files);

    files.forEach(file => {
        if (photoCount[currentPerson] >= MAX_PHOTOS) return;

        const div = document.createElement('div');
        div.classList.add('test');

        div.addEventListener('click', () => {
            selectImage(currentPerson, div);
        });

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);

        div.appendChild(img);
        document.getElementById('boxes' + currentPerson).appendChild(div);

        photoCount[currentPerson]++;
    });

    updateAddButton(currentPerson);
    input.value = "";
}

function updateAddButton(person) {
    const section = document.querySelector(
        `.person[data-person="${person}"]`
    );
    const addBtn = section.querySelector('.add');

    addBtn.classList.toggle(
        'disabled',
        photoCount[person] >= MAX_PHOTOS
    );
}


/* =====================
   SELECTION
===================== */

function selectImage(person, element) {
    const boxes = document.getElementById('boxes' + person);

    boxes.querySelectorAll('.test').forEach(img =>
        img.classList.remove('selected')
    );

    element.classList.add('selected');
    selectedImage[person] = element;
}


/* =====================
   ACTIONS
===================== */

function moveImage(person, direction) {
    const img = selectedImage[person];
    if (!img) return;

    const target = direction === -1
        ? img.previousElementSibling
        : img.nextElementSibling;

    if (!target) return;

    const parent = img.parentNode;

    if (direction === -1) {
        parent.insertBefore(img, target);
    } else {
        parent.insertBefore(target, img);
    }
}

function deleteImage(person) {
    const img = selectedImage[person];
    if (!img) return;

    img.remove();
    selectedImage[person] = null;

    photoCount[person]--;
    updateAddButton(person);
}


/* =====================
   COLOR
===================== */

function changeColor(person, color) {
    const section = document.querySelector(
        `.person[data-person="${person}"]`
    );

    section.style.backgroundColor = color;
}


/* =====================
   EXPORT
===================== */

function exportPerson(person) {
    const section = document.querySelector(
        `.person[data-person="${person}"]`
    );

    section.classList.add('exporting');

    html2canvas(section, {
        scale: 2
    }).then(canvas => {

        const link = document.createElement('a');
        link.download = `composition-${person}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        section.classList.remove('exporting');
    });
}
