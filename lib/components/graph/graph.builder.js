"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.buildLinkProps = buildLinkProps;
exports.buildNodeProps = buildNodeProps;

var _graph = _interopRequireDefault(require("./graph.const"));

var _utils = require("../../utils");

var _link = require("../link/link.helper");

var _marker = require("../marker/marker.helper");

var _graph2 = require("./graph.helper");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

/**
 * Get the correct node opacity in order to properly make decisions based on context such as currently highlighted node.
 * @param  {Object} node - the node object for whom we will generate properties.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @returns {number} the opacity value for the given node.
 * @memberof Graph/builder
 */
function _getNodeOpacity(node, highlightedNode, highlightedLink, config) {
  var highlight =
    node.highlighted ||
    node.id === (highlightedLink && highlightedLink.source) ||
    node.id === (highlightedLink && highlightedLink.target);
  var someLinkHighlighted = highlightedLink && highlightedLink.source && highlightedLink.target;
  var someNodeHighlighted = !!(highlightedNode || someLinkHighlighted);
  var opacity;

  if (someNodeHighlighted && config.highlightDegree === 0) {
    opacity = highlight ? config.node.opacity : config.highlightOpacity;
  } else if (someNodeHighlighted) {
    opacity = highlight ? config.node.opacity : config.highlightOpacity;
  } else {
    opacity = node.opacity || config.node.opacity;
  }

  return opacity;
}
/**
 * Build some Link properties based on given parameters.
 * @param  {Object} link - the link object for which we will generate properties.
 * @param  {Object.<string, Object>} nodes - same as {@link #graphrenderer|nodes in renderGraph}.
 * @param  {Object.<string, Object>} links - same as {@link #graphrenderer|links in renderGraph}.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param  {Function[]} linkCallbacks - same as {@link #graphrenderer|linkCallbacks in renderGraph}.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns an object that aggregates all props for creating respective Link component instance.
 * @memberof Graph/builder
 */

function buildLinkProps(link, nodes, links, config, linkCallbacks, highlightedNode, highlightedLink, transform) {
  var _nodes$source, _nodes$source2, _nodes$target, _nodes$target2;

  var source = link.source,
    target = link.target;
  var x1 =
    (nodes === null || nodes === void 0
      ? void 0
      : (_nodes$source = nodes[source]) === null || _nodes$source === void 0
      ? void 0
      : _nodes$source.x) || 0;
  var y1 =
    (nodes === null || nodes === void 0
      ? void 0
      : (_nodes$source2 = nodes[source]) === null || _nodes$source2 === void 0
      ? void 0
      : _nodes$source2.y) || 0;
  var x2 =
    (nodes === null || nodes === void 0
      ? void 0
      : (_nodes$target = nodes[target]) === null || _nodes$target === void 0
      ? void 0
      : _nodes$target.x) || 0;
  var y2 =
    (nodes === null || nodes === void 0
      ? void 0
      : (_nodes$target2 = nodes[target]) === null || _nodes$target2 === void 0
      ? void 0
      : _nodes$target2.y) || 0;
  var type = link.type || config.link.type;
  var selfLinkDirection = link.selfLinkDirection || config.link.selfLinkDirection;
  var mainNodeParticipates = false;

  switch (config.highlightDegree) {
    case 0:
      break;

    case 2:
      mainNodeParticipates = true;
      break;

    default:
      // 1st degree is the fallback behavior
      mainNodeParticipates = source === highlightedNode || target === highlightedNode;
      break;
  }

  var guiltyNode = mainNodeParticipates && nodes[source].highlighted && nodes[target].highlighted;
  var guiltyLink =
    source === (highlightedLink && highlightedLink.source) && target === (highlightedLink && highlightedLink.target);
  var highlight = guiltyNode || guiltyLink;
  var opacity = link.opacity || config.link.opacity;

  if (highlightedNode || (highlightedLink && highlightedLink.source)) {
    opacity = highlight ? config.link.opacity : config.highlightOpacity;
  }

  var stroke = link.color || config.link.color;

  if (highlight) {
    stroke =
      config.link.highlightColor === _graph["default"].KEYWORDS.SAME ? config.link.color : config.link.highlightColor;
  }

  var strokeDasharray = link.strokeDasharray || config.link.strokeDasharray;
  var strokeDashoffset = link.strokeDashoffset || config.link.strokeDashoffset;
  var strokeLinecap = link.strokeLinecap || config.link.strokeLinecap;
  var strokeWidth = (link.strokeWidth || config.link.strokeWidth) * (1 / transform);

  if (config.link.semanticStrokeWidth) {
    var linkValue = links[source][target] || links[target][source] || 1;
    strokeWidth += (linkValue * strokeWidth) / 10;
  }

  var markerId = config.directed ? (0, _marker.getMarkerId)(highlight, transform, config) : null;
  var t = 1 / transform;
  var fontSize = null,
    fontColor = null,
    fontWeight = null,
    label = null;

  if (config.link.renderLabel) {
    if (typeof config.link.labelProperty === "function") {
      label = config.link.labelProperty(link);
    } else {
      label = link[config.link.labelProperty];
    }

    fontSize = link.fontSize || config.link.fontSize;
    fontColor = link.fontColor || config.link.fontColor;
    fontWeight = highlight ? config.link.highlightFontWeight : config.link.fontWeight;
  }

  var _getNormalizedNodeCoo = (0, _graph2.getNormalizedNodeCoordinates)(
      {
        sourceId: source,
        targetId: target,
        sourceCoords: {
          x: x1,
          y: y1,
        },
        targetCoords: {
          x: x2,
          y: y2,
        },
      },
      nodes,
      config,
      strokeWidth
    ),
    sourceCoords = _getNormalizedNodeCoo.sourceCoords,
    targetCoords = _getNormalizedNodeCoo.targetCoords;

  var d = (0, _link.buildLinkPathDefinition)(
    sourceCoords,
    targetCoords,
    type,
    link.breakPoints,
    link.source,
    link.target,
    selfLinkDirection
  );
  return {
    className: _graph["default"].LINK_CLASS_NAME,
    d: d,
    fontColor: fontColor,
    fontSize: fontSize * t,
    fontWeight: fontWeight,
    label: label,
    markerId: markerId,
    mouseCursor: config.link.mouseCursor,
    opacity: opacity,
    source: source,
    stroke: stroke,
    strokeWidth: strokeWidth,
    strokeDasharray: strokeDasharray,
    strokeDashoffset: strokeDashoffset,
    strokeLinecap: strokeLinecap,
    target: target,
    onClickLink: linkCallbacks.onClickLink,
    onMouseOutLink: linkCallbacks.onMouseOutLink,
    onMouseOverLink: linkCallbacks.onMouseOverLink,
    onRightClickLink: linkCallbacks.onRightClickLink,
  };
}
/**
 * Build some Node properties based on given parameters.
 * @param  {Object} node - the node object for whom we will generate properties.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param  {Function[]} nodeCallbacks - same as {@link #graphrenderer|nodeCallbacks in renderGraph}.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns object that contain Link props ready to be feeded to the Link component.
 * @memberof Graph/builder
 */

function buildNodeProps(node, config) {
  var nodeCallbacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var highlightedNode = arguments.length > 3 ? arguments[3] : undefined;
  var highlightedLink = arguments.length > 4 ? arguments[4] : undefined;
  var transform = arguments.length > 5 ? arguments[5] : undefined;
  var highlight =
    node.highlighted ||
    node.id === (highlightedLink && highlightedLink.source) ||
    node.id === (highlightedLink && highlightedLink.target);

  var opacity = _getNodeOpacity(node, highlightedNode, highlightedLink, config);

  var fill = node.color || config.node.color;

  if (highlight && config.node.highlightColor !== _graph["default"].KEYWORDS.SAME) {
    fill = config.node.highlightColor;
  }

  var stroke = node.strokeColor || config.node.strokeColor;

  if (highlight && config.node.highlightStrokeColor !== _graph["default"].KEYWORDS.SAME) {
    stroke = config.node.highlightStrokeColor;
  }

  var label = node[config.node.labelProperty] || node.id;

  if (typeof config.node.labelProperty === "function") {
    label = config.node.labelProperty(node);
  }

  var labelPosition = node.labelPosition || config.node.labelPosition;
  var strokeWidth = node.strokeWidth || config.node.strokeWidth;

  if (highlight && config.node.highlightStrokeWidth !== _graph["default"].KEYWORDS.SAME) {
    strokeWidth = config.node.highlightStrokeWidth;
  }

  var t = 1 / transform;
  var nodeSize = node.size || config.node.size;
  var isSizeNumericValue = _typeof(nodeSize) !== "object";
  var offset = 0;

  if (isSizeNumericValue) {
    offset = nodeSize;
  } else if (labelPosition === "top" || labelPosition === "bottom") {
    offset = nodeSize.height;
  } else if (labelPosition === "right" || labelPosition === "left") {
    offset = nodeSize.width;
  }

  var fontSize = node.fontSize || config.node.fontSize;
  var highlightFontSize = node.highlightFontSize || config.node.highlightFontSize;
  var finalFontSize = highlight ? highlightFontSize : fontSize;
  var dx = finalFontSize * t + offset / 100 + 1.5;
  var svg = node.svg || config.node.svg;
  var fontColor = node.fontColor || config.node.fontColor;
  var renderLabel = config.node.renderLabel;

  if (!(0, _utils.isNil)(node.renderLabel) && typeof node.renderLabel === "boolean") {
    renderLabel = node.renderLabel;
  }

  var labelClass = config.node.labelClass;

  if (!(0, _utils.isNil)(node.labelClass) && typeof node.labelClass === "string") {
    labelClass = node.labelClass;
  }

  return _objectSpread(
    _objectSpread({}, node),
    {},
    {
      className: _graph["default"].NODE_CLASS_NAME,
      cursor: config.node.mouseCursor,
      cx: (node === null || node === void 0 ? void 0 : node.x) || "0",
      cy: (node === null || node === void 0 ? void 0 : node.y) || "0",
      dx: dx,
      fill: fill,
      fontColor: fontColor,
      fontSize: finalFontSize * t,
      fontWeight: highlight ? config.node.highlightFontWeight : config.node.fontWeight,
      id: node.id,
      label: label,
      labelPosition: labelPosition,
      opacity: opacity,
      overrideGlobalViewGenerator: !node.viewGenerator && node.svg,
      renderLabel: renderLabel,
      labelClass: labelClass,
      size: isSizeNumericValue
        ? nodeSize * t
        : {
            height: nodeSize.height * t,
            width: nodeSize.width * t,
          },
      stroke: stroke,
      strokeWidth: strokeWidth * t,
      svg: svg,
      type: node.symbolType || config.node.symbolType,
      viewGenerator: node.viewGenerator || config.node.viewGenerator,
      onClickNode: nodeCallbacks.onClickNode,
      onMouseOut: nodeCallbacks.onMouseOut,
      onMouseOverNode: nodeCallbacks.onMouseOverNode,
      onRightClickNode: nodeCallbacks.onRightClickNode,
    }
  );
}
