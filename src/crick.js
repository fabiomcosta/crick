
(function(global){

    global.crick = {
        simulate: function(element, eventType, options){
            simulateEvent(element, eventType, options);
        },
        type: function(element, value, focus){
            if (focus == null) focus = true;
            if (focus) element.focus();
            var charCode = value.charCodeAt(0);
            this.simulate(element, 'keydown', {keyCode: charCode, charCode: 0});
            this.simulate(element, 'keypress', {keyCode: charCode, charCode: charCode});
            this.simulate(element, 'keyup', {keyCode: charCode, charCode: 0});
        }
    };

})(typeof export == 'undefined' ? this : export);
