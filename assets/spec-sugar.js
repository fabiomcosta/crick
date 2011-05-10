if (!Element.prototype.addEventListener){
    Element.prototype.addEventListener = function(type, fn){
        this.attachEvent('on' + type, fn);
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
