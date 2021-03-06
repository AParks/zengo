'use strict';

var assembleParams = require('./api-params-assemble.js');

var createApi = function(znHttp) {

	var api = {};

	api.get = function(endpoint, params) {
		var returnData = function(body) {
			return body.data;
		};
		return api.query(endpoint, params).then(returnData);
	};

	api.query = function(endpoint, params) {

		var options = {
			params: assembleParams(params)
		};

		var returnParsedResponse = function(response) {
			var body = response.getBody();

			if (body.totalCount === 0) {
				body.offset = body.offset || 0;
				body.data = body.data || [];
			}

			return body;
		};

		return znHttp.get(endpoint, options).then(returnParsedResponse);
	};


	api.queryAll = function(endpoint, params) {

		params.page = 1;

		const returnData = function(body) {

			const totalCount = body.totalCount,
				limit = body.limit;

			if (totalCount > limit) {

				const promises = [],
					numPages = Math.ceil(totalCount / limit);

				for (let page = 2; page <= numPages; page++) {

					params.page = page;

					promises.push(api.get(endpoint, params));
				}

				return Promise.all(promises).then(function(pages) {

					let data = body.data;

					pages.forEach(function(page) {
						data = data.concat(page);
					});

					return data;

				});

			}

			return body.data;
		};

		return api.query(endpoint, params).then(returnData);

	};

	api.queryFirst = function(endpoint, params) {
		return api.query(endpoint, params).then(function(response) {
			return response.data[0];
		});
	};

	var returnResponseData = function(response) {
		return response.getBody().data;
	};

	api.post = function(endpoint, data) {
		return znHttp.post(endpoint, data).then(returnResponseData);
	};

	api.put = function(endpoint, data) {
		return znHttp.put(endpoint, data).then(returnResponseData);
	};

	api.del = function(endpoint, params) {
		var options = {
			params: assembleParams(params)
		};

		var returnParsedResponse = function(response) {
			return response.getBody();
		};
		return znHttp.del(endpoint, options).then(returnParsedResponse);
	};

	api.count = function(endpoint, params) {

		var options = {
			params: assembleParams(params)
		};

		var returnParsedResponse = function(response) {
			var body = response.getBody();
			return body.totalCount || 0;
		};

		return znHttp.get(endpoint + '/count', options).then(returnParsedResponse);
	};

	return api;
};

module.exports = createApi;
