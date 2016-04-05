/// <reference path="..\Object.js" />
/// <reference path="..\DataTable.js" />

describe('Testa as funcionalidades da função DataTable', function () {

    it('Simple DataTable Test', function () {

        var dt = new DataTable();
        dt.addColumns(['id', 'nome']);

        dt.addRow([10, 'teste']);
        dt.addRow([11]);

        expect(dt.row(0).value(0)).toBe(10);
        expect(dt.row(0).value(1)).toBe('teste');
        expect(dt.row(1).value(0)).toBe(11);
        expect(dt.row(1).value(1)).toBe(undefined);
    });
});
