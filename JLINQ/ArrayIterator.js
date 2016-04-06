/// <reference path="Iterator.js" />

function ArrayIterator(_source) {
    Iterator.call(this, _source);

    if (_source instanceof Array) {
        this.iterateFunction = iterateArray;
    }
    else {
        throw new Error("Invalid argument: _source.");
    }

    var index = -1;

    function iterateArray() {
        index++;

        if (index < _source.length) {
            this.current = _source[index];
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