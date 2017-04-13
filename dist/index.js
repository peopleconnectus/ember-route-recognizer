'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (routerMap) {
  var router = new _routeRecognizer2.default();

  function callCallback(callback, parentRoute) {
    callback.call({
      route,
      alias,
      parentRoute
    });
  }

  var routeLookup = {};

  // for reference https://github.com/emberjs/ember.js/blob/v2.12.0/packages/ember-routing/lib/system/dsl.js#L20
  function route(name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callback = arguments[2];

    if (arguments.length === 2 && typeof options === 'function') {
      callback = options;
      options = {};
    }

    var path = void 0;
    if (options.path) {
      path = options.path;
    } else {
      path = name;
    }
    if (path.indexOf('/') !== 0) {
      path = `/${path}`;
    }

    var fullName = void 0;
    var fullPath = void 0;
    var parentRoute = this.parentRoute;

    if (parentRoute) {
      fullName = parentRoute.fullName + '.';
      fullPath = parentRoute.fullPath;
    } else {
      fullName = '';
      fullPath = '';
    }
    fullName += name;
    fullPath += path;

    var routeObj = {
      name,
      fullName,
      path,
      fullPath
    };
    router.add([{ path: fullPath, handler: routeObj }]);

    routeLookup[fullName] = callback;

    if (callback) {
      callCallback(callback, routeObj);
    }
  }

  function alias(aliasRoute, aliasPath, aliasTarget) {
    var fullName = void 0;
    var parentRoute = this.parentRoute;

    if (parentRoute) {
      fullName = parentRoute.fullName + '.';
    } else {
      fullName = '';
    }
    fullName += aliasTarget;

    var callback = routeLookup[fullName];
    var args = [aliasRoute, { path: aliasPath }];
    if (callback) {
      args.push(callback);
    }

    this.route.apply(this, args);
  }

  callCallback(routerMap);

  return function (path) {
    return router.recognize(path);
  };
};

var _routeRecognizer = require('route-recognizer');

var _routeRecognizer2 = _interopRequireDefault(_routeRecognizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }