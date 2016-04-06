/// <reference path="Iterator.js" />

function SkipIterator(_source, _count) {
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

    //snapshot
    var originalCount = _count;
    var count = originalCount;
    var index = Math.min(count, _source.length);

    function iterateArray() {

        if (index > 0 && index < _source.length) {
            this.current = _source[index];
            index++;
            return true;
        }

        this.completed = true;
        return false;
    };

    function iterateInterator() {
        while (count > 0 && _source.moveNext()) {
            count--;
        }

        if (count <= 0) {
            while (_source.moveNext()) {
                this.current = _source.current;
                return true;
            }
        }
        this.completed = true;
        return false;
    };

    this.resetFunction = function () {
        if (_source instanceof Iterator) {
            _source.reset();
        }
        count = originalCount;
        index = Math.min(count, _source.length);
    };
};

SkipIterator.prototype = Iterator.prototype;