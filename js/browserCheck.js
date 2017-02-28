function checkBrowser(){
    
var ie = detectIE();
if ( ie ) {
    console.log( "IE Detected!!", ie );
    if(document.getElementById && !document.attachEvent){
            console.log('Browser: modern IE');
        } else{
            console.log('Browser: old IE browser');
            if( ie <= 10 ){
                // Old Browser, redirect the user
                var choice = confirm("This website may not work properly with your current browser. Please download a modern browser e.g. Chrome. Press OK to download Chrome or Press Cancel to continue anyways");

                if(choice == true){
                    window.location = "https://www.google.com/chrome/browser/desktop/index.html";
                }
            }
        }
    }

}

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}
