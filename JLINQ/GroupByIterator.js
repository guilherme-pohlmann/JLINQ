/// <reference path="Iterator.js" />
/// <reference path="ArrayIterator.js" />

function Grouping(_key, _hashCode, _hashNext) {
    this.key = _key;
    this.hashCode = _hashCode;
    this.hashNext = _hashNext;
    this.next = undefined;
    this.elements = [];

    this.add = function (element) {
        this.elements.push(element);
    };
};

function Lookup() {
    this.groupings = new Array(7);
    var lastGrouping;
    var count = 0;

    var computeHash = function (key) {
        if (!key || !key.getHashCode) {
            return 0;
        }
        return key.getHashCode() & 0x7FFFFFFF
    };

    var resize = function () {
        var newSize = count * 2 + 1;
        var newGroupings = new Array(newSize);
        var g = lastGrouping;

        do {
            g = g.next;
            var index = g.hashCode % newSize;
            g.hashNext = newGroupings[index];
            newGroupings[index] = g;
        } while (g != lastGrouping);

        this.groupings = newGroupings;
    };

    this.getGrouping = function (key, create) {
        var hashCode = computeHash(key);

        for (var g = this.groupings[hashCode % this.groupings.length]; g != null; g = g.hashNext) {
            if (g.hashCode === hashCode) {
                return g;
            }
        }

        if (create) {
            if (count === this.groupings.length) {
                resize();
            }
            var index = hashCode % this.groupings.length;
            var g = new Grouping(key, hashCode, this.groupings[index]);

            this.groupings[index] = g;

            if (!lastGrouping) {
                g.next = g;
            }
            else {
                g.next = lastGrouping.next;
                lastGrouping.next = g;
            }

            lastGrouping = g;
            count++;
            return g;
        }
        return undefined;
    };

    this.getLastGrouping = function () {
        return lastGrouping;
    };
};

function GroupByIterator(_source, _keySelector, _elementSelector) {

    Iterator.call(this, _source);

    var lookup = new Lookup();
    var resultIterator;

    var buildResult = function () {
        var itens = [];
        var g = lookup.getLastGrouping();

        if (g != null) {
            do {
                g = g.next;

                itens.push({
                    key: g.key,
                    elements: g.elements
                });
            } while (g != lookup.getLastGrouping());
        }

        resultIterator = new ArrayIterator(itens);
    };

    var lookupGroup = function (element) {
        lookup.getGrouping(_keySelector(element), true).add(_elementSelector(element));
    };

    var iterateArray = function () {
        for (var i = 0; i < _source.length; i++) {
            lookupGroup(_source[i]);
        }
        buildResult();
    };

    var iterateInterator = function () {
        while (_source.moveNext()) {
            lookupGroup(_source.current);
        }
        buildResult();
    };

    this.iterateFunction = function () {
        while (resultIterator.moveNext()) {
            this.current = resultIterator.current;
            return true;
        }

        this.completed = true;
        return false;
    };

    this.resetFunction = function () {
        resultIterator.reset();
    };


    if (_source instanceof Array) {
        iterateArray();
    }
    else if (_source instanceof Iterator) {
        iterateInterator();
    }
    else {
        throw new Error("Invalid argument: _source.");
    }

    if (!_keySelector) {
        throw new Error("Invalid null argument: _keySelector.");
    }
    if (!_elementSelector) {
        throw new Error("Invalid null argument: _elementSelector.");
    }
};

GroupByIterator.prototype = Iterator.prototype;