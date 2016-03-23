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
});
