carousel = 0;

function carousal_init_fn()   { 
    var carousal_container = document.getElementsByClassName('carousal-container');
    if (!carousal_container.length) {
        return;
    }   
    for(var i=0; i < carousal_container.length; i++) {
        var carousal_item_cont = carousal_container[i].getElementsByClassName('carousal-item-container');
        var item = carousal_item_cont[0].getElementsByClassName('carousal-item');
        carousal_item_cont[0].style.width = item.length + "00%";
        for(var j=0; j < item.length; j++) {
            item[j].style.width = 100/item.length + "%";
        }
    }
}

function carousal_fn(direction) {
    var carousal_container = document.getElementsByClassName('carousal-container');
    if (!carousal_container.length) {
        return;
    }   
    var carousal_item_cont = carousal_container[0].getElementsByClassName('carousal-item-container');
    if (!carousal_item_cont.length) {
        return;
    }   
    var item = carousal_item_cont[0].getElementsByClassName('carousal-item');
    if (!item.length) {
        return;
    }   
    var style =window.getComputedStyle(carousal_item_cont[0]);
    var matrix = new WebKitCSSMatrix(style.webkitTransform);
    var width = carousal_item_cont[0].clientWidth;
    var percent = ((matrix.m41/width) * 100);
    var transformX = 0;
    if (direction == "left") {
        carousel--;
        if (carousel < 0) {
            carousel = 0;
        }
        transformX = (-percent - (100/item.length));
        if (transformX < 0) {
            transformX = 0;
        }
        transformX = carousel * (100/item.length);
    }
    if (direction == "right") {
        carousel++;
        if (carousel >= item.length) {
            carousel = item.length-1;
        }
        transformX = (-percent + (100/item.length));
        if (transformX > (item.length - 1) * (100/item.length)) {
            transformX = -percent;
        }
        transformX = carousel * (100/item.length);
    }
    carousal_item_cont[0].style.transform = "translateX(" + -transformX + "%)";
}

function submit_antsand() {
    console.log(event);
    if (!event) {
        console.log('No event triggered');
        return;
    }
    var srcelement = event.srcElement; 
    console.log(srcelement);
    console.log('Event 1');
    var hash = event.srcElement.getAttribute('data-hash'); 
    form_elements = document.querySelectorAll('[data-hash="' + hash + '"]');
    console.log(form_elements);
    console.log('Event 2');
    if (form_elements.length) { 
        var input = form_elements[0].querySelectorAll('[data-input="input"]');
        console.log(input);
    console.log('Event 3');
        if (input.length) { 
            var forminput = []; 
            for (var i=0; i< input.length; i++) { 
                var formvalue = {}; 
                formvalue['name'] = input[i].getAttribute('data-name');
                formvalue['value'] = input[i].value; forminput.push(formvalue); 
            }
            console.log(forminput);
        } 
    } 
      var form  = new FormData();
      //var firstname = document.getElementById('sub_firstname');  
      //var lastname = document.getElementById('sub_lastname');  
      //var email = document.getElementById('sub_email'); 
      var hostname = document.location.hostname;
      var host = document.location.host;
      var origin = document.location.origin;
      var protocol = document.location.protocol;
      var port = document.location.port;
      var url = document.URL;
      var clientdate = window.Date();
      var clientinnerwidth = window.innerWidth;
      var clientinnerheight = window.innerHeight;
      var clientouterwidth = window.outerWidth;
      var clientouterheight = window.outerHeight;
      var secure = window.isSecureContext;

    /*  if (!firstname.value &&
          !lastname.value &&
          !email.value) {
        return;
      } */
      //form.append("firstname", firstname.value);
      form.append("forminputs", JSON.stringify(forminput));
      //form.append("lastname", lastname.value);
      //form.append("email", email.value);
      form.append("hash", hash);
      form.append("hostname", hostname);
      form.append("host", host);
      form.append("origin", origin);
      form.append("protocol", protocol);
      form.append("port", port);
      form.append("url", url);
      form.append("clientdate", clientdate);
      form.append("clientinnerwidth", clientinnerwidth);
      form.append("clientinnerheight", clientinnerheight);
      form.append("clientouterwidth", clientouterwidth);
      form.append("clientouterheight", clientouterheight);
      form.append("secure", secure);
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
            var form = document.getElementById(hash);
            if (this.response) {
                form.innerHTML = this.response;
            } else {
                form.innerHTML = "Thank you for your interest in BLKBOXGYM. We will get in touch with you shortly.";
            }
            scroll_bottom(hash);
            //var button = document.getElementById("button");
            //button.innerText = "Thank You!";
            //button.style.backgroundColor = "#af8c2f";
        }
      };
      xhttp.open("POST", "https://www.antsand.ca/forms/api/post/", true);
      xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhttp.send(form);
}

