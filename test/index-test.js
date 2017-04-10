import { expect } from 'chai';
import routesLoader from '../lib';

describe('Acceptance', function() {
  it('handles no matches', function() {
    let routeLookup = routesLoader(function() {});

    let result = routeLookup('/');

    expect(result).to.be.undefined;
  });

  it('recognizes query params', function() {
    let routeLookup = routesLoader(function() {
      this.route('single-route');
    });

    let result = routeLookup('/single-route?aParam=true');

    expect(result[0]).to.deep.equal({
      handler: {
        name: 'single-route',
        fullName: 'single-route',
        path: '/single-route',
        fullPath: '/single-route'
      },
      params: {},
      isDynamic: false
    });
    expect(result.queryParams).to.deep.equal({
      aParam: 'true'
    });
    expect(result.length).to.equal(1);
  });

  describe('single route', function() {
    it('matches', function() {
      let routeLookup = routesLoader(function() {
        this.route('single-route');
      });

      let result = routeLookup('/single-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'single-route',
          fullName: 'single-route',
          path: '/single-route',
          fullPath: '/single-route'
        },
        params: {},
        isDynamic: false
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });

    it('matches a custom path with leading slash', function() {
      let routeLookup = routesLoader(function() {
        this.route('single-route', { path: '/custom-single-route' });
      });

      let result = routeLookup('/custom-single-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'single-route',
          fullName: 'single-route',
          path: '/custom-single-route',
          fullPath: '/custom-single-route'
        },
        params: {},
        isDynamic: false
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });

    it('matches a custom path without leading slash', function() {
      let routeLookup = routesLoader(function() {
        this.route('single-route', { path: 'custom-single-route' });
      });

      let result = routeLookup('/custom-single-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'single-route',
          fullName: 'single-route',
          path: '/custom-single-route',
          fullPath: '/custom-single-route'
        },
        params: {},
        isDynamic: false
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });

    it('matches a custom path with dynamic segment', function() {
      let routeLookup = routesLoader(function() {
        this.route('single-route', { path: ':dynamic_segment' });
      });

      let result = routeLookup('/custom-single-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'single-route',
          fullName: 'single-route',
          path: '/:dynamic_segment',
          fullPath: '/:dynamic_segment'
        },
        params: {
          'dynamic_segment': 'custom-single-route'
        },
        isDynamic: true
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });
  });

  describe('parent route', function() {
    it('matches', function() {
      let routeLookup = routesLoader(function() {
        this.route('parent-route', function() {
          this.route('child-route');
        });
      });

      let result = routeLookup('/parent-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'parent-route',
          fullName: 'parent-route',
          path: '/parent-route',
          fullPath: '/parent-route'
        },
        params: {},
        isDynamic: false
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });

    it('matches a custom path with leading slash', function() {
      let routeLookup = routesLoader(function() {
        this.route('parent-route', { path: '/custom-route' }, function() {
          this.route('child-route');
        });
      });

      let result = routeLookup('/custom-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'parent-route',
          fullName: 'parent-route',
          path: '/custom-route',
          fullPath: '/custom-route'
        },
        params: {},
        isDynamic: false
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });

    it('matches a custom path without leading slash', function() {
      let routeLookup = routesLoader(function() {
        this.route('parent-route', { path: 'custom-route' }, function() {
          this.route('child-route');
        });
      });

      let result = routeLookup('/custom-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'parent-route',
          fullName: 'parent-route',
          path: '/custom-route',
          fullPath: '/custom-route'
        },
        params: {},
        isDynamic: false
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });

    it('matches a custom path with dynamic segment', function() {
      let routeLookup = routesLoader(function() {
        this.route('parent-route', { path: ':dynamic_segment' }, function() {
          this.route('child-route');
        });
      });

      let result = routeLookup('/custom-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'parent-route',
          fullName: 'parent-route',
          path: '/:dynamic_segment',
          fullPath: '/:dynamic_segment'
        },
        params: {
          'dynamic_segment': 'custom-route'
        },
        isDynamic: true
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });
  });

  describe('child route', function() {
    it('matches', function() {
      let routeLookup = routesLoader(function() {
        this.route('parent-route', function() {
          this.route('child-route');
        });
      });

      let result = routeLookup('/parent-route/child-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'child-route',
          fullName: 'parent-route.child-route',
          path: '/child-route',
          fullPath: '/parent-route/child-route'
        },
        params: {},
        isDynamic: false
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });

    it('matches a custom path with leading slash', function() {
      let routeLookup = routesLoader(function() {
        this.route('parent-route', function() {
          this.route('child-route', { path: '/custom-route' });
        });
      });

      let result = routeLookup('/parent-route/custom-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'child-route',
          fullName: 'parent-route.child-route',
          path: '/custom-route',
          fullPath: '/parent-route/custom-route'
        },
        params: {},
        isDynamic: false
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });

    it('matches a custom path without leading slash', function() {
      let routeLookup = routesLoader(function() {
        this.route('parent-route', function() {
          this.route('child-route', { path: 'custom-route' });
        });
      });

      let result = routeLookup('/parent-route/custom-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'child-route',
          fullName: 'parent-route.child-route',
          path: '/custom-route',
          fullPath: '/parent-route/custom-route'
        },
        params: {},
        isDynamic: false
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });

    it('matches a custom path with dynamic segment', function() {
      let routeLookup = routesLoader(function() {
        this.route('parent-route', function() {
          this.route('child-route', { path: ':dynamic_segment' });
        });
      });

      let result = routeLookup('/parent-route/custom-route');

      expect(result[0]).to.deep.equal({
        handler: {
          name: 'child-route',
          fullName: 'parent-route.child-route',
          path: '/:dynamic_segment',
          fullPath: '/parent-route/:dynamic_segment'
        },
        params: {
          'dynamic_segment': 'custom-route'
        },
        isDynamic: true
      });
      expect(result.queryParams).to.deep.equal({});
      expect(result.length).to.equal(1);
    });
  });
});
