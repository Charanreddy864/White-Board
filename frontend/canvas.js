let canvas=document.querySelector("canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let penColors=document.querySelectorAll(".pen-color");
let penWidth=document.querySelector(".pen-width");
let eraserWidth=document.querySelector(".eraser-width");
let eraserColor="white";
let eraserSize="10";
let penColor="black";
let penSize="3";
let eraserElem=document.querySelector(".eraser");
let eraserActive=false;
let penElem=document.querySelector(".pen");
let download=document.querySelector(".download");
let undo=document.querySelector(".undo");
let redo=document.querySelector(".redo");


let canvasTracker=[];
// let url=canvas.toDataURL();
// canvasTracker.push(url);
track=0;


//Using the API
let mouseClicked=false;
let tool=canvas.getContext("2d");
tool.fillStyle="white";
tool.fillRect(0, 0, canvas.width, canvas.height);
tool.strokeStyle=penColor;
tool.lineWidth=penSize;

canvas.addEventListener("mousedown",(e)=>{
    mouseClicked=true;
    // beginpath({x:e.clientX,y:e.clientY});
    let data={x:e.clientX,u:e.clientY};
    socket.emit("beginpath",data);
    
})
canvas.addEventListener("mousemove",(e)=>{
    if(mouseClicked)
    {
        let data={
            x:e.clientX,y:e.clientY,
            color:eraserActive ? eraserColor : penColor,
            width:eraserActive ? eraserSize : penSize
        }
        socket.emit("drawstroke",data);

    }

})
function beginpath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}
function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}
canvas.addEventListener("mouseup",(e)=>{
    mouseClicked=false;
    let url=canvas.toDataURL();
    canvasTracker.push(url);
    track=canvasTracker.length;
    console.log(canvasTracker[track]);
})

penColors.forEach((color)=>{
    color.addEventListener("click",(e)=>{
        let colorName=color.classList[0];
        tool.strokeStyle=colorName;
        penColor=colorName;
    })
})

penWidth.addEventListener("change",(e)=>{
    tool.lineWidth=penWidth.value;
    penSize=penWidth.value;

})
eraserWidth.addEventListener("change",(e)=>{
    tool.lineWidth=eraserWidth.value;
    eraserSize=eraserWidth.value;
})
eraserElem.addEventListener("click",(e)=>{
    eraserActive=!eraserActive;
    if(eraserActive)
    {
        tool.lineWidth=eraserSize;
        tool.strokeStyle=eraserColor;
        eraserElem.classList.add("highlight");
        penElem.classList.remove("highlight");
    }
    else
    {
        tool.lineWidth=penSize;
        tool.strokeStyle=penColor;
        penElem.classList.add("highlight");
        eraserElem.classList.remove("highlight");
    }
})
penElem.addEventListener("click",(e)=>{
    tool.lineWidth=penSize;
    tool.strokeStyle=penColor;
    eraserActive=false;
    penElem.classList.add("highlight");
    eraserElem.classList.remove("highlight");

})
download.addEventListener("click",(e)=>{
    let url=canvas.toDataURL();
    let a=document.createElement("a");
    a.href=url;
    a.download="Board.jpg";
    a.click();
})
undo.addEventListener("click",(e)=>{
    if(track>0) track--;
    let data={
        trackValue:track,
        canvasTracker
    }
    socket.emit("performUndoRedo",data);
})
redo.addEventListener("click",(e)=>{
    if(track<canvasTracker.length-1) track++;
    let data={
        trackValue:track,
        canvasTracker
    }
    socket.emit("performUndoRedo",data);
})

function performUndoRedo(object)
{
    track=object.trackValue;
    canvasTracker=object.canvasTracker;
    let url=canvasTracker[track];
    let img=new Image();
    img.src=url;
    img.onload = (e) =>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}

socket.on("beginpath",(data)=>{
    beginpath(data);
})
socket.on("drawstroke",(data)=>{
    drawStroke(data);
})
socket.on("performUndoRedo",(data)=>{
    performUndoRedo(data);
})