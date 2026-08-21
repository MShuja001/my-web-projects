let hamnav = document.querySelector(".hamnav")
let img = document.querySelector(".hamburg img")
document.querySelector(".hamburg").addEventListener("click", ()=>{
    if(hamnav.style.right=="-215px"){
    hamnav.style.right="0";
    img.src="./assets/cross.svg"
}
else{
    hamnav.style.right="-215px";
    img.src="./assets/hamburger.svg"
    }
})