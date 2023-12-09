const addNoteBtn = document.querySelector("#addNoteBtn");
const clearBtn = document.querySelector("#clearBtn");
const removeBtn = document.querySelector("#removeBtn");
const searchTagBtn = document.querySelector("#searchTagBtn");
const showAllBtn = document.querySelector("#showAllBtn");
const notesContainer = document.querySelector("#notesContainer");
const searchedTagInput = document.querySelector("#searchedTag");
const closedTasksContainer = document.querySelector("#closedTasksContainer");
const closedTasksList = document.querySelector("#closedTasksList");

const title = document.querySelector("#title");
const content = document.querySelector("#content");
const colorPick = document.querySelector("#colorPick");
const isPinned = document.querySelector("#isPinned");
const tagElementInput = document.querySelector("#tagContainerDiv input");
const reminderDateInput = document.querySelector("#reminderDateElement input");

window.addEventListener("load", initialNotesShow);

function validateForm() {
  if (title.value.trim() === "") {
    alert("Title must be filled out");
    return false;
  }
  if (content.value.trim() === "") {
    alert("Content must be filled out");
    return false;
  }
  return true;
}

class Note {
  constructor(
    title,
    content,
    colorPick,
    isPinned,
    tag,
    reminderDate,
    listElements
  ) {
    this.title = title;
    this.content = content;
    this.colorPick = colorPick;
    this.isPinned = isPinned;
    this.date = new Date().toISOString();
    this.tag = tag || "";
    this.reminderDate = reminderDate;
    this.listElements = listElements || [];
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
      isPinned.checked,
      null,
      null
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
      noteData.reminderDate,
      noteData.listElements
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
        noteData.reminderDate,
        noteData.listElements
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
  reminderDate = null,
  listElements = null
) {
  const noteElement = document.createElement("div");
  noteElement.classList.add("note");
  noteElement.dataset.noteId = id;

  const noteContentElement = document.createElement("div");
  noteContentElement.id = "noteContentElement";

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
  reminderDateInput.value = reminderDate || "";
  reminderDateElement.appendChild(reminderDateInput);
  noteElement.appendChild(reminderDateElement);

  const tagContainerDiv = document.createElement("div");
  tagContainerDiv.id = "tagContainerDiv";

  const listContainerDiv = document.createElement("div");
  listContainerDiv.id = "listContainerDiv";

  const tagElementSpan = document.createElement("span");
  tagElementSpan.textContent = "Tag";
  const tagElementInput = document.createElement("input");
  tagElementInput.type = "text";
  tagElementInput.value = tag || "";

  const listElementSpan = document.createElement("span");
  listElementSpan.textContent = "List";
  const listElementInput = document.createElement("input");
  listElementInput.type = "text";
  listElementInput.value = tag || "";
  const listElementBtn = document.createElement("input");
  listElementBtn.type = "button";
  listElementBtn.value = "Add";
  const listElementUl = document.createElement("ul");
  listElementUl.id = "noteList";

  const checkboxSelectSpan = document.createElement("span");
  checkboxSelectSpan.textContent = "Select";
  const checkboxSelect = document.createElement("input");
  checkboxSelect.type = "checkbox";

  tagContainerDiv.appendChild(tagElementSpan);
  tagContainerDiv.appendChild(tagElementInput);
  listContainerDiv.appendChild(listElementInput);
  listContainerDiv.appendChild(listElementBtn);
  listContainerDiv.appendChild(document.createElement("br"));
  listContainerDiv.appendChild(listElementSpan);
  listContainerDiv.appendChild(document.createElement("br"));
  listContainerDiv.appendChild(listElementUl);

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
  noteContentElement.appendChild(noteContent);
  noteContentElement.appendChild(tagContainerDiv);
  noteContentElement.appendChild(listContainerDiv);
  noteContentElement.appendChild(checkboxSelectSpan);
  noteContentElement.appendChild(checkboxSelect);
  noteContentElement.appendChild(reminderDateElement);
  noteContentElement.appendChild(reminderDateInput);

  noteElement.appendChild(noteContentElement);
  noteElement.appendChild(listContainerDiv);
  noteElement.style.backgroundColor = colorPick;

  tagElementInput.addEventListener("input", function () {
    saveTagToLocalStorage(tagElementInput, noteElement.dataset.noteId);
  });

  reminderDateInput.addEventListener("change", function () {
    saveDateToLocalStorage(reminderDateInput, noteElement.dataset.noteId);
  });

  listElementBtn.addEventListener("click", function () {
    addElementToList(listElementInput.value, noteElement.dataset.noteId);
  });

  if (listElements && listElements.length > 0) {
    listElements.forEach((element) => {
      const listItem = document.createElement("li");
      listItem.textContent = element;
      listElementUl.appendChild(listItem);
    });
  }
  return noteElement;
}

function addElementToList(element, noteId) {
  const note = JSON.parse(localStorage.getItem(noteId));
  note.listElements.push(element);
  localStorage.setItem(noteId, JSON.stringify(note));

  const listElementUl = document.querySelector(
    `[data-note-id="${noteId}"] #noteList`
  );
  const listItem = document.createElement("li");
  listItem.textContent = element;
  listElementUl.appendChild(listItem);

  listItem.addEventListener("click", function () {
    closeTask(listItem, noteId);
  });
}

function closeTask(listItem, noteId) {
  const note = JSON.parse(localStorage.getItem(noteId));
  const elementText = listItem.textContent;

  note.listElements = note.listElements.filter(
    (element) => element !== elementText
  );
  localStorage.setItem(noteId, JSON.stringify(note));

  const closedTaskItem = document.createElement("li");
  closedTaskItem.textContent = elementText;
  closedTasksList.appendChild(closedTaskItem);

  listItem.remove();
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

  const currentDateTime = new Date().toISOString();
  if (currentDateTime >= reminderDateInput.value) {
    showNotification(note.title, note.content, noteId);
  }
}

function showNotification(title, content, noteId) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: content });

    const note = JSON.parse(localStorage.getItem(noteId));
    delete note.reminderDate;
    localStorage.setItem(noteId, JSON.stringify(note));
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, { body: content });

        const note = JSON.parse(localStorage.getItem(noteId));
        delete note.reminderDate;
        localStorage.setItem(noteId, JSON.stringify(note));
      }
    });
  }
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

function checkReminders() {
  const localStorageNotes = Object.entries(localStorage);
  localStorageNotes.forEach(([key, value]) => {
    const noteData = JSON.parse(value);
    const reminderDate = noteData.reminderDate;

    if (reminderDate) {
      const currentTimestamp = new Date().getTime();
      const reminderTimestamp = new Date(reminderDate).getTime();

      if (currentTimestamp >= reminderTimestamp) {
        showNotification(noteData.title, noteData.content, key);
        delete noteData.reminderDate;
        localStorage.setItem(key, JSON.stringify(noteData));
      }
    }
  });
}

checkReminders();

const now = new Date();
const secondsUntilNextMinute = 60 - now.getSeconds();
setInterval(checkReminders, secondsUntilNextMinute * 1000);
