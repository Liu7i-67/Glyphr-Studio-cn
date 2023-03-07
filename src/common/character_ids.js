import { log } from '../app/main.js';
import { isInteger } from './functions.js';

/**
 * Reading and writing character IDs come in many flavors. This file
 * deals with identifying and converting between these formats:
 * @param {string} char - single character
 * @param {string} unicode - hexadecimal id number, starting with 'U+' or 'u+'
 * @param {number} dec - decimal representation of a character
 * @param {string} hex - a string of a hexadecimal number, starting with '0X' or '0x'
 * @param {string} xmlDec - a decimal XML Char Reference, string starting with '&#'
 * @param {string} xmlHex - a decimal XML Char Reference, string starting with '&#x' or '&#X'
 */

// --------------------------------------------------------------
// Format detection for single inputs
// --------------------------------------------------------------

/**
 * @param {string} - single character
 * @returns {boolean}
 */
export function isChar(input) {
	if (typeof input !== 'string') return false;
	if (input.length > 1) return false;
	return true;
}

/**
 * @param {string} input - Unicode id starting with 'U+'
 * @returns {boolean}
 */
export function isUnicode(input) {
	input = normalizePrefixes(input);
	return isNumberWithPrefix(input, 'U+');
}

/**
 * @param {string} input - Hex string starting with '0x'
 * @returns {boolean}
 */
export function isHex(input) {
	input = normalizePrefixes(input);
	return isNumberWithPrefix(input, '0x');
}

/**
 * @param {string} input - Decimal XML Char Reference starting with '&#'
 * @returns {boolean}
 */
export function isXMLDec(input) {
	return isNumberWithPrefix(input, '&#');
}

/**
 * @param {string} input - Hexadecimal XML Char Reference starting with '&#'
 * @returns {boolean}
 */
export function isXMLHex(input) {
	input = normalizePrefixes(input);
	return isNumberWithPrefix(input, '&#x');
}

// --------------------------------------------------------------
// Prefix and Suffix checking
// --------------------------------------------------------------

/**
 * For Hex, XML Hex, and Unicode IDs, we want to be lenient
 * with regards to capitalization (of the x for hex and the U for
 * Unicode). All our functions assume the 'normal' way of writing these,
 * so this function ensures passed in content is capitalized as expected.
 * @param {string} input - thing to normalize
 * @returns {string}
 */
function normalizePrefixes(input) {
	input = input.replaceAll('0X', '0x');
	input = input.replaceAll('&#X', '&#x');
	input = input.replaceAll('u+', 'U+');
	return input;
}

/**
 * Checks for two things:
 * 1) that a string has a specified prefix
 * 2) that the subsequent suffix is a valid number
 * @param {string} input - thing to check
 * @param {string} prefix - prefix to check for
 * @returns {boolean}
 */
function isNumberWithPrefix(input, prefix) {
	// Check for prefix
	if (hasPrefix(input, prefix)) return false;
	// Check for many instance instead of single instance
	if (input.indexOf(prefix, prefix.length) > 0) return false;
	// Check for valid number suffix
	// Since we don't care about the actual value, just throwing a
	// '0x' at the beginning to see if it is a valid dec or hex number
	let value = input.substring(prefix.length);
	if (isNaN(Number(`0x${value}`))) return false;

	return true;
}

/**
 * @param {string} input - thing to check
 * @param {string} prefix - prefix to check for
 * @returns {boolean}
 */
function hasPrefix(input, prefix) {
	return input.indexOf(prefix) > -1;
}

/**
 * Hex, Unicode IDs, and XML Char Entities all use different prefixes,
 * but the same Hexadecimal suffix. This validates and formats the suffix.
 * @param {string} input - string to check
 * @returns {string} - validated and formatted suffix
 */
function validateHexSuffix(input) {
	const result = parseInt(`0x${input}`);
	if (isNaN(result)) return false;
	return result.toString(16).toUpperCase();
}

// --------------------------------------------------------------
// Validate and return single ID Formats
// --------------------------------------------------------------

/**
 * @param {string} input - expected hexadecimal string
 * @returns - validated hexadecimal string
 */
export function validateAsHex(input) {
	if (!isHex(input)) return false;
	const result = validateHexSuffix(input);
	return result ? `0x${result}` : false;
}

/**
 * @param {string} input - expected Unicode ID string
 * @returns - validated Unicode ID string
 */
export function validateAsUnicode(input) {
	if (!isUnicode(input)) return false;
	const result = unicodeToHex(input);
	if (result === false) return false;
	if (isNaN(Number(result))) return false;
	return `U+${result.substring(2)}`;
}

/**
 * @param {string} input - expected hexadecimal XML Char Reference
 * @returns - validated hexadecimal XML Char Reference
 */
export function validateAsXMLHex(input) {
	if (!isXMLHex(input)) return false;
	const result = xmlHexToHex(input);
	if (result === false) return false;
	if (isNaN(Number(result))) return false;
	return `&#x${result.substring(2)}`;
}

/**
 * @param {string} input - expected decimal XML Char Reference
 * @returns - validated decimal XML Char Reference
 */
export function validateAsXMLDec(input) {
	if (!isXMLDec(input)) return false;
	let result = String(xmlDecToDec(input));
	return `&#${result}`;
}

// --------------------------------------------------------------
// Single to Single Conversion Functions
// --------------------------------------------------------------

