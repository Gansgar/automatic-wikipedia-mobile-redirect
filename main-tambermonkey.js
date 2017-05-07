// ==UserScript==
// @name         Wikipedia redirection
// @namespace    http://your.homepage/
// @version      0.1
// @description  Redirect from PC Wikipedia to mobile wikipedia
// @author       You
// @include      /https://.{2,4}\.wikipedia\.org/wiki/*/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

var url = window.location.href;
var n = url.search(/\.wikipedia/i);
var modifiedURL = url.substr(0,n) + ".m" + url.substr(n);

var addVal = "Diskussion:";
if (url.indexOf("//en.") != -1)
    addVal = "Talk:";

//GM_setValue("directly", false);
var onload;

if( url.search(/\.m/i) != -1 ) {
    onload = function() {
        if (url.indexOf(addVal) == -1)
            $('.header').append('<div id="CPm"><p>Redirect everytime?</p><input type="checkBox"'+ (GM_getValue("directly")?"checked":"") +'/><br><p style="color:#787878" id="CPmp">to discussion ➤</p></div>');
        else
            $('.header').append('<div id="CPm"><p>Redirect everytime?</p><input type="checkBox"'+ (GM_getValue("directly")?"checked":"") +'/><br><p style="color:#787878" id="CPmp">to articel ➤</p></div>');

        $('#CPm > p').css({"font-size":"85%","display":"inline-block", "margin-right": "0.5em"});
        $('#CPm > input').css("display","inline-block");
        $('#CPm').css({"height":"100%","padding":10});

        $('#CPm > input').click(function(){
            GM_setValue("directly", $("#CPm > input").is(":checked"));
        });
        $('#CPmp').click(function(){
            var discussion = "";
            if (url.indexOf(addVal) == -1) {
                var a = url.lastIndexOf('/')+1;
                discussion = [url.slice(0, a), addVal, url.slice(a)].join('');
            } else
                discussion = url.replace(addVal, '');
            window.location.replace(discussion);
        });
    };
} else if(GM_getValue("directly")) {
    window.stop();
    window.location.replace(modifiedURL);
} else {
    onload = function() {
        $('<input type="button" id="CP" value="to mobile"/>').insertBefore("#p-navigation");
        $("#CP").css("width", $("#p-navigation").css("width")).css("margin", "0 0.6em 0 0.7em");

        $("#CP").click(function(){
            window.location.replace(modifiedURL);
        });
    };

}

if (document.readyState === "complete")
    onload();
else
    (addEventListener || attachEvent).call(window, addEventListener ? "load" : "onload", onload);
