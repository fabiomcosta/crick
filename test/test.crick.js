describe('event simulator', function(){

    xdescribe('calling events on an element', function(){
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
                this.element.addEventListener(events[i], this.callback);
                simulateEvent(this.element, events[i]);
                expect(this.callback).toHaveBeenCalled();
            });
        })(i);
    });
    
    describe('calling keypress events on an input element', function(){
        beforeEach(function(){
            this.input = newElement('<input type="text"/>');
        });
        for (var i = 49; i < 50; i++) (function(i){
            var _char = String.fromCharCode(i);
            if (_char){
                it('should call the keypress event for the "'+ _char +'" char and the inputs value should be it', function(){
                    this.input.addEventListener('keydown', function(e){ console.log(e); });
                    crick.type(this.input, _char);
                    expect(this.input.value).toEqual(_char);
                });
            }
        })(i);
    });
});
