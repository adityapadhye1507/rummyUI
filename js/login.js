var loginCallback = function(data, success){
    if(data.code==0){
        $("#loginMsg").html(data.message);
    } else{
        localStorage.setItem("authCode", data.message);
        window.location = "waitingRoom.html";
    }
}

//login the user
function login(){
    var username = $("#username")[0].value;
    var password = $("#password")[0].value;
        
    var user = {
                "username": username,
                "password": password
            };
    
    localStorage.setItem("username", username);
    $.ajax({
            type: "POST", //default
            async: true, //default
            cache: false,//default
            url  : URL + "login",
            data : JSON.stringify(user),
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            dataType: "json", //default to the content type of response
            success: loginCallback
        });
}

