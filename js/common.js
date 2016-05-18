'use strict';
function getViewportSize() {
    var size = {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
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

function loadScript(url, callback, charset, crossorigin) {
    "use strict";
    if (typeof url !== 'string') {
        throw new Error('invalid param:url at function-loadScript, must be string');
    }

    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var baseElement = head.getElementsByTagName("base")[0],
        currentlyAddingScript;

    var node = document.createElement("script");
    (typeof charset === 'string') && (node.charset = charset);
    (typeof crossorigin === 'string') && node.setAttribute("crossorigin", crossorigin);

    if ("onload" in node) {
        node.onload = onload;
        node.onerror = function() {
            onload(true);
            throw new Error('function loadScript:' + url + ' error!');
        };
    } else {
        node.onreadystatechange = function() {
            if (/loaded|complete/.test(node.readyState)) {
                onload();
            }
        };
    }

    node.async = true;
    node.src = url;
    currentlyAddingScript = node;
    baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);
    currentlyAddingScript = null;

    function onload(error) {
        node.onload = node.onerror = node.onreadystatechange = null;
        head.removeChild(node);
        node = null;
        (typeof callback === 'function') && callback(error);
    }
}

function clearSlct() {
    if("getSelection" in window) {
        window.getSelection().removeAllRanges();
    } else {
        document.selection.empty();
    }
}


