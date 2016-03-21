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

    new Clipboard('#copy', {
        target: function(trigger) {
            return jsonResult;
        }
    }).on('success', function(e) {
        var toast = $("#toastInfo");
        toast.innerHTML = "复制成功";
        toast.style.display = "block";
        setTimeout(function() {
            toast.style.display = "none";
        }, 2000);
        e.clearSelection();
    }).on('error', function(e) {
        var toast = $("#toastInfo");
        toast.innerHTML = "复制失败" + e;
        toast.style.display = "block";
        setTimeout(function() {
            toast.style.display = "none";
        }, 2000);
    });

    addEvent(jsonContent, "scroll", function(e) {
        var scale = jsonContent.scrollTop / jsonContent.scrollHeight;
        var result = $(".right")[0];
        result.scrollTop = result.scrollHeight * scale;
    });

    addEvent($(".divider")[0], "mousedown", function(e) {
        document.body.onmousemove = function(e) {
            var windowWidth = getViewportSize().width;
            if (windowWidth - e.clientX > 70) {
                $(".left")[0].style.width = (e.clientX / windowWidth) * 100 + "%";
            }
        };
    });

    addEvent(document.body, "mouseup", function() {
        document.body.onmousemove = null;
    });

    addEvent($("#clear"), "click", function() {
        jsonContent.value = "";
        jsonContent.focus();
        jsonResult.innerHTML = "";
    });

    addEvent($("#compress"), "click", function() {
        success && (jsonResult.innerHTML = JSON.stringify(JSON.parse($("#json_content").value)));
    });

    addEvent($("#format"), "click", function() {
        jsonResult.innerHTML = format(jsonContent.value);
    });

    addEvent($("#save"), "click", function() {
        if (success) {
            var result = JSON.stringify(JSON.parse(jsonContent.value), null, 4);
            saveAs(new Blob([result], {
                type: "text/plain;charset=utf-8"
            }), "json_format.json");
        }
    });

})();