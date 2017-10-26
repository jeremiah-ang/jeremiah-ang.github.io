function ListNode (element, next = null) {
    this.element = element;
    this.next = next;
}

ListNode.prototype.getNext = function () { return this.next; }
ListNode.prototype.getElement = function () { return this.element; }
ListNode.prototype.setElement = function (ele) { this.element = ele; }
ListNode.prototype.setNext = function (next) { this.next = next; }
ListNode.prototype.hasNext = function () { return this.next != null; }
ListNode.prototype.toString = function () {
    var next = (this.hasNext()) ? this.getNext().toString() : "[]";
    return "[" + this.getElement() + "," + next + "]";
}
