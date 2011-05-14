/*
---
    Port from the YUI3 event-simulate functionality on vanilla javascript.
...
*/
(function(global, document){

    var mix = function(obj1, obj2){
        for (var key in obj2){
            obj1[key] = obj2[key];
        }
    };

    //mouse events supported
    var mouseEvents = {
        click:      1,
        dblclick:   1,
        mouseover:  1,
        mouseout:   1,
        mousedown:  1,
        mouseup:    1,
        mousemove:  1
    };

    //key events supported
    var keyEvents   = {
        keydown:    1,
        keyup:      1,
        keypress:   1
    };

    //events that bubble by default
    var bubbleEvents = {
        scroll:     1,
        resize:     1,
        reset:      1,
        submit:     1,
        change:     1,
        select:     1,
        error:      1,
        abort:      1
    };

    //all key and mouse events bubble
    mix(bubbleEvents, mouseEvents);
    mix(bubbleEvents, keyEvents);

    var simulateKeyEvent = function(
        target,
        type,
        bubbles,
        cancelable,
        view,
        ctrlKey,
        altKey,
        shiftKey,
        metaKey,
        keyCode,
        charCode
    ){
        type = type.toLowerCase();

        //setup default values
        if (bubbles !== false) bubbles = true;
        if (cancelable !== false) cancelable = true; //all key events can be cancelled
        view = view || window; //view is typically window
        if (ctrlKey !== true) ctrlKey = false;
        if (altKey !== true) altKey = false;
        if (shiftKey !== true) shiftKey = false;
        if (metaKey !== true) metaKey = false;
        keyCode = keyCode || 0;
        charCode = charCode || 0;

        //try to create a mouse event
        var customEvent,
            eventWorked;

        //check for DOM-compliant browsers first
        if ('createEvent' in document){
            try {
                //try to create key event
                customEvent = document.createEvent('KeyEvents');
                customEvent.initKeyEvent(
                    type,
                    bubbles,
                    cancelable,
                    view,
                    ctrlKey,
                    altKey,
                    shiftKey,
                    metaKey,
                    keyCode,
                    charCode
                );
            } catch (ex) {
                try {
                    customEvent = document.createEvent('Events');
                } catch(ex) {
                    customEvent = document.createEvent('UIEvents');
                } finally {
                    customEvent.initEvent(type, bubbles, cancelable);
                    customEvent.view = view;
                    customEvent.altKey = altKey;
                    customEvent.ctrlKey = ctrlKey;
                    customEvent.shiftKey = shiftKey;
                    customEvent.metaKey = metaKey;
                    customEvent.keyCode = keyCode;
                    customEvent.charCode = charCode;
                }
            }
            eventWorked = target.dispatchEvent(customEvent);
        } else if ('createEventObject' in document){
            customEvent = document.createEventObject();
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.shiftKey = shiftKey;
            customEvent.metaKey = metaKey;
            /*
             * IE doesn't support charCode explicitly. CharCode should
             * take precedence over any keyCode value for accurate
             * representation.
             */
            customEvent.keyCode = (charCode > 0) ? charCode : keyCode;
            eventWorked = target.fireEvent('on' + type, customEvent);
        }
        return eventWorked;
    };

    var simulateMouseEvent = function(
        target,
        type,
        bubbles,
        cancelable,
        view,
        detail,
        screenX,
        screenY,
        clientX,
        clientY,
        ctrlKey,
        altKey,
        shiftKey,
        metaKey,
        button,
        relatedTarget
    ){

        //check target
        if (!target){
            new Error("simulateMouseEvent(): Invalid target.");
        }

        //check event type
        if (typeof type == 'string'){
            type = type.toLowerCase();

            //make sure it's a supported mouse event
            if (!mouseEvents[type]){
                new Error("simulateMouseEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            new Error("simulateMouseEvent(): Event type must be a string.");
        }

        //setup default values
        if (bubbles == null) bubbles = true; //all mouse events bubble
        if (cancelable == null) cancelable = (type != "mousemove"); //mousemove is the only one that can't be cancelled
        if (view == null) view = window; //view is typically window
        if (typeof detail != 'number') detail = 1;   //number of mouse clicks must be at least one
        if (typeof screenX != 'number') screenX = 0;
        if (typeof screenY != 'number') screenY = 0;
        if (typeof clientX != 'number') clientX = 0;
        if (typeof clientY != 'number') clientY = 0;
        if (ctrlKey == null) ctrlKey = false;
        if (altKey == null) altKey = false;
        if (shiftKey == null) shiftKey = false;
        if (metaKey == null) metaKey = false;
        if (typeof button != 'number') button = 0;

        relatedTarget = relatedTarget || null;

        //try to create a mouse event
        var customEvent,
            eventWorked;

        //check for DOM-compliant browsers first
        if ('createEvent' in document){

            customEvent = document.createEvent("MouseEvents");

            //Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
            if (customEvent.initMouseEvent){
                customEvent.initMouseEvent(type, bubbles, cancelable, view, detail,
                                     screenX, screenY, clientX, clientY,
                                     ctrlKey, altKey, shiftKey, metaKey,
                                     button, relatedTarget);
            } else { //Safari

                //the closest thing available in Safari 2.x is UIEvents
                customEvent = document.createEvent("UIEvents");
                customEvent.initEvent(type, bubbles, cancelable);
                customEvent.view = view;
                customEvent.detail = detail;
                customEvent.screenX = screenX;
                customEvent.screenY = screenY;
                customEvent.clientX = clientX;
                customEvent.clientY = clientY;
                customEvent.ctrlKey = ctrlKey;
                customEvent.altKey = altKey;
                customEvent.metaKey = metaKey;
                customEvent.shiftKey = shiftKey;
                customEvent.button = button;
                customEvent.relatedTarget = relatedTarget;
            }

            /*
             * Check to see if relatedTarget has been assigned. Firefox
             * versions less than 2.0 don't allow it to be assigned via
             * initMouseEvent() and the property is readonly after event
             * creation, so in order to keep YAHOO.util.getRelatedTarget()
             * working, assign to the IE proprietary toElement property
             * for mouseout event and fromElement property for mouseover
             * event.
             */
            if (relatedTarget && !customEvent.relatedTarget){
                if (type == "mouseout"){
                    customEvent.toElement = relatedTarget;
                } else if (type == "mouseover"){
                    customEvent.fromElement = relatedTarget;
                }
            }

            //fire the event
            eventWorked = target.dispatchEvent(customEvent);

        } else if ('createEventObject' in document){ //IE

            //create an IE event object
            customEvent = document.createEventObject();

            //assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.detail = detail;
            customEvent.screenX = screenX;
            customEvent.screenY = screenY;
            customEvent.clientX = clientX;
            customEvent.clientY = clientY;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.metaKey = metaKey;
            customEvent.shiftKey = shiftKey;

            //fix button property for IE's wacky implementation
            switch(button){
                case 0:
                    customEvent.button = 1;
                    break;
                case 1:
                    customEvent.button = 4;
                    break;
                case 2:
                    //leave as is
                    break;
                default:
                    customEvent.button = 0;
            }

            /*
             * Have to use relatedTarget because IE won't allow assignment
             * to toElement or fromElement on generic events. This keeps
             * YAHOO.util.customEvent.getRelatedTarget() functional.
             */
            customEvent.relatedTarget = relatedTarget;

            //fire the event
            eventWorked = target.fireEvent("on" + type, customEvent);

        } else {
            new Error("simulateMouseEvent(): No event simulation framework present.");
        }

        return eventWorked;
    };

    global.simulateEvent = function(target, type, options){
        options = options || {};
        type = type.toLowerCase();

        if (keyEvents[type]){
            return simulateKeyEvent(
                target,
                type,
                options.bubbles,
                options.cancelable,
                options.view,
                options.ctrlKey,
                options.altKey,
                options.shiftKey,
                options.metaKey,
                options.keyCode,
                options.charCode
            );
        }

        return simulateMouseEvent(
            target,
            type,
            options.bubbles,
            options.cancelable,
            options.view,
            options.detail,
            options.screenX,
            options.screenY,
            options.clientX,
            options.clientY,
            options.ctrlKey,
            options.altKey,
            options.shiftKey,
            options.metaKey,
            options.button,
            options.relatedTarget
        );
    };

})(this, document);

