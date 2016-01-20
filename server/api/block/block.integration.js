'use strict';

var app = require('../..');
import request from 'supertest';

var newBlock;

describe('Block API:', function() {

  describe('GET /api/blocks', function() {
    var blocks;

    beforeEach(function(done) {
      request(app)
        .get('/api/blocks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          blocks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      blocks.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/blocks', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/blocks')
        .send({
          name: 'New Block',
          info: 'This is the brand new block!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBlock = res.body;
          done();
        });
    });

    it('should respond with the newly created block', function() {
      newBlock.name.should.equal('New Block');
      newBlock.info.should.equal('This is the brand new block!!!');
    });

  });

  describe('GET /api/blocks/:id', function() {
    var block;

    beforeEach(function(done) {
      request(app)
        .get('/api/blocks/' + newBlock._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          block = res.body;
          done();
        });
    });

    afterEach(function() {
      block = {};
    });

    it('should respond with the requested block', function() {
      block.name.should.equal('New Block');
      block.info.should.equal('This is the brand new block!!!');
    });

  });

  describe('PUT /api/blocks/:id', function() {
    var updatedBlock;

    beforeEach(function(done) {
      request(app)
        .put('/api/blocks/' + newBlock._id)
        .send({
          name: 'Updated Block',
          info: 'This is the updated block!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBlock = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBlock = {};
    });

    it('should respond with the updated block', function() {
      updatedBlock.name.should.equal('Updated Block');
      updatedBlock.info.should.equal('This is the updated block!!!');
    });

  });

  describe('DELETE /api/blocks/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/blocks/' + newBlock._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when block does not exist', function(done) {
      request(app)
        .delete('/api/blocks/' + newBlock._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
