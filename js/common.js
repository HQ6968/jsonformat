function getViewportSize() {
    var size = {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
    // if(size.width < document.body.clientWidth) {
    //     size.width = document.body.clientWidth;
    // }
    // if(size.height < document.body.clientHeight) {
    //     size.height = document.body.clientHeight;
    // }
    return size;
}

function $(idclasstag) {
    switch (idclasstag[0]) {
        case "#":
            return document.getElementById(idclasstag.substr(1));
        case ".":
            return document.getElementsByClassName(idclasstag.substr(1));
        default:
            return document.getElementsByTagName(idclasstag);
    }
}

function addEvent(target, type, func) {
    if (target.addEventListener)
        target.addEventListener(type, func, false);
    else if (target.attachEvent)
        target.attachEvent("on" + type, func);
    else target["on" + type] = func;
}

function removeEvent(target, type, func) {
    if (target.removeEventListener) {
        target.removeEventListener(type, func, false);
    } else if(target.detachEvent) {
        target.detachEvent('on' + type, func);
    } else target['on' + type] = null;
}

function loadScript(url, callback) {
    "use strict";
    var scripts = document.getElementsByTagName('SCRIPT');
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src === url) {
            return;
        }
    }

    var scriptTag = document.createElement('SCRIPT');
    scriptTag.setAttribute("type", 'text/javascript');
    scriptTag.src = url;
    (document.getElementsByTagName('HEAD')[0] || document.documentElement).appendChild(scriptTag);
    scriptTag.onload = scriptTag.onreadystatechange = function() { //Attach handlers for all browsers
        if (! /*@cc_on!@*/ false || this.readyState === "loaded" || this.readyState === "complete") {
            this.onload = this.onreadystatechange = null;
            if (typeof(callback) === "function") {
                callback();
            }
        }
    }
}

function clearSlct() {
    if("getSelection" in window) {
        window.getSelection().removeAllRanges();
    } else {
        document.selection.empty();
    }
}



// function deleEle(selectorList) {
//     var i, j;
//     var eles;
//     var parent;
//     for (i = 0; i < selectorList.length; i++) {
//         eles = $(selectorList[i]);
//         if (eles && eles.length) {
//             while (eles.length && eles.length > 0) {
//                 parent = eles[0].parentNode;
//                 if (parent) {
//                     parent.removeChild(eles[0]);
//                 }
//             }
//         } else {
//             if (eles) {
//                 parent = eles.parentNode;
//                 if(parent) {
//                     parent.removeChild(eles);
//                 }
//             }
//         }
//     }
// }
// deleEle(["#googlead", ".jquery-api-top", "iframe"]);
