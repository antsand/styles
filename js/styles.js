function submit() {
    var srcelement = event.srcElement; 
    console.log(srcelement);
    var hash = event.srcElement.getAttribute('data-hash'); 
    form_elements = document.querySelectorAll('[data-hash="' + hash + '"]');
    console.log(form_elements);
    if (form_elements.length) { 
        var input = form_elements[0].querySelectorAll('[data-input="input"]');
        console.log(input);
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
        form.innerHTML = "Thank you for subscribing. Check your mail or junk mail to see cofirmation";
        //var button = document.getElementById("button");
        //button.innerText = "Thank You!";
        //button.style.backgroundColor = "#af8c2f";
    }
  };
  xhttp.open("POST", "/form/submit", true);
  xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhttp.send(form);
}