function scroll_fn() {
    var doc = document.getElementsByTagName('html')[0];
    if(doc.scrollTop > 55) {
        scroll_fixed();
    } else {
        scroll_not_fixed();
    }
}


function scroll_fixed() {
 var header = document.getElementsByClassName("nav-header");
 if (header.length) {
    if (header[0].clientWidth > 600) {
       header[0].style.position="fixed"; 
       header[0].style.top="0px"; 
       header[0].style.zIndex="99";
       header[0].style.boxShadow="0 2px 5px 0 rgba(0,0,0,0.1)";
       var hero =document.getElementsByClassName('hero');
       if (hero.length) {
        hero[0].style.marginTop = "55px"; 
       }
    }
 }
}

function scroll_not_fixed() {
 var header = document.getElementsByClassName("nav-header");
 if (header.length) {
    if (header[0].clientWidth > 600) {
       header[0].style.position=""; 
       var hero = document.getElementsByClassName('hero');
       if (hero.length) {
        hero[0].style.marginTop = ""; 
       }
    }
 }
}

function nav_toggle() {
    //event.srcEleemnt.style.display = "none";
    document.getElementById('nav_bar');
    if (document.getElementById('mobile_nav_menu').style.display == 'none' || !(document.getElementById('mobile_nav_menu').style.display) ) {
        document.getElementById('mobile_nav_menu').style.display = 'block';
    } else {
        document.getElementById('mobile_nav_menu').style.display = 'none';
    }
}

function show_menu(id) {
    //event.preventDefault();
    console.log(event);
    var id = document.getElementById(id);
    if (!id) {
        return;
    }
    if (id.classList.contains('display-none-sm-minidesktop')) {
        event.srcElement.parentElement.getElementsByTagName('img')[0].style.transform = "rotate(180deg)";
        id.classList.remove("display-none-sm-minidesktop");
        id.classList.add("display-block-sm-minidesktop");
    } else if (id.classList.contains("display-block-sm-minidesktop")) {
        event.srcElement.parentElement.getElementsByTagName('img')[0].style.transform = "rotate(0deg)";
        id.classList.remove("display-block-sm-minidesktop");
        id.classList.add("display-none-sm-minidesktop");
    }
}

function resizefn() {
    var review_span = document.getElementsByClassName('review_span');
    var slideshow_container =  document.getElementsByClassName('review_slideshow_container');
    var testimonial =  document.getElementsByClassName('testimonial_written');
    var review_dots =  document.getElementsByClassName('review_dots');
    if (review_span.length) {
        if (slideshow_container.length) {
            slideshow_container[0].style.width = review_span[0].clientWidth* testimonial.length  + 'px';
            console.log(testimonial);
            for (var i=0; i < testimonial.length; i++) {
                if (i==0) {
                   review_dots[i].className = "bg-white inline-block review_dots cursor-pointer";
                } else {
                   review_dots[i].className = "bg-grey inline-block review_dots cursor-pointer";
                }
                testimonial[i].style.width =  review_span[0].clientWidth + "px";
            }
        }
    }
    carousal_init_fn();
}

function change_testimonial(index) {
    var review_span = document.getElementsByClassName('review_span');
    var slideshow_container =  document.getElementsByClassName('review_slideshow_container');
    var testimonial =  document.getElementsByClassName('testimonial_written');
    var review_dots =  document.getElementsByClassName('review_dots');
    slideshow_container[0].style.transform = "translate(-" + review_span[0].clientWidth*index   + 'px)';
    for (var i=0; i < review_dots.length; i++) {
        if (i == index) {
           review_dots[i].className = "bg-white inline-block review_dots cursor-pointer";
        } else {
           review_dots[i].className = "bg-grey inline-block review_dots cursor-pointer";
        }
    }
}

function scroll_bottom(id) {
    var elmnt = document.getElementById(id);
    if (elmnt) {
        elmnt.scrollIntoView();
        document.getElementById('mobile_nav_menu').style.display = 'none';
    }
}

window.onload=function() {
    window.addEventListener('scroll', scroll_fn);
    window.addEventListener("resize", resizefn);
    carousal_init_fn();
    resizefn();
}
