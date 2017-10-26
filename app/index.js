const items = require ("./script/data/items.json");
const Item = require ("./script/Item/Item");


window.onload = function () {
	loadItems(items);
}

function loadItems (items) {
	var item;
	var itemsContainer = document.getElementById("items");
	for (var i = 0; i < items.length; i++) {
		item = new Item(items[i]);
		itemsContainer.appendChild(item.dom);
	}
} 
