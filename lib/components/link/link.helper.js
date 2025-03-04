"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.buildLinkPathDefinition = buildLinkPathDefinition;

var _link = require("./link.const");

var _RADIUS_STRATEGIES;

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError(
    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if ((typeof Symbol !== "undefined" && iter[Symbol.iterator] != null) || iter["@@iterator"] != null)
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

/**
 * Computes radius value for a straight line.
 * @returns {number} radius for straight line.
 * @memberof Link/helper
 */
function straightLineRadius() {
  return 0;
}
/**
 * Computes radius for a smooth curve effect.
 * @param {number} x1 - x value for point 1
 * @param {number} y1 - y value for point 1
 * @param {number} x2 - y value for point 2
 * @param {number} y2 - y value for point 2
 * @returns{number} value of radius.
 * @memberof Link/helper
 */

function smoothCurveRadius(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
/**
 * Computes radius value for a full curve (semi circumference).
 * @returns {number} radius for full curve.
 * @memberof Link/helper
 */

function fullCurveRadius() {
  return 1;
}

var RADIUS_STRATEGIES =
  ((_RADIUS_STRATEGIES = {}),
  _defineProperty(_RADIUS_STRATEGIES, _link.LINE_TYPES.STRAIGHT, straightLineRadius),
  _defineProperty(_RADIUS_STRATEGIES, _link.LINE_TYPES.CURVE_SMOOTH, smoothCurveRadius),
  _defineProperty(_RADIUS_STRATEGIES, _link.LINE_TYPES.CURVE_FULL, fullCurveRadius),
  _RADIUS_STRATEGIES);
/**
 * Get a strategy to compute line radius.<br/>
 * *CURVE_SMOOTH* type inspired by {@link http://bl.ocks.org/mbostock/1153292|mbostock - Mobile Patent Suits}.
 * @param {string} [type=LINE_TYPES.STRAIGHT] type of curve to get radius strategy from.
 * @returns {Function} a function that calculates a radius
 * to match curve type expectation. Fallback is the straight line.
 * @memberof Link/helper
 */

function getRadiusStrategy(type) {
  return RADIUS_STRATEGIES[type] || RADIUS_STRATEGIES[_link.LINE_TYPES.STRAIGHT];
}
/**
 * This method returns the path definition for a given link base on the line type
 * and the link source and target.
 * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d|d attribute mdn}
 * @param {Object} sourceCoords - link sourceCoords
 * @param {Object} targetCoords - link targetCoords
 * @param {string} type - the link line type
 * @param {Array.<Object>} breakPoints - additional set of points that the link will cross
 * @param {string|number} sourceId - the source node id
 * @param {string|number} targetId - the target node id
 * @param {string} selfLinkDirection - the direction that self links will be rendered in
 * @returns {string} the path definition for the requested link
 * @memberof Link/helper
 */

function buildLinkPathDefinition() {
  var sourceCoords = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var targetCoords = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _link.LINE_TYPES.STRAIGHT;
  var breakPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var sourceId = arguments.length > 4 ? arguments[4] : undefined;
  var targetId = arguments.length > 5 ? arguments[5] : undefined;
  var selfLinkDirection =
    arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _link.SELF_LINK_DIRECTION.TOP_RIGHT;
  var sx = sourceCoords.x,
    sy = sourceCoords.y;
  var tx = targetCoords.x,
    ty = targetCoords.y;

  if (sourceId === targetId && sx === tx && sy === ty) {
    switch (selfLinkDirection) {
      case _link.SELF_LINK_DIRECTION.TOP_LEFT:
        return "M"
          .concat(sx, ",")
          .concat(sy, " A40,30 45 1,1 ")
          .concat(tx + 1, ",")
          .concat(ty - 1);

      case _link.SELF_LINK_DIRECTION.BOTTOM_LEFT:
        return "M"
          .concat(sx, ",")
          .concat(sy, " A40,30 -45 1,1 ")
          .concat(tx - 1, ",")
          .concat(ty - 1);

      case _link.SELF_LINK_DIRECTION.BOTTOM_RIGHT:
        return "M"
          .concat(sx, ",")
          .concat(sy, " A40,30 45 1,1 ")
          .concat(tx - 1, ",")
          .concat(ty + 1);

      default:
        return "M"
          .concat(sx, ",")
          .concat(sy, " A40,30 -45 1,1 ")
          .concat(tx + 1, ",")
          .concat(ty + 1);
    }
  }

  var validType = _link.LINE_TYPES[type] || _link.LINE_TYPES.STRAIGHT;
  var calcRadiusFn = getRadiusStrategy(validType);
  var restOfLinkPoints = [].concat(_toConsumableArray(breakPoints), [targetCoords]);
  var restOfLinkPath = restOfLinkPoints
    .map(function(_ref, i) {
      var x = _ref.x,
        y = _ref.y;

      var _ref2 = i > 0 ? restOfLinkPoints[i - 1] : sourceCoords,
        px = _ref2.x,
        py = _ref2.y;

      var radius = calcRadiusFn(px, py, x, y);
      return " A"
        .concat(radius, ",")
        .concat(radius, " 0 0,1 ")
        .concat(x, ",")
        .concat(y);
    })
    .join("");
  return "M"
    .concat(sx, ",")
    .concat(sy)
    .concat(restOfLinkPath);
}
