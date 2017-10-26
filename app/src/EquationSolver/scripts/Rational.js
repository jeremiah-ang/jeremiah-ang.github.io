function Rational (q, d) {
    var g = Rational.gcd(q,d);
    this.q = q / g;
    this.d = d / g;
    this.reduce_to_simplest();
}
/*
=================================================

            Alt constructor

=================================================
*/
Rational.string_to_rational = function (s) {
    s = s.split("/");
    var q = s[0];
    var d = (s[1]) ? s[1] : 1;
    return new Rational (q, d);
}
Rational.make = function (a, b = 1) { return new Rational(a, b); }
Rational.clone = function (r) {
    return new Rational(r.get_quotient(), r.get_denominator());
}

/*
=================================================

            Getter & Setter

=================================================
*/
Rational.prototype.get_quotient = function () { return this.q; }
Rational.prototype.get_denominator = function () { return this.d; }
Rational.prototype.set_quotient = function (q) { this.q = q;}
Rational.prototype.set_denomiator = function (d) { this.d = d;}
Rational.prototype.set_value = function (q, d) { this.set_quotient(q); this.set_denomiator(d); }

/*
=================================================

            Arimethic Operations

=================================================
*/

Rational.add = function (r1, r2) {
    var new_q = r1.get_quotient() * r2.get_denominator() + r2.get_quotient() * r1.get_denominator();
    var new_d = r1.get_denominator() * r2.get_denominator();
    return new Rational (new_q, new_d);
}
Rational.minus = function (r1, r2) {
    return Rational.add (r1, this.negate(r2));
}
Rational.mul = function (r1, r2) {
    var new_q = r1.get_quotient() * r2.get_quotient();
    var new_d = r1.get_denominator() * r2.get_denominator();
    return new Rational (new_q, new_d);
}
Rational.divide = function (r1, r2) {
    return Rational.mul (r1, Rational.invert(r2));
}
Rational.negate = function (r) {
    var new_r = Rational.clone(r);
    new_r.set_quotient(-1 * new_r.get_quotient());
    new_r.reduce_to_simplest();
    return new_r;
}
Rational.invert = function (r) {
    var new_r = Rational.clone(r);
    var temp = new_r.get_quotient();
    new_r.set_quotient(new_r.get_denominator());
    new_r.set_denomiator(temp);
    new_r.reduce_to_simplest();
    return new_r;
}
Rational.equals = function (r1, r2) {
    return (r1.get_quotient() === r2.get_quotient() &&
            r1.get_denominator() === r2.get_denominator());
}
Rational.pow = function (r1, r2) {
    var new_q = Math.pow(r1.get_quotient(), r2.toNumber());
    var new_d = Math.pow(r1.get_denominator(), r2.toNumber());
    if(Rational.isInteger(new_q) && Rational.isInteger(new_d)) {
        return new Rational(new_q, new_d);
    } else {
        var r = new Rational(1,1);
        r.q = new_q / new_d;
        return r;
    }
}

/*
=================================================

            Arimethic Operations

=================================================
*/

Rational.prototype.reduce_to_simplest = function () {
    if (this.q == 0) {
        this.d = 1;
    } else if (this.d < 0) {
        this.q = -this.q;
        this.d = -this.d;
    } else {
        var g = Rational.gcd(this.q,this.d);
        this.q = this.q / g;
        this.d = this.d / g;
    }
}

Rational.prototype.toString = function () {
    return (this.d === 1) ? this.q : this.q + "/" + this.d;
}
Rational.prototype.toNumber = function () {
    return this.get_quotient() / this.get_denominator();
}

Rational.gcd = function (a, b) {
    if(isNaN(a)) return 0;
    a = Math.abs(a);
    b = Math.abs(b);
    if(a === 0 || b === 0) return a + b;
    else return Rational.gcd (b, a % b);
}

Rational.isInteger = function (a) {
    return Math.floor(a) === a;
}
