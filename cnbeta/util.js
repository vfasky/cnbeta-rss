exports.isFunction = function(x) {
  if (!x) return false;
  var rx = /function/,
    ft = "function";
  switch (typeof x) {
  case ft:
    return true;
  case "object":
    if ((ft !== typeof x.toString) && (ft !== typeof x.valueOf)) try {
      return rx.test(x);
    } catch (x) {
      return false;
    } else return Object.prototype.toString.call(x) === "[object Function]";
    break;
  default:
    return false;
  }
};

exports.isObject = function(x) {
  if (Object.prototype.toString.call(x) !== "[object Object]") {
    return false;
  }

  var key;
  for (key in x) {
    break;
  }

  return !key || Object.prototype.hasOwnProperty.call(x, key);
};

exports.isArray = function(x) {
  if (Array.isArray) return Array.isArray(x);
  return Object.prototype.toString.call(x) === "[object Array]";
};

exports.isString = function(x) {
  return Object.prototype.toString.call(x) === "[object String]";
};

exports.isNumeric = function(x) {
  if (Object.prototype.toString.call(x) === "[object Number]") {
    return true;
  }
  if (exports.isString(x)) {
    var regex = /^\-?[0-9]*\.?[0-9]+$/;
    return regex.test(x);
  }
  return false;
};

exports.isEmail = function(x) {
  if (exports.isString(x)) {
    var regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i;
    return regex.test(x);
  }
  return false;
};

exports.isEmpty = function(x) {
  if (false === exports.isString(x)) x = x.toString();
  return x === null || exports.trim(x) === "" ? true : false;
};

exports.isUndefined = function(x) {
  return undefined === x ? true : false;
};

exports.isWhitespace = function(x) {
  if (false === exports.isString(x)) x = x.toString();
  var regex = /^\s*$/;
  return regex.test(x);
};

/**
 * 首字母大写
 * @param {[type]} str [description]
 * @return {[type]} [description]
 */
exports.ucfirst = function(str) {
  return String(str).replace(/\b\w+\b/, function(word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
  });
};

exports.trim = function(x) {
  if (false === exports.isString(x)) x = x.toString();
  if (String.prototype.trim) return x.trim();

  var trimLeft, trimRight;

  if (exports.isWhitespace("\xA0")) {
    trimLeft = /^\s+/;
    trimRight = /\s+$/;
  } else {
    // IE doesn't match non-breaking spaces with \s, thanks jQuery.
    trimLeft = /^[\s\xA0]+/;
    trimRight = /[\s\xA0]+$/;
  }
  return x.replace(trimLeft, "").replace(trimRight, "");
};



exports.inArray = function(item, array) {
  if (false === exports.isArray(array)) return false;
  var isIn = false;
  exports.each(array, function(v) {
    if (item === v) {
      isIn = true;
      return false;
    }
  });
  return isIn;
};

/**
 * 转换html
 * @param {[type]} x [description]
 * @return {[type]} [description]
 */
exports.escapeHTML = function(x) {
  var escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(x).replace(/&(?!\w+;)|[<>"']/g, function(s) {
    return escapeMap[s] || s;
  });
};

/**
 * 去除html
 * @param {[type]} x [description]
 * @return {[type]} [description]
 */
exports.toText = function(x) {
  return String(x).replace(/<[^>].*?>/g, "");
};


exports.each = function(items, callback) {
  if (false === exports.isFunction(callback)) return false;
  if (exports.isArray(items)) {
    var count = items.length;
    for (var i = 0; i < count; i++) {
      var ret = callback(items[i], i);
      if (false === ret) {
        break;
      }
    }
  } else if (exports.isObject(items)) {
    for (var k in items) {
      var ret = callback(items[k], k);
      if (false === ret) {
        break;
      }
    }
  }
};