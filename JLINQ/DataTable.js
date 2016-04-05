function DataColumn(name) {
    this.name = name;
};

function DataRow(columns, values) {
    this.values = values;
    this.columns = columns;

    this.value = function (index) {
        if (index < values.length) {
            return values[index];
        }
        return undefined;
    };

    this.setValue = function (index, value) {
        if (index < values.length) {
            values[index] = value;
        }
    };

    this.getValues = function () {
        return values;
    };
};

function DataTable() {

    this.columns = [];
    this.rows = [];

    this.addColumn = function (name) {
        var index = this.columns.push(new DataColumn(name)) - 1;

        for (var i = 0; i < this.rows.length; i++) {
            this.rows[i].values.length++;
        }
        return index;
    };

    this.insertColumn = function (index, name) {
        this.columns.splice(index, 0, new DataColumn(name));

        for (var i = 0; i < this.rows.length; i++) {
            this.rows[i].values.splice(index, 0, undefined);
        }
        return index;
    };

    this.addRow = function (dataRow) {
        return this.rows.push(dataRow) - 1;
    };

    this.row = function (index, create) {
        if (index < this.rows.length) {
            return this.rows[index];
        }

        if (create) {
            return this.rows[this.addRow(new DataRow(this.columns, new Array(this.columns.length)))];
        }
        return undefined;
    };

    this.getRows = function () {
        return this.rows;
    };

    this.containsColumn = function (name, ignoreCase) {
        var a = ignoreCase ? name.toLowerCase() : name;
        var b;

        for (var i = 0; i < this.columns.length; i++) {
            b = ignoreCase ? this.columns[i].toLowerCase() : this.columns[i];

            if (a === b) {
                return true;
            }
        }
        return false;
    };

    this.createRow = function () {
        return new DataRow(this.columns, new Array(this.columns.length));
    };
};