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

    setInterval(function() {
        currentValue = jsonContent.value.trim();
        if (lastValue !== currentValue) {
            lastValue = currentValue;
            jsonResult.innerHTML = format(currentValue);
        }
    }, 13);

    new Clipboard('#copy', {
        target: function(trigger) {
            return jsonResult;
        }
    }).on('success', function(e) {
        setTimeout(function() {
            alert("复制成功");
        }, 50);
        e.clearSelection();
    }).on('error', function(e) {
        setTimeout(function() {
            alert("复制失败");
        }, 50);
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

    addEvent(document.body, "mouseup", function() {
        document.body.onmousemove = null;
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
            currentValue = jsonContent.value = content;
            jsonResult.innerHTML = format(currentValue);
        };
    });

    // (function(callback) {
    //     window.getCityCode = window.getCityCode || function(content) {
    //         if (typeof callback === "function") {
    //             callback(content);
    //         }
    //     };
    //     loadScript("http://weather.hao.360.cn/sed_api_weather_info.php?_jsonp=getCityCode&_=" + (new Date()).getTime());
    // })(function(data) {
    //     var city = data.area[2][0];
    //     var dawn_weather = data.weather[1].info.dawn[1];
    //     var dawn_temperature = data.weather[1].info.dawn[2]; //℃
    //     var day_weather = data.weather[1].info.day[1];
    //     var day_temperature = data.weather[1].info.day[2]; //℃
    //     var night_weather = data.weather[1].info.night[1];
    //     var night_temperature = data.weather[1].info.night[2]; //℃
    //     $("#city").innerHTML = city;
    //     $("#dawn").innerHTML = "拂晓 " + dawn_weather + " " + dawn_temperature + "℃";
    //     $("#day").innerHTML = "白日 " + day_weather + " " + day_temperature + "℃";
    //     $("#night").innerHTML = "夜晚 " + night_weather + " " + night_temperature + "℃";
    //     $("#pm25").innerHTML = "pm2.5: " + data.pm25.pm25[0];
    //     var scripts = $("script");
    //     for (var i = 0; i < scripts.length; i++) {
    //         if (scripts[i].src.indexOf("weather.hao.360.cn") >= 0) {
    //             scripts[i].parentNode.removeChild(scripts[i]);
    //             break;
    //         }
    //     }
    // });

})();
