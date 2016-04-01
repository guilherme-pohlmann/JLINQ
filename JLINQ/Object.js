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