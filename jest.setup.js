// Jest setup file for test environment
require('@testing-library/jest-dom');

// Mock Cloudflare Workers environment
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = options.headers || {};
  }
};

global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.headers = options.headers || {};
  }
  
  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
};

global.Headers = class Headers {
  constructor(init) {
    this.headers = init || {};
  }
};

// Mock D1 database for tests
global.D1Database = class MockD1Database {
  constructor() {
    this.data = new Map();
  }
  
  prepare(query) {
    return {
      bind: function(...values) { return this; },
      first: function() { return null; },
      all: function() { return { results: [] }; },
      run: function() { return { meta: { changes: 0 } }; },
    };
  }
  
  exec(query) {
    return { results: [] };
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(function(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  }),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});