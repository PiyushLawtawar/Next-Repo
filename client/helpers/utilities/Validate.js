export const Validate = {
    regExp: {
        onlyTextWithSpace: new RegExp('^[a-zA-Z ]*$'),
        nameWithSpecialChars: new RegExp('^[a-zA-Z áéíóúÁÉÍÓÚüÜñÑ¿¡]*$'),
        textWithSpecialCharsNoQuestionMark: new RegExp('^[a-zA-Z áéíóúÁÉÍÓÚüÜñÑ¡]*$'),
        // nameWithSpecialChars: new RegExp('^[a-zA-Z \"\'\~]*$'),
        onlyNumbers: new RegExp('^[0-9]*$'),
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        numWithCharacters: new RegExp('^[0-9a-zA-Z]*$'),
        numWithCharactersAndSpace:  new RegExp('^[0-9a-zA-Z ]*$'),
        numWithCharactersAndSpaceAndSpecialChars: new RegExp('^[0-9a-zA-Z áéíóúÁÉÍÓÚüÜñÑ¿¡]*$'),
    },
    isValidLength: function (e) {
        if (e.target.maxLength) {
            return e.target.value.toString().length <= e.target.maxLength ? true : false
        } else {
            return true;
        }
    },
    textWithSpecialChars: function (e, preValue, maxLength) {
        return e.target.value ? (
            (this.regExp.nameWithSpecialChars.test(e.target.value) && (maxLength ? e.target.value.toString().length <= maxLength : true))
                ? e.target.value : preValue
        ) : e.target.value;
    },
    textWithSpecialCharsNoQ: function (e, preValue, maxLength) {
        return e.target.value ? (
            (this.regExp.textWithSpecialCharsNoQuestionMark.test(e.target.value) && (maxLength ? e.target.value.toString().length <= maxLength : true))
                ? e.target.value : preValue
        ) : e.target.value;
    },
    onlyText: function (e, preValue) {
        return e.target.value ? (
            (this.regExp.onlyTextWithSpace.test(e.target.value))
                ? e.target.value : preValue
        ) : e.target.value;
    },
    onlyNumbers: function (e, preValue) {
        return e.target.value ? (this.regExp.onlyNumbers.test(e.target.value.toString()) ? e.target.value : preValue) : e.target.value;
    },
    isValidEmail: function (value) {
        return this.regExp.email.test(String(value).toLowerCase());
    },
    onlyNumbersWithMaxLength: function (e, preValue, maxLength) {
        let onlyNumbers = this.onlyNumbers(e, preValue);
        return (onlyNumbers.toString().length <= maxLength) ? onlyNumbers : preValue;
    },
    onlyMaxLength: function (e, preValue, maxLength) {
        return (e.target.value.toString().length <= maxLength) ? e.target.value : preValue;
    },
    testLength: function (val, fixedLength) {
        return val.toString().length === fixedLength;
    },
    onlyNumbersWithCharacters: function (e, preValue) {
        return e.target.value ? (this.regExp.numWithCharacters.test(e.target.value) ? e.target.value : preValue) : e.target.value;
    },
    onlyNumbersWithCharactersWithSpace: function (e, preValue) {
        return e.target.value ? (this.regExp.numWithCharactersAndSpace.test(e.target.value) ? e.target.value : preValue) : e.target.value;
    },
    onlyNumbersWithCharactersWithSpaceWithSpecialChars: function (e, preValue) {
        return e.target.value ? (this.regExp.numWithCharactersAndSpaceAndSpecialChars.test(e.target.value) ? e.target.value : preValue) : e.target.value;
    },
    validation: function (e, preValue) {
        var value;
        switch (e.target.getAttribute('validationtype')) {
            case 'onlyText':
                value = this.onlyText(e, preValue);
                break;
            case 'textWithSpecialChars':
                value = this.textWithSpecialChars(e, preValue, e.target.getAttribute('maxLength'));
                break;
            case 'textWithSpecialCharsNoQ':
                value = this.textWithSpecialCharsNoQ(e, preValue, e.target.getAttribute('maxLength'));
                break;
            case 'onlyNumbers':
                value = this.onlyNumbers(e, preValue);
                break;

            case 'onlyNumbersWithMaxLength':
                value = this.onlyNumbersWithMaxLength(e, preValue, e.target.getAttribute('maxLength'));
                break;

            case 'onlyMaxLength':
                value = this.onlyMaxLength(e, preValue, e.target.getAttribute('maxLength'));
                break;
            case 'onlyNumbersWithCharacters':
                value = this.onlyNumbersWithCharacters(e, preValue, e.target.getAttribute('onlyNumbersWithCharacters'));
                break;
            case 'onlyNumbersWithCharactersWithSpace':
                value = this.onlyNumbersWithCharactersWithSpace(e, preValue, e.target.getAttribute('onlyNumbersWithCharactersWithSpace'));
                break;
            case 'onlyNumbersWithCharactersWithSpaceWithSpecialChars':
                value = this.onlyNumbersWithCharactersWithSpaceWithSpecialChars(e, preValue, e.target.getAttribute('onlyNumbersWithCharactersWithSpaceWithSpecialChars'));
                break;
            default:
                value = e.target.value;
                break;
        }
        return value;
    }
}