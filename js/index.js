const eles = document.getElementsByClassName('full-screen');
for (let i = 0; i < eles.length; ++i) {
    eles[i].setAttribute("style","height:" + window.innerHeight + "px");
    eles[i].style.height = window.innerHeight + "px";
}
