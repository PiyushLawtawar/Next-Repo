if(document.querySelector('.mdc-text-field') != null){
	var textInputs = document.querySelectorAll('.mdc-text-field');
	for (var i = 0, textInput; textInput = textInputs[i]; i++) {
			var inputText = new mdc.textField.MDCTextField(textInput);
	}
}
