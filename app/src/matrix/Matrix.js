function Matrix (a) {
    this.a = a;
}

/*
=================================================

            Misc. Functions

=================================================
*/

Matrix.rationalise = function (matrix) {
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[0].length; j++) {
            if(!(matrix[i][j] instanceof Rational)) {
                matrix[i][j] = Rational.make(matrix[i][j]);
            }
        }
    }
}

/*
=================================================

        Elementary Row Operations

=================================================
*/
Matrix.mult_c_to_row = function (matrix, c, row, steps = null) {
    if(steps != null)
        Matrix.new_ero (steps, "0,"+c+","+row, Rational.invert(c));

    row -= 1;
    var e = new Array();
    if (!(c instanceof Rational)) c = Rational.make(c);

    for (var i = 0; i < matrix.length; i++) {
        e[i] = new Array();
        for (var j = 0; j < matrix.length; j++) {
            if (i === j) {
                if (i === row) {
                    e[i][j] = c;
                } else {
                    e[i][j] = Rational.make(1);
                }
            } else {
                e[i][j] = Rational.make(0);
            }
        }
    }

    return Matrix.mul(e, matrix);
}

Matrix.swap_rows = function (matrix, row1, row2, steps = null) {
    if(steps != null)
        Matrix.new_ero (steps, "1," + row1 + "," + row2, new Rational(-1,1));

    row1 -= 1;
    row2 -= 1;
    var e = new Array();
    for (var i = 0; i < matrix.length; i++) {
        e[i] = new Array();
        for (var j = 0; j < matrix.length; j++) {
            if ((i === row1 && j === row2)
             || (i === row2 && j === row1)
             || (i === j &&  i !== row1 && i !== row2)) {
                e[i][j] = Rational.make(1);
            } else {
                e[i][j] = Rational.make(0);
            }
        }
    }
    return Matrix.mul(e, matrix);
}
Matrix.add_to_rowA_c_rowB = function (matrix, row1, c, row2, steps = null) {
    if(steps != null)
        Matrix.new_ero (steps, "2," + row1 + "," + c + "," + row2, new Rational(1,1));

    row1 -= 1;
    row2 -= 1;

    if (!(c instanceof Rational)) c = Rational.make(c);

    var e = new Array();
    for (var i = 0; i < matrix.length; i++) {
        e[i] = new Array();
        for (var j = 0; j < matrix.length; j++) {
            if (i === j) {
                e[i][j] = Rational.make(1);
            } else if (i === row1 && j === row2) {
                e[i][j] = c;
            } else {
                e[i][j] = Rational.make(0);
            }
        }
    }

    return Matrix.mul(e, matrix);
}

Matrix.apply_eros_to_matrix = function (eros, m1, steps) {
    for (var i = 1; i < eros.length; i++) {
        for (var j = 0; j < eros[i].length; j++) {
            m1 = Matrix.apply_ero_to_matrix (eros[i][j], m1, steps);
        }
        if (i + 1 < eros.length)
            Matrix.print_matrix (m1, steps);
    }

    return m1;
}
Matrix.apply_ero_to_matrix = function (ero, m1, steps) {
    ero = ero.split(",");
    var i = parseInt(ero[0]);
    if (i === 0) {
        return Matrix.mult_c_to_row(m1,
                                    Rational.string_to_rational(ero[1]),
                                    ero[2],
                                    steps);
    } else if (i === 1) {
        return Matrix.swap_rows(m1, ero[1], ero[2], steps);
    } else if (i === 2) {
        return Matrix.add_to_rowA_c_rowB (m1,
                                          ero[1],
                                          Rational.string_to_rational(ero[2]),
                                          ero[3],
                                          steps);
    } else {
        console.log("INVALID!");
    }
}

/*
=================================================

                Matrix Operations

=================================================
*/
Matrix.equals = function (m1, m2) {
    if (m1 == null || m2 == null) {
        return false
    } else if (m1.length === m2.length && m1[0].length === m2[0].length) {
        for (var i = 0; i < m1.length; i++) {
            for (var j = 0; j <m1[0].length; j++) {
                if(!Rational.equals(m1[i][j], m2[i][j])) {
                    return false;
                }
            }
        }
        return true;
    } else {
        return false;
    }
}

Matrix.add = function (m1, m2) {
    var e = new Array();
    for (var i = 0; i < m1.length; i++) {
        for (var j = 0; j < m1[0].length; j++) {
            e[i][j] = Rational.add(m1[i][j], m2[i][j]);
        }
    }
    return e;
}
Matrix.mul = function (m1, m2) { //m1m2
    var e = new Array();
    for (var i = 0; i < m1.length; i++) {
        e[i] = new Array();
        console.log("Next Row");
        for (var j = 0; j < m2[0].length; j++) {
            e[i][j] = Rational.make(0);
            for (var k = 0; k < m2.length; k++) {
                e[i][j] = Rational.add(e[i][j], Rational.mul(m1[i][k] , m2[k][j]));
            }
        }
    }
    return e;
}
Matrix.transpose = function (m1) {
    var e = new Array();
    for (var i = 0; i < m1[0].length; i++) {
        e[i] = new Array();
        for (var j = 0; j < m1.length; j++) {
            e[i][j] = m1[j][i];
        }
    }
    return e;
}

Matrix.negate = function (m1) {
}

Matrix.determinant = function (m1) {
    step = Matrix.row_echelon_form(m1);
    return step.getDeterminant();
}

Matrix.inverse = function (m1, steps = null) {

    if(steps == null || !steps.getHasRREF()) {
        steps = Matrix.reduced_row_echleon_form(m1, steps);
    }

    if(steps.haveInverse()) {
        var identity = Matrix.identity(m1.length);
        var inverse_steps = new Steps(identity);
        var inverse = Matrix.apply_eros_to_matrix (steps.getAllEros(), identity, inverse_steps);
        steps.setInverse(inverse_steps.getMatrixArray());
    }

    return steps;

}


/*
=================================================

                Identity Matrix

=================================================
*/

Matrix.identity = function (size) {
    var e = new Array();
    for (var i = 0; i < size; i++) {
        e[i] = new Array();
        for (var j = 0; j < size; j++) {
            if (i === j) {
                e[i][j] = Rational.make(1);
            } else {
                e[i][j] = Rational.make(0);
            }
        }
    }
    return e;
}
Matrix.is_identity = function (m) {
    return Matrix.equals(m, Matrix.identity(m.length));
}
Matrix.isSquare = function (m) {
    return (m.length > 1) ? m.length === m[0].length : false;
}


/*
=================================================

        Reduced Row Echelon Form

=================================================
*/

Matrix.row_echelon_form = function (matrix, steps = null) {
    steps = (steps == null) ? new Steps(matrix) : steps;

    var i = 0;
    var j = 0;
    var k = 0;
    var non_empty_index = 0;
    var performed = false;

    while (i < matrix.length && j < matrix[0].length) {
        performed = false;
        if (Rational.equals(matrix[i][j], Rational.make(0))) {
            non_empty_index = Matrix.get_non_empty_index(matrix, i, j);
            if(non_empty_index === -1) {
                j++;
            } else {
                matrix = Matrix.swap_rows(matrix, i + 1, non_empty_index + 1, steps);
                Matrix.print_matrix(matrix, steps);
            }
        } else {
            for (k = i + 1; k < matrix.length; k++) {
                if(!Rational.equals(matrix[k][j], Rational.make(0))) {
                    matrix = Matrix.add_to_rowA_c_rowB(matrix,
                                                       k + 1,
                                                       Rational.mul(matrix[k][j], Rational.invert(Rational.negate(matrix[i][j]))),
                                                       i + 1,
                                                       steps);
                    performed = true;
                }
            }
            i += 1;
            j += 1;
            if(performed) Matrix.print_matrix(matrix, steps);
        }
    }

    var determinant = Rational.make(0);
    if (Matrix.isSquare(matrix)) {
        determinant = Rational.make(1);
        for (var a = 0; a < matrix.length; a++) {
            determinant = Rational.mul(determinant, matrix[a][a]);
        }
    }
    steps.setDeterminant(determinant);

    return steps;
}

Matrix.reduced_row_echleon_form = function (matrix, steps = null) {
    steps = (steps == null) ? new Steps(matrix) : steps;

    steps = Matrix.row_echelon_form(matrix, steps);
    matrix = steps.getMatrix();
    for (var i = matrix.length - 1; i >= 0; i--) {
        for (var j = 0; j < matrix[0].length; j++) {
            if(Rational.equals(matrix[i][j], Rational.make(0))) {
                //continue
            } else {
                if(!Rational.equals(matrix[i][j], Rational.make(1)))
                    matrix = Matrix.mult_c_to_row(matrix,
                                                  Rational.invert(matrix[i][j]),
                                                  i + 1,
                                                  steps);
                for (var k = 0; k < i; k++) {
                    matrix = Matrix.add_to_rowA_c_rowB (matrix,
                                                        k + 1,
                                                        Rational.negate(matrix[k][j]),
                                                        i + 1,
                                                        steps);
                }

                Matrix.print_matrix(matrix, steps);
                j = matrix[0].length;
            }
        }
    }

    steps.setHasRREF(true);
    return steps;
}

/*
=================================================

                    Adjoint

=================================================
*/

Matrix.adjoint = function (matrix) {
    if (!Matrix.isSquare(matrix)) {
        return null;
    }

    var adj = new Array();
    for (var i = 0; i < matrix.length; i++) {
        adj[i] = new Array();
        for (var j = 0; j < matrix[0].length; j++) {
            adj[i][j] = Matrix.cofactor(matrix, i, j);
        }
    }

    return Matrix.transpose(adj);
}

Matrix.cofactor = function (matrix, i, j) {
    if(matrix.length === 2) {
        if (i === j) {
            var k = (i + j) % 2;
            return matrix[k][k];
        } else {
            return -matrix[j][i];
        }
    } else {
        var m = Matrix.cofactor_matrix(matrix, i, j);
        var det = Matrix.determinant(m);
        var a = ((i + j) % 2 === 0) ? 1 : -1;
        return a * det;
    }
}
Matrix.cofactor_matrix = function (matrix, a, b) {
    var m = new Array();
    var ii = 0, jj = 0;
    for (var i = 0; i < matrix.length; i++) {
        if (i !== a) {
            m[ii] = new Array();
            jj = 0;
            for (var j = 0; j < matrix[0].length; j++) {
                if (j !== b) {
                    m[ii][jj] = matrix[i][j];
                    jj++;
                }
            }
            ii++;
        }

    }
    return m;
}


/*
=================================================

        Console Printing Functions

=================================================
*/
Matrix.print_matrix = function (matrix, steps = null) {
    if(steps !== null)
        Matrix.new_matrix (steps, matrix);
    else
        console.log (Matrix.matrix_toString (matrix));
}
Matrix.matrix_toString = function (matrix) {
    row = "";
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[0].length; j++) {
            row += matrix[i][j] + " ";
        }
        row += "\n";
    }
    return row;
}

Matrix.get_non_empty_index = function (matrix, i, j) {
    while(Rational.equals(matrix[i][j], Rational.make(0))) {
        if(i + 1 === matrix.length) {
            i = -1;
            break;
        } else {
            i++;
        }
    }
    return i;
}

Matrix.new_ero = function (steps, ero, det) {
    steps.add_ero(ero, det);
}
Matrix.new_matrix = function (steps, matrix) {
    steps.add_matrix(matrix);
}
