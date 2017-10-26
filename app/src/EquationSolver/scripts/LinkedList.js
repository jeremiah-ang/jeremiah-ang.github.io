function LinkedList () {
    this.head = null;
    this.size = 0;
}

LinkedList.prototype.getSize = function () { return this.size; }
LinkedList.prototype.setSize = function (size) { this.size = size; }
LinkedList.prototype.getFirst = function () { return this.getHead(); }
LinkedList.prototype.getHead = function () { return this.head; }
LinkedList.prototype.setHead = function (head) { this.head = head; }
LinkedList.prototype.toString = function () {
    if(this.isEmptyList()) {
        return "[]";
    } else {
        return this.getHead().toString();
    }
}

LinkedList.prototype.add = function(element) {
    this.setHead(new ListNode (element, this.getHead()));
    this.setSize (this.getSize() + 1);
}
LinkedList.prototype.addAfter = function (node, element) {
    node.setNext(new ListNode (element, node.getNext()));
    this.setSize (this.getSize() + 1);
}
LinkedList.prototype.remove = function () {
    if (this.isEmptyList()) {
        return null;
    } else {
        var newHead = this.getHead().getNext();
        var oldHead = this.getHead();
        oldHead.setNext(null);
        this.setHead(newHead);
        this.setSize (this.getSize() - 1);
        return oldHead.getElement();
    }
}
LinkedList.prototype.removeAfter = function (node) {

}

LinkedList.prototype.indexOf = function (element) {
    if (this.isEmptyList()) {
        return -1;
    } else {
        var node = this.getHead();
        var index = 0;
        for (var i = 0; i < this.getSize(); i++) {
            if (node.getElement() === element) {
                return i;
            }
            node = node.getNext();
        }
        return -1;
    }
}
LinkedList.prototype.contains = function (element) {
    return this.indexOf(element) != -1;
}
LinkedList.prototype.append = function (linkedlist) {
    if (this.isEmptyList()) {
        this.setHead(linkedlist.getHead());
    } else {
        var node = this.getHead();
        for (var i = 1; i < this.getSize(); i++) {
            node = node.getNext();
        }
        node.setNext(linkedlist.getHead());
        this.setSize(this.getSize() + linkedlist.getSize());
    }
}
LinkedList.prototype.reverse = function () {
    function helper (xs, reversed) {
        if (xs == null) {
            return reversed;
        } else {
            var next = xs.getNext();
            xs.setNext(reversed);
            return helper (next, xs);
        }
    }
    this.setHead(helper(this.getHead(), null));
}
LinkedList.prototype.isEmptyList = function () { return this.head == null; }
