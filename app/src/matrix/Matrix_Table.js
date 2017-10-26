function Matrix_Table (fn, id = null) {
    this.table = (id == null) ? this.add_table() : document.getElementById(id);
    if(id != null) {
        this.add_row(fn);
        this.add_row(fn);
        this.add_col(fn);
        this.add_col(fn);
    } else {
        this.create (fn);
    }
}


Matrix_Table.prototype.create = function (fn) {
    var l = fn("ROW LENGTH");
    var k = fn("COL LENGTH");

    for (var i = 0; i < l; i++) {
        this.add_row();
    }
    for (var j = 0; j < k; j++) {
        this.add_col(fn);
    }

}

Matrix_Table.prototype.collectValues = function () {
    var row, a, r, matrix = new Array();
    for (var i = 0; i < this.table.rows.length; i++) {
        row = this.table.rows[i];
        matrix[i] = new Array();
        for (var j = 0; j < this.table.rows[0].cells.length; j++) {
            r = Rational.string_to_rational(row.cells[j].children[0].value);
            matrix[i][j] = r;
        }
    }
    return matrix;
}

Matrix_Table.prototype.add_table = function () {
    var table = document.createElement("table");
    table.className = Matrix_Table.table_classname;
    return table;
}

Matrix_Table.prototype.add_row = function (fn = null) {
    var i = this.table.rows.length;
    var row = this.table.insertRow();
    var cell;
    for (var j = 0; j < this.table.rows[0].cells.length; j++) {
        cell = row.insertCell(j);
        if(fn != null)
            cell.appendChild(fn(i, j));
    }
}
Matrix_Table.prototype.add_col = function (fn) {
    var row, cell, j = this.table.rows[0].cells.length;
    for (var i = 0; i < this.table.rows.length; i++) {
        row = this.table.rows[i];
        cell = row.insertCell(j);
        cell.appendChild(fn(i, j));
    }
}
Matrix_Table.prototype.minus_row = function () {
    console.log(this.table.rows.length);
    if (this.table.rows.length > 1){
        console.log("MINUS ROW");
        this.table.deleteRow(this.table.rows.length - 1)
    }
}
Matrix_Table.prototype.minus_col = function () {
    console.log(this.table.rows.length);
    if (this.table.rows.length > 0 && this.table.rows[0].cells.length > 1) {
        console.log("MINUS COL");
        for (var i = 0; i < this.table.rows.length; i++) {
            var row = this.table.rows[i];
            row.deleteCell(row.cells.length - 1);
        }
    }
}

Matrix_Table.new_input = function (i, j, fn = null) {
    var input = document.createElement("input");
    input.className = Matrix_Table.cell_classname;
    input.maxLength = 4;
    input.id = "cell"+i+""+j;
    input.value = (fn != null) ? fn(i,j) : 0;
    return input;
}

Matrix_Table.new_cell = function (value) {
    var input = document.createElement("span");
    input.innerHTML = value;
    return input;
}

Matrix_Table.solution_printer = function (matrix) {
    return function (i, j) {
        if(isNaN(i)) {
            if("ROW LENGTH" === i) return matrix.length;
            else if ("COL LENGTH" === i) return matrix[0].length;
        } else return Matrix_Table.new_cell(matrix[i][j]);
    }
}
Matrix_Table.empty_input_printer = function () {
    return function (i, j) {
        var fn = function (i, j) {
            i = i + 1;
            j = j + 1;
            var a = Math.abs(i+j) - Math.abs(i-j);
            return a;
        }
        return Matrix_Table.new_input (i, j, fn);
    }
}

Matrix_Table.prototype.clear = function () {
    for (var i = 0; i < this.table.rows.length; i++) {
        for (var j = 0; j < this.table.rows[0].cells.length; j++) {
            this.table.rows[i].cells[j].children[0].value = 0;
        }
    }
}

Matrix_Table.cell_classname = "input_cells_input";
Matrix_Table.table_classname = "matrix_table fill_width";
