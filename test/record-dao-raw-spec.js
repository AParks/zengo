'use strict';

describe('RecordDaoRaw', function() {

	var util = require('./support/api-test-util.js');

	var RecordDaoRaw = require('../src/record-dao-raw.js');

	var api;
	var znNock;

	beforeEach(function() {
		api = util.createApi();
		znNock = util.ZnNock();
	});

	describe('get', function () {

		it('should call GET api and return raw record', function() {

			var recordDaoRaw = RecordDaoRaw(api, 7);

			var apiResponse = {
				data: {
					id: 651,
					field1: 'apples'
				},
				totalCount: 1
			};

			znNock.get('/forms/7/records/651').reply(200, apiResponse);

			var request = {
				id: 651,
			};

			return recordDaoRaw.get(request)
				.then(function(response) {
					expect(response).to.eql({
						id: 651,
						field1: 'apples'
					});
				});
		});

		it('should call GET api and return raw records', function() {

			var recordDaoRaw = RecordDaoRaw(api, 7);

			var apiResponse = {
				data: [
					{
						id: 651,
						field1: 'apples'
					},
					{
						id: 652,
						field1: 'bananas'
					},
					{
						id: 653,
						field1: 'oranges'
					}
				],
				totalCount: 100
			};

			znNock.get('/forms/7/records?id=1%7C2%7C3&limit=3&attributes=field1%2Cid').reply(200, apiResponse);

			var request = {
				id: [1,2,3],
				limit: 3,
				attributes: ['field1','id']
			};

			return recordDaoRaw.get(request)
				.then(function(response) {
					expect(response).to.eql(
						[
							{
								id: 651,
								field1: 'apples'
							},
							{
								id: 652,
								field1: 'bananas'
							},
							{
								id: 653,
								field1: 'oranges'
							}
						]
					);
				});
		});

	});

	describe('query', function () {

		it('should call GET api and return raw records', function() {

			var recordDaoRaw = RecordDaoRaw(api, 123);

			var apiResponse = {
				data: [
					{
						id: 1
					},
					{
						id: 3
					}
				],
				totalCount: 2
			};

			znNock.get('/forms/123/records?field123=apples').reply(200, apiResponse);

			var request = {
				field123: 'apples'
			};

			return recordDaoRaw.query(request)
				.then(function(response) {
					expect(response.totalCount).to.equal(2);
					expect(response.data[0]).to.eql({
						id: 1,
					});
					expect(response.data[1]).to.eql({
						id: 3,
					});
				});
		});
	});

	describe('save', function() {

		describe('without id', function() {

			it('should create record and return raw saved record', function() {

				var recordDaoRaw = RecordDaoRaw(api, 123);

				var record = {
					field123: 'apples'
				};

				var recordRequest = {
					field123: 'apples'
				};

				var savedRecord = {
					id: 1,
					saved: true
				};

				var apiResponse = {
					data: savedRecord
				};

				znNock.post('/forms/123/records', recordRequest).reply(200, apiResponse);

				return recordDaoRaw.save(record)
					.then(function(response) {
						expect(response).to.eql({
							id: 1,
							saved: true
						});
					});
			});
		});

		describe('with id', function() {

			it('should update record and return raw saved record', function() {

				var recordDaoRaw = RecordDaoRaw(api, 123);

				var record = {
					id: 7,
					field123: 'apples'
				};

				var recordRequest = {
					id: 7,
					field123: 'apples'
				};

				var savedRecord = {
					id: 7,
					saved: true
				};

				var apiResponse = {
					data: savedRecord
				};

				znNock.put('/forms/123/records/7', recordRequest).reply(200, apiResponse);

				return recordDaoRaw.save(record)
					.then(function(response) {
						expect(response).to.eql({
							id: 7,
							saved: true
						});
					});
			});
		});
	});

	describe('count', function() {

		it('should call COUNT api and return the total count', function() {

			var recordDaoRaw = RecordDaoRaw(api, 123);

			var totalCount = 1;

			var apiResponse = {
				status: 200,
  				code: 2000,
  				totalCount: totalCount
			};

			znNock.get('/forms/123/records/count?field123=apples').reply(200, apiResponse);

			var request = {
				field123: 'apples'
			};

			return recordDaoRaw.count(request).then(function(results) {
				expect(results).to.be.equal(totalCount);
			});

		});

	});
});
