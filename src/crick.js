
(function(global){

    var specialActions = {
        left: function(input){
            this._moveCaret(input, '-=1');
        },
        right: function(input){
            this._moveCaret(input, '+=1');
        },
        top: function(input){
            this._moveCaret(input, 0);
        },
        bottom: function(input){
            this._moveCaret(input, input.value.length);
        }
    };

    global.crick = {
        simulate: function(element, eventType, options){
            return simulateEvent(element, eventType, options);
        },
        _getKeyCodeFor: function(_char){
            var keyCode = KeyboardEvent['DOM_VK_'+ _char.toUpperCase()];
            return keyCode || 0;
        },
        _moveCaret: function(input, to){
            var relative = to.match(/^([-+])=(\d+)/);
            var position = (relative) ? input.selectStart + (parseInt(relative[1] + relative[2], 10)) : to;
            input.setSelectionRange(position, position);
        },
        type: function(element, value, focus){
            if (focus !== false) element.focus();

            for (var i = 0, l = value.length; i < l; i++){
                var _char = value.charAt(i),
                    charCode = 0;

                if (_char == '['){
                    var specialKeyEndIndex = value.indexOf(']', i);
                    _char = value.substring(i + 1, specialKeyEndIndex);
                    i += specialKeyEndIndex - i;
                } else {
                    charCode = _char.charCodeAt(0);
                }

                var keyCode = this._getKeyCodeFor(_char),
                    keydownWorked = false, keypressWorked = false;

                keydownWorked = this.simulate(element, 'keydown', {keyCode: keyCode, charCode: 0});
                if (keydownWorked){
                    keypressWorked = this.simulate(element, 'keypress', {keyCode: keyCode, charCode: charCode});
                }
                this.simulate(element, 'keyup', {keyCode: keyCode, charCode: 0});

                var eventWorked = keydownWorked && keypressWorked,
                    specialAction = specialActions[_char.toLowerCase()];
                
                if (specialAction && eventWorked){
                    specialAction.call(this, element);
                }
            }
        }
    };

})(typeof export == 'undefined' ? this : export);
