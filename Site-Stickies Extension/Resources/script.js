if(window.top === window) {
    safari.self.addEventListener("message", createNewNote)
    safari.self.addEventListener("message", printToConsole)
    safari.self.addEventListener("message", createNotesFromProperties)

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
            safari.extension.dispatchMessage("getCurrentNotes");
        }
    }
    
    window.addEventListener("DOMContentLoaded", (event) => {
        safari.extension.dispatchMessage("getCurrentNotes");
    })

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

function createNotesFromProperties(event) {
    if (event.name == "notesFromStorage") {
        /** add code here to take data like this {0: ["New note 📝", 119, 852], 1: ["New note 📝", 152, 649]} and create a note from it. You'll probably want to edit the createNewNote function, which currently will only run in response to the toolbar being clicked, to do it.*/
    }
}
