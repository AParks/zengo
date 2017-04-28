'use strict';

var get = require('lodash.get');
var set = require('lodash.set');

var createFirebase = function(path, data) {

	var fb = {};

	if (!path) {
		path = '';
	}

	fb.path = path;

	if (!data) {
		data = {};
	}

	fb.data = data;

	fb.child = function(path) {
		var newPath;
		if (fb.path) {
			newPath = fb.path + '/' + path;
		} else {
			newPath = path;
		}
		return createFirebase(newPath, fb.data);
	};

	var objPath = function() {
		return fb.path.replace(/\//g, ".");
	};

	fb.set = function(value, cb) {
		var path = objPath();
		set(fb.data, path, value);
		if (cb) {
			cb();
		}
	};

	fb.once = function(ev, resolve, reject) {
		var obj = {};
		obj.val = function() {
			var path = objPath();
			var value = get(fb.data, path);
			return value;
		};
		resolve(obj);
	};

	return fb;

};

module.exports = createFirebase;