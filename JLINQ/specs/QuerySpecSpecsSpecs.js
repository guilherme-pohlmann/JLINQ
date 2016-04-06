/// <reference path="..\Enumerable.js" />

describe('Testa as funcionalidades da função Enumerable utilizando queries complexas', function () {

    it('Where+Select', function () {

        var source =
            [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
            ];

        var iterator = source.where(function (el) { return el.id > 2 })
                             .select(function (el) { return el.id });

        expect(iterator.count()).toBe(2);
        expect(iterator.elementAt(0)).toBe(3);
        expect(iterator.elementAt(1)).toBe(4);
    });

    it('Where+Select+Take', function () {

        var source =
            [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
            ];

        var iterator = source.where(function (el) { return el.id > 2 })
                             .select(function (el) { return el.id })
                             .take(1);

        expect(iterator.count()).toBe(1);
        expect(iterator.elementAt(0)).toBe(3);
    });

    it('Where+Select+FirstOrDefault', function () {

        var source =
            [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
            ];

        var element = source.where(function (el) { return el.id > 2 })
                            .select(function (el) { return el.id })
                            .firstOrDefault();

        expect(element).toBe(3);
    });

    it('Where+Select+LastOrDefault', function () {

        var source =
            [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
            ];

        var element = source.where(function (el) { return el.id > 2 })
                            .select(function (el) { return el.id })
                            .lastOrDefault();

        expect(element).toBe(4);
    });

    it('Where+Select+All', function () {

        var source =
            [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
                { id: 5 },
                { id: 6 },
            ];

        var result = source.where(function (el) { return el.id > 2 })
                           .select(function (el) { return el.id })
                           .all(function (el) { return el > 2 });

        expect(result).toBe(true);
    });

    it('Where+Select+ForEach', function () {

        var source =
            [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
                { id: 5 },
                { id: 6 },
            ];

        var result = source.where(function (el) { return el.id > 2 })
                           .select(function (el) { return el.id });

        result.forEach(function (element) {
            expect(typeof element == "number").toBe(true);
            expect(element > 2).toBe(true);
        });
    });

    it('Where+Select+ToArray+ForEach', function () {

        var source =
            [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
                { id: 5 },
                { id: 6 },
            ];

        var result = source.where(function (el) { return el.id > 2 })
                           .select(function (el) { return el.id })
                           .toArray();


        var count = 0;

        result.forEach(function (element, option) {
            expect(typeof element == "number").toBe(true);
            expect(element > 2).toBe(true);

            if (option.$index === 2) {
                option.$break();
            }
            else {
                count++;
            }
        });
        expect(count).toBe(2);
    });

    it('Where+SelectMany+Where++Count+ElementAt', function () {

        var source =
            [
                { id: 1, chars: ['1', '2'] },
                { id: 2, chars: ['3', '4'] },
                { id: 3, chars: ['5', '6'] },
                { id: 4, chars: ['7', '8'] },
                { id: 5, chars: ['9', '10'] },
                { id: 6, chars: ['11', '12'] },
                { id: 7, chars: ['13', '14'] },
                { id: 8, chars: ['15', '16'] },
                { id: 9, chars: ['17', '18'] },
                { id: 10, chars: ['19', '20'] },
            ];

        var result = source.where(function (el) { return el.id > 5 })
                           .selectMany(function (el) { return el.chars })
                           .where(function (ch) { return ch - '0' >= 15 });

        expect(result.count()).toBe(6);
        expect(result.elementAt(0)).toBe('15');
        expect(result.elementAt(1)).toBe('16');
        expect(result.elementAt(2)).toBe('17');
        expect(result.elementAt(3)).toBe('18');
        expect(result.elementAt(4)).toBe('19');
        expect(result.elementAt(5)).toBe('20');
    });

    it('OrderBy+Where+Skip+forEach', function () {
        var array = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

        array.orderBy(function (e) { return e })
             .where(function (e) { return e > 5 })
             .skip(1)
             .forEach(function (e) {
                 expect(e > 6).toBe(true);
             });
    });
});
