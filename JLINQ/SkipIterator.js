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
        throw new Error("Invalid argument.");
    }

    //snapshot
    var originalCount = _count;
    var count = originalCount;
    var source = _source;
    var index = Math.min(count, source.length);

    function iterateArray() {

        if (index > 0 && index < source.length) {
            this.current = source[index];
            index++;
            return true;
        }

        this.completed = true;
        return false;
    };

    function iterateInterator() {
        while (count > 0 && source.moveNext()) {
            count--;
        }

        if (count > 0) {
            while (source.moveNext()) {
                this.current = source.current;
                return true;
            }
        }
        this.completed = true;
        return false;
    };

    this.resetFunction = function () {
        if (source instanceof Iterator) {
            source.reset();
        }
        count = originalCount;
        index = Math.min(count, source.length);
    };
};

SkipIterator.prototype = Iterator.prototype;