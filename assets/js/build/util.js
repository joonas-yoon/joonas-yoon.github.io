"use strict";(function(a){a.fn.navList=function(){var c=a(this);return $a=c.find("a"),b=[],$a.each(function(){var c=Math.max,d=a(this),e=c(0,d.parents("li").length-1),f=d.attr("href"),g=d.attr("target");b.push("<a class=\"link depth-"+e+"\""+("undefined"!=typeof g&&""!=g?" target=\""+g+"\"":"")+("undefined"!=typeof f&&""!=f?" href=\""+f+"\"":"")+"><span class=\"indent-"+e+"\"></span>"+d.text()+"</a>")}),b.join("")},a.fn.panel=function(c){if(0!=this.length){if(1<this.length){for(var d=0;d<this.length;d++)a(this[d]).panel(c);return f}var e,f=a(this),g=a("body"),h=a(window),j=f.attr("id");return e=a.extend({delay:0,hideOnClick:!1,hideOnEscape:!1,hideOnSwipe:!1,resetScroll:!1,resetForms:!1,side:null,target:f,visibleClass:"visible"},c),"jQuery"!=typeof e.target&&(e.target=a(e.target)),f._hide=function(a){e.target.hasClass(e.visibleClass)&&(a&&(a.preventDefault(),a.stopPropagation()),e.target.removeClass(e.visibleClass),window.setTimeout(function(){e.resetScroll&&f.scrollTop(0),e.resetForms&&f.find("form").each(function(){this.reset()})},e.delay))},f.css("-ms-overflow-style","-ms-autohiding-scrollbar").css("-webkit-overflow-scrolling","touch"),e.hideOnClick&&(f.find("a").css("-webkit-tap-highlight-color","rgba(0,0,0,0)"),f.on("click","a",function(c){var d=a(this),g=d.attr("href"),h=d.attr("target");g&&"#"!=g&&""!=g&&g!="#"+j&&(c.preventDefault(),c.stopPropagation(),f._hide(),window.setTimeout(function(){"_blank"==h?window.open(g):window.location.href=g},e.delay+10))})),f.on("touchstart",function(a){f.touchPosX=a.originalEvent.touches[0].pageX,f.touchPosY=a.originalEvent.touches[0].pageY}),f.on("touchmove",function(a){if(null!==f.touchPosX&&null!==f.touchPosY){var c=f.touchPosX-a.originalEvent.touches[0].pageX,d=f.touchPosY-a.originalEvent.touches[0].pageY,g=f.outerHeight(),h=f.get(0).scrollHeight-f.scrollTop();if(e.hideOnSwipe){var i=!1;switch(e.side){case"left":i=20>d&&-20<d&&50<c;break;case"right":i=20>d&&-20<d&&-50>c;break;case"top":i=20>c&&-20<c&&50<d;break;case"bottom":i=20>c&&-20<c&&-50>d;break;default:}if(i)return f.touchPosX=null,f.touchPosY=null,f._hide(),!1}(0>f.scrollTop()&&0>d||h>g-2&&h<g+2&&0<d)&&(a.preventDefault(),a.stopPropagation())}}),f.on("click touchend touchstart touchmove",function(a){a.stopPropagation()}),f.on("click","a[href=\"#"+j+"\"]",function(a){a.preventDefault(),a.stopPropagation(),e.target.removeClass(e.visibleClass)}),g.on("click touchend",function(a){f._hide(a)}),g.on("click","a[href=\"#"+j+"\"]",function(a){a.preventDefault(),a.stopPropagation(),e.target.toggleClass(e.visibleClass)}),e.hideOnEscape&&h.on("keydown",function(a){27==a.keyCode&&f._hide(a)}),f}},a.fn.placeholder=function(){if("undefined"!=typeof document.createElement("input").placeholder)return a(this);if(0!=this.length){if(1<this.length){for(var c=0;c<this.length;c++)a(this[c]).placeholder();return d}var d=a(this);return d.find("input[type=text],textarea").each(function(){var c=a(this);(""==c.val()||c.val()==c.attr("placeholder"))&&c.addClass("polyfill-placeholder").val(c.attr("placeholder"))}).on("blur",function(){var c=a(this);c.attr("name").match(/-polyfill-field$/)||""==c.val()&&c.addClass("polyfill-placeholder").val(c.attr("placeholder"))}).on("focus",function(){var c=a(this);c.attr("name").match(/-polyfill-field$/)||c.val()==c.attr("placeholder")&&c.removeClass("polyfill-placeholder").val("")}),d.find("input[type=password]").each(function(){var c=a(this),d=a(a("<div>").append(c.clone()).remove().html().replace(/type="password"/i,"type=\"text\"").replace(/type=password/i,"type=text"));""!=c.attr("id")&&d.attr("id",c.attr("id")+"-polyfill-field"),""!=c.attr("name")&&d.attr("name",c.attr("name")+"-polyfill-field"),d.addClass("polyfill-placeholder").val(d.attr("placeholder")).insertAfter(c),""==c.val()?c.hide():d.hide(),c.on("blur",function(a){a.preventDefault();var d=c.parent().find("input[name="+c.attr("name")+"-polyfill-field]");""==c.val()&&(c.hide(),d.show())}),d.on("focus",function(a){a.preventDefault();var c=d.parent().find("input[name="+d.attr("name").replace("-polyfill-field","")+"]");d.hide(),c.show().focus()}).on("keypress",function(a){a.preventDefault(),d.val("")})}),d.on("submit",function(){d.find("input[type=text],input[type=password],textarea").each(function(){var c=a(this);c.attr("name").match(/-polyfill-field$/)&&c.attr("name",""),c.val()==c.attr("placeholder")&&(c.removeClass("polyfill-placeholder"),c.val(""))})}).on("reset",function(c){c.preventDefault(),d.find("select").val(a("option:first").val()),d.find("input,textarea").each(function(){var c,d=a(this);switch(d.removeClass("polyfill-placeholder"),this.type){case"submit":case"reset":break;case"password":d.val(d.attr("defaultValue")),c=d.parent().find("input[name="+d.attr("name")+"-polyfill-field]"),""==d.val()?(d.hide(),c.show()):(d.show(),c.hide());break;case"checkbox":case"radio":d.attr("checked",d.attr("defaultValue"));break;case"text":case"textarea":d.val(d.attr("defaultValue")),""==d.val()&&(d.addClass("polyfill-placeholder"),d.val(d.attr("placeholder")));break;default:d.val(d.attr("defaultValue"));}})}),d}},a.prioritize=function(c,d){"jQuery"!=typeof c&&(c=a(c)),c.each(function(){var c,e=a(this),f=e.parent();if(0!=f.length)if(!e.data("__prioritize")){if(!d)return;if(c=e.prev(),0==c.length)return;e.prependTo(f),e.data("__prioritize",c)}else{if(d)return;c=e.data("__prioritize"),e.insertAfter(c),e.removeData("__prioritize")}})}})(jQuery);