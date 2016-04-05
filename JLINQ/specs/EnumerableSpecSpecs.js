/// <reference path="..\Object.js" />
/// <reference path="..\Enumerable.js" />

describe('Testa as funcionalidades da função Enumerable', function () {

    it('Where sobre Array', function () {
        var source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 1000, 10000];
        var iterator = source.where(function (el) { return el > 10 }).toArray();

        expect(iterator.count()).toBe(3);
        expect(iterator.elementAt(0)).toBe(100);
        expect(iterator.elementAt(1)).toBe(1000);
        expect(iterator.elementAt(2)).toBe(10000);
    });

    it('Where sobre Iterator', function () {
        var source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 1000, 10000];
        var iterator = source.where(function (el) { return el > 10 }).where(function (el) { return el > 100 });

        expect(iterator.count()).toBe(2);
        expect(iterator.elementAt(0)).toBe(1000);
        expect(iterator.elementAt(1)).toBe(10000);
    });

    it('Select sobre Array', function () {
        var source = [1, 2, 3, 4, 5];
        var iterator = source.select(function (el) { return "Valor:" + el.toString() }).toArray();

        expect(iterator.count()).toBe(5);
        expect(iterator.elementAt(0)).toBe("Valor:1");
        expect(iterator.elementAt(1)).toBe("Valor:2");
        expect(iterator.elementAt(2)).toBe("Valor:3");
        expect(iterator.elementAt(3)).toBe("Valor:4");
        expect(iterator.elementAt(4)).toBe("Valor:5");
    });

    it('Select sobre Iterator', function () {
        var source = [1, 2, 3, 4, 5].asIterator();
        var iterator = source.select(function (el) { return "Valor:" + el.toString() });

        expect(iterator.count()).toBe(5);
        expect(iterator.elementAt(0)).toBe("Valor:1");
        expect(iterator.elementAt(1)).toBe("Valor:2");
        expect(iterator.elementAt(2)).toBe("Valor:3");
        expect(iterator.elementAt(3)).toBe("Valor:4");
        expect(iterator.elementAt(4)).toBe("Valor:5");
    });

    it('Take sobre Array', function () {
        var source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].take(5).toArray();

        expect(source.count()).toBe(5);
        expect(source.elementAt(0)).toBe(1);
        expect(source.elementAt(1)).toBe(2);
        expect(source.elementAt(2)).toBe(3);
        expect(source.elementAt(3)).toBe(4);
        expect(source.elementAt(4)).toBe(5);
    });

    it('Take sobre Iterator', function () {
        var source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].take(5);

        expect(source.count()).toBe(5);
        expect(source.elementAt(0)).toBe(1);
        expect(source.elementAt(1)).toBe(2);
        expect(source.elementAt(2)).toBe(3);
        expect(source.elementAt(3)).toBe(4);
        expect(source.elementAt(4)).toBe(5);
    });

    it('Skip sobre Array', function () {
        var source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].skip(5).toArray();

        expect(source.count()).toBe(5);
        expect(source.elementAt(0)).toBe(6);
        expect(source.elementAt(1)).toBe(7);
        expect(source.elementAt(2)).toBe(8);
        expect(source.elementAt(3)).toBe(9);
        expect(source.elementAt(4)).toBe(10);
    });

    it('Skip sobre Iterator', function () {
        var source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].skip(5);

        expect(source.count()).toBe(5);
        expect(source.elementAt(0)).toBe(6);
        expect(source.elementAt(1)).toBe(7);
        expect(source.elementAt(2)).toBe(8);
        expect(source.elementAt(3)).toBe(9);
        expect(source.elementAt(4)).toBe(10);
    });

    it('FirstOrDefault sobre Array com resultado', function () {
        var el = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].firstOrDefault();

        expect(el).toBe(1);
    });

    it('FirstOrDefault sobre Array sem resultado sem default', function () {
        var el = [].firstOrDefault();

        expect(el).toBe(undefined);
    });

    it('FirstOrDefault sobre Array sem resultado com default', function () {
        var el = [].firstOrDefault(0);

        expect(el).toBe(0);
    });

    it('FirstOrDefault sobre Iterator com resultado', function () {
        var el = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].asIterator().firstOrDefault();

        expect(el).toBe(1);
    });

    it('FirstOrDefault sobre Iterator sem resultado sem default', function () {
        var el = [].asIterator().firstOrDefault();

        expect(el).toBe(undefined);
    });

    it('FirstOrDefault sobre Iterator sem resultado com default', function () {
        var el = [].asIterator().firstOrDefault(0);

        expect(el).toBe(0);
    });

    it('LastOrDefault sobre Array com resultado', function () {
        var el = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].lastOrDefault();

        expect(el).toBe(10);
    });

    it('LastOrDefault sobre Array sem resultado sem default', function () {
        var el = [].lastOrDefault();

        expect(el).toBe(undefined);
    });

    it('LastOrDefault sobre Array sem resultado com default', function () {
        var el = [].lastOrDefault(0);

        expect(el).toBe(0);
    });

    it('LastOrDefault sobre Iterator com resultado', function () {
        var el = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].asIterator().lastOrDefault();
        expect(el).toBe(10);
    });

    it('LastOrDefault sobre Iterator sem resultado sem default', function () {
        var el = [].asIterator().lastOrDefault();
        expect(el).toBe(undefined);
    });

    it('LastOrDefault sobre Iterator sem resultado com default', function () {
        var el = [].asIterator().lastOrDefault(0);
        expect(el).toBe(0);
    });

    it('Any sobre Array com predicate com resultado', function () {
        expect([1, 2, 3, 4, 5].any(function (el) { return el === 5 })).toBe(true);
    });

    it('Any sobre Array com predicate sem resultado', function () {
        expect([1, 2, 3, 4, 5].any(function (el) { return el === 15 })).toBe(false);
    });

    it('Any sobre Iterator com predicate com resultado', function () {
        expect([1, 2, 3, 4, 5].asIterator().any(function (el) { return el === 5 })).toBe(true);
    });

    it('Any sobre Iterator com predicate sem resultado', function () {
        expect([1, 2, 3, 4, 5].asIterator().any(function (el) { return el === 15 })).toBe(false);
    });

    it('Any sobre Array sem predicate com resultado', function () {
        expect([1, 2, 3, 4, 5].any()).toBe(true);
    });

    it('Any sobre Array sem predicate sem resultado', function () {
        expect([].any()).toBe(false);
    });

    it('Any sobre Iterator sem predicate com resultado', function () {
        expect([1, 2, 3, 4, 5].asIterator().any()).toBe(true);
    });

    it('Any sobre Iterator sem predicate sem resultado', function () {
        expect([].asIterator().any()).toBe(false);
    });

    it('All sobre Array', function () {
        expect([1, 2, 3, 4].all(function (el) { return el > 0 })).toBe(true);
        expect([1, 2, -3, 4].all(function (el) { return el > 0 })).toBe(false);
    });

    it('All sobre Iterator', function () {
        expect([1, 2, 3, 4].asIterator().all(function (el) { return el > 0 })).toBe(true);
        expect([1, 2, -3, 4].asIterator().all(function (el) { return el > 0 })).toBe(false);
    });

    it('Contains sobre Array sem comparador com resultado', function () {
        expect([1, 2, 3, 4, 5].contains(4)).toBe(true);
    });

    it('Contains sobre Array sem comparador sem resultado', function () {
        expect([1, 2, 3, 4, 5].contains(10)).toBe(false);
    });

    it('Contains sobre Array com comparador com resultado', function () {
        var obj = {
            id: 10
        };

        expect([{ id: 1 }, { id: 2 }, obj, { id: 4 }].contains(obj, function (a, b) { return a.id == b.id })).toBe(true);
    });

    it('Contains sobre Array com comparador sem resultado', function () {
        var obj = {
            id: 10
        };

        expect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }].contains(obj, function (a, b) { return a.id == b.id })).toBe(false);
    });

    it('Contains sobre Iterator sem comparador com resultado', function () {
        expect([1, 2, 3, 4, 5].asIterator().contains(4)).toBe(true);
    });

    it('Contains sobre Iterator sem comparador sem resultado', function () {
        expect([1, 2, 3, 4, 5].asIterator().contains(10)).toBe(false);
    });

    it('Contains sobre Iterator com comparador com resultado', function () {
        var obj = {
            id: 10
        };

        expect([{ id: 1 }, { id: 2 }, obj, { id: 4 }].asIterator().contains(obj, function (a, b) { return a.id == b.id })).toBe(true);
    });

    it('Contains sobre Iterator com comparador sem resultado', function () {
        var obj = {
            id: 10
        };

        expect([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }].asIterator().contains(obj, function (a, b) { return a.id == b.id })).toBe(false);
    });

    it('ElementAt sobre sobre Array com resultado', function () {
        expect([1, 2, 3].elementAt(1)).toBe(2);
    });

    it('ElementAt sobre sobre Array sem resultado', function () {
        expect(function () { [1, 2, 3].elementAt(5) }).toThrow(new Error("Index out of range."));
    });

    it('ElementAt sobre sobre Iterator com resultado', function () {
        expect([1, 2, 3].asIterator().elementAt(1)).toBe(2);
    });

    it('ElementAt sobre sobre Iterator sem resultado', function () {
        expect(function () { [1, 2, 3].asIterator().elementAt(5) }).toThrow(new Error("Index out of range."));
    });

    it('ElementAtOrDefault sobre Array com resultado', function () {
        expect([1, 2, 3].elementAtOrDefault(1)).toBe(2);
    });

    it('ElementAtOrDefault sobre Array sem resultado sem default', function () {
        expect([1, 2, 3].elementAtOrDefault(10)).toBe(undefined);
        expect([1, 2, 3].elementAtOrDefault(-1)).toBe(undefined);
    });

    it('ElementAtOrDefault sobre Array sem resultado com default', function () {
        expect([1, 2, 3].elementAtOrDefault(10, 0)).toBe(0);
        expect([1, 2, 3].elementAtOrDefault(-1, 0)).toBe(0);
    });

    it('ElementAtOrDefault sobre Iterator com resultado', function () {
        expect([1, 2, 3].asIterator().elementAtOrDefault(1)).toBe(2);
    });

    it('ElementAtOrDefault sobre Iterator sem resultado sem default', function () {
        expect([1, 2, 3].asIterator().elementAtOrDefault(10)).toBe(undefined);
        expect([1, 2, 3].asIterator().elementAtOrDefault(-1)).toBe(undefined);
    });

    it('ElementAtOrDefault sobre Iterator sem resultado com default', function () {
        expect([1, 2, 3].asIterator().elementAtOrDefault(10, 0)).toBe(0);
        expect([1, 2, 3].asIterator().elementAtOrDefault(-1, 0)).toBe(0);
    });

    it('SelectMany sobre Array', function () {
        var x =
         [
            { ids: [1, 2] },
            { ids: [3, 4] },
            { ids: [5, 6] },
            { ids: [7, 8] },
            { ids: [9, 10] }
         ].selectMany(function (el) { return el.ids });

        expect(x.count()).toBe(10);
        expect(x.elementAt(0)).toBe(1);
        expect(x.elementAt(1)).toBe(2);
        expect(x.elementAt(2)).toBe(3);
        expect(x.elementAt(3)).toBe(4);
        expect(x.elementAt(4)).toBe(5);
        expect(x.elementAt(5)).toBe(6);
        expect(x.elementAt(6)).toBe(7);
        expect(x.elementAt(7)).toBe(8);
        expect(x.elementAt(8)).toBe(9);
        expect(x.elementAt(9)).toBe(10);
    });

    it('SelectMany sobre Iterator', function () {
        var x =
         [
            { ids: [1, 2] },
            { ids: [3, 4] },
            { ids: [5, 6] },
            { ids: [7, 8] },
            { ids: [9, 10] }
         ].asIterator().selectMany(function (el) { return el.ids });

        expect(x.count()).toBe(10);
        expect(x.elementAt(0)).toBe(1);
        expect(x.elementAt(1)).toBe(2);
        expect(x.elementAt(2)).toBe(3);
        expect(x.elementAt(3)).toBe(4);
        expect(x.elementAt(4)).toBe(5);
        expect(x.elementAt(5)).toBe(6);
        expect(x.elementAt(6)).toBe(7);
        expect(x.elementAt(7)).toBe(8);
        expect(x.elementAt(8)).toBe(9);
        expect(x.elementAt(9)).toBe(10);
    });

    it('GroupBy sobre Array', function () {
        
        var array =
            [
                {
                    id: 1,
                    nome: '1'
                },
                {
                    id: 1,
                    nome: '2'
                },
                {
                    id: 1,
                    nome: '3'
                },
                {
                    id: 2,
                    nome: '4'
                },
                {
                    id: 2,
                    nome: '4'
                },
                {
                    id: 2,
                    nome: '4'
                }
                ,
                {
                    id: 3,
                    nome: '4'
                },
                {
                    id: 3,
                    nome: '4'
                },
                {
                    id: 3,
                    nome: '4'
                },
                {
                    id: 3,
                    nome: '4'
                }
                ,
                {
                    id: 4,
                    nome: '4'
                }
                ,
                {
                    id: 4,
                    nome: '4'
                },
                {
                    id: 5,
                    nome: '4'
                }
                ,
                {
                    id: 5,
                    nome: '4'
                }
                ,
                {
                    id: 5,
                    nome: '4'
                },
                {
                    id: 6,
                    nome: '4'
                },
                {
                    id: 7,
                    nome: '4'
                }
                ,
                {
                    id: 8,
                    nome: '4'
                },
                {
                    id: 9,
                    nome: '4'
                }
            ];
        var x = array.groupBy(function (ob) { return ob.id }, function (ob) { return ob });

        while (x.moveNext()) {
            var cur = x.current;
        }
    });

    it('OrderBy sobre Array', function () {
        
        var ar = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0].orderBy(function (e) { return e }).toArray();



    });
});
