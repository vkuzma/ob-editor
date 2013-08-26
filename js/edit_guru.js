var EditGuru = function(options) {
	for(key in options) {
		this[key] = options[key]
	}
	this.$container = $(this.container);
	this.$content = this.$container.find('#content');
	this.regBlock = '<div class="block" style="opacity: 0;"><div class="text" contentEditable="true"></div></div><div class="space"><a href=""class="add">+</a></div>';
	this.init();
};

EditGuru.prototype = {
	init: function() {
		if(this.$container) {
			this.$content.on('click', '.add', $.proxy(function(event) {
				event.preventDefault();
				if(event.target == event.currentTarget)
					this.insert_block($(event.target));
			}, this));
		}
	},
	insert_block: function(spacer) {
		var blocks = this.$content.find('>.block');
		var click_pos = blocks.length;
		var new_block = $(this.regBlock);
		var match = false;
		blocks.each($.proxy(function(index, value) {
			if($(value).position().top > spacer.position().top) {
				click_pos = index
				$(value).before(new_block);
				match = true;
				return false;
			}
		}, this));

		if(!match)
			this.$content.append(new_block);

		new_block.animate({
			opacity: 1
		}, 500)
	}	
}