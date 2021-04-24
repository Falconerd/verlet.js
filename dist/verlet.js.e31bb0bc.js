// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.js":[function(require,module,exports) {
"use strict";

require("./styles.css");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = 720;
var height = 480;
var BOUNCE = 0.9;
var GRAVITY = 0.5;
var FRICTION = 0.99;
var ITERATIONS = 4;
var SLEEP_DISTANCE = 0.3;
var bodies = [];
var time_last_frame = Date.now();
var paused = false;
createBody([{
  x: 50,
  y: 50,
  oldx: 10,
  oldy: 50
}, {
  x: 100,
  y: 50,
  oldx: 100,
  oldy: 50
}, {
  x: 100,
  y: 100,
  oldx: 100,
  oldy: 100
}, {
  x: 50,
  y: 100,
  oldx: 50,
  oldy: 100
}], [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]]);
createBody([{
  x: 100,
  y: 100,
  oldx: 90,
  oldy: 100
}, {
  x: 200,
  y: 100,
  oldx: 200,
  oldy: 100
}, {
  x: 200,
  y: 200,
  oldx: 200,
  oldy: 200
}, {
  x: 100,
  y: 200,
  oldx: 100,
  oldy: 200
}], [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]]); // createBody(
//   [
//     { x: 300, y: 100, oldx: 300, oldy: 100 },
//     { x: 200, y: 100, oldx: 200, oldy: 100 },
//     { x: 200, y: 200, oldx: 200, oldy: 200 },
//     { x: 100, y: 200, oldx: 100, oldy: 200 }
//   ],
//   [
//     [0, 1],
//     [1, 2],
//     [2, 3],
//     [3, 0],
//     [0, 2]
//   ]
// );

ctx.strokeStyle = "#00ff00";
ctx.strokeWidth = 2;
update();
document.addEventListener('click', function (e) {
  console.log(e);
  var x = e.clientX;
  var y = e.clientY;
  var hw = Math.random() * 50;
  var hh = Math.random() * 50;
  var a = {
    x: x - hw,
    y: y - hh
  };
  var b = {
    x: x + hw,
    y: y - hh
  };
  var c = {
    x: x + hw,
    y: y + hh
  };
  var d = {
    x: x - hw,
    y: y + hh
  };
  createBody([_objectSpread(_objectSpread({}, a), {}, {
    oldx: a.x,
    oldy: a.y
  }), _objectSpread(_objectSpread({}, b), {}, {
    oldx: b.x,
    oldy: b.y
  }), _objectSpread(_objectSpread({}, c), {}, {
    oldx: c.x,
    oldy: c.y
  }), _objectSpread(_objectSpread({}, d), {}, {
    oldx: d.x,
    oldy: d.y
  })], [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]]);
});
document.addEventListener('keypress', function (e) {
  if (e.key === ' ') {
    paused = !paused;
  }
});

function update() {
  if (paused) {
    requestAnimationFrame(update);
    return;
  }

  var now = Date.now();
  var dt = now - time_last_frame;
  time_last_frame = now;
  /*
  updatePoints();
  constrainPoints();
  updateSticks();
  sleepCheck(dt);
  updateOrigins();
  updateRotation();
    renderSticks();
  renderPoints();
  renderRotation();
  */

  ctx.clearRect(0, 0, width, height);
  renderDebug(dt);
  requestAnimationFrame(update);
}

function updatePoints() {
  for (var _i = 0, _bodies = bodies; _i < _bodies.length; _i++) {
    var b = _bodies[_i];
    if (b.asleep) continue;
    var points = b.points;

    var _iterator = _createForOfIteratorHelper(points),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var p = _step.value;
        var vx = (p.x - p.oldx) * FRICTION;
        var vy = (p.y - p.oldy) * FRICTION;
        p.oldx = p.x;
        p.oldy = p.y;
        p.x += vx;
        p.y += vy;
        p.y += GRAVITY;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
}

function constrainPoints() {
  for (var _i2 = 0, _bodies2 = bodies; _i2 < _bodies2.length; _i2++) {
    var b = _bodies2[_i2];
    if (b.asleep) continue;
    var points = b.points;

    var _iterator2 = _createForOfIteratorHelper(points),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var p = _step2.value;
        var vx = (p.x - p.oldx) * FRICTION;
        var vy = (p.y - p.oldy) * FRICTION;

        if (p.x > width) {
          p.x = width;
          p.oldx = p.x + vx * BOUNCE;
        } else if (p.x < 0) {
          p.x = 0;
          p.oldx = p.x + vx * BOUNCE;
        }

        if (p.y > height) {
          p.y = height;
          p.oldy = p.y + vy * BOUNCE;
        } else if (p.y < 0) {
          p.y = 0;
          p.oldy = p.y + vy * BOUNCE;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
}

function updateSticks() {
  for (var _i3 = 0, _bodies3 = bodies; _i3 < _bodies3.length; _i3++) {
    var b = _bodies3[_i3];
    if (b.asleep) continue;
    var sticks = b.sticks;

    for (var i = 0; i < ITERATIONS; ++i) {
      var _iterator3 = _createForOfIteratorHelper(sticks),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var s = _step3.value;
          var p0 = s.p0;
          var p1 = s.p1;
          var dx = p1.x - p0.x;
          var dy = p1.y - p0.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var diff = s.length - dist;
          var pct = diff / dist / 2;
          var ox = dx * pct;
          var oy = dy * pct;
          s.p0.x -= ox;
          s.p0.y -= oy;
          s.p1.x += ox;
          s.p1.y += oy;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }
}

function updateOrigins() {
  for (var _i4 = 0, _bodies4 = bodies; _i4 < _bodies4.length; _i4++) {
    var b = _bodies4[_i4];
    if (b.asleep) continue;

    var _calculateOrigin = calculateOrigin(b.points),
        x = _calculateOrigin.x,
        y = _calculateOrigin.y;

    b.oldorigin.x = b.origin.x;
    b.oldorigin.y = b.origin.y;
    b.origin.x = x;
    b.origin.y = y;
  }
}

function updateRotation() {
  for (var _i5 = 0, _bodies5 = bodies; _i5 < _bodies5.length; _i5++) {
    var b = _bodies5[_i5];
    if (b.asleep) continue;
    var cax = b.points[0].x - b.origin.x;
    var cay = b.points[0].y - b.origin.y;
    var theta = Math.atan2(cay, cax);
    b.rotation = theta - b.otheta;
  }
}

function renderPoints() {
  for (var _i6 = 0, _bodies6 = bodies; _i6 < _bodies6.length; _i6++) {
    var b = _bodies6[_i6];
    var points = b.points;
    ctx.strokeStyle = "#0f0";

    if (b.asleep) {
      ctx.strokeStyle = 'yellow';
    }

    var _iterator4 = _createForOfIteratorHelper(points),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var p = _step4.value;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#001c00";
        ctx.fill();
        ctx.stroke();
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    ctx.beginPath();
    ctx.arc(b.origin.x, b.origin.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#f00";
    ctx.fill();
    ctx.stroke();
  }
}

function renderSticks() {
  for (var _i7 = 0, _bodies7 = bodies; _i7 < _bodies7.length; _i7++) {
    var b = _bodies7[_i7];
    var sticks = b.sticks;

    var _iterator5 = _createForOfIteratorHelper(sticks),
        _step5;

    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var s = _step5.value;
        ctx.beginPath();
        ctx.moveTo(s.p0.x, s.p0.y);
        ctx.lineTo(s.p1.x, s.p1.y);
        ctx.strokeStyle = '#00ff00';

        if (b.asleep) {
          ctx.strokeStyle = 'yellow';
        }

        ctx.stroke();
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  }
}

function renderRotation() {
  for (var _i8 = 0, _bodies8 = bodies; _i8 < _bodies8.length; _i8++) {
    var b = _bodies8[_i8];
    var rot = b.rotation;
    var x = b.origin.x + 20 * Math.cos(rot);
    var y = b.origin.y + 20 * Math.sin(rot);
    ctx.strokeStyle = '#00ff00';

    if (b.asleep) {
      ctx.strokeStyle = 'yellow';
    }

    ctx.moveTo(b.origin.x, b.origin.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function renderDebug(dt) {
  ctx.font = '12px monospace';
  ctx.fillStyle = 'white';
  ctx.fillText("dt: ".concat(dt), width - 100, 16);
}

function sleepCheck(dt) {
  for (var _i9 = 0, _bodies9 = bodies; _i9 < _bodies9.length; _i9++) {
    var b = _bodies9[_i9];

    if (distance(b.origin, b.oldorigin) < SLEEP_DISTANCE) {
      b.still_time += dt;

      if (b.still_time > 1000) {
        b.asleep = true;
      }
    }
  }
}

function distance(p0, p1) {
  var dx = p1.x - p0.x,
      dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function createBody(points, edges) {
  var origin = calculateOrigin(points);
  var b = {
    origin: origin,
    oldorigin: _objectSpread({}, origin),
    points: points,
    sticks: [],
    rotation: 0,
    still_time: 0,
    asleep: false
  }; // for every point, create a stick to every other point
  // for (let i = 0; i < points.length; ++i) {}

  var _iterator6 = _createForOfIteratorHelper(edges),
      _step6;

  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var e = _step6.value;
      var p0 = points[e[0]];
      var p1 = points[e[1]];
      b.sticks.push({
        p0: p0,
        p1: p1,
        length: distance(p0, p1)
      });
    } // Move point to origin then calc angle

  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }

  var cax = b.points[0].x - origin.x;
  var cay = b.points[0].y - origin.y; // Original angle to point 0, used to calc rot

  b.otheta = Math.atan2(cay, cax);
  bodies.push(b);
}

function calculateOrigin(points) {
  var sumx = points.reduce(function (acc, val) {
    return acc + val.x;
  }, 0);
  var sumy = points.reduce(function (acc, val) {
    return acc + val.y;
  }, 0);
  var cx = sumx / points.length;
  var cy = sumy / points.length;
  return {
    x: cx,
    y: cy
  };
}
},{"./styles.css":"styles.css"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51246" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/verlet.js.e31bb0bc.js.map