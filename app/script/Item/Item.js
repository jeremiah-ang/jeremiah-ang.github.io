const path = require ("path");

class Item {
	constructor (json) {
		var dom = document.createElement("a");
		dom.classList.add("cell");
		dom.classList.add("work");
		if (json['huge']) dom.classList.add("large");
		dom.id = json['id'];

		var dir = json['dir'];
		var filename = json['file'] || "index.html";
		dom.href = "./app" + path.resolve (__dirname, "../../src/", dir, filename);

		var h1 = document.createElement("h1");
		h1.innerHTML = json['title'];

		var p = document.createElement("p");
		p.classList.add("description");
		p.innerHTML = json['description'];

		dom.appendChild(h1);
		dom.appendChild(p);

		this.json = json;
		this.dom = dom;
	}
}

module.exports = Item;