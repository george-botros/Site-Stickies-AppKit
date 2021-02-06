if(window.top === window) {
    safari.self.addEventListener("message", createNewNote)

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
            sticky.style.left = (rect.left + amountMouseMovedX) + "px";
            sticky.style.top = (rect.top + amountMouseMovedY) + "px";
            originalMouseX = e.clientX
            originalMouseY = e.clientY
        }
    }
}
