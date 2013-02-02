ko.bindingHandlers.iScrollHandler = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        "use strict";
        window.setTimeout(function () {
            var wrapperId = $(element).find('.wrapper').attr('id'),
                $wrapper = $(element).find('.wrapper'),
                myScroll,
                isTouch = window.navigator.msMaxTouchPoints || ('ontouchstart' in window),
                $scroller = $(element).find('.slider'),
                $prevScroller = $(element).find('.prev-slider'),
                $nextScroller = $(element).find('.next-slider');

            if (!wrapperId) {
                $wrapper.attr('id', 'iscroller' + (new Date()).getTime() + Math.floor(Math.random() * 1000));
                wrapperId = $wrapper.attr('id');
            }

            //myScroll = new iScroll(wrapperId, { vScroll: false, hScrollbar: false, onBeforeScrollStart: null }); //this caused symptoms of critical bug 4058 - turning this off - do not enable!
            if (isTouch) {
              $wrapper.addClass("touch-scroll");
            }

           
            if ($prevScroller) {
                $prevScroller.on("click touch", function () {
                    if (isTouch) {
						$wrapper.animate({ scrollLeft: "-=200px" });
                    }
                    return false;
                });
            }

            if ($nextScroller) {
                $nextScroller.on("click touch", function () {
                    if (isTouch) {
                        $wrapper.animate({ scrollLeft: "+=200px" });
                    }
                    return false;
                });
            }
            //this is for the datasource - when it updates:
            
            window.setTimeout(function () {
               
                var selected = allBindingsAccessor().selected || "",
                    items = ko.utils.unwrapObservable(valueAccessor()),
                    isHal = allBindingsAccessor().isHal || false;
                if (selected) {
                    if (items) {
                        ko.bindingHandlers.iScrollHandler.setSelectedValue(element, myScroll, items, selected, 0, isHal, $wrapper);
                        selected.subscribe(function (selectedValue) {
                            ko.bindingHandlers.iScrollHandler.setSelectedValue(element, myScroll, items, selectedValue, 600, isHal, $wrapper);
                        });
                    }
                }
            }, 100);
        }, 0);
    },
    computeWidth: function (element, $scroller, myScroll) {
        "use strict";
        if ($(element).is(":visible")) {
            $scroller.width(25000);
            var $lastLi = $(element).find('.thelist>li:last'),
                left = $lastLi.position().left,
                outerwidth = $lastLi.outerWidth(true),
                a;

            outerwidth += $lastLi.width();

            a = left - $scroller.position().left + outerwidth;
            $scroller.width(a);
            myScroll.refresh();
        }
    },
    setSelectedValue: function (element, myScroll, items, selectedValue, scrollSpeed, isHal, $wrapper) {
        "use strict";
        function koValue(obj) {
            return $.isFunction(obj) ? obj() : obj;
        }
        var position = 0, $selItem;
        if (isHal) {
            $.each(items, function (index, item) {
                if (koValue(item.Resource.RetentionKey) === koValue(selectedValue)) {
                    position = index;
                    return false;
                }
            });
        } else {
            $.each(items, function (index, item) {
                //if ($wrapper.scrollLeft()) alert(koValue(item.Value) + " <k  v> " + koValue(selectedValue));
                if (koValue(item.Value) === koValue(selectedValue)) {
                    position = index;
                    return false;
                }
            });
        }
        if ($(element).is(":visible")) {
            if (window.navigator.msMaxTouchPoints || ('ontouchstart' in window)) {
                // make sure it exists, then scroll
                $selItem = $wrapper.find('li:nth-child(' + (position + 1) + ')');
                if ($selItem) {
                    //if ($wrapper.scrollLeft()) alert("Scroll Left: " + $wrapper.scrollLeft() + " Pos left:" + $selItem.position().left + " pos:" + position);
                    $wrapper.animate({ scrollLeft: $wrapper.scrollLeft() + $selItem.position().left - 100 });
                }
            }         }
        else {
            debug.log("warning: element is no visible!");
        }
    }
};
