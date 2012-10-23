/*!
 * jaiks.js v1.1.0
 * (c) 2012 ulrik nielsen
 *
 * A way to bundle ajax requests.
 *
 * Full details and documentation:
 * http://github/mrbase/jaiks
 *
 * License: http://www.opensource.org/licenses/mit-license.php
 */

var jaiks = (function ($) {
  "use strict";

  var defaults = {
    post_var : 'payload',
    async : true,
    url : ''
  };

  var settings = {};

  var pub = {};
  var call_stack = {};
  var call_stack_count = 0;

  pub.init = function (options) {
    settings = $.extend({}, defaults, options);
  }

  pub.add = function (action, callback, data, weight) {
    if (0 === settings.length) {
      if (window.console) {
        console.error("jaiks not initialize, use jaiks.init({...});");
      }

      return;
    }

    if (undefined === weight) {
      weight = 10;
    }

    if (undefined === data) {
      data = {};
    }

    call_stack[action] = {
      'weight'   : weight,
      'action'   : action,
      'callback' : callback,
      'data'     : data
    };

    call_stack_count++;
  };

  pub.exec = function () {
    if (!settings.url) {
      if (window.console) {
        console.error("jaiks target url not set, use: jaiks.init({url: 'http://..../'}); to initialize");
      }

      return;
    }

    if (0 === call_stack_count) {
      return;
    }

    // sort the call stack after weight
    var stack = [];
    $.each(call_stack, function (key, data) {
      stack.push(data);
    });

    stack.sort(function (obj1, obj2) {
      return obj1.weight - obj2.weight;
    });

    $('body').trigger('jaiks.loading');

    // encode data so we can safely transfer it in a request
    var data = JSON.stringify(stack);
    var data = encodeURIComponent(data).replace(/[!'()*]/g, escape);

    var jqxhr = $.ajax({
      async    : settings.async,
      data     : settings.post_var+'='+data,
      dataType : 'json',
      type     : 'POST',
      url      : settings.url
    });

    jqxhr.done(function (response) {
      $.each(response, function (i, obj) {
        call_stack[obj.action].callback.call(this, obj);
      });
    });

    jqxhr.fail(function (jqXHR, textStatus) {
      if (window.console) {
        console.log('jaiks failed: ', textStatus);
      }
    });

    jqxhr.always(function () {
      $('body').trigger('jaiks.done');
    });
  };

  return pub;
})(jQuery);
