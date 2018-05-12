function getUserInfo(){
    var retrievedObject = localStorage.getItem('userInfo');
    return  retrievedObject != null ? JSON.parse(retrievedObject) : null;
}

function logOutUser(){
    localStorage.clear();
    window.location.href = BASE_URL;
}

function showToaster(data, flag){
    var toaster = document.getElementById("toaster");
    toaster.className = "show";
    if(flag == 'success')
    toaster.style.backgroundColor = "#28db93";
    document.getElementById("toaster").innerHTML = data;
    setTimeout(function(){
        toaster.className = toaster.className.replace("show", ""); 
    }, 3000);
}

function getParameterValues(param) {  
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');  
    for (var i = 0; i < url.length; i++) {  
        var urlparam = url[i].split('=');  
        if (urlparam[0] == param) {  
            return urlparam[1];  
        }  
    }  
}