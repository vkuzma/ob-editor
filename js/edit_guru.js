var EditGuru = function(options) {
	for(key in options) {
		this[key] = options[key]
	}
	this.$container = $(this.container);
	this.$content = this.$container.find('#content');
	this.regBlock = '<div class="block"><textarea></textarea></div><div class="space"></div>';
	this.init();
};

EditGuru.prototype = {
	init: function() {
		if(this.$container) {
			this.$content.on('click', '.space', $.proxy(function(event) {
				event.preventDefault();
				if(event.target == event.currentTarget)
					this.insert_block($(event.target));
			}, this));
		}
	},
	insert_block: function(spacer) {
		var blocks = this.$content.find('>.block');
		var click_pos = blocks.length;
		var match = false;
		blocks.each(function(index, value) {
		console.log($(value).position().top+'  '+spacer.position().top);
			if($(value).position().top > spacer.position().top) {
				click_pos = index
				$(value).before(this.regBlock);
				match = true;
				return false;
			}
		});
		console.log(click_pos);

		if(!match)
			this.$content.append(this.regBlock);
	}	
}