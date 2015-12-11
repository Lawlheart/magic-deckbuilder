'use strict';

describe('Controller: BuildCtrl', function () {

  // load the controller's module
  beforeEach(module('magicApp'));

  var BuildCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuildCtrl = $controller('BuildCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
