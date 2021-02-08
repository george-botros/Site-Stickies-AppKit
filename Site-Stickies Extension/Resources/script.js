if(window.top === window) {
    safari.self.addEventListener("message", createNewNote)
    safari.self.addEventListener("message", printToConsole)
    safari.self.addEventListener("message", notesFromStorageReceiver)
    
    window.addEventListener("DOMContentLoaded", (event) => {
        safari.extension.dispatchMessage("getCurrentNotes");
    })
}

function printToConsole(event) {
    if (event.name == "printToConsole") {
        console.log(event.message)
    }
}

function createNewNote(event) {
    if (event.name == "toolbarItemClicked") {
        console.log("creating a new note 📝", event);
        var sticky = document.createElement("div");
        sticky.setAttribute("class", "sticky-shockerella");
        sticky.setAttribute("contenteditable", "true");
        document.body.appendChild(sticky);
        sticky.innerHTML = "New note 📝";
        sticky.onmousedown = noteClicked;
    }
}


function noteClicked(clickEvent) {
    let sticky = clickEvent.target;
    let originalMouseX = clickEvent.clientX
    let originalMouseY = clickEvent.clientY

    window.onmousemove = matchPosition;

    window.onmouseup = function() {
        window.onmousemove = null
    }

    function matchPosition(e) {
        let amountMouseMovedX = e.clientX - originalMouseX
        let amountMouseMovedY = e.clientY - originalMouseY
        const rect = sticky.getBoundingClientRect()
        var updatedPositionX  = rect.left + amountMouseMovedX;
        var updatedPositionY = rect.top + amountMouseMovedY;
        
        sticky.style.left = (updatedPositionX) + "px";
        sticky.style.top = (updatedPositionY) + "px";
        originalMouseX = e.clientX
        originalMouseY = e.clientY
        getAllNotesOnPageAndPassToExtension()
    }
}

function getAllNotesOnPageAndPassToExtension() {
    let notes = document.querySelectorAll('.sticky-shockerella')
    let listOfNotes = {}
    notes.forEach((note, index) => {
        listOfNotes[index.toString()] = [note.innerHTML, Math.floor(note.getBoundingClientRect().left), Math.floor(note.getBoundingClientRect().top)]
    })
    console.log(listOfNotes)
    safari.extension.dispatchMessage("noteUpdate", listOfNotes)
}

function notesFromStorageReceiver(event) { //assign properties received from "notesFromStorage" to a variable, noteProperties which will be passed to a function that will recreate the former notes.
    if (event.name == "notesFromStorage"){
        let noteProperties = event.message;
        createNotesFromProperties(noteProperties);
    }

}

function createNotesFromProperties(noteProperties) {
    
    // {0: ["New note 📝", 1120, 100], 1: ["t", 1120, 100], 2: ["", 1065, 120]}
    //  #    content     left(x) top(y)
    console.log("Entered the createnotesfromproperties function");
    var index = 0;
    for (note in noteProperties) {
        console.log("creating a new note FROM PROPERTIES 📝");
        var sticky = document.createElement("div");
        sticky.setAttribute("class", "sticky-shockerella");
        sticky.setAttribute("contenteditable", "true");
        document.body.appendChild(sticky);
        sticky.onmousedown = noteClicked;
        
        sticky.innerHTML = noteProperties[`${index}`][0];
        sticky.style.left = noteProperties[`${index}`][1] + "px";
        console.log("noteproperties numkeys: noteProperties[`${index}`][0]");
        console.log("wdfkdslf");
        sticky.style.top = noteProperties[`${index}`][2] + "px";
        index = index + 1;
    }
        
}
