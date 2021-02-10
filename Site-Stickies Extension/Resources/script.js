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
        newNote();
        //sticky.style.background = "rgb(174, 198, 207)";
    }
}

function newNote() {
    var stickyContainer = document.createElement("div");
    document.body.appendChild(stickyContainer);
    stickyContainer.setAttribute("class", "sticky-container");
    stickyContainer.style.top = 100 + window.scrollY + "px";
    stickyContainer.onmousedown = noteClicked;
    
    var sticky = document.createElement("div");
    sticky.setAttribute("class", "sticky-shockerella");
    sticky.setAttribute("contenteditable", "plaintext-only");
    sticky.setAttribute("placeh","New note 📝");
    stickyContainer.appendChild(sticky);
    sticky.onkeyup = getAllNotesOnPageAndPassToExtension;
    sticky.addEventListener("onmousedown", function(event) {
        event.stopPropagation();
        noteClicked;
    })

    
    var closeButton = document.createElement("div");
    stickyContainer.appendChild(closeButton);
    closeButton.innerHTML = "⨯";
    closeButton.setAttribute("class", "closeButton")
    closeButton.onmousedown = function() {
        stickyContainer.remove();
        getAllNotesOnPageAndPassToExtension();
    }
    
    return stickyContainer;
}

function noteClicked(clickEvent) {
    var sticky = clickEvent.target;
    var originalMouseX = clickEvent.clientX
    var originalMouseY = clickEvent.clientY
    var rect = sticky.getBoundingClientRect();
    var offsetX = originalMouseX - rect.left; //Offset is positive.
    var offsetY = originalMouseY - rect.top;
    

    window.onmousemove = matchPosition;

    window.onmouseup = function() {
        window.onmousemove = null
    }

    function matchPosition(e) {
        updatedPositionX = e.clientX + window.scrollX - offsetX;
        updatedPositionY = e.clientY + window.scrollY - offsetY;
        
        sticky.style.left = (updatedPositionX) + "px";
        sticky.style.top = (updatedPositionY) + "px";
        
        getAllNotesOnPageAndPassToExtension()
    }
}

function getAllNotesOnPageAndPassToExtension() {
    let notes = document.querySelectorAll('.sticky-container')
    let listOfNotes = {}
    notes.forEach((note, index) => {
        listOfNotes[index.toString()] = [note.innerHTML, Math.floor(note.getBoundingClientRect().left + window.scrollX), Math.floor(note.getBoundingClientRect().top + window.scrollY)]
    })
    safari.extension.dispatchMessage("noteUpdate", listOfNotes)
}
//weird stuff happens when respawning + cmd+a

function notesFromStorageReceiver(event) { //assign properties received from "notesFromStorage" to a variable, noteProperties which will be passed to a function that will recreate the former notes.
    if (event.name == "notesFromStorage"){
        let noteProperties = event.message;
        createNotesFromProperties(noteProperties);
    }

}

function createNotesFromProperties(noteProperties) {
    
    // {0: ["New note 📝", 1120, 100], 1: ["t", 1120, 100], 2: ["", 1065, 120]}
    //  #    content     left(x) top(y)
    var index = 0;
    for (note in noteProperties) {
        stickyContainer = newNote();
        
        stickyContainer.firstChild.innerHTML = noteProperties[`${index}`][0];
        stickyContainer.style.left = noteProperties[`${index}`][1] + "px";
        stickyContainer.style.top = noteProperties[`${index}`][2] + "px";
        index = index + 1;
    }
        
}

/*
 Test on https://www.harvardmocktrial.org/results
 */
