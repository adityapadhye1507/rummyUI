var match = false;
var URL = "http://127.0.0.1:8080/Rummy/";

var registerCallback = function(data, success){
    if(data.code==0){
        $("#registerMsg").html(data.message);
    } else{
        localStorage.setItem("authCode", data.message);
        window.location = "index.html";
    }
}

function register(){
    if(!match){
        return;
    }
    console.log("Can register user now!!");
    
    var username = $("#usernamesignup")[0].value;
    var password = $("#passwordsignup")[0].value;
    var details  = $("#emailsignup")[0].value;
    
    //console.dir($("#usernamesignup"));
    
    var user = {
                "username": username,
                "password": password,
                "details": details
            };
    
    console.log(JSON.stringify(user));
    
    $.ajax({
            type: "POST", //default
            async: true, //default
            cache: false,//default
            url  : URL + "registration/register",
            data : JSON.stringify(user),
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            dataType: "json", //default to the content type of response
            success: registerCallback
        });
}

$(document).ready(function(){
    $("#passwordsignup_confirm").keyup(function(){
        console.log("checking passwords");
        var password = $("#passwordsignup").val();
        var confirmPassword = $("#passwordsignup_confirm").val();
        match = false;
        if (password !== confirmPassword){
            $("#registerMsg").html("Passwords do not match!");
            match = false;
        } else{
            $("#registerMsg").html("");
            match = true;
        }
    });
});