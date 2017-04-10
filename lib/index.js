import RouteRecognizer from 'route-recognizer';

export default function(routerMap) {
  let router = new RouteRecognizer();

  function callCallback(callback, parentRoute) {
    callback.call({
      route,
      parentRoute
    });
  }

  // for reference https://github.com/emberjs/ember.js/blob/v2.12.0/packages/ember-routing/lib/system/dsl.js#L20
  function route(name, options = {}, callback) {
    if (arguments.length === 2 && typeof options === 'function') {
      callback = options;
      options = {};
    }

    let path;
    if (options.path) {
      path = options.path;
    } else {
      path = name;
    }
    if (path.indexOf('/') !== 0) {
      path = `/${path}`;
    }

    let fullName;
    let fullPath;
    let { parentRoute } = this;
    if (parentRoute) {
      fullName = parentRoute.fullName + '.';
      fullPath = parentRoute.fullPath;
    } else {
      fullName = '';
      fullPath = '';
    }
    fullName += name;
    fullPath += path;

    let routeObj = {
      name,
      fullName,
      path,
      fullPath
    };
    router.add([{ path: fullPath, handler: routeObj }]);

    if (callback) {
      callCallback(callback, routeObj);
    }
  }

  callCallback(routerMap);

  return function(path) {
    return router.recognize(path);
  };
}
