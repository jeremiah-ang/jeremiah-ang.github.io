function Steps (matrix) {
    this.matrix = new Array();
    this.inverse = new Array();
    this.eros = new Array();
    this.eros[0] = new Array();
    this.determinant = new Rational(1, 1);
    this.step_count = 0;
    this.hasRREF = false;

    this.add_matrix(matrix);
}

Steps.prototype.add_ero = function (ero, determinant) {
    this.eros[this.step_count].push(ero);
}
Steps.prototype.add_matrix = function (matrix) {
    this.matrix.push(matrix);
    this.eros[++this.step_count] = new Array();
}
Steps.prototype.getAllEros = function () {return this.eros};
Steps.prototype.getEros = function (step) { return this.eros[step]; }
Steps.prototype.getMatrix = function (step = -1) { return (step === -1) ? this.matrix[this.matrix.length - 1] : this.matrix[step]; }
Steps.prototype.getMatrixArray = function () { return this.matrix;}
Steps.prototype.getDeterminant = function () { return this.determinant; }
Steps.prototype.getHasRREF = function () { return this.hasRREF; }
Steps.prototype.getInverse = function (step = -1) { return (step === -1) ? this.inverse[this.matrix.length - 1] : this.inverse[step]; }
Steps.prototype.getInverseArray = function () { return this.inverse; }
Steps.prototype.setDeterminant = function (det) { this.determinant = det; }
Steps.prototype.setHasRREF = function (hasRREF) { this.hasRREF = hasRREF; }
Steps.prototype.setInverse = function (inverse) { this.inverse = inverse; }
Steps.prototype.haveInverse = function () { return !Rational.equals(this.determinant, Rational.make(0)); }

Steps.ero_toString = function (ero) {
    ero = ero.split(",");
    var i = parseInt(ero[0]);
    if (i === 0) {
        return ">> Multiply " + ero[1] + " to Row" + ero[2];
    } else if (i === 1) {
        return ">> Swap Row" + ero[1] + " w/ Row" + ero[2];
    } else if (i === 2) {
        return ">> Add to Row" + ero[1] + ", " + ero[2] + "*Row" + ero[3];
    } else {
        return "INVALID ERO";
    }
}
