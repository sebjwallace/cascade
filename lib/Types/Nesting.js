'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Nesting = exports.Nesting = function () {
	function Nesting() {
		_classCallCheck(this, Nesting);
	}

	_createClass(Nesting, null, [{
		key: 'isNesting',
		value: function isNesting(check) {
			return check.match(/^\>[^]/);
		}
	}, {
		key: 'format',
		value: function format(fromString) {
			return fromString.replace('> ', '');
		}
	}]);

	return Nesting;
}();