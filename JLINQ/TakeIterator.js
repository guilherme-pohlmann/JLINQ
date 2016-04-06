/// <reference path="Iterator.js" />

function TakeIterator(_source, _count) {
    Iterator.call(this, _source);

    if (_source instanceof Array) {
        this.iterateFunction = iterateArray;
    }
    else if (_source instanceof Iterator) {
        this.iterateFunction = iterateInterator;
    }
    else {
        throw new Error("Invalid argument: _source.");
    }

    var originalCount = _count;
    var count = originalCount;
    var index = -1;

    function iterateArray() {
        index++;

        if (index < count && index < _source.length) {
            this.current = _source[index];
            return true;
        }

        this.completed = true;
        return false;
    };

    function iterateInterator() {
        while (_source.moveNext()) {
            this.current = _source.current;

            if (--count == 0) {
                this.completed = true;
            }
            return true;
        }
        this.completed = true;
        return false;
    };

    this.resetFunction = function () {
        if (_source instanceof Iterator) {
            _source.reset();
        }
        count = originalCount;
        index = -1;
    };
};

TakeIterator.prototype = Iterator.prototype;