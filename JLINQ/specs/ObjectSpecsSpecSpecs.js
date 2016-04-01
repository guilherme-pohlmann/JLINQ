/// <reference path="..\Object.js" />

describe('Object Tests', function () {

    it('Number hashsing equals', function () {

        var a = (Math.random() * 99999999);
        var ah1 = a.getHashCode();
        var ah2 = a.getHashCode();

        expect(ah1).toBe(ah2);
    });

    it('Number hashsing not equals', function () {

        var a = (Math.random() * 99999999);
        var b = (Math.random() * 99999999);
        var ah1 = a.getHashCode();
        var ah2 = b.getHashCode();

        expect(ah1 !== ah2).toBe(true);
    });

    it('String hashsing equals', function () {

        var a = 'test string';
        var ah1 = a.getHashCode();
        var ah2 = a.getHashCode();

        expect(ah1).toBe(ah2);
    });

    it('String hashsing not equals', function () {

        var a = 'test string 2';
        var b = 'test string 3';
        var ah1 = a.getHashCode();
        var ah2 = b.getHashCode();

        expect(ah1 !== ah2).toBe(true);
    });

    it('Date hashsing equals', function () {

        var a = new Date();
        var ah1 = a.getHashCode();
        var ah2 = a.getHashCode();

        expect(ah1).toBe(ah2);

        a = new Date('2016-01-01');
        ah1 = a.getHashCode();
        ah2 = a.getHashCode();

        expect(ah1).toBe(ah2);
    });

    it('Date hashsing not equals', function () {

        var a = new Date('2016-01-01 12:25:10');
        var b = new Date('2016-01-01 12:25:11');
        var ah1 = a.getHashCode();
        var ah2 = b.getHashCode();

        expect(ah1 !== ah2).toBe(true);
    });

    it('Object hashsing equals', function () {

        var a = {
            str: 'test string',
            number: (Math.random() * 99999999)
        };
        var ah1 = a.getHashCode();
        var ah2 = a.getHashCode();

        expect(ah1).toBe(ah2);

        var b = {
            str: 'test string',
            number: a.number
        };
        var bh1 = b.getHashCode();

        expect(ah1).toBe(bh1);
    });

    it('Object hashsing not equals', function () {

        var a = {
            str: 'test string2',
            number: (Math.random() * 99999999)
        };
        var ah1 = a.getHashCode();

        var b = {
            str: 'test string3',
            number: (Math.random() * 99999999)
        };
        var bh1 = b.getHashCode();

        expect(ah1 !== bh1).toBe(true);
    });
});

