/// <reference path="Iterator.js" />

function ArrayIterator(_source) {
    Iterator.call(this, _source);

    if (_source instanceof Array) {
        this.iterateFunction = iterateArray;
    }
    else {
        throw new Error("Invalid argument.");
    }

    var source = _source;
    var index = -1;

    function iterateArray() {
        index++;

        if (index < source.length) {
            this.current = source[index];
            return true;
        }

        this.completed = true;
        return false;
    };

    this.resetFunction = function () {
        index = -1;
    };
};

ArrayIterator.prototype = Iterator.prototype;