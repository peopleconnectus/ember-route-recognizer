# ember-route-recognizer

[![Greenkeeper badge](https://badges.greenkeeper.io/peopleconnectus/ember-route-recognizer.svg)](https://greenkeeper.io/)
[![npm version](https://badge.fury.io/js/ember-route-recognizer.svg)](https://badge.fury.io/js/ember-route-recognizer)
[![Build Status](https://travis-ci.org/peopleconnectus/ember-route-recognizer.svg?branch=master)](https://travis-ci.org/peopleconnectus/ember-route-recognizer)
[![Build status](https://ci.appveyor.com/api/projects/status/navm4psiytye3ocd/branch/master?svg=true)](https://ci.appveyor.com/project/CM-SiteUI/ember-route-recognizer/branch/master)
[![dependencies Status](https://david-dm.org/peopleconnectus/ember-route-recognizer/status.svg)](https://david-dm.org/peopleconnectus/ember-route-recognizer)
[![devDependencies Status](https://david-dm.org/peopleconnectus/ember-route-recognizer/dev-status.svg)](https://david-dm.org/peopleconnectus/ember-route-recognizer?type=dev)

Resolve Ember.js routes by path in Node.js

### Installation

```sh
yarn add ember-route-recognizer
```

### Motivation

In your Node.js server, you have an incoming request path and need to know what Ember.js route it maps to. It is impossible to guess with just the url what Ember.js route it maps to because a route can have a custom path. We need a way to load the Ember.js route map in Node.js. With some slight modifications to your Ember.js `router.js`, it is now possible.

### Example

Given a router at `app/router.js` like this:

```js
import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('parent-route', { path: 'custom-route/:dynamic_segment' }, function() {
    this.route('child-route');
  });
});

export default Router;
```

We must first extract just the route map to a new file because we don't want to import all of Ember.js. Create a new file at `app/router-map.js` like this:

```js
export default function() {
  this.route('parent-route', { path: 'custom-route/:dynamic_segment' }, function() {
    this.route('child-route');
  });
};
```

Then our `app/router.js` becomes:

```js
import Ember from 'ember';
import config from './config/environment';
import routerMap from './router-map';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(routerMap);

export default Router;
```

Next, we need to get this new `app/router-map.js` into our Node.js server. This can be done a variety of ways, but a git submodule is the most complete solution. Given an Ember.js app named `my-app`, you would run this in your Node.js server directory:

```sh
git submodule add -- https://my-git-server/my-app.git my-app
```

Now we have access to that file in our Node.js project. We assume you have Babel set up in your project because your Ember.js code needs it. Assuming you have an npm build script like this:

```js
{
  "scripts": {
    "build": "babel lib -d dist"
  }
}
```

We can add the brebuild step:

```js
{
  "scripts": {
    "prebuild": "cp my-app/app/router-map.js lib",
    "build": "babel lib -d dist"
  }
}
```

And we probably want to add `lib/router-map.js` to our `.gitignore`.

Now, we can finally write the code to consume this file. This code lives at `lib/index.js`:

```js
import emberRouteRecognizer from 'ember-route-recognizer';
import routerMap from './router-map';

let routeResolver = emberRouteRecognizer(routerMap);

let result = routeResolver('/custom-route/some-variable/child-route?someParam=true');

console.log(result);
```

The result structure comes from [route-recognizer](https://github.com/tildeio/route-recognizer)

```js
{ '0': 
   { handler: 
      { name: 'child-route',
        fullName: 'parent-route.child-route',
        path: '/child-route',
        fullPath: '/custom-route/:dynamic_segment/child-route' },
     params: 
      { dynamic_segment: 'some-variable' },
     isDynamic: true },
  queryParams: { someParam: 'true' },
  length: 1 }
```