/**
 * Convert decimal to hexadecimal
 * @param {number} input - decimal
 * @returns {string} - hexadecimal
 */
export function decToHex(input) {
	if (!isInteger(input)) return false;
	let suffix = validateHexSuffix(input.toString(16));
	return suffix ? `0x${suffix}` : false;
}

/**
 * Convert a string with a single character to hexadecimal
 * @param {string} input - char
 * @returns {string} - hexadecimal
 */
export function charToHex(input) {
	if (!isChar(input)) return false;
	return input.charCodeAt(0);
}

/**
 * Converts a single Unicode ID to hexadecimal
 * @param {string} input - Unicode string starting with 'U+'
 * @returns {string} - hexadecimal string
 */
export function unicodeToHex(input) {
	if (!isUnicode(input)) return false;
	let suffix = validateHexSuffix(input.substring(2));
	return suffix ? `0x${suffix}` : false;
}

/**
 * Converts a single Hex-based XML Char Reference to hexadecimal
 * @param {string} input - XML char code starting with '&#x'
 * @returns {string} - hexadecimal string
 */
export function xmlHexToHex(input) {
	if (!isXMLHex(input)) return false;
	let suffix = validateHexSuffix(input.substring(3));
	return suffix ? `0x${suffix}` : false;
}

/**
 * Converts a single Decimal-based XML Char Reference to a number
 * @param {string} input - XML char code starting with '&#'
 * @returns {number} - decimal number
 */
export function xmlDecToDec(input) {
	if (!isXMLDec(input)) return false;
	return parseInt(input.substring(2));
}

// --------------------------------------------------------------
// Splitting a string of many IDs
// --------------------------------------------------------------

/**
 * Splits a string containing hexadecimal numbers into an array
 * @param {string} input - string of hexadecimal numbers
 * @returns {array}
 */
export function hexesToHexArray(input) {
	input = input.replaceAll('X', 'x');
	let result = input.split('0x');
	result = result.map((value) => {
		return validateAsHex(value);
	});

	return result;
}

/**
 * Splits a string containing Unicode IDs into an array
 * @param {string} input - string of Unicode IDs
 * @returns {array}
 */
export function unicodesToUnicodeArray(input) {
	input = input.replaceAll('u', 'U');
	let result = input.split('U+');
	result = result.map((value) => {
		return validateAsUnicode(value);
	});

	return result;
}

// --------------------------------------------------------------
// Many to Many Conversion Functions
// --------------------------------------------------------------

/**
 * Convert string to an array of hexadecimal
 * @param {number} input - string
 * @returns {array} - hexadecimal
 */
export function charsToHexArray(input) {
	const result = [];
	for (let i = 0; i < input.length; i++) {
		result.push(charToHex(i));
	}
	return result;
}

/**
 * Convert hexadecimal to string
 * @param {string} input - hexadecimal
 * @returns {string} - string
 */
export function hexesToChars(input) {
	log('hexesToChars', 'start');
	input = input.replaceAll('X', 'x');
	if (String(input).charAt(1) !== 'x') return false;

	input = input.split('0x');
	let result = '';

	for (let i = 0; i < input.length; i++) {
		if (input[i] !== '') {
			input[i] = String.fromCharCode(`0x${input[i]}`);
			if (input[i]) result += input[i];
		}
	}

	log(`hexesToChars`, 'end');
	return result;
}

/**
 * Convert hexadecimal string to XML format
 * @param {number} input - hexadecimal
 * @returns {string} - String of XML char entities
 */
export function hexesToXMLHexes(input) {
	let hexArr = hexesToHexArray(input);
	let result = '';
	if (hexArr && hexArr.length) {
		result = hexArr.reduce((acc, value) => {
			if (!isHex(value)) return '';
			return value.replaceAll('0x', '&#x') + ';';
		});
	}
	return result;
}

// --------------------------------------------------------------
// Accepting unknown formats
// --------------------------------------------------------------

/**
 * Take user input and try to get Unicode out
 * @param {string} input - input string
 * @returns {array} - sanitized array of strings
 */
export function parseCharsInput(input) {
	// Takes any kind or number of input
	// and returns an array of hex values
	// Unicode: 'U+123;U+123;'
	// Hexadecimal: '0x1230x123'
	// Chars: 'abc'

	// log('parseCharsInput', 'start');
	// log('passed ' + input);

	if (!input) return false;

	let entries = [];
	const results = [];

	if (hasPrefix(input, 'U+')) {
		input = input.replace(/u\+/g, 'U+');
		entries = input.split('U+');
	} else if (hasPrefix(input, '0x')) {
		input = input.replace(/0X/g, '0x');
		entries = input.split('0x');
	} else {
		return charsToHexArray(input);
	}

	entries.forEach((entry) => {
		entry = entry.replace(/;/g, '');
		if (entry !== '') {
			results.push(validateAsHex(entry));
		}
	});

	if (results.length === 0) results.push('0x0');
	// log('returning ' + JSON.stringify(results));
	// log('parseCharsInput', 'end');
	return results;
}

/**
 * Does a loose compare of two hex inputs to see
 * if they are equal (ignoring zero pads)
 * @param {any} hex1 - first hex value
 * @param {any} hex2 - second hex value
 * @returns {boolean}
 */
export function areHexValuesEqual(hex1, hex2) {
	hex1 = validateAsHex(hex1);
	hex2 = validateAsHex(hex2);
	return hex1 == hex2;
}
