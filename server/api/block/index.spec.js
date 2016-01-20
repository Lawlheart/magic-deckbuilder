'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var blockCtrlStub = {
  index: 'blockCtrl.index',
  show: 'blockCtrl.show',
  create: 'blockCtrl.create',
  update: 'blockCtrl.update',
  destroy: 'blockCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var blockIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './block.controller': blockCtrlStub
});

describe('Block API Router:', function() {

  it('should return an express router instance', function() {
    blockIndex.should.equal(routerStub);
  });

  describe('GET /api/blocks', function() {

    it('should route to block.controller.index', function() {
      routerStub.get
        .withArgs('/', 'blockCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/blocks/:id', function() {

    it('should route to block.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'blockCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/blocks', function() {

    it('should route to block.controller.create', function() {
      routerStub.post
        .withArgs('/', 'blockCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/blocks/:id', function() {

    it('should route to block.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'blockCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/blocks/:id', function() {

    it('should route to block.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'blockCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/blocks/:id', function() {

    it('should route to block.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'blockCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
