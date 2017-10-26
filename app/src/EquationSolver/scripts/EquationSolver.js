function EquationSolver (stmt) {
    this.result;
    this.error = false;
    if(this.isValidEquation(stmt)) {
        this.result = this.solve(this.infixToPostfix(stmt.split('').join(" ").trim()));
    } else {
        this.error = true;
    }
}

EquationSolver.prototype.setResult = function (result) { this.result = result; }
EquationSolver.prototype.infixToPostfix = function (infix) {
    var tokens = new Stack();
    var postfix = new Stack();

    var sc = infix.split(" ");
    var token;
    var numberToken = "";

    while (sc.length > 0) {
        token = sc.shift();
        if (this.isOperator(token)) {

            if (this.isValidNumberToken(numberToken)) {
                postfix.push(numberToken);
            }

            if (this.isMinus(token)) {
                if (this.isEmptyToken(numberToken)
                && !this.isAfterCloseBracket(numberToken)) {
                    postfix.push(0);
                    numberToken = (this.isMinus(numberToken)) ? "" : "-";
                    token = "--";
                } else {
                    numberToken = (this.isMinus(numberToken)) ? numberToken : "";
                }
            }


            if (this.isOpenBracket(token)) {
                if (!this.isEmptyToken(numberToken)) {
                    tokens.push("*");
                    numberToken = "";
                }
                postfix.push(numberToken + "1");
                tokens.push(token);
            } else if (this.isCloseBracket(token)) {
                while (!this.isOpenBracket(tokens.peek())) {
                    postfix.push(tokens.pop());
                }
                tokens.pop();
                postfix.push("*");
                numberToken = "a";
            } else {
                if (this.precedence(token) < this.precedence(tokens.peek())) {
                    postfix.push(tokens.pop());
                }
                tokens.push(token);
                numberToken = (this.isMinus(numberToken)) ? numberToken : "";
            }

        } else {
            numberToken = numberToken + token;
        }
    }

    if(this.isValidNumberToken(numberToken)) {
        postfix.push(numberToken);
    }

    while (!tokens.isEmptyList()) {
        postfix.push(tokens.pop());
    }

    return postfix;
}
EquationSolver.prototype.solve = function (postfix) {
    console.log(postfix.toString());
    if (postfix.isEmptyList() || !this.isOperator(postfix.peek())) {
        return postfix;
    }

    var token;
    var num1, num2;
    token = postfix.pop();
    num1 = this.solveFirst(postfix);
    num2 = this.solveFirst(postfix);

    postfix.push(this.operate (num1, num2, token));
    return postfix;
}
EquationSolver.prototype.solveFirst = function (postfix) {
    if (this.isArithmeticOperand(postfix.peek())) {
        postfix = this.solve(postfix);
        return postfix.pop();
    } else {
        return postfix.pop();
    }
}
EquationSolver.prototype.isPlus = function (token) { return token === "+"; }
EquationSolver.prototype.isMinus = function (token) { return token === "-"; }
EquationSolver.prototype.isMult = function (token) { return token === "*"; }
EquationSolver.prototype.isDiv = function (token) { return token === "/"; }
EquationSolver.prototype.isSpecialMinus = function (token) { return token === "--"; }
EquationSolver.prototype.isAfterCloseBracket = function (token) { return token === "a"; }
EquationSolver.prototype.isOpenBracket = function (token) { return token === "("; }
EquationSolver.prototype.isCloseBracket = function (token) { return token === ")"; }
EquationSolver.prototype.isPow = function (token) { return token === "^"; }
EquationSolver.prototype.isEmptyToken = function (token) { return token === ""; }
EquationSolver.prototype.isValidNumberToken = function (token) { return !this.isEmptyToken(token) && !this.isMinus(token) && !this.isAfterCloseBracket(token); }
EquationSolver.prototype.isValidToken = function (token) { return this.isOperator(token) || !isNaN(parseInt(token))}
EquationSolver.prototype.isOperator = function (token) { return this.isArithmeticOperand(token) || this.isOpenBracket(token) || this.isCloseBracket(token); }
EquationSolver.prototype.isOperand = function (token) { return !this.isOperator(token); }
EquationSolver.prototype.isArithmeticOperand = function (token) { return this.isPlus(token) || this.isMinus(token) || this.isSpecialMinus(token) || this.isMult(token) || this.isDiv(token) || this.isPow(token); }
EquationSolver.prototype.precedence = function (token) {
    if (this.isPlus(token) || this.isMinus(token)) {
        return 1;
    } else if (this.isMult(token) || this.isDiv(token)) {
        return 2;
    } else if (this.isPow(token)) {
        return 3;
    } else if (this.isSpecialMinus(token)) {
        return 4;
    } else {
        return 0;
    }
}
EquationSolver.prototype.operate = function (a, b, operator) {
    a = (a instanceof Rational) ? a : Rational.string_to_rational(a + "");
    b = (b instanceof Rational) ? b : Rational.string_to_rational(b + "");

    if (this.isPlus(operator) || this.isSpecialMinus(operator)) {
        return Rational.add(a,b);
    } else if (this.isMinus(operator)) {
        return Rational.minus(b,a);
    } else if (this.isMult(operator)) {
        return Rational.mul(a,b);
    } else if (this.isDiv(operator)) {
        return Rational.divide(b,a);
    } else if (this.isPow(operator)) {
        return Rational.pow(b,a);
    } else {
        return 0;
    }
}
EquationSolver.prototype.isValidEquation = function (stmt) {
    stmt = stmt.split("");
    var node;

    var brackets = new Stack();
    var operator = "";

    if (stmt.length == 0) {
        this.setResult(EquationSolver.ERROR_EMPTY_INPUT());
        return false;
    } else if (this.isArithmeticOperand(stmt[0]) && !this.isMinus(stmt[0])) {
        this.setResult(EquationSolver.ERROR_INVALID_ARITHMETIC());
        return false;
    }

    while (stmt.length != 0) {
        node = stmt.shift();
        if (!this.isValidToken(node)) {
            this.setResult(EquationSolver.ERROR_INVALID_TOKEN());
            return false;
        } if (this.isOpenBracket(node)) {
            operator = "";
            brackets.push(node);
        } else if (this.isCloseBracket(node)) {
            operator = "";
            if (brackets.isEmptyList()) {
                this.setResult(EquationSolver.ERROR_MISMATCH_BRACKET());
                return false;
            }
            brackets.pop();
        } else if (this.isArithmeticOperand(node)) {
            if (this.isArithmeticOperand(operator) && !this.isMinus(node)) {
                this.setResult(EquationSolver.ERROR_INVALID_ARITHMETIC());
                return false;
            }
            operator = node;
        } else {
            operator = "";
        }
    }
    if (brackets.isEmptyList() && this.isEmptyToken(operator)) {
        return true;
    } else {
        this.setResult(EquationSolver.ERROR_INVALID_ARITHMETIC());
        return false;
    }
}

EquationSolver.ERROR_INVALID_TOKEN = function () { return EquationSolver.ERROR("Invalid Token!"); }
EquationSolver.ERROR_MISMATCH_BRACKET = function () { return EquationSolver.ERROR("Mismatch Brackets!"); }
EquationSolver.ERROR_INVALID_ARITHMETIC = function () { return EquationSolver.ERROR("Invalid Arithmetic!"); }
EquationSolver.ERROR_EMPTY_INPUT = function () { return EquationSolver.ERROR("No input!"); }
EquationSolver.ERROR = function (msg) { s = new Stack(); s.add ("<span class='smaller'>"+msg+"</span>"); return s; }
