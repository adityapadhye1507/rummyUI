var ajaxCall = function(params){
    var URL = "http://127.0.0.1:8080/Rummy/";
    $.ajax({
            type: "POST",
            async: true,
            cache: false,
            url  : URL + params.url,
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'AuthToken' : params.code
            },
            success: params.callback
        });
}

var ajaxDataCall = function(params){
    var URL = "http://127.0.0.1:8080/Rummy/";
    $.ajax({
            type: "POST",
            async: true,
            cache: false,
            url  : URL + params.url,
            data : JSON.stringify(params.data),
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'AuthToken' : params.code
            },
            success: params.callback
        });
}

var ajaxGameCall = function(params){
    var URL = "http://127.0.0.1:8080/Rummy/";
    $.ajax({
            type: "POST",
            async: true,
            cache: false,
            url  : URL + params.url,
            data : JSON.stringify(params.data),
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'AuthToken' :   params.code,
                'GameId'    :   params.gameId
            },
            success: params.callback
        });
}