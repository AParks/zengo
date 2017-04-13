'use strict';

var map = require('lodash.map');
var merge = require('lodash.merge');

var ZnRecordDao = function(znApi, formId) {

	var dao = {};

	var getEndpoint = function(recordId) {
		var endpoint = ['/forms', formId, 'records'].join('/');
		if (recordId) {
			endpoint += '/' + recordId;
		}
		return endpoint;
	};

	dao.get = function(request) {
		var endpoint = getEndpoint(request.id);
		return znApi.get(endpoint);
	};

	dao.query = function(request) {
		var endpoint = getEndpoint();
		return znApi.query(endpoint, request);
	};

	dao.save = function(record) {
		var endpoint = getEndpoint(record.id);
		if (record.id) {
			return znApi.put(endpoint, record);
		}
		return znApi.post(endpoint, record);
	};

	return dao;
};

module.exports = ZnRecordDao;
