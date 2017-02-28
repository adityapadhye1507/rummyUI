var svgns = "http://www.w3.org/2000/svg";

// initialize the game board
$(document).ready(function(){
    // Checking for authcode, if not present, asking user to login again
    var gameId = localStorage.getItem("gameId");
    if(gameId != null){
        getChats();
        // To call the function repeatedly
        window.setInterval(getChats, 5000);
        
        initTable();
        
        window.setInterval(checkTurn, 2000);
        window.setInterval(checkWinner, 2000);
        
        $( "#modal" ).dialog({
        closeOnEscape: false,
        title: "Game Rules",
        autoOpen: false,
        modal: true,
        closeText: "hide",
        buttons: [{
          text: "Close Dialog",
          click: function() {
            $( this ).dialog( "close" );
          }
        }]
    });
        
    }else{
        //redirect the user to waiting room if they without logging in
        redirectToWaiting();
    }
});

//populate rules for the game
var rules = function(){
    var x = "<div>";
    x += "<h2>Game Rules</h2>";
    x += "<p>To win the game, following conditions should be met:</p>";
    x += "<ul>";
    x += "<li>Form a pure sequence of 7 cards</li>";
    x += "<li>Form two pure sequence of 4 cards and 3 cards</li>";
    x += "<li>Form one pure sequence of 4 cards and one sequence of 3 of a kind</li>";
    x += "</ul>";
    x += "<p>Pure Sequence: Cards of same suit, in a sequence</p>";
    x += "<p>Three of a kind: Cards of different suits with same card value</p>";
    x += "</div>";
    
    $( "#modal" ).html(x);
    $( "#modal" ).dialog( "open" );
}

//get all the chat messages for the game
var getChats = function(){    
    var params = {};
    params.url = "chat/getMessages";
    params.code = localStorage.getItem("authCode");
    params.gameId = localStorage.getItem("gameId");
    params.callback = getChatsCallback;
    params.data = "";
    
    ajaxGameCall(params);    
}

var getChatsCallback = function(data, success){
    if(data.code == 1){
        var chats = JSON.parse(data.message);
        var text = "";
        var i;
        for(i=0; i<chats.players.length; i++){
            text += chats.players[i] + "\n";
        }
        $("#textArea").html(text);
    }
}

//send a message to server
var sendMessage = function(){
    var message = $("#messageArea")[0].value;
    if( message != "" ){
        var URL = "http://127.0.0.1:8080/Rummy/";
        var params = {};

        params.url = "chat/sendMessage";
        params.code = localStorage.getItem("authCode");
        params.gameId = localStorage.getItem("gameId");
        params.callback = sendMessageCallback;
        params.data = {"message" : message};

        ajaxGameCall(params);
    }
}

var sendMessageCallback = function(data, success){
    //console.dir(data);
    $("#messageArea")[0].value = "";
}

//get the card in hand for the player
var getPlayerHand = function(){
    var params = {};
    params.url = "game/getPlayerHand";
    params.code = localStorage.getItem("authCode");
    params.gameId = localStorage.getItem("gameId");
    params.callback = getPlayerHandCallback;
    params.data = "";
    
    ajaxGameCall(params);  
}

var getPlayerHandCallback = function(data, success){
    //console.dir(data);
    if(data.code == 1){
        var object = JSON.parse(data.message);
        var x = 300;
        var y = 375;
        $( "#hand" ).html( "" );
        $(object.hand).each(function(i){
            makeCard(object.hand[i], x, y);
            x += 50;
        });
    }else{
        console.log("Error getting player hand!!");
    }
}

//get the top card of the pile
var getTopCard = function(){
    var params = {};
    params.url = "game/getTopCard";
    params.code = localStorage.getItem("authCode");
    params.gameId = localStorage.getItem("gameId");
    params.callback = getTopCardCallback;
    params.data = "";
    
    ajaxGameCall(params);  
}

var getTopCardCallback = function(data, success){
    //console.dir(data);
    if(data.code == 1){
      
      var path = "/~Aditya/Rummy/images/cards/" + data.message + ".png";
      var card = document.createElementNS( svgns, "image" );
      card.setAttribute( "href", path );
      card.setAttribute( "width", "75");
      card.setAttribute( "height", "75");
      card.setAttribute( "x", "500");
      card.setAttribute( "y", "250");
      card.setAttribute( "class", "clickable");
      card.setAttribute( "onmousedown", "drawPile()");
      $( "#topCard" ).html( card.outerHTML );
      
    }else{
        console.log("Error getting top card!!");
    }
}

//Initialize the table and draw cards on the table
var initTable = function(){
    document.getElementsByTagName( "svg" )[0]
                    .addEventListener( "mousemove", mouseMoveEvtListener, false );
    document.getElementsByTagName( "svg" )[0]
            .addEventListener( "mouseup", mouseUpEvtListener, false );
    
    getPlayerHand();
    getTopCard();
}

var redirectToWaiting = function(){
    window.location = "waitingRoom.html";
}

//create svg cards in hand
function makeCard(cardId, x, y) {
      var path = "/~Aditya/Rummy/images/cards/" + cardId + ".png";
      var card = document.createElementNS( svgns, "image" );
      card.setAttribute( "href", path );
      card.setAttribute( "width", "75");
      card.setAttribute( "height", "75");
      card.setAttribute( "x", x );
      card.setAttribute( "y", y );
      card.setAttribute( "id", cardId );
      card.setAttribute( "class", "clickable");
      card.setAttribute( "transform", "matrix(1 0 0 1 0 0)" );
      card.setAttribute( "onmousedown" , "setMove(" + cardId + ")" );
      document.getElementById( "hand" ).appendChild( card );
}

//throw a card from the hand
var throwCard = function(cardId){
    console.log("throwing card!!", cardId);
    
    var card = {"cardId" : cardId};
    
    var params = {};
    params.url = "game/throwCard";
    params.code = localStorage.getItem("authCode");
    params.gameId = localStorage.getItem("gameId");
    params.callback = throwCardCallback;
    params.data = card;
    
    ajaxGameCall(params); 
}

var throwCardCallback = function(data, success){
    if(data.code == 0){
        alert(data.message);
        initTable();
    }
    if(data.code == 1){
        initTable();
    }
    if(data.code == 2){
        alert(data.message);
        redirectToWaiting();
    }
}

//draw a card from the deck
var drawDeck = function(){
    console.log("Drawing card from deck!!");
    
    var params = {};
    params.url = "game/drawDeck";
    params.code = localStorage.getItem("authCode");
    params.gameId = localStorage.getItem("gameId");
    params.callback = drawDeckCallback;
    params.data = "";
    
    ajaxGameCall(params);  
    
}

var drawDeckCallback = function(data, success){
    if(data.code == 0){
        alert(data.message);
    }else{
        initTable();
    }
}


//draw a card from the pile
var drawPile = function(){
    console.log("Drawing card from pile!!");
    
    var params = {};
    params.url = "game/drawPile";
    params.code = localStorage.getItem("authCode");
    params.gameId = localStorage.getItem("gameId");
    params.callback = drawPileCallback;
    params.data = "";
    
    ajaxGameCall(params); 
}

var drawPileCallback = function(data, success){
    if(data.code == 0){
        //$("#gameMsg").html(data.message);
        alert(data.message);
    }else{
        initTable();
    }
}

//check for user's turn to play
var checkTurn = function(){
    console.log("Checking for your turn!!");
    
    var params = {};
    params.url = "game/checkTurn";
    params.code = localStorage.getItem("authCode");
    params.gameId = localStorage.getItem("gameId");
    params.callback = checkTurnCallback;
    params.data = "";
    
    ajaxGameCall(params); 
}

var checkTurnCallback = function(data, success){
    if(data.code == 0){
        console.log(data.message);
        $("#gameMsg").html("Opponents Turn");
    }else{
        console.log(data.message);
        $("#gameMsg").html("Your Turn");
        initTable();
    }
}

//check if the game has a winner yet
var checkWinner = function(){
    console.log("Checking for your turn!!");
    
    var params = {};
    params.url = "game/getWinner";
    params.code = localStorage.getItem("authCode");
    params.gameId = localStorage.getItem("gameId");
    params.callback = checkWinnerCallback;
    params.data = "";
    
    ajaxGameCall(params); 
}

var checkWinnerCallback = function(data, success){
    if(data.code == 1){
        alert(data.message);
        logout();
    }
}

//logout and send the user to waiting room
var logout = function(){
    console.log("Logging out!!");
    
    var params = {};
    params.url = "game/logout";
    params.code = localStorage.getItem("authCode");
    params.gameId = localStorage.getItem("gameId");
    params.callback = logoutCallback;
    params.data = "";
    
    ajaxGameCall(params); 
}

var logoutCallback = function(data, success){
    if(data.code == 1){
        localStorage.setItem("gameId", "");
        redirectToWaiting();
    }
}

/*********************************************Code to move the cards***************************************/
var moverId, myX, myY;

function checkHit( x, y ){
    console.dir(x);
    console.dir(y);
    if(x>=450 && x<=550){
        if(y>=200 && y<=300){
            return true;
        }
    }
}

function setMove( evt ){
    //check if hand has 8 cards
    
    moverId = evt.getAttribute( "id" );
    console.log("moverId:", moverId);
    var ele = document.getElementById(moverId);

    myX = parseInt(ele.getAttribute( "x"));
    myY = parseInt(ele.getAttribute( "y"));

    console.log( "myX:", myX, "myY:", myY, "\n");
}

/*
* this is called every mouse move on the doc
* if we are dragging something, move it
*/	
function mouseMoveEvtListener( evt ){
    if( moverId ){
        var moverEle = document.getElementById( moverId );

        //actually move the piece
        moverEle.setAttribute( "width", "100" );
        moverEle.setAttribute( "height", "100" );
        moverEle.setAttribute( "x", evt.clientX );
        moverEle.setAttribute( "y", evt.clientY );
    }
}

// clear the id of dragging object
function mouseUpEvtListener( evt ){
    if(moverId){
        var curX = parseInt(document.getElementById( moverId )
                            .getAttribute( "x" )),
            curY = parseInt(document.getElementById( moverId )
                            .getAttribute( "y" )),
            hit  = checkHit( curX, curY );

        if( hit ){
            var moverEle = document.getElementById( moverId );
            moverEle.setAttribute( "width", "75" );
            moverEle.setAttribute( "height", "75" );
            moverEle.setAttribute( "x", "500" );
            moverEle.setAttribute( "y", "250" );
            throwCard( moverId );
            moverId = undefined;
        } else{
            // if not on a pile
            var moverEle = document.getElementById( moverId );
            moverEle.setAttribute( "width", "75" );
            moverEle.setAttribute( "height", "75" );
            moverEle.setAttribute( "x", myX );
            moverEle.setAttribute( "y", myY );
            moverId = undefined;
        }
    }
}