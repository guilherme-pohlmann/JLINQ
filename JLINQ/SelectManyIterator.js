/// <reference path="Iterator.js" />
/// <reference path="ArrayIterator.js" />

function SelectManyIterator(_source, _selector) {

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
    if (!_selector) {
        throw new Error("Argument null: _selector");
    }

    var source = _source;
    var selector = _selector;
    var index = -1;
    var currentIterator;

    this.iterateCurrent = function () {
        if (currentIterator.moveNext()) {
            this.current = currentIterator.current;
            return true;
        }
        return false;
    };

    function iterateArray() {

        if (currentIterator && this.iterateCurrent()) {
            return true;
        }

        index++;

        for (var i = index; i < source.length; i++) {
            index = i;
            currentIterator = new ArrayIterator(selector(source[i]));

            if (this.iterateCurrent()) {
                return true;
            }
        }

        this.completed = true;
        return false;
    };

    function iterateInterator() {
        if (currentIterator && this.iterateCurrent()) {
            return true;
        }

        while (source.moveNext()) {
            currentIterator = new ArrayIterator(selector(source.current));

            if (this.iterateCurrent()) {
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
        index = -1;
        currentIterator = undefined;
    };
};

SelectManyIterator.prototype = Iterator.prototype;