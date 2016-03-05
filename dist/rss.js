(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.RSS = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Compiler = (function () {
	function Compiler(Store) {
		_classCallCheck(this, Compiler);

		this.Store = Store;
	}

	_createClass(Compiler, [{
		key: 'isMediaQuery',
		value: function isMediaQuery(check) {
			return check.match(/\@media/);
		}
	}, {
		key: 'isExtend',
		value: function isExtend(check) {
			return check.match(/^\@extend($|[0-9])/);
		}
	}, {
		key: 'isVariable',
		value: function isVariable(check) {
			if (typeof check != 'string') return false;
			return check.match(/^\$[a-z,A-Z]+$/);
		}
	}, {
		key: 'isMixin',
		value: function isMixin(check) {
			return check.match(/^\@mixin\s/);
		}
	}, {
		key: 'isNesting',
		value: function isNesting(check) {
			return check.match(/^\>[^]/);
		}
	}, {
		key: 'isGrouping',
		value: function isGrouping(check) {
			return check.match(/^\#\s[a-z,A-Z]+$/);
		}
	}, {
		key: 'generateSelector',
		value: function generateSelector(selector, scope) {
			var children = '';
			var check = selector.match(/^[^\s]+/)[0];
			var postfixes = selector.replace(/^[^\s]+/, '');
			if (this.Store.styles[check]) for (var child in this.Store.styles[check].children) {
				children += child.replace('&', ' ') + ' ' + postfixes + ', ';
			}
			return (children + ' ' + '.' + scope + ' ' + selector).replace(/\s+\:/, ':').replace('BASE', '');
		}
	}, {
		key: 'generateValue',
		value: function generateValue(value) {
			if (this.isVariable(value)) return this.Store.variables[value];else return value;
		}
	}, {
		key: 'parse',
		value: function parse(obj, scope) {
			var _this = this;

			var parentID = '';
			var parentOBJ = {};
			var groupingID = '';

			var stack = [];
			var sum = "";
			var level = 0;

			var stitch = function stitch(obj) {

				level++;

				for (var props in obj) {

					if (_this.isVariable(props)) continue;

					if (level == 1 && !_this.isMediaQuery(props)) {
						parentID = props;
						parentOBJ = obj[props];
					}

					if (_this.isMixin(props)) {
						if (typeof obj[props] == 'string') {
							var key = _this.Store.mixins[props.replace('@mixin ', '')];
							stitch(key(obj[props]));
						} else continue;
					} else if (_this.isGrouping(props)) {
						groupingID = props.replace('# ', '') + '-';
						stitch(obj[props]);
						groupingID = '';
					} else if (_this.isNesting(props)) {
						var item = _defineProperty({}, parentID + " " + props.replace('> ', ''), obj[props]);
						stack.push(item);
					} else if (_this.isExtend(props)) continue;else {
						if (typeof obj[props] === 'object') {
							if (_this.isMediaQuery(props)) sum += props;else sum += _this.generateSelector(props, scope);
							sum += "{";
							stitch(obj[props]);
							sum += "}";
						} else {
							sum += groupingID + props;
							sum += ":" + _this.generateValue(obj[props]) + ";";
						}
					}
				}

				level--;
			};

			stitch(obj);

			var len = stack.length;
			for (var i = 0; i < len; i++) {
				stitch(stack[i]);
				len = stack.length;
			}

			return sum;
		}
	}]);

	return Compiler;
})();

exports.Compiler = Compiler;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Token = require('./Token');

var _Store = require('./Store');

var _Tag = require('./Tag');

var Component = (function () {
	function Component(styles) {
		_classCallCheck(this, Component);

		this.token = new _Token.Token();
		this.tag = new _Tag.Tag(this.token.key);
		if (styles) this.setStyles(styles);
	}

	_createClass(Component, [{
		key: 'setStyles',
		value: function setStyles(obj) {
			_Store.Store.setStyles(obj, this.token, this.tag);
		}
	}, {
		key: 'set',
		value: function set(obj) {
			this.setStyles(obj);
		}
	}, {
		key: 'getStyleTag',
		value: function getStyleTag() {
			return this.tag.getTag();
		}
	}, {
		key: 'getScope',
		value: function getScope() {
			return '.' + this.token.key;
		}
	}, {
		key: 'className',
		value: function className() {
			return this.token.key;
		}
	}, {
		key: 'getToken',
		value: function getToken() {
			return this.token.key;
		}
	}]);

	return Component;
})();

exports.Component = Component;

},{"./Store":5,"./Tag":7,"./Token":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Style = require('./Style');

var PreCompiler = (function () {
	function PreCompiler(Store) {
		_classCallCheck(this, PreCompiler);

		this.Store = Store;
	}

	_createClass(PreCompiler, [{
		key: 'parse',
		value: function parse(obj, token) {
			var _this = this;

			var level = 0;
			var activeStyle = {};

			var extract = function extract(obj) {
				level++;

				for (var prop in obj) {

					if (level == 1) {
						_this.Store.styles[prop] = new _Style.Style(token.key, prop, obj[prop]);
						activeStyle = _this.Store.styles[prop];
						if (!_this.Store.tokenIndex[token.key]) _this.Store.tokenIndex[token.key] = {};
						_this.Store.tokenIndex[token.key][activeStyle.selector] = activeStyle;
						if (!_this.Store.styleIndex[token.key]) _this.Store.styleIndex[token.key] = {};
						_this.Store.styleIndex[token.key][activeStyle.selector] = activeStyle.body;
					}

					if (prop.match(/^\@extend($|[0-9])/)) {
						var _parent = _this.Store.styles[obj[prop]];
						if (!_parent) console.log('\'' + obj[prop] + '\' cannot be extended because it does not exist!');else {
							activeStyle.parents[obj[prop]] = obj[prop];
							_parent.children['.' + activeStyle.token + '&' + activeStyle.selector] = true;
							_this.Store.renderStack[_parent.token] = _parent.token;
						}
					} else if (prop.match(/^\$[a-z,A-Z]+$/)) {
						_this.Store.variables[prop] = obj[prop];
					} else if (prop.match(/^\@mixin\s[^]/) && typeof obj[prop] === 'function') {
						_this.Store.mixins[prop.replace(/^\@mixin\s/, '')] = obj[prop];
					}

					if (typeof obj[prop] === 'object') {
						extract(obj[prop]);
					}
				}
				level--;
			};
			extract(obj);
			this.Store.renderStack[token.key] = token.key;
			//console.log(this);
		}
	}]);

	return PreCompiler;
})();

exports.PreCompiler = PreCompiler;

},{"./Style":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Component2 = require('./Component');

var RSS = function RSS() {
	_classCallCheck(this, RSS);

	if (!document.getElementById('rss-container')) {
		var el = document.createElement('div');
		el.id = 'rss-container';
		document.body.appendChild(el);
	}
};

var RSSSingleton = new RSS();

exports.RSSSingleton = RSSSingleton;
var Component = _Component2.Component;
exports.Component = Component;

},{"./Component":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Compiler = require('./Compiler');

var _PreCompiler = require('./PreCompiler');

var StoreSingleton = (function () {
	function StoreSingleton() {
		_classCallCheck(this, StoreSingleton);

		this.styles = {};
		this.tags = {};
		this.mixins = {};
		this.variables = {};
		this.tokenIndex = {};
		this.styleIndex = {};
		this.renderStack = {};
	}

	_createClass(StoreSingleton, [{
		key: 'setStyles',
		value: function setStyles(styles, token, tag) {
			this.tags[token.key] = tag;
			this.compile(styles, token);
		}
	}, {
		key: 'compile',
		value: function compile(styles, token) {
			var preCompiler = new _PreCompiler.PreCompiler(this);
			preCompiler.parse(styles, token);
			for (var item in this.renderStack) {
				var compiler = new _Compiler.Compiler(this);
				var result = compiler.parse(this.styleIndex[this.renderStack[item]], this.renderStack[item]);
				//console.log(result);
				this.tags[item].update(result);
			}
			this.renderStack = {};
		}
	}]);

	return StoreSingleton;
})();

var Store = new StoreSingleton();
exports.Store = Store;

},{"./Compiler":1,"./PreCompiler":3}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Style = function Style(token, selector, body) {
	_classCallCheck(this, Style);

	this.token = token;
	this.selector = selector;
	this.body = body;
	this.parents = {};
	this.children = {};
};

exports.Style = Style;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Tag = (function () {
	function Tag(id) {
		_classCallCheck(this, Tag);

		this.tag = this.generateTag('rss-' + id);
	}

	_createClass(Tag, [{
		key: 'generateTag',
		value: function generateTag(id) {
			var el = document.createElement('style');
			el.id = id;
			var container = document.getElementById('rss-container');
			container.appendChild(el);
			return el;
		}
	}, {
		key: 'getTag',
		value: function getTag() {
			return this.tag;
		}
	}, {
		key: 'update',
		value: function update(stringified) {
			this.tag.innerHTML = stringified;
			// console.log(stringified);
			// for (var i=0; i < document.styleSheets.length; i++){
			// 	if(document.styleSheets[i].ownerNode ==  this.tag){
			// 		document.styleSheets[i].insertRule(stringified,0);
			// 	}
			// }
		}
	}]);

	return Tag;
})();

exports.Tag = Tag;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Token = (function () {
	function Token() {
		_classCallCheck(this, Token);

		this.key = this.generateKey(4);
		this.current = false;
	}

	_createClass(Token, [{
		key: "generateKey",
		value: function generateKey(length) {
			var key = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
			for (var i = 0; i < length; i++) key += possible.charAt(Math.floor(Math.random() * possible.length));
			return key;
		}
	}]);

	return Token;
})();

exports.Token = Token;

},{}]},{},[4])(4)
});

var RSS = RSS;