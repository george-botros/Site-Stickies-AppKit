if(window.top === window) {
    safari.self.addEventListener("message", createNewNote)
    safari.self.addEventListener("message", printToConsole)

    function printToConsole(event) {
        if (event.name == "printToConsole") {
            console.log(event.message)
        }
    }
    
    function createNewNote(event) {
        if (event.name == "toolbarItemClicked") {
            console.log("creating a new note 📝", event);
            var sticky = document.createElement("div");
            sticky.setAttribute("class", "sticky");
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
            console.log("noteupdateran")
            safari.extension.dispatchMessage("noteUpdate", {"content": sticky.innerHTML, "top": updatedPositionY, "left": updatedPositionX})
        }
    }
    
    window.addEventListener("DOMContentLoaded", (event) => {
        safari.extension.dispatchMessage("getCurrentNotes");
    })
    
            

}
