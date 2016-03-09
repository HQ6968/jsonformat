/**
 * 格式化json对象，将json对象转换为格式良好的html字符串
 * @param  {object} jsonObj 要转换的json对象
 * @param  {number} indent  采用缩进的数量，默认为4
 * @return {string}         格式化后的html字符串
 */
function formatJson(jsonObj, indent) {
    "use strict";
    var indentNum = indent || 4;
    var space = "";
    for (var i = 0; i < indentNum; i++) {
        space += "&nbsp;";
    }
    var foldFuncName = "openfold";
    (function(win) {
        win[foldFuncName] = win[foldFuncName] || function(target, comma) {
            var objcontent = target.nextSibling;
            var _comma = "";
            if (comma) {
                _comma = ",";
            }
            var typeInfo = {
                "json_object": "Object{...}" + _comma,
                "json_array": "Array[" + (target.title || "...") + "]" + _comma
            };

            var size = getElementSize(objcontent, "border");
            if (size.height === 0) {
                size.height = parseInt(objcontent.style.height, 10);
            }
            var height;
            var time = 1000;
            var pervalue;
            var anima;
            if (objcontent.style.display !== "none") {
                objcontent.style.display = "none";
                target.className = "btn-close";
                target.innerHTML = typeInfo[objcontent.className];
            } else {
                target.innerHTML = "";
                objcontent.style.display = "inline";
                target.className = "btn-open";
            }


            // if (objcontent.style.display !== "none") {

            //     height = size.height;
            //     pervalue = height * 10 / time;

            //     anima = setInterval(function() {
            //         if (height <= pervalue) {
            //             objcontent.style.display = "none";
            //             objcontent.style.height = size.height + "px";
            //             target.className = "btn-close";
            //             target.innerHTML = typeInfo[objcontent.className];
            //             clearInterval(anima);
            //             return;
            //         }
            //         height -= pervalue;
            //         objcontent.style.height = height + "px";
            //     }, 10);

            // } else {
            //     height = objcontent.style.height = 0;
            //     objcontent.style.display = "inline-block";
            //     pervalue = size.height * 10 / time;
            //     target.innerHTML = "";
            //     target.className = "btn-open";
            //     anima = setInterval(function() {
            //         if (height >= size.height) {
            //             objcontent.style.height = size.height + "px";

            //             clearInterval(anima);
            //             return;
            //         }
            //         height += pervalue;
            //         objcontent.style.height = height + "px";
            //     }, 10);
            // }
        };

        function getElementSize(element, type) {
            var size = {};
            var getRealStyle = function(element, attr) {
                //在ie8及以下不能准确执行，但是width和height都可以准确获取
                return element.currentStyle ? element.currentStyle[attr] : document.defaultView.getComputedStyle(element, false)[attr];
            };
            type = type || "content";
            switch (type) {
                case 'content':
                    size.width = parseInt(getRealStyle(element, 'width'), 10);
                    size.height = parseInt(getRealStyle(element, 'height'), 10);
                    break;
                case 'padding':
                    size.width = element.clientWidth;
                    size.height = element.clientHeight;
                    break;
                case 'border':
                    size.width = element.offsetWidth;
                    size.height = element.offsetHeight;
                    break;
            }
            return size;
        }
    })(window);
    addStyle();
    return parseValue(jsonObj);

    /**
     * 对object类型的值进行格式化转换
     * @param  {object} obj       要转换的对象
     * @param  {number} indentNum 缩进的数量
     * @return {string}           转换之后的html字符串
     */
    function parseObj(obj, indentNum, comma) {
        var objstr = '<span class="btn-open" onclick="' + foldFuncName + '(this, ' + comma + ')"></span><span class="json_object">{<br/>';
        var key, i = 0,
            len = 0;
        var spacestr = "";
        var _comma = "";
        if (comma) {
            _comma = ",";
        }

        for (var j = 0; j < indentNum; j++) {
            spacestr += space;
        }
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                len++;
            }
        }
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                i++;
                objstr += spacestr + space + '<span class="json_key">"' +
                    key + '"</span>: ' +
                    parseValue(obj[key], indentNum + 1, i !== len) + '<br/>';
            }
        }
        return objstr + spacestr + "}" + _comma + "</span>";
    }

    /**
     * 对数组类型的值进行转换
     * @param  {array} value     要转换的数组
     * @param  {number} indentNum 当前需要缩进的数量
     * @return {string}           转换之后的html字符串
     */
    function parseArray(value, indentNum, comma) {
        var arr = '<span class="btn-open" onclick="' + foldFuncName + '(this, ' + comma + ')" title="' + value.length + '"></span><span class="json_array">[<br/>';
        var _comma = "";
        if (comma) {
            _comma = ",";
        }
        var spacestr = "";
        for (var j = 0; j < indentNum; j++) {
            spacestr += space;
        }
        var add = false;
        for (var i = 0; i < value.length; i++) {
            arr += spacestr + space + parseValue(value[i], indentNum + 1, i !== value.length - 1) + "<br/>";
        }
        return arr + spacestr + "]" + _comma + "</span>";
    }

    /**
     * 对json属性对应的值进行转换
     * @param  {T} value     json规定的合法的值
     * @param  {number} indentNum 当前需要缩进的数量
     * @return {string}           转换之后的字符串
     */
    function parseValue(value, indentNum, comma) {
        if (indentNum === void 0) {
            indentNum = 0;
        }
        var _comma = "";
        if (comma) {
            _comma = ",";
        }
        var type = toString.call(value).replace(/^\[object ([a-zA-Z]+)\]$/, "$1");
        switch (type) {
            case "String":
                value = value.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                if (/^http(s)?:\/\/[\s\S]+/.test(value)) {
                    value = '<a href="' + value + '" target="_blank">' + value + '</a>';
                }
                return '<span class="json_string">"' + value + '"</span>' + _comma;
            case "Number":
                return '<span class="json_number">' + value + '</span>' + _comma;
            case "Boolean":
                return '<span class="json_boolean">' + value + '</span>' + _comma;
            case "Array":
                return parseArray(value, indentNum, comma);
            case "Object":
                return parseObj(value, indentNum, comma);
            default:
                if (value !== null) {
                    throw new Error("invalid type!");
                    return "";
                } else {
                    return '<span class="json_null">null</span>' + _comma;
                }
        }
    }

    /**
     * 添加对应的样式style，只会添加一次
     */
    function addStyle() {
        if (document.getElementsByClassName("json_format_style")[0]) {
            return;
        }

        function parseStyle(classInfo, styleObj) {
            var className = "",
                key;
            if (typeof classInfo === "string") {
                className = "." + classInfo;
            } else if (toString.call(classInfo) === "[object Array]") {
                className = "." + classInfo.join(", .");
            }
            className += "{";
            for (key in styleObj) {
                if (styleObj.hasOwnProperty(key)) {
                    className += key + ":" + styleObj[key] + ";";
                }
            }
            className += "}";
            return className;
        }
        var styleInfo = {
            json_key: {
                color: "green",
                "font-weight": "bold"
            },
            json_string: {
                color: "blue"
            },
            json_number: {
                color: "purple"
            },
            json_boolean: {
                color: "orange"
            },
            json_null: {
                color: "red"
            },
            "btn-open:before btn-close:before": {
                display: "inline-block",
                "text-align": "center",
                width: ".8em",
                height: ".8em",
                "border-radius": "2px",
                "line-height": ".8em",
                border: "1px solid gray",
                "margin-right": "3px",
                cursor: "pointer"
            },
            "btn-open:before": {
                content: "\"-\""
            },
            "btn-close:before": {
                content: "\"+\""
            }
        };
        var key, cssText = "";
        for (key in styleInfo) {
            if (styleInfo.hasOwnProperty(key)) {
                cssText += parseStyle(key.split(" "), styleInfo[key]);
            }
        }
        var styleNode = document.createElement("STYLE");
        styleNode.setAttribute("type", "text/css");
        styleNode.className = "json_format_style";

        if (styleNode.styleSheet) {
            styleNode.styleSheet.cssText = cssText;
        } else {
            styleNode.appendChild(document.createTextNode(cssText));
        }
        (document.getElementsByTagName("HEAD")[0] || document.documentElement).appendChild(styleNode);
    }
}
