if (!Element.prototype.addEventListener){
    Element.prototype.addEventListener = function(type, fn, capture){
        this.attachEvent('on' + type, fn, capture);
    };
}

var $ = function(id){
    return document.getElementById(id);
};

var newElement = function(html){
    var element = document.createElement('div');
    element.innerHTML = html;
    return element.firstChild;
};
