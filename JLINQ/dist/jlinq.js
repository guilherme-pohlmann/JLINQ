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
/// <reference path="Iterator.js" />
/// <reference path="WhereSelectIterator.js" />
/// <reference path="TakeIterator.js" />
/// <reference path="ArrayIterator.js" />
/// <reference path="SkipIterator.js" />
/// <reference path="SelectManyIterator.js" />
/// <reference path="GroupByIterator.js" />
/// <reference path="OrderByIterator.js" />

(function () {
    function _defaultComparer(a, b) {
        return a == b;
    };

    Array.prototype.asIterator = function () {
        return new ArrayIterator(this);
    };

    Array.prototype.where = function (predicate) {
        return new WhereSelectIterator(this, predicate);
    };

    Array.prototype.select = function (selector) {
        return new WhereSelectIterator(this, undefined, selector);
    };

    Array.prototype.take = function (count) {
        return new TakeIterator(this, count);
    };

    Array.prototype.skip = function (count) {
        return new SkipIterator(this, count);
    };

    Array.prototype.firstOrDefault = function ($default) {
        if (this.length > 0) {
            return this[0];
        }
        return $default;
    };

    Array.prototype.lastOrDefault = function ($default) {
        if (this.length > 0) {
            return this[this.length - 1];
        }
        return $default;
    };

    Array.prototype.any = function (predicate) {
        if (predicate) {
            for (var i = 0; i < this.length; i++) {
                if (predicate(this[i])) {
                    return true;
                }
            }
            return false;
        }
        return this.length > 0;
    };

    Array.prototype.all = function (predicate) {
        if (!predicate) {
            throw new Error("Invalid null argument: predicate.");
        }
        for (var i = 0; i < this.length; i++) {
            if (!predicate(this[i])) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.count = function () {
        return this.length;
    };

    Array.prototype.contains = function (value, comparer) {
        var comparerImp = comparer || _defaultComparer;

        for (var i = 0; i < this.length; i++) {
            if (comparerImp(this[i], value)) {
                return true;
            }
        }
        return false;
    };

    Array.prototype.elementAt = function (index) {
        if (index < 0 || index >= this.length) {
            throw new Error("Index out of range.");
        }
        return this[index];
    };

    Array.prototype.elementAtOrDefault = function (index, $default) {
        if (index < 0 || index >= this.length) {
            return $default;
        }
        return this[index];
    };

    Array.prototype.selectMany = function (selector) {
        return new SelectManyIterator(this, selector);
    };

    Array.prototype.groupBy = function (keySelector, elementSelector) {
        return new GroupByIterator(this, keySelector, elementSelector);
    };

    Array.prototype.insert = function (index, element) {
        this.splice(index, 0, element);
    };

    Array.prototype.orderBy = function (keySelector) {
        return new OrderByIterator(this, keySelector, false);
    };

    Array.prototype.orderByDescending = function (keySelector) {
        return new OrderByIterator(this, keySelector, true);
    };

    Array.prototype.forEach = function (action) {

        if (!action) {
            return;
        }

        var $break = false;

        for (var i = 0; i < this.length; i++) {
            var option = {
                $index: i,
                $break: function () {
                    $break = true;
                }
            };

            action(this[i], option);

            if ($break) {
                break;
            }
        }
    };

    Iterator.prototype.asIterator = function () {
        return this.reset();
    };

    Iterator.prototype.where = function (predicate) {
        if (this.getPredicate && !this.getPredicate()) {
            this.setPredicate(predicate);
            return this;
        }
        return new WhereSelectIterator(this, predicate);
    };

    Iterator.prototype.select = function (selector) {
        if (this.getSelector && !this.getSelector()) {
            this.setSelector(selector);
            return this;
        }
        return new WhereSelectIterator(this, undefined, selector);
    };

    Iterator.prototype.take = function (count) {
        return new TakeIterator(this, count);
    };

    Iterator.prototype.skip = function (count) {
        return new SkipIterator(this, count);
    };

    Iterator.prototype.firstOrDefault = function ($default) {
        if (this.moveNext()) {
            var result = this.current;
            this.reset();

            return result;
        }
        return $default;
    };

    Iterator.prototype.lastOrDefault = function ($default) {
        if (this.moveNext()) {
            var result;

            do {
                result = this.current;
            }
            while (this.moveNext());

            this.reset();
            return result;
        }
        return $default;
    };

    Iterator.prototype.any = function (predicate) {
        if (predicate) {
            while (this.moveNext()) {
                if (predicate(this.current)) {
                    this.reset();
                    return true;
                }
            }
            this.reset();
            return false;
        }
        var hasAny = this.moveNext();
        this.reset();

        return hasAny;
    };

    Iterator.prototype.all = function (predicate) {
        if (!predicate) {
            throw new Error("Invalid null argument: predicate.");
        }
        while (this.moveNext()) {
            if (!predicate(this.current)) {
                this.reset();
                return false;
            }
        }
        this.reset();
        return true;
    };

    Iterator.prototype.count = function () {
        var count = 0;

        while (this.moveNext()) {
            count++;
        }
        this.reset();
        return count;
    };

    Iterator.prototype.contains = function (value, comparer) {
        var comparerImp = comparer || _defaultComparer;

        while (this.moveNext()) {
            if (comparerImp(this.current, value)) {
                this.reset();
                return true;
            }
        }
        this.reset();
        return false;
    };

    Iterator.prototype.elementAt = function (index) {
        var element;

        while (true) {
            if (!this.moveNext()) {
                throw new Error("Sequence is empty.");
            }
            if (index == 0) {
                element = this.current;
                break;
            }
            index--;
        }
        this.reset();
        return element;
    };

    Iterator.prototype.elementAtOrDefault = function (index, $default) {
        if (index < 0) {
            return $default;
        }

        var result = $default;

        while (true) {
            if (!this.moveNext()) {
                break;
            }
            if (index === 0) {
                result = this.current;
                break;
            }
            index--;
        }
        this.reset();
        return result;
    };

    Iterator.prototype.toArray = function () {
        var result = [];

        while (this.moveNext()) {
            result.push(this.current);
        }

        this.reset();
        return result;
    };

    Iterator.prototype.selectMany = function (selector) {
        return new SelectManyIterator(this, selector);
    };

    Iterator.prototype.groupBy = function (keySelector, elementSelector) {
        return new GroupByIterator(this, keySelector, elementSelector);
    };

    Iterator.prototype.orderBy = function (keySelector) {
        return new OrderByIterator(this, keySelector, false);
    };

    Iterator.prototype.orderByDescending = function (keySelector) {
        return new OrderByIterator(this, keySelector, true);
    };

    Iterator.prototype.forEach = function (action) {
        if (!action) {
            return;
        }

        var $break = false;
        var index = 0;

        while (this.moveNext()) {
            var option = {
                $index: index,
                $break: function () {
                    $break = true;
                }
            };

            action(this.current, option);

            if ($break) {
                break;
            }
            index++;
        }
        this.reset();
    };
})();
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
function Iterator(_source) {

    if (!_source) {
        throw new Error("Invalid null argument: _source.");
    }

    this.completed = false;
    this.current = undefined;

    this.iterateFunction = function () {
        return false;
    };

    this.resetFunction = function () {
    };

    this.moveNext = function(){
        if (this.completed) {
            return false;
        }

        this.current = undefined;
        return this.iterateFunction();
    };

    this.reset = function () {
        this.completed = false;
        this.resetFunction();
    };
};
String.prototype.getHashCode = function () {
    var hash = 0, i, chr, len;

    if (this.length === 0) {
        return hash;
    }
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
};

Number.prototype.getHashCode = function () {
    var x = this;

    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = ((x >> 16) ^ x);

    return x;
};

Object.prototype.getHashCode = function () {
    var hash1, hash2;

    for (var prop in this) {
        var value = this[prop];
        var type = typeof value;

        if (value && value.getHashCode && type !== "object" && type !== "function") {
            if (!hash1) {
                hash1 = value.getHashCode();
            }
            else if (!hash2) {
                hash2 = value.getHashCode();
            }
            else {
                break;
            }
        }
    }

    if (hash1 && hash2) {
        return (hash1 | hash2).getHashCode();
    }
    else if (hash1) {
        return hash1.getHashCode();
    }
    return 0;
};

Date.prototype.getHashCode = function () {
    return this.getTime();
};
/// <reference path="Iterator.js" />
/// <reference path="ArrayIterator.js" />

function OrderByIterator(_source, _keySelector, _desc) {
    Iterator.call(this, _source);

    var resultIterator;
    var keys;

    function defaultComparer(a, b) {
        if (a === b) {
            return 0;
        }
        if (a < b) {
            return -1;
        }
        return 1;
    };

    function computeKeys(elements, count) {
        keys = new Array(count);
        for (var i = 0; i < count; i++) {
            keys[i] = _keySelector(elements[i]);
        }
    };

    function compareKeys(index1, index2) {
        var v = defaultComparer(keys[index1], keys[index2]);

        if (v === 0) {
            return index1 - index2;
        }
        return _desc ? -v : v;
    }

    function sort(elements, count) {
        computeKeys(elements, count);

        var map = new Array(count);
        for (var i = 0; i < count; i++) {
            map[i] = i
        }
        quickSort(map, 0, count - 1);

        return map;
    };

    function quickSort(map, left, right) {
        do {
            var i = left;
            var j = right;
            var x = map[i + ((j - i) >> 1)];
            do {
                while (i < map.length && compareKeys(x, map[i]) > 0) {
                    i++
                };
                while (j >= 0 && compareKeys(x, map[j]) < 0) {
                    j--
                };
                if (i > j) {
                    break
                };
                if (i < j) {
                    var temp = map[i];
                    map[i] = map[j];
                    map[j] = temp;
                }
                i++;
                j--;
            } while (i <= j);
            if (j - left <= right - i) {
                if (left < j) quickSort(map, left, j);
                left = i;
            }
            else {
                if (i < right) quickSort(map, i, right);
                right = j;
            }
        } while (left < right);
    }

    function iterateArray(elements) {
        var result = [];

        if (elements.length > 0) {
            var map = sort(elements, elements.length);

            for (var i = 0; i < elements.length; i++) {
                result.push(elements[map[i]]);
            }
        }
        resultIterator = new ArrayIterator(result);
    };

    function iterateIterator() {
        iterateArray(_source.toArray());
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
        iterateArray(_source);
    }
    else if (_source instanceof Iterator) {
        iterateIterator();
    }
    else {
        throw new Error("Invalid argument: _source.");
    }

    if (!_keySelector) {
        throw new Error("Invalid null argument: _keySelector.");
    }
};

OrderByIterator.prototype = Iterator.prototype;
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
        throw new Error("Invalid argument: _source.");
    }
    if (!_selector) {
        throw new Error("Invalid null argument: _selector.");
    }

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

        for (var i = index; i < _source.length; i++) {
            index = i;
            currentIterator = new ArrayIterator(_selector(_source[i]));

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

        while (_source.moveNext()) {
            currentIterator = new ArrayIterator(_selector(_source.current));

            if (this.iterateCurrent()) {
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
        index = -1;
        currentIterator = undefined;
    };
};

SelectManyIterator.prototype = Iterator.prototype;
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