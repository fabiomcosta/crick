describe('event simulator', function(){

    describe('calling events on an element', function(){
        beforeEach(function(){
            this.element = newElement('<div/>');
            this.callback = jasmine.createSpy();
        });

        var events = [
            'click',
            'dblclick',
            'mousedown',
            'mouseup',
            'mouseover',
            'mouseout',
            'mousemove',
            'keydown',
            'keyup',
            'keypress'
        ];

        for (var i = 0; i < events.length; i++) (function(i){
            it('should '+ events[i] +' on an element', function(){
                this.element.addEventListener(events[i], this.callback, false);
                simulateEvent(this.element, events[i]);
                expect(this.callback).toHaveBeenCalled();
            });
        })(i);
    });

    describe('keyboard events', function(){

        beforeEach(function(){
            this.input = newElement('<input type="text"/>');
            document.body.appendChild(this.input);
        });

        afterEach(function(){
            document.body.removeChild(this.input);
        });

        describe('calling keypress events on an input element', function(){
            // some acceptable keys according to w3c
            // http://www.w3.org/TR/DOM-Level-3-Events/#keys
            var charCodes = [36, 45], i;
            for (i = 48; i <= 57; i++) charCodes.push(i);
            for (i = 65; i <= 90; i++) charCodes.push(i);
            for (i = 96; i <= 122; i++) charCodes.push(i);

            for (i = 0; i < charCodes.length; i++) (function(i){
                var _char = String.fromCharCode(charCodes[i]);
                if (_char) it('should call the keypress event for the "'+ _char +'" char and the inputs value should be it', function(){
                    crick.type(this.input, _char);
                    expect(this.input.value).toEqual(_char);
                });
            })(i);
        });

        describe('special keys', function(){
            it('should accept left arrow special key', function(){
                crick.type(this.input, 'a[left]b');
                expect(this.input.value).toEqual('ba');
            });
        });

        describe('preventing the default behavior of the event', function(){
            it('should not input anything if the event has been prevented', function(){
                this.input.addEventListener('keydown', function(e){e.preventDefault();}, false);
                crick.type(this.input, 'a');
                expect(this.input.value).toEqual('');
            });
        });

    });

});
