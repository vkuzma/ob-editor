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
					console.log(window.getSelection());
				}
			});
			this.$container.find('.bold').click(function(event) {
				event.preventDefault();
				alert("bold");
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
			exportedHTML += '<p>' + $(value).find('.text').text() + '</p>\n';
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
}
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
}

	

	