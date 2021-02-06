if(window.top === window) {
    safari.self.addEventListener("message", createNewNote)

    function createNewNote(event) {
                if (event.name == "toolbarItemClicked") {
                    console.log("creating a new note 📝", event);
                    var sticky = document.createElement("div");
                    sticky.setAttribute("class", "sticky");
                    //sticky.setAttribute("contenteditable", "true");
                    document.body.appendChild(sticky);
                    sticky.innerHTML = "New note 📝";
                    sticky.onmousedown = matchPosition;
                    console.log("just added a function to run when mouse goes down on sticky")
                    
            }
    }
    
    
    function matchPosition(e) {
        console.log("hi")
        //event.target.setAttribute("currentlyClicked", "true");
        sticky = e.target;

        
        sticky.onmousemove = elementDrag;
        sticky.onmouseup = function() {
            sticky.onmousemove = null;
        }
    }
    
    function elementDrag(dragevent) {
        sticky = dragevent.target;
        divX = sticky.getBoundingClientRect().left;
        divY = sticky.getBoundingClientRect().top;
        mouseX = dragevent.clientX;
        mouseY = dragevent.clientY;
        
        offsetX = mouseX - divX;
        offsetY = mouseY - divY;
        
        sticky.style.left = (mouseX - offsetX) + "px";
        console.log(sticky.style.left)
        sticky.style.top = (mouseY - offsetY) + "px";
        console.log("divX & divY", divX, divY, "mouseX, mouseY", mouseX, mouseY);
        console.log(typeof divX,typeof divY, typeof mouseX, typeof mouseY, typeof offsetX, typeof offsetY);
    }
}
