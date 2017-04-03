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

    Array.prototype.firstOrDefault = function ($default, predicate) {
        var source = this;

        if (predicate) {
            for (var index = 0; index < source.length; index++) {
                if (predicate(source[index])) {
                    return source[index];
                }
            }
        } else if (source.length > 0) {
            return source[0];
        }
        return $default;
    };

    Array.prototype.lastOrDefault = function ($default, predicate) {
        var source = this;

        if (predicate) {
            for (var index = source.length - 1; index >= 0; index--) {
                if (predicate(source[index])) {
                    return source[index];
                }
            }
        } else if (source.length > 0) {
            return source[source.length - 1];
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

    Iterator.prototype.firstOrDefault = function ($default, predicate) {

        var result = $default;

        if (this.moveNext()) {
            if (predicate) {
                do {
                    if (predicate(this.current)) {
                        result = this.current;
                        break;
                    }
                }
                while (this.moveNext());
            }
            else {
                result = this.current;
            }

            this.reset();
        }
        return result;
    };

    Iterator.prototype.lastOrDefault = function ($default, predicate) {
        var result = $default;

        if (this.moveNext()) {
            do {
                if (predicate) {
                    if (predicate(this.current)) {
                        result = this.current;
                    }
                } else {
                    result = this.current;
                }
            }
            while (this.moveNext());

            this.reset();
            
        }
        return result;
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