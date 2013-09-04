var EditGuru = function(options) {
	for(var key in options) {
		this[key] = options[key];
	}
	this.$container = $(this.container);
	this.$content = this.$container.find('#content');
	this.addWidgets = '<a href=""class="add">p</a>';
	this.regBlock = '<div class="block" style="opacity: 0;"><div class="text" contentEditable="true"></div></div><div class="space">' + this.addWidgets + '</div>';
	this.init();
};

EditGuru.prototype = {
	init: function() {
		if(this.$container) {
			this.$content.on('click', '.add', $.proxy(function(event) {
				event.preventDefault();
				if(event.target == event.currentTarget)
					this.insertBlock($(event.target));
			}, this));
			this.$content.on('keypress', '.text', function(event) {
				// Enter
				if(event.keyCode == 13) {
					event.preventDefault();
					var selObj = window.getSelection();
					
					

					$(selObj.anchorNode).css('color', 'red');
					var s_m = new SelectMan(selObj);
					s_m.splitSelectedTextNode();

					// textrange selected
					
					// $(this).html([$(this).html().slice(0, selObj.extentOffset), $(this).html().slice(selObj.extentOffset)].join('<br>'));
					var node = this;
					// var range = window.getSelection().getRangeAt(0);

					// var treeWalker = document.createTreeWalker(
					// 		node,
					// 		NodeFilter.SHOW_ELEMENT,
					// 		null,
					// 		false
					// 	);
					// 	var charCount = 0;
					// 	while (treeWalker.nextNode()) {
					// 		//console.log(treeWalker.currentNode);
					// 	}
				}
			});
			this.$container.find('.bold').click(function(event) {
				event.preventDefault();
				var selObj = window.getSelection();
				var $parentNode = $(selObj.focusNode.parentNode);
				if(selObj.type == 'Caret') {
					if($parentNode.css('font-weight') == 'bold')
						$parentNode.css('font-weight', '');
					else
						$parentNode.css('font-weight', 'bold');
				}
			});
			this.$container.find('.italic').click(function(event) {
				event.preventDefault();
				var selObj = window.getSelection();
				var $parentNode = $(selObj.focusNode.parentNode);
				if(selObj.type == 'Caret') {
					if($parentNode.css('font-style') == 'italic')
						$parentNode.css('font-style', '');
					else
						$parentNode.css('font-style', 'italic');
				}
			});
			this.$container.find('.underline').click(function(event) {
				event.preventDefault();
				var selObj = window.getSelection();
				var $parentNode = $(selObj.focusNode.parentNode);
				if(selObj.type == 'Caret') {
					if($parentNode.css('text-decoration') == 'underline')
						$parentNode.css('text-decoration', '');
					else
						$parentNode.css('text-decoration', 'underline');
				}
			});


		}
	},
	// insert a regular block (p tag)
	insertBlock: function(spacer) {
		var blocks = this.$content.find('>.block');
		var click_pos = blocks.length;
		var new_block = $(this.regBlock);
		var match = false;
		blocks.each($.proxy(function(index, value) {
			if($(value).position().top > spacer.position().top) {
				click_pos = index;
				$(value).before(new_block);
				match = true;
				return false;
			}
		}, this));

		if(!match)
			this.$content.append(new_block);

		new_block.animate({
			opacity: 1
		}, 500);
	},
	// parse Blocks into pure html
	exportHtmlCode: function() {
		var exportedHTML = '';
		this.$content.find('>.block').each(function(index, value) {
			exportedHTML += '<p>' + $(value).find('.text').html() + '</p>\n';
		});
		return exportedHTML;
	},
	// registers a new Block type
	registerBlock: function(block) {

	}
};

var Block = function() {

	this.emptyTemplate = '<p>Empty Block</p>';
}

Block.prototype = {
	
}

var CodePreview = function($elem) {
	this.$cpreview = $elem.find('.inner');
	this.$cpreview_content = this.$cpreview.find('.content');
	this.$open = this.$cpreview.find('.open');

	this.init();
};
CodePreview.prototype = {
	init: function() {
		this.$open.click($.proxy(function(event) {
			event.preventDefault();
			if(this.$open.html() == 'open') {
				this.$open.html('close');
				this.$cpreview.height(this.$cpreview_content.outerHeight(true));
				this.$cpreview.css('bottom', 0);
			}
			else {
				this.$open.html('open');
				this.$cpreview.css('bottom', -this.$cpreview_content.outerHeight(true));
			}
		}, this));
		
	},
	setCode: function(code) {
		this.$cpreview_content.text(code);
		this.updatePrevieContent();
	},
	updatePrevieContent: function() {
		if(this.$open.html() == 'close') {
			this.$cpreview.height(this.$cpreview_content.outerHeight(true));
			this.$cpreview.css('bottom', 0);
		}
	}
};

var SelectMan = function(selObj) {
	this.selObj = selObj;
};

SelectMan.prototype = {
	splitSelectedTextNode: function() {

		// anchor and focus node is the same
		if(this.selObj.anchorNode == this.selObj.focusNode) {
			var currentNode = this.selObj.anchorNode;
			this.replaceSelectedNode(currentNode, this.selObj.anchorOffset, this.selObj.focusOffset,
				function(node) {
					return '<span style="color: red;">' + node.data + '</span>';
				});

		}
		//if(selObj.type == 'Range') {
		//	select from right to left
		//	if(selObj.extentOffset > selObj.baseOffset) {
		//		var n1 = selObj.focusNode.splitText(selObj.extentOffset);
		//		var n2 = selObj.focusNode.splitText(selObj.baseOffset);
		//		var n0 = selObj.focusNode.splitText(0);
		//	}
		//	// select from left to right
		//	else {
		//		var n1 = selObj.focusNode.splitText(selObj.baseOffset);
		//		var n2 = selObj.focusNode.splitText(selObj.extentOffset);
		//		var n0 = selObj.focusNode.splitText(0);
		//	}
		//	$(n2).css('font-weight', 'bold');
		//	var newElement = $('<span style="color: grey;">');
		//	newElement.append(n2);
		//	$(selObj.focusNode.parentElement).html(n0).append(newElement).append(n1);
		//}
	},
	replaceSelectedNode: function(node, anchorOffset, focusOffset, fn) {
		var right_node,
			selected_node,
			left_node;

		var parent_node = $(node.parentNode);

		// select from left to right
		if(focusOffset > anchorOffset) {
			right_node = node.splitText(focusOffset);
			selected_node = right_node.previousSibling.splitText(anchorOffset);
			left_node = node;
		}
		// select from right to left
		else {
			right_node = node.splitText(anchorOffset);
			selected_node = right_node.previousSibling.splitText(focusOffset);
			left_node = node;
		}

		var silblings = this.getAllPreviousSibling(left_node).reverse();
		silblings.push(left_node);
		parent_node.html(this.concatSilblings(silblings));
		parent_node.append(fn(selected_node));
		silblings = [];
		silblings.push(right_node);
		silblings = silblings.concat(this.getAllNextSibling(right_node));

		// new_element

		parent_node.append(this.concatSilblings(silblings));

		// this.selObj.collapse(parent_node, 1);
		// this.setCaret(left_node, 1, parent_node);

		console.log([left_node, selected_node, right_node]);

		return [left_node, selected_node, right_node];
	},
	concatSilblings: function(silblings) {
		var value = '';
		for(var key in silblings) {
			value += silblings[key].data;
		}
		return value;
	},
	getAllPreviousSibling: function(node) {
		var previousSiblings = [];
		var current_node = node;
		while(current_node.previousSibling) {
			current_node = current_node.previousSibling;
			previousSiblings.push(current_node);
		}
		return previousSiblings;
	},
	getAllNextSibling: function(node) {
		var nextSiblings = [];
		var current_node = node;
		while(current_node.nextSibling) {
			current_node = current_node.nextSibling;
			nextSiblings.push(current_node);
		}
		return nextSiblings;
	},
	getAnchorNodeIndex: function() {
		return this.getNodeIndex('anchorNode');
	},
	getFocusNodeIndex: function() {
		return this.getNodeIndex('focusNode');
	},
	getNodeIndex: function(nodeName) {
		var node_array = [];
		var node_list = this.selObj[nodeName].parentNode.childNodes;
		for(var i = 0, n; n = node_list[i]; ++i) node_array.push(n);

		for(var key in node_array) {
			if(this.selObj[nodeName] == node_array[key])
				return key;
		}
		return -1;
	},
	// not working
	setCaret: function(node, index, parent_node) {
		// var range = document.createRange();
		// range.setStart(node, index);
		// range.collapse(true);
		// this.selObj.removeAllRanges();
		// this.selObj.addRange(range);
		// parent_node.focus();
	}
};
