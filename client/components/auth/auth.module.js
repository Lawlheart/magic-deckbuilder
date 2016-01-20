'use strict';

angular.module('magicApp.auth', [
  'magicApp.constants',
  'magicApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
