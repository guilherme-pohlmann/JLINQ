/// <reference path="Iterator.js" />
/// <reference path="WhereSelectIterator.js" />
/// <reference path="TakeIterator.js" />
/// <reference path="ArrayIterator.js" />
/// <reference path="SkipIterator.js" />
/// <reference path="SelectManyIterator.js" />
/// <reference path="GroupByIterator.js" />

(function () {
    function invalidSource() {
        throw new Error("Invalid source");
    };

    function where(source, predicate) {
        if (source instanceof Iterator) {
            if (source.getPredicate && !source.getPredicate()) {
                source.setPredicate(predicate);
                return source;
            }
            return new WhereSelectIterator(source, predicate);
        }
        else if (source instanceof Array) {
            return new WhereSelectIterator(source, predicate);
        }
        invalidSource();
    };

    function select(source, selector) {
        if (source instanceof Iterator) {
            if (source.getSelector && !source.getSelector()) {
                source.setSelector(selector);
                return source;
            }
            else {
                return new WhereSelectIterator(source, undefined, selector);
            }
        }
        else if (source instanceof Array) {
            return new WhereSelectIterator(source, undefined, selector);
        }
        invalidSource();
    };

    function selectMany(source, selector) {
        if (source instanceof Iterator || source instanceof Array) {
            return new SelectManyIterator(source, selector);
        }
        invalidSource();
    };

    function take(source, count) {
        if (source instanceof Iterator || source instanceof Array) {
            return new TakeIterator(source, count);
        }
        invalidSource();
    };

    function skip(source, count) {
        if (source instanceof Iterator || source instanceof Array) {
            return new SkipIterator(source, count);
        }
        invalidSource();
    };

    function firstOrDefault(source, $default) {
        if (source instanceof Array && source.length > 0) {
            return source[0];
        }
        else if (source instanceof Iterator && source.moveNext()) {
            var result = source.current;
            source.reset();

            return result;
        }
        return $default;
    };

    function lastOrDefault(source, $default) {
        if (source instanceof Array && source.length > 0) {
            return source[source.length - 1];
        }
        else if (source instanceof Iterator && source.moveNext()) {
            var result;

            do {
                result = source.current;
            }
            while (source.moveNext());

            source.reset();
            return result;
        }
        return $default;
    };

    function any(source, predicate) {
        if (source instanceof Array) {
            if (predicate) {
                for (var i = 0; i < source.length; i++) {
                    if (predicate(source[i])) {
                        return true;
                    }
                }
                return false;
            }
            return source.length > 0;
        }
        else if (source instanceof Iterator) {
            if (predicate) {
                while (source.moveNext()) {
                    if (predicate(source.current)) {
                        source.reset();
                        return true;
                    }
                }
                source.reset();
                return false;
            }
            var hasAny = source.moveNext();
            source.reset();

            return hasAny;
        }
        return false;
    };

    function all(source, predicate) {

        if (!predicate) {
            throw new Error("Argument null: predicate");
        }

        if (source instanceof Array) {
            for (var i = 0; i < source.length; i++) {
                if (!predicate(source[i])) {
                    return false;
                }
            }
            return true;
        }
        else if (source instanceof Iterator) {
            while (source.moveNext()) {
                if (!predicate(source.current)) {
                    source.reset();
                    return false;
                }
            }
            source.reset();
            return true;
        }
        invalidSource();
    };

    function count(source) {
        var count = 0;

        if (source instanceof Array) {
            count = source.length;
        }
        else if (source instanceof Iterator) {
            while (source.moveNext()) {
                count++;
            }
            source.reset();
        }
        else {
            invalidSource();
        }
        return count;
    };

    function contains(source, value, comparer) {
        if (source instanceof Array) {
            for (var i = 0; i < source.length; i++) {
                if (comparer(source[i], value)) {
                    return true;
                }
            }
            return false;
        }
        else if (source instanceof Iterator) {
            while (source.moveNext()) {
                if (comparer(source.current, value)) {
                    source.reset();
                    return true;
                }
            }
            source.reset();
            return false;
        }
        invalidSource();
    };

    function elementAt(source, index) {
        if (index < 0) {
            throw new Error("Index out of range.");
        }

        var element;

        if (source instanceof Array) {
            if (index < source.length) {
                element = source[index];
            }
            else {
                throw new Error("Index out of range.");
            }
        }
        else if (source instanceof Iterator) {
            while (true) {
                if (!source.moveNext()) {
                    throw new Error("Index out of range.");
                }
                if (index == 0) {
                    element = source.current;
                    break;
                }
                index--;
            }
            source.reset();
        }
        else {
            invalidSource();
        }
        return element;
    };

    function elementAtOrDefault(source, index, $default) {
        if (index < 0) {
            return $default;
        }

        if (source instanceof Array) {
            if (index < source.length) {
                return source[index];
            }
        }
        else if (source instanceof Iterator) {
            while (true) {
                if (!source.moveNext()) {
                    break;
                }
                if (index == 0) {
                    source.reset();
                    return source.current;
                }
                index--;
            }
            source.reset();
        }
        else {
            invalidSource();
        }
        return $default;
    };

    var groupBy = function (source, keySelector, elementSelector) {
        if (!keySelector) {
            throw new Error("Argument null: keySelector");
        }
        return new GroupByIterator(source, keySelector, elementSelector || _defaultSelector);
    };

    function _defaultComparer(a, b) {
        return a == b;
    };

    function _defaultSelector(e) {
        return e;
    };

    Array.prototype.asIterator = function () {
        return new ArrayIterator(this);
    };

    Array.prototype.where = function (predicate) {
        return where(this, predicate);
    };

    Array.prototype.select = function (selector) {
        return select(this, selector);
    };

    Array.prototype.take = function (count) {
        return take(this, count);
    };

    Array.prototype.skip = function (count) {
        return skip(this, count);
    };

    Array.prototype.firstOrDefault = function ($default) {
        return firstOrDefault(this, $default);
    };

    Array.prototype.lastOrDefault = function ($default) {
        return lastOrDefault(this, $default);
    };

    Array.prototype.any = function (predicate) {
        return any(this, predicate);
    };

    Array.prototype.all = function (predicate) {
        return all(this, predicate);
    };

    Array.prototype.count = function () {
        return count(this);
    };

    Array.prototype.contains = function (value, comparer) {
        return contains(this, value, comparer || _defaultComparer);
    };

    Array.prototype.elementAt = function (index) {
        return elementAt(this, index);
    };

    Array.prototype.elementAtOrDefault = function (index, $default) {
        return elementAtOrDefault(this, index, $default);
    };

    Array.prototype.selectMany = function (selector) {
        return new selectMany(this, selector);
    };

    Array.prototype.groupBy = function (keySelector, elementSelector) {
        return groupBy(this, keySelector, elementSelector);
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
        return where(this, predicate);
    };

    Iterator.prototype.select = function (selector) {
        return select(this, selector);
    };

    Iterator.prototype.take = function (count) {
        return take(this, count);
    };

    Iterator.prototype.skip = function (count) {
        return skip(this, count);
    };

    Iterator.prototype.firstOrDefault = function ($default) {
        return firstOrDefault(this, $default);
    };

    Iterator.prototype.lastOrDefault = function ($default) {
        return lastOrDefault(this, $default);
    };

    Iterator.prototype.any = function (predicate) {
        return any(this, predicate);
    };

    Iterator.prototype.all = function (predicate) {
        return all(this, predicate);
    };

    Iterator.prototype.count = function () {
        return count(this);
    };

    Iterator.prototype.contains = function (value, comparer) {
        return contains(this, value, comparer || _defaultComparer);
    };

    Iterator.prototype.elementAt = function (index) {
        return elementAt(this, index);
    };

    Iterator.prototype.elementAtOrDefault = function (index, $default) {
        return elementAtOrDefault(this, index, $default);
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
        return new selectMany(this, selector);
    };

    Iterator.prototype.groupBy = function (keySelector, elementSelector) {
        return groupBy(this, keySelector, elementSelector);
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