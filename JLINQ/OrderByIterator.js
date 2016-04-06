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