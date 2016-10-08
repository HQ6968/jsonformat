/**
 * 绑定事件
 * @author tingyuan
 * @date   2016-03-07
 */
(function() {
  var success = false; //表示当前解析是否成功
  var jsonContent = $("#json_content");
  var jsonResult = $("#json_result");
  var isAnimating = false;

  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  }

  function isValidJson(str) {
    try {
      eval('var jsonObj = ' + str);
      if (typeof jsonObj === 'object') {
        return JSON.stringify(jsonObj);
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  var format = function(jsonstr, tryto) {
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
      var jsonStr;
      if (tryto && (jsonStr = isValidJson(jsonstr))) {
        jsonContent.value = jsonStr;
        return format(jsonStr);
      } else {
        success = false;
        var error = e.toString().replace(/\n/g, "<br><br>");
        return "<span style=\"color:red;\">" + error + "</span>";
      }
    }
  };
  setTimeout(function() {
    jsonContent.focus();
  });
  if (localStorage) {
    jsonContent.value = localStorage.getItem('json_format_content') || "";
    jsonResult.innerHTML = format(jsonContent.value);
  }

  addEvent(jsonContent, 'input', function() {
    jsonResult.innerHTML = format(jsonContent.value.trim());
  });
  addEvent(jsonContent, 'propertychange', function() {
    jsonResult.innerHTML = format(jsonContent.value.trim());
  });

  var showToast = (function() {
    var isAnimating = false;
    var toast = $("#toastInfo");
    return function(content, type, time) {
      if (!isAnimating) {
        isAnimating = true;
        toast.innerHTML = content;
        toast.style.backgroundColor = type === 'error' ? 'red' : '#09f';
        toast.className = 'toast toast__show';
        setTimeout(function() {
          toast.className = 'toast';
          isAnimating = false;
        }, time || 1800);
      }
    };
  })();


  new Clipboard('#copy', {
    target: function(trigger) {
      return jsonResult;
    }
  }).on('success', function(e) {
    if (jsonResult.innerHTML.length > 0) {
      showToast('复制成功', 'success');
    }
    e.clearSelection();
  }).on('error', function(e) {
    showToast("复制失败: " + e, 'error');
  });


  addEvent(jsonContent, "scroll", function(e) {
    var scale = jsonContent.scrollTop / jsonContent.scrollHeight;
    var result = $(".right")[0];
    result.scrollTop = result.scrollHeight * scale;
  });
  // addEvent($(".right")[0], "scroll", function(e) {
  //     var scale = jsonResult.scrollTop / jsonResult.scrollHeight;
  //     var result = $(".left")[0];
  //     result.scrollTop = result.scrollHeight * scale;
  // });

  var changeWidth = function(e) {
    clearSlct();
    var windowWidth = getViewportSize().width;
    if (windowWidth - e.clientX > 100) {
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
        if (localStorage) {
          localStorage.removeItem('json_format_content');
        }
        break;
      case 'compress':
        if (success) {
          var result = JSON.stringify(JSON.parse(jsonContent.value));
          jsonResult.innerHTML = result;
        }
        break;
      case 'format':
        jsonResult.innerHTML = format(jsonContent.value);
        if (success) {
          var result = JSON.stringify(JSON.parse(jsonContent.value), null, 4);
          jsonContent.value = result;
        }
        break;
      case 'save':
        if (!Blob) {
          showToast('抱歉，您的浏览器不支持导出', 'error');
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
      case 'cache':
        if (!localStorage) {
          showToast("抱歉，您的浏览器不支持暂存", 'error');
          return;
        }
        localStorage.setItem('json_format_content', jsonContent.value);
        showToast("暂存成功", 'success');
        break;
      case 'tryFormat':
        jsonResult.innerHTML = format(jsonContent.value, true);
        break;
    }
  });

  addEvent($('#import_input'), 'change', function(e) {
    if (typeof FileReader === 'undefined') {
      showToast("抱歉，您的浏览器不支导入", 'error');
      return false;
    }
    var reader = new FileReader();
    reader.readAsText($('#import_input').files[0]);
    reader.onload = function() {
      var content = this.result.trim();
      jsonContent.value = content;
      jsonResult.innerHTML = format(content);
    };
  });

})();
