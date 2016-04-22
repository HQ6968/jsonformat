/**
 * 绑定事件
 * @author tingyuan
 * @date   2016-03-07
 */
(function() {
    'use strict';
    var success = false; //表示当前解析是否成功
    var jsonContent = $("#json_content");
    var jsonResult = $("#json_result");
    var currentValue; // 表示当前的值
    var lastValue = ""; //表示上一次的值
    var checkInput = null; // 监听输入的interval

    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }
    var format = function(jsonstr) {
        try {
            if (jsonstr.length === 0) {
                success = false;
                return "";
            }
            jsonlint.parse(jsonstr);
            var result = formatJson(JSON.parse(jsonstr), 4);
            success = true;
            return result;
        } catch (e) {
            success = false;
            var error = e.toString().replace(/\n/g, "<br><br>");
            return "<span style=\"color:red;\">" + error + "</span>";
        }
    };

    jsonContent.focus();
    checkInput = setInterval(function() {
        currentValue = jsonContent.value.trim();
        if (lastValue !== currentValue) {
            lastValue = currentValue;
            jsonResult.innerHTML = format(currentValue);
        }
    }, 100);

    addEvent(jsonContent, 'focus', function() {
        if (!!checkInput) {
            return;
        }
        checkInput = setInterval(function() {
            currentValue = jsonContent.value.trim();
            if (lastValue !== currentValue) {
                lastValue = currentValue;
                jsonResult.innerHTML = format(currentValue);
            }
        }, 100);
    });
    addEvent(jsonContent, 'blur', function() {
        checkInput && clearInterval(checkInput);
        checkInput = null;
    });

    var theClipboard = new Clipboard('#copy', {
        target: function(trigger) {
            return jsonResult;
        }
    }).on('success', function(e) {
        if (jsonResult.innerHTML.length > 0 && !theClipboard.isAnimating) {
            var toast = $("#toastInfo");
            toast.innerHTML = "复制成功";
            toast.className = 'toast toast__show';
            theClipboard.isAnimating = true;
            setTimeout(function() {
                toast.className = 'toast';
                theClipboard.isAnimating = false;
            }, 1800);
        }
        e.clearSelection();
    }).on('error', function(e) {
        if (!theClipboard.isAnimating) {
            theClipboard.isAnimating = true;
            var toast = $("#toastInfo");
            toast.innerHTML = "复制失败: " + e;
            toast.className = 'toast toast__show';
            setTimeout(function() {
                toast.className = 'toast';
                theClipboard.isAnimating = false;
            }, 1800);
        }
    });

    addEvent(jsonContent, "scroll", function(e) {
        var scale = jsonContent.scrollTop / jsonContent.scrollHeight;
        var result = $(".right")[0];
        result.scrollTop = result.scrollHeight * scale;
    });

    var changeWidth = function(e) {
        clearSlct();
        var windowWidth = getViewportSize().width;
        if (windowWidth - e.clientX > 70) {
            $(".left")[0].style.width = (e.clientX / windowWidth) * 100 + "%";
        }
    };

    addEvent($(".divider")[0], "mousedown", function(e) {
        addEvent(document.body, 'mousemove', changeWidth);
    });
    addEvent(document.body, "mouseup", function() {
        removeEvent(document.body, 'mousemove', changeWidth);
    });

    addEvent($('.func')[0], 'click', function(e) {
        var e = e || window.event;
        var target = e.target || e.srcElement;
        switch (target.id) {
            case 'clear':
                jsonContent.value = "";
                jsonContent.focus();
                jsonResult.innerHTML = "";
                break;
            case 'compress':
                if (success) {
                    var result = JSON.stringify(JSON.parse($("#json_content").value));
                    jsonResult.innerHTML = result;
                }
                break;
            case 'format':
                jsonResult.innerHTML = format(jsonContent.value);
                break;
            case 'save':
                if (!Blob) {
                    alert('抱歉，您的浏览器不支持导出');
                    return;
                }
                if (success) {
                    var result = JSON.stringify(JSON.parse(jsonContent.value), null, 4);
                    saveAs(new Blob([result], {
                        type: "text/plain;charset=utf-8"
                    }), "json_format.json");
                }
                break;
            case 'import':
                $('#import_input').click();
                break;
        }
    });



    addEvent($('#import_input'), 'change', function(e) {
        if (typeof FileReader === 'undefined') {
            alert("抱歉，您的浏览器不支持导入，请升级");
            return false;
        }
        var reader = new FileReader();
        console.log(e);
        reader.readAsText($('#import_input').files[0]);
        reader.onload = function() {
            var content = this.result.trim();
            jsonContent.focus();

            currentValue = jsonContent.value = content;
            jsonResult.innerHTML = format(currentValue);
        };
    });

})();
