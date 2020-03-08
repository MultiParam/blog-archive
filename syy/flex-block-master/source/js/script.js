window.addEventListener("load", function() {
    const navBtn = document.querySelector(".header-navbar-btn");

    // mobile nav click
    navBtn.addEventListener("click", function() {
        this.classList.toggle("active");
    });
    var weixin_logo = document.getElementsByClassName('weixin_logo')[0];

    weixin_logo.onmouseover = function() {
        var qrLogoPc = document.getElementsByClassName('qr_logo_pc')[0];
        qrLogoPc.style.display = 'block';
    };


    weixin_logo.onmouseout = function() {
        // alert(222);
        var qrLogoPc = document.getElementsByClassName('qr_logo_pc')[0];

        qrLogoPc.style.display = 'none';
    };
})