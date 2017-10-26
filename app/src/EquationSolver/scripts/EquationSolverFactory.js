function print (msg) {
    if (msg instanceof LinkedList || msg instanceof ListNode)
        console.log(msg.toString());
    else console.log(msg);
}

window.onload = function () {
    esf = new EquationSolverFactory();

    print(!isNaN(parseInt("a")));
}

function EquationSolverFactory () {
    this.input = document.getElementById(EquationSolverFactory.inputId);
    this.output = document.getElementById(EquationSolverFactory.outputId);
    this.submitBtn = document.getElementById(EquationSolverFactory.submitBtnId);

    this.input.placeholder = "12+-(2-3)/5";

    var $this = this;
    this.submitBtn.addEventListener("click", function(e){ $this.submitBtnDidClick(e); });
}

EquationSolverFactory.prototype.submitBtnDidClick = function (e) {
    var eqn = this.input.value.replace(/\s/g, "");
    var $this = this;
    eqs = new EquationSolver (eqn);
    var result = this.createOutput(eqn, eqs.result.pop(), eqs.error);
    this.output.insertBefore(result.html, this.output.firstChild);
    result.html.addEventListener ("click", function(e){ $this.resultDidClick(result); });
    if (this.output.children.length > 10) {
        this.output.removeChild(this.output.lastChild);
    }
}

EquationSolverFactory.prototype.resultDidClick = function (result) {
    this.input.value = result.input;
}

EquationSolverFactory.prototype.createOutput = function (eqn, soln, isError) {
    return new Result (eqn, soln, isError);
}

EquationSolverFactory.inputId = "equation_input";
EquationSolverFactory.outputId = "equation_output";
EquationSolverFactory.submitBtnId = "equation_submit";
