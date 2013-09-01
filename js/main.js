$(function(){
	var editGuru = new EditGuru({
		container: document.getElementById('editor')
	});

	var codePreview = new CodePreview($('.code-preview'));

	setInterval($.proxy(function() {
		codePreview.setCode(editGuru.exportHtmlCode())
	}, this), 500);
});