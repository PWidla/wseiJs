const addNoteBtn = document.querySelector('#addNoteBtn');
const clearBtn = document.querySelector('#clearBtn');
const notesContainer = document.querySelector('#notesContainer');
const localStorageNotes = Object.entries(localStorage);

const title = document.querySelector('#title');
const content = document.querySelector("#content");
const colorPick = document.querySelector("#colorPick");
const isPinned = document.querySelector("#isPinned");

window.addEventListener("load", function () {
    const localStorageNotes = Object.entries(localStorage);

    if(localStorageNotes.length>0){
        showNotes(localStorageNotes);
    }
});

function validateForm() {
    if (title.value.trim() === "") {
        alert("Title must be filled out");
        return false;
    }
    if (content.value.trim() === "") {
        alert("Title must be filled out");
        return false;
    }
    return true;
}

class Note {
    constructor(title, content, colorPick, isPinned) {
        this.title = title;
        this.content = content;
        this.colorPick = colorPick;
        this.isPinned = isPinned;
        this.date = new Date().toISOString()
    }
}

addNoteBtn.addEventListener("click", function (event) {
    event.preventDefault(); 

    if (validateForm()) {
        let lastId = parseInt(localStorage.getItem('lastId')) || 0;

        var newNote = new Note(title.value, content.value, colorPick.value, isPinned.checked);
        
        if (isPinned.checked === true){
            window.localStorage.setItem(`pinnedNote${lastId}`, JSON.stringify(newNote));
        } else {
            window.localStorage.setItem(`note${lastId}`, JSON.stringify(newNote));
        }

        localStorage.setItem('lastId', lastId + 1);

        const localStorageNotes = Object.entries(localStorage);
        showNotes(localStorageNotes);
        console.log(localStorageNotes);
    }
});

clearBtn.addEventListener("click", function(event){
    notesContainer.innerHTML = '';
    window.localStorage.clear();
})

function showNotes(localStorageNotes){
    notesContainer.innerHTML = '';

    const pinnedNotes = localStorageNotes.filter(([key, value]) => key.startsWith('pinnedNote'));
    pinnedNotes.forEach(([key, value]) => {
        const noteData = JSON.parse(value);
        const noteElement = createNoteElement(noteData.title, noteData.content, noteData.colorPick, noteData.date, noteData.isPinned);
        notesContainer.appendChild(noteElement); 
    });

    localStorageNotes.forEach(([key, value]) => {
        if (key.startsWith('note')) {
            const noteData = JSON.parse(value);
            const noteElement = createNoteElement(noteData.title, noteData.content, noteData.colorPick, noteData.date, noteData.isPinned);
            notesContainer.appendChild(noteElement); 
        }
    });
}

function createNoteElement(title, content, colorPick, date, isPinned) {
    const noteElement  = document.createElement('div');
    noteElement.classList.add('note');

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const contentElement = document.createElement('p');
    contentElement.textContent = content;

    const dateElement = document.createElement('span');
    dateElement.textContent = date;

    if (isPinned) {
        const pinnedElement = document.createElement('span');
        pinnedElement.textContent = 'Pinned';        
        pinnedElement.classList.add('pinned');
        noteElement.appendChild(pinnedElement);
    }

    noteElement.appendChild(titleElement);
    noteElement.appendChild(contentElement);
    noteElement.appendChild(dateElement);

    noteElement.style.backgroundColor = colorPick;
    return noteElement ;
}