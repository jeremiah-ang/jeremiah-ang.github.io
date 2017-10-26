function Stack () {
    LinkedList.call(this);
}
Stack.prototype = LinkedList.prototype;
Stack.constructor = Stack;

Stack.prototype.push = function (element) {
    this.add(element);
}

Stack.prototype.pop = function () {
    if (this.isEmptyList()) {
        return null;
    } else {
        return this.remove();
    }
}

Stack.prototype.peek = function () {
    if (this.isEmptyList()) {
        return null;
    } else {
        return this.getHead().getElement();
    }
}
