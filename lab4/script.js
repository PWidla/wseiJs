const addNoteBtn = document.querySelector("#addNoteBtn");
const clearBtn = document.querySelector("#clearBtn");
const removeBtn = document.querySelector("#removeBtn");
const searchTagBtn = document.querySelector("#searchTagBtn");
const showAllBtn = document.querySelector("#showAllBtn");
const notesContainer = document.querySelector("#notesContainer");
const searchedTagInput = document.querySelector("#searchedTag");

const localStorageNotes = Object.entries(localStorage);

const title = document.querySelector("#title");
const content = document.querySelector("#content");
const colorPick = document.querySelector("#colorPick");
const isPinned = document.querySelector("#isPinned");
const tagElementInput = document.querySelector("#tagContainerDiv input");

window.addEventListener("load", initialNotesShow);

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
  constructor(title, content, colorPick, isPinned, tag, reminderDate) {
    this.title = title;
    this.content = content;
    this.colorPick = colorPick;
    this.isPinned = isPinned;
    this.date = new Date().toISOString();
    this.tag = tag;
    this.reminderDate = reminderDate;
  }
}

addNoteBtn.addEventListener("click", function (event) {
  event.preventDefault();

  if (validateForm()) {
    let lastId = parseInt(localStorage.getItem("lastId")) || 0;

    var newNote = new Note(
      title.value,
      content.value,
      colorPick.value,
      isPinned.checked
    );

    if (isPinned.checked === true) {
      window.localStorage.setItem(
        `pinnedNote${lastId}`,
        JSON.stringify(newNote)
      );
    } else {
      window.localStorage.setItem(`note${lastId}`, JSON.stringify(newNote));
    }

    localStorage.setItem("lastId", lastId + 1);

    const localStorageNotes = Object.entries(localStorage);
    showNotes(localStorageNotes);
  }
});

function showNotes(localStorageNotes) {
  notesContainer.innerHTML = "";

  const pinnedNotes = localStorageNotes.filter(([key, value]) =>
    key.startsWith("pinnedNote")
  );
  pinnedNotes.forEach(([key, value]) => {
    const noteData = JSON.parse(value);
    const noteElement = createNoteElement(
      key,
      noteData.title,
      noteData.content,
      noteData.colorPick,
      noteData.date,
      noteData.isPinned,
      noteData.tag,
      noteData.reminderDate
    );
    notesContainer.appendChild(noteElement);
  });

  localStorageNotes.forEach(([key, value]) => {
    if (key.startsWith("note")) {
      const noteData = JSON.parse(value);
      const noteElement = createNoteElement(
        key,
        noteData.title,
        noteData.content,
        noteData.colorPick,
        noteData.date,
        noteData.isPinned,
        noteData.tag,
        noteData.reminderDate
      );
      notesContainer.appendChild(noteElement);
    }
  });
}

function createNoteElement(
  id,
  title,
  content,
  colorPick,
  date,
  isPinned,
  tag,
  reminderDate = null
) {
  const noteElement = document.createElement("div");
  noteElement.classList.add("note");
  noteElement.dataset.noteId = id;

  const noteContent = document.createElement("div");
  noteContent.id = "noteContentDiv";

  const titleElement = document.createElement("h3");
  titleElement.textContent = title;

  const contentElement = document.createElement("p");
  contentElement.textContent = content;

  const dateElement = document.createElement("span");
  const formattedDate = new Date(date).toLocaleString();
  dateElement.textContent = "Created at: " + formattedDate;

  const reminderDateElement = document.createElement("div");
  reminderDateElement.textContent = "Reminder date";
  const reminderDateInput = document.createElement("input");
  reminderDateInput.type = "datetime-local";
  reminderDateInput.value = reminderDate;
  reminderDateElement.appendChild(reminderDateInput);
  noteElement.appendChild(reminderDateElement);

  const tagContainerDiv = document.createElement("div");
  tagContainerDiv.id = "tagContainerDiv";

  const tagElementSpan = document.createElement("span");
  tagElementSpan.textContent = "Tag";
  const tagElementInput = document.createElement("input");
  tagElementInput.type = "text";
  tagElementInput.value = tag || "";

  const checkboxSelectSpan = document.createElement("span");
  checkboxSelectSpan.textContent = "Select";
  const checkboxSelect = document.createElement("input");
  checkboxSelect.type = "checkbox";

  tagContainerDiv.appendChild(tagElementSpan);
  tagContainerDiv.appendChild(tagElementInput);

  if (isPinned) {
    const pinnedElement = document.createElement("span");
    pinnedElement.textContent = "Pinned";
    pinnedElement.classList.add("pinned");
    noteElement.appendChild(pinnedElement);
  }

  checkboxSelect.addEventListener("change", function () {
    noteElement.classList.toggle("selected", checkboxSelect.checked);
  });

  noteContent.appendChild(titleElement);
  noteContent.appendChild(contentElement);
  noteContent.appendChild(dateElement);
  noteElement.appendChild(noteContent);
  noteElement.appendChild(tagContainerDiv);
  noteElement.appendChild(checkboxSelectSpan);
  noteElement.appendChild(checkboxSelect);
  noteElement.appendChild(reminderDateElement);
  noteElement.appendChild(reminderDateInput);

  noteElement.style.backgroundColor = colorPick;

  tagElementInput.addEventListener("input", function () {
    saveTagToLocalStorage(tagElementInput, noteElement.dataset.noteId);
  });

  reminderDateInput.addEventListener("change", function () {
    saveDateToLocalStorage(reminderDateInput, noteElement.dataset.noteId);
  });

  return noteElement;
}

function saveTagToLocalStorage(tagElementInput, noteId) {
  const note = JSON.parse(localStorage.getItem(noteId));
  note.tag = tagElementInput.value;
  localStorage.setItem(noteId, JSON.stringify(note));
}

function saveDateToLocalStorage(reminderDateInput, noteId) {
  const note = JSON.parse(localStorage.getItem(noteId));
  note.reminderDate = reminderDateInput.value;
  localStorage.setItem(noteId, JSON.stringify(note));
  console.log(reminderDateInput.value);
  console.log(Object.entries(localStorage));
}

clearBtn.addEventListener("click", function () {
  notesContainer.innerHTML = "";
  window.localStorage.clear();
});

removeBtn.addEventListener("click", function () {
  const selectedNotes = document.querySelectorAll(".selected");
  selectedNotes.forEach((note) => {
    localStorage.removeItem(note.dataset.noteId);
  });

  const localStorageNotes = Object.entries(localStorage);
  showNotes(localStorageNotes);
});

searchTagBtn.addEventListener("click", function (event) {
  const localStorageNotes = Object.entries(localStorage);
  const taggedNotes = localStorageNotes.filter(([key, value]) =>
    doesContainTag(value)
  );
  showNotes(taggedNotes);
});

showAllBtn.addEventListener("click", initialNotesShow);

function doesContainTag(note) {
  const parsedNote = JSON.parse(note);
  const searchedTag = searchedTagInput.value.trim();

  if (searchedTag === "") {
    return parsedNote.tag === undefined || parsedNote.tag === "";
  }

  return parsedNote.tag !== undefined && parsedNote.tag.includes(searchedTag);
}

function initialNotesShow() {
  const localStorageNotes = Object.entries(localStorage);

  showNotes(localStorageNotes);
}
