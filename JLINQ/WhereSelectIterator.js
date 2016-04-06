/// <reference path="Iterator.js" />

function WhereSelectIterator(_source, _predicate, _selector) {

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

    var source = _source;
    var predicate = _predicate;
    var selector = _selector;
    var index = -1;

    function iterateArray() {

        index++;

        for (var i = index; i < source.length; i++) {
            var target = source[i];

            if (!predicate || predicate(target)) {
                index = i;
                this.current = selector ? selector(target) : target;
                return true;
            }
        }

        this.completed = true;
        return false;
    };

    function iterateInterator() {
        while (source.moveNext()) {

            if (!predicate || predicate(source.current)) {
                this.current = selector ? selector(source.current) : source.current;
                return true;
            }
        }
        this.completed = true;
        return false;
    };

    this.setPredicate = function (_predicate) {
        predicate = predicate;
    };

    this.getPredicate = function () {
        return predicate;
    };

    this.setSelector = function (_selector) {
        selector = _selector;
    };

    this.getSelector = function () {
        return selector;
    };

    this.resetFunction = function () {
        if (source instanceof Iterator) {
            source.reset();
        }
        index = -1;
    };
};

WhereSelectIterator.prototype = Iterator.prototype;