var URL = "http://127.0.0.1:8080/Rummy/";
var scan = true;

$(document).ready(function(){
    // Checking for authcode, if not present, asking user to login again
    var authCode = localStorage.getItem("authCode");
    if(authCode != null){
        //if authcode is present in localstorage, get the players and scan for any incoming request
        getPlayers();
        getRequest();
        window.setInterval(getPlayers,5000);
        window.setInterval(getRequest,5000);
    }else{
        redirectToLogin();
    }
    
    // Setting onclick listener to every row of table
    $('#waitList').delegate('tr', 'click' , function(){
        var user = $(this)[0].textContent;
        requestPlayer(user);
    });
        
    $( "#modal" ).dialog({
        closeOnEscape: false,
        title: "Requesting Player...",
        autoOpen: false,
        modal: true,
        closeText: "hide",
        close: cancelRequest,
        buttons: [{
          text: "Cancel Request",
          click: function() {
            $( this ).dialog( "close" );
          }
        }]
    });

    $( "#modal2" ).dialog({
        closeOnEscape: false,
        title: "Please respond...",
        autoOpen: false,
        modal: true,
        closeText: "hide",
        close: rejectRequest,
        buttons: [{
          text: "Accept Request",
          click: acceptRequest
        }]
    });
});

//Ask to Redirect user to login if not already logged in
var redirectToLogin = function(){
    $("#roomMsg").html("Please click <a href='index.html'>here</a> to login!");
    console.log("Please login before coming here!");
}

//get the players in waiting room
var getPlayers = function(){
    console.log("calling getPlayers");
    var code = localStorage.getItem("authCode");
    var players = "";
    $.ajax({
            type: "POST", //default
            async: true, //default
            cache: false,//default
            url  : URL + "room/getPlayers",
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'AuthToken' : code
            },
            success: getPlayersCallback
        });
}

var getPlayersCallback = function(data, success){
    
    if(data.code==0){
        $("#roomMsg").html(data.message);
        console.log(data);
    } else{
        
    $("#roomMsg").html("");
        
    var list = JSON.parse(data.message);
    
    var $tbody = $('#waitList > tbody');
    console.dir(list);
    
    // Remove existing players from tbody
    $tbody.html("");
    
    // Append players to the tbody
    $(list.players).each(function( i ){
        $tbody.append("<tr><td>" + list.players[i] + "</td></tr>");
    });
    }
    
}


//check if anyone requested to play
var getRequest = function(){
    console.log("calling getRequest");
    
    var params = {};
    var recieverName = localStorage.getItem("username");
    
    params.code = localStorage.getItem("authCode");
    params.data = {
                "reciever" : recieverName
              };
    
    params.url = "room/getRequest";
    params.callback = getRequestCallback;
    //console.dir(params);
    ajaxDataCall(params);
}
var getRequestCallback = function(data, success){
    if(data.code == 1){
        var msg = "Player <span id='sender'>" + data.message + "</span> wants to start a game";
        scan = false;
        $( "#modal2" ).html(msg);
        //$( "#modal" ).html("data.message");
        $( "#modal2" ).dialog( "open" );
    }
}

// request a user to play the game
var requestPlayer = function(username){
    console.log("Requesting player:", username);
    
    var params = {};
    var senderName = localStorage.getItem("username");
    
    params.code = localStorage.getItem("authCode");
    params.data = { 
                "sender": senderName,
                "reciever" : username
              };
    
    params.url = "room/requestPlayer";
    params.callback = requestPlayerCallback;
    //console.dir(params);
    ajaxDataCall(params);
}
var requestPlayerCallback = function(data, success){
    console.log("inside requestPlayerCallback");
    scan = false;
    //alert() modal
    if(data.code == 1){
        $( "#modal" ).html(data.message);
        //$( "#modal" ).html("data.message");
        $( "#modal" ).dialog( "open" );
        waitAcceptance();
    }else{
       console.log("error requesting player");
    }
}

// cancel the request
var cancelRequestCallback = function(data, success){
    if(data.code == 1){
        console.log("Request Cancelled Successfully!!");
    }else{
        console.log("Error cancelling request!!");
    }
}

var cancelRequest = function(){
    console.log("Cancelling the request!!");
    var params = {};
    var senderName = localStorage.getItem("username");
    
    params.code = localStorage.getItem("authCode");
    params.data = {"sender": senderName};
    
    params.url = "room/cancelRequest";
    params.callback = cancelRequestCallback;
    //console.dir(params);
    ajaxDataCall(params);
}

//accept the request to play
var acceptRequestCallback = function(data, success){
    if(data.code == 1){
        localStorage.setItem("gameId", data.message);
        window.location = "game.html";
    }else{
        console.log("request could not be accepted!")
    }
}

var acceptRequest = function(){
    //$( this ).dialog( "close" );
    
    console.log("Accepting the request!!");
    var params = {};
    var recieverName = localStorage.getItem("username");
    
    params.code = localStorage.getItem("authCode");
    params.data = {"reciever": recieverName};
    
    params.url = "room/acceptRequest";
    params.callback = acceptRequestCallback;
    //console.dir(params);
    ajaxDataCall(params);
}

//reject the request
var rejectRequest = function(){
    
    console.log("Rejecting the request!!");
    var params = {};
    var senderName = $("#sender")[0].innerHTML;
    
    params.code = localStorage.getItem("authCode");
    params.data = {"sender": senderName};
    
    params.url = "room/cancelRequest";
    params.callback = cancelRequestCallback;
    //console.dir(params);
    ajaxDataCall(params);
    $( "modal2" ).dialog( "close" );
}

//wait for the request to be accepted
var waitAcceptanceCallback = function(data, success){
    if(data.code == 1){
        localStorage.setItem("gameId", data.message);
        window.location = "game.html";
    }if(data.code == 2){
        $( "#modal" ).dialog( "close" );
        console.log(data.message);
    }
    else{
        //console.log("request could not be accepted!");
        console.log(data.message);
    }
}

var waitAcceptance = function(){
    // check if a game id is allocated
    console.log("Waiting for acceptance of the request!!");
    var params = {};
    var senderName = localStorage.getItem("username");
    
    params.code = localStorage.getItem("authCode");
    params.data = {"sender": senderName};
    
    params.url = "room/checkStatus";
    params.callback = waitAcceptanceCallback;
    //console.dir(params);
    ajaxDataCall(params);
    window.setTimeout(waitAcceptance, 2000);
}

//logout the user and send them to index page
var logout = function(){
    console.log("Logging out!!");
    
    var params = {};
    params.url = "room/logout";
    params.code = localStorage.getItem("authCode");
    params.callback = logoutCallback;
    params.data = "";
    
    ajaxGameCall(params); 
}

var logoutCallback = function(data, success){
    if(data.code == 1){
        localStorage.setItem("authCode", "");
        localStorage.setItem("gameId", "");
        localStorage.setItem("userId", "");
        window.location = "index.html";
    }
}