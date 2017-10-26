function Result (eqn, soln, isError) {
    this.input = eqn;
    this.html = this.make(eqn, soln, isError);
}

Result.prototype.make = function (eqn, soln, isError) {
    var p = document.createElement("div");
    p.className = (isError) ? 'output error' : 'output ok';
    p.innerHTML = soln;
    var s = document.createElement("span");
    s.className = 'preview';
    s.innerHTML = eqn;
    p.appendChild(s);
    return p;
}
