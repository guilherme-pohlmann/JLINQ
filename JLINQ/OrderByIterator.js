/// <reference path="Iterator.js" />
/// <reference path="ArrayIterator.js" />

function OrderByIterator(_source, _keySelector, _desc) {
    Iterator.call(this, _source);

    if (_source instanceof Array) {
        this.iterateFunction = iterateArray;
    }
    else if (_source instanceof Iterator) {
        this.iterateFunction = iterateIterator;
    }
    else {
        throw new Error("Invalid argument.");
    }

    var source = _source;
    var keySelector = _keySelector;
    var desc = _desc;
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
            keys[i] = keySelector(elements[i]);
        }
    };

    function compareKeys(index1, index2) {
        var v = defaultComparer(keys[index1], keys[index2]);

        if (v === 0) {
            return index1 - index2;
        }
        return desc ? -v : v;
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
                while (i < map.length && compareKeys(x, map[i]) > 0) i++;
                while (j >= 0 && compareKeys(x, map[j]) < 0) j--;
                if (i > j) break;
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

    function iterateArray() {
        var result = [];

        if (source.length > 0) {
            var map = sort(source, source.length);

            for (var i = 0; i < source.length; i++) {
                result.push(source[map[i]]);
            }
        }
        resultIterator = new ArrayIterator(result);
    };

    function iterateIterator() {
        
        

        
    };
};

OrderByIterator.prototype = Iterator.prototype;