function Matrix_Solver () {

    var $this = this;
    this.input_table = new Matrix_Table(Matrix_Table.empty_input_printer(null),
                                        Matrix_Solver.input_table_id);

    this.output = document.getElementById(Matrix_Solver.output_id);
    this.adj_output = document.getElementById(Matrix_Solver.adj_output_id);
    this.det_output = document.getElementById(Matrix_Solver.det_output_id);
    this.main_output = document.getElementById(Matrix_Solver.main_output_id);
    this.main_adj = document.getElementById(Matrix_Solver.main_adj_id);
    this.main_det = document.getElementById(Matrix_Solver.main_det_id);

    this.submit_btn = document.getElementById(Matrix_Solver.submit_btn_id);
    this.clear_btn = document.getElementById(Matrix_Solver.clear_btn_id);
    this.plus_row_btn = document.getElementById(Matrix_Solver.plus_row_btn_id);
    this.plus_col_btn = document.getElementById(Matrix_Solver.plus_col_btn_id);
    this.minus_row_btn = document.getElementById(Matrix_Solver.minus_row_btn_id);
    this.minus_col_btn = document.getElementById(Matrix_Solver.minus_col_btn_id);

    this.submit_btn.addEventListener("click", function(){ Matrix_Solver.submitBtnDidClick.call($this) });
    this.clear_btn.addEventListener("click", function(){ Matrix_Solver.clearBtnDidClick.call($this) });
    this.plus_row_btn.addEventListener("click", function(){ Matrix_Solver.plusRowBtnDidClick.call($this) });
    this.plus_col_btn.addEventListener("click", function(){ Matrix_Solver.plusColBtnDidClick.call($this) });
    this.minus_row_btn.addEventListener("click", function(){ Matrix_Solver.minusRowBtnDidClick.call($this) });
    this.minus_col_btn.addEventListener("click", function(){ Matrix_Solver.minusColBtnDidClick.call($this) });

}

/* =================================

        Button Click Functions

==================================== */

Matrix_Solver.submitBtnDidClick = function(e) {
    this.clear_output();
    var matrix = this.input_table.collectValues();

    var adj = Matrix.adjoint(matrix);
    var inverse_steps = Matrix.inverse(matrix);

    this.print_solution(inverse_steps, adj);
}
Matrix_Solver.plusRowBtnDidClick = function(e) {
    this.input_table.add_row(Matrix_Table.empty_input_printer(null));
}
Matrix_Solver.plusColBtnDidClick = function(e) {
    this.input_table.add_col(Matrix_Table.empty_input_printer(null));
}
Matrix_Solver.minusRowBtnDidClick = function(e) {
    this.input_table.minus_row();
}
Matrix_Solver.minusColBtnDidClick = function(e) {
    this.input_table.minus_col();
}
Matrix_Solver.clearBtnDidClick = function (e) {
    this.input_table.clear();
}


/*
=================================================

            Display Solutions

=================================================
*/
Matrix_Solver.prototype.print_solution = function (steps, adj) {
    this.print_rref(steps);
    this.print_adj(adj);
    this.print_determinant(steps.getDeterminant())
}

Matrix_Solver.prototype.print_adj = function (adj) {
    if(adj != null) {
        this.show_adj();
        var step_div = this.add_step();
        step_div.appendChild(this.add_matrix(adj));
        this.adj_output.appendChild(step_div);
    }
}
Matrix_Solver.prototype.print_determinant = function (determinant) {
    if (determinant != null) {
        this.show_det();
        this.det_output.innerHTML = "<span class = 'cell'>" + determinant + "</span>";
    }
}
Matrix_Solver.prototype.show_rref = function () {
    this.main_output.classList.remove("hidden");
}
Matrix_Solver.prototype.show_adj = function () {
    this.main_adj.classList.remove("hidden");
}
Matrix_Solver.prototype.show_det = function () {
    this.main_det.classList.remove("hidden");
}

Matrix_Solver.prototype.print_rref = function (steps) {
    this.show_rref();
    var step_div;
    for (var i = 0; i < steps.step_count; i++) {

        step_div = this.add_step();

        step_div.appendChild(this.add_eros(steps.getEros(i)));
        step_div.appendChild(this.add_matrixs(steps, i));

        this.output.appendChild(step_div);
    }
}
Matrix_Solver.prototype.add_step = function () {
    var step_div = document.createElement("div");
    step_div.className = "step";
    return step_div;
}
Matrix_Solver.prototype.add_eros = function (eros_array) {
    var eros_div = document.createElement("div");
    eros_div.className = "eros";

    for (var i = 0; i < eros_array.length; i++) {
        this.add_ero(eros_div, eros_array[i]);
    }
    return eros_div;
}

Matrix_Solver.prototype.add_ero = function (div, ero_string) {
    var ero = document.createElement("div");
    ero.className = "ero";
    ero.innerHTML = "<span>" + Steps.ero_toString(ero_string) + "</span>";
    div.appendChild(ero);
}

Matrix_Solver.prototype.add_matrixs = function (steps, i) {
    var matrix_div = document.createElement("div");
    matrix_div.className = "matrixs";

    matrix_div.appendChild(this.add_matrix(steps.getMatrix(i)));
    if(steps.haveInverse()){
        matrix_div.appendChild(this.add_matrix(steps.getInverse(i)));
    }

    return matrix_div;
}

Matrix_Solver.prototype.add_matrix = function (matrix) {
    var matrix_div = document.createElement("div");
    matrix_div.className = "matrix";

    matrix = new Matrix_Table(Matrix_Table.solution_printer(matrix));
    matrix_div.appendChild(matrix.table);

    return matrix_div;
}

Matrix_Solver.prototype.clear_output = function () {
    this.output.innerHTML = "";
    this.adj_output.innerHTML = "";
    this.main_adj.classList.add("hidden");
}

/* =================================

       HTML Classnames and ID

==================================== */

Matrix_Solver.output_id = "rref_inv_output";
Matrix_Solver.adj_output_id = "adj_output";
Matrix_Solver.det_output_id = "det_output";
Matrix_Solver.main_output_id = "main_rref_output";
Matrix_Solver.main_adj_id = "main_adj_output";
Matrix_Solver.main_det_id = "main_det_output";
Matrix_Solver.input_table_id = "input_cells_table";
Matrix_Solver.submit_btn_id = "input_controls_submit";
Matrix_Solver.clear_btn_id = "input_controls_clear";
Matrix_Solver.plus_row_btn_id = "input_controls_row";
Matrix_Solver.plus_col_btn_id = "input_controls_col";
Matrix_Solver.minus_row_btn_id = "input_controls_mrow";
Matrix_Solver.minus_col_btn_id = "input_controls_mcol";
