if(window.top === window) {
    safari.self.addEventListener("message", createNewNote)

    function createNewNote(event) {
                if (event.name == "toolbarItemClicked") {
                    console.log("creating a new note 📝", event)
                    var stickycontainer = document.createElement("div");
                    stickycontainer.setAttribute("class", "sticky-container")
                    document.body.appendChild(stickycontainer);
                    
                        var stickyouter = document.createElement("div");
                        stickyouter.setAttribute("class", "sticky-outer")
                        stickycontainer.appendChild(stickyouter)

                            var sticky = document.createElement("div")
                            sticky.setAttribute("class", "sticky")
                            stickyouter.appendChild(sticky)
                    
                                var stickycontent = document.createElement("div")
                                stickycontent.setAttribute("class", "sticky-content")
                                stickycontent.setAttribute("contenteditable", "true")
                                stickycontent.innerHTML = "New note 📝"
                                sticky.appendChild(stickycontent)
                }
            }
}
