'use strict';

describe('Component: TestbuildComponent', function () {

  // load the controller's module
  beforeEach(module('magicApp'));

  var TestbuildComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    TestbuildComponent = $componentController('TestbuildComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
