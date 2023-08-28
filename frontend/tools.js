//Opening and closing tool bar
let optionsCont=document.querySelector(".options-cont");
let optionsOpen=false;
optionsCont.addEventListener("click",(e)=>{
    optionsOpen=!optionsOpen;
    if(optionsOpen)
    {
        openTools();
    }
    else
    {
        closeTools();   
    }
})
function openTools()
{
    let icon=optionsCont.querySelector("i");
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
    let toolBar=document.querySelector(".tool-bar");
    toolBar.classList.add("tool-bar-visible");
}
function closeTools()
{
    let icon=optionsCont.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
    let toolBar=document.querySelector(".tool-bar");
    toolBar.classList.remove("tool-bar-visible");
    closePenTools();
    penToolsOpen=false;
    closeEraserTools();
    eraserToolsOpen=false;
}
let penToolsOpen=false;
let eraserToolsOpen=false;
let pen=document.querySelector(".pen");
let eraser=document.querySelector(".eraser");
//Pen Tools
pen.addEventListener("click",(e)=>{
        penToolsOpen=!penToolsOpen;
        if(penToolsOpen) openPenTools();
        else closePenTools();
})
function openPenTools()
{
    closeEraserTools();
    eraserToolsOpen=false;
    let penTools=document.querySelector(".pen-tool-cont");
    penTools.classList.add("pen-eraser-tools-visible");
}
function closePenTools()
{
    let penTools=document.querySelector(".pen-tool-cont");
    penTools.classList.remove("pen-eraser-tools-visible");
}
//Eraser tools
eraser.addEventListener("click",(e)=>{
    eraserToolsOpen=!eraserToolsOpen;
    if(eraserToolsOpen) openEraserTools();
    else closeEraserTools();
})
function openEraserTools()
{
    closePenTools();
    penToolsOpen=false;
    let eraserTools=document.querySelector(".eraser-tool-cont");
    eraserTools.classList.add("pen-eraser-tools-visible");
}
function closeEraserTools()
{
    let eraserTools=document.querySelector(".eraser-tool-cont");
    eraserTools.classList.remove("pen-eraser-tools-visible");
}
//Adding image
let uploadBtn=document.querySelector(".add-image");
uploadBtn.addEventListener("click",(e)=>{
    let input=document.createElement("input");
    input.setAttribute("type","file");
    input.click();
    input.addEventListener("change",(e)=>{
        let image=input.files[0];
        if (image.type.startsWith("image/"))
        {
        let url=URL.createObjectURL(image);
            //Adding image into note
        let stickyNoteHTML=`
        <div class="sticky-header">
        <div class="sticky-minimize"><i class="fa-solid fa-minus"></i></div>
        <div class="sticky-remove"><i class="fa-solid fa-trash"></i></div>
        </div>
        <div class="sticky-text">
            <img src="${url}"/>
        </div>`;
        createStickyNote(stickyNoteHTML);
        }
        else
        {
            alert("You can only add images");
        } 
        })

})
//Sticky-Note creation
let stickynoteBtn=document.querySelector(".add-note");
stickynoteBtn.addEventListener("click",(e)=>{
    let stickyNoteHTML=`
    <div class="sticky-header">
    <div class="sticky-minimize"><i class="fa-solid fa-minus"></i></div>
    <div class="sticky-remove"><i class="fa-solid fa-trash"></i></div>
    </div>
    <div class="sticky-text">
        <textarea ></textarea>
    </div>`;
    createStickyNote(stickyNoteHTML);
})

function createStickyNote(stickyNoteHTML){
    let note=document.createElement("div");
    note.classList.add("sticky-note-cont");
    note.innerHTML=stickyNoteHTML;
    document.body.appendChild(note);
    let removeBtn=note.querySelector(".sticky-remove");
    let minimizeBtn=note.querySelector(".sticky-minimize");
    noteActions(note,removeBtn,minimizeBtn);
    note.onmousedown = function (event) {
        dragAndDrop(note, event);
    };

    note.ondragstart = function () {
        return false;
    };
}
function noteActions(note,remove,minimize)
{
    remove.addEventListener("click",(e)=>{
        note.remove();
    })
    minimize.addEventListener("click",(e)=>{
        let textCont=note.querySelector(".sticky-text");
        let isDisplayed=getComputedStyle(textCont).getPropertyValue("display");
        if(isDisplayed === "block")
        {
            textCont.classList.add("sticky-text-hidden");
        }
        else
        {
            textCont.classList.remove("sticky-text-hidden");      
        }

    })
}
function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}
