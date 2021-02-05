if(window.top === window) {
    safari.self.addEventListener("message", createNewNote)

    function createNewNote(event) {
                if (event.name == "toolbarItemClicked") {
                    console.log("creating a new note 📝", event)
                    var sticky = document.createElement("div");
                    sticky.setAttribute("class", "sticky")
                    sticky.setAttribute("contenteditable", "true")
                    document.body.appendChild(sticky);
                    sticky.innerHTML = "New note 📝"
            }
    }
}
