'use strict';

var get = require('lodash.get');
var util = require('./zn-http-fake-query-util');
var orderBy = require('lodash.orderby');

var fakeQuery = function(data, params) {

	var query = {};

	query.paginate = function() {

		var pagination = util.getPaginateParams(params);

		if (!data || !pagination) {
			return query;
		}

		var page = pagination.page || 1;

		var limit = pagination.limit || 20;

		--page;

		data = data.slice(page * limit, (page + 1) * limit);

		return query;

	};

	// todo: needs to support php array like params
	// sort[0]=1,sort[1]=2 direction[0]=asc,direction[1]=desc
	query.sort = function() {

		var sorting = util.getSortingParams(params);

		if (!sorting) {
			return query;
		}

		data = orderBy(data, sorting.sort, sorting.direction);

		return query;

	};

	query.filter = function() {

		// todo: needs a lot of work to be close
		// to what the api does

		var conditionalParams = util.getConditionalParams(params);

		var filterParam = util.getFilterParam(params);

		if (!conditionalParams && !filterParam) {
			return query;
		}

		var filter = util.conditionalParamsToFilter(conditionalParams);

		// todo: check does the api merge both
		// conditional params and a filter?

		if (!filter) {
			return query;
		}

		// todo: that filter match goes in here
		// data = filterMatcher(data, filter);

		return query;

	};

	// todo: really necessary only for testing?
	query.restrictToAttributes = function() {

		var attributes = util.getAttributesParam(params);

		if (!attributes) {
			return query;
		}

		return query;

	};

	// todo: really necessary only for testing?
	query.restrictToRelated = function() {

		var related = util.getRelatedParam(params);

		if (!related) {
			return query;
		}

		return query;

	};

	query.convertToTimezone = function() {

		// todo: small chance for use case but
		// if we decide to implement also needs
		// a small timezone module to convert

		return query;

	};

	query.getCount = function() {

		if ((!!data) && (data.constructor === Array)) {
			return data.length || 0;
		}

		if ((!!data) && (data.constructor === Object)) {
			return 1;
		}

		return 0;

	};

	query.getResults = function() {
		return data;
	};

	return query;

};

module.exports = fakeQuery;
