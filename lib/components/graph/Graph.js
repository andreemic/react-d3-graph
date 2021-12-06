"use strict";

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

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _d3Drag = require("d3-drag");

var _d3Force = require("d3-force");

var _d3Selection = require("d3-selection");

var _d3Zoom = require("d3-zoom");

var _graph = _interopRequireDefault(require("./graph.const"));

var _graph2 = _interopRequireDefault(require("./graph.config"));

var _err = _interopRequireDefault(require("../../err"));

var _collapse = require("./collapse.helper");

var _graph3 = require("./graph.helper");

var _graph4 = require("./graph.renderer");

var _utils = require("../../utils");

var _ = require("../..");

var _graph5 = require("./graph.builder");

var _link = require("../link/link.helper");

var _link2 = require("../link/link.const");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = (typeof Symbol !== "undefined" && o[Symbol.iterator]) || o["@@iterator"];
  if (!it) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F,
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    },
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
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
 * Graph component is the main component for react-d3-graph components, its interface allows its user
 * to build the graph once the user provides the data, configuration (optional) and callback interactions (also optional).
 * The code for the [live example](https://danielcaldas.github.io/react-d3-graph/sandbox/index.html)
 * can be consulted [here](https://github.com/danielcaldas/react-d3-graph/blob/master/sandbox/Sandbox.jsx)
 * @example
 * import { Graph } from 'react-d3-graph';
 *
 * // graph payload (with minimalist structure)
 * const data = {
 *     nodes: [
 *       {id: 'Harry'},
 *       {id: 'Sally'},
 *       {id: 'Alice'}
 *     ],
 *     links: [
 *         {source: 'Harry', target: 'Sally'},
 *         {source: 'Harry', target: 'Alice'},
 *     ]
 * };
 *
 * // the graph configuration, you only need to pass down properties
 * // that you want to override, otherwise default ones will be used
 * const myConfig = {
 *     nodeHighlightBehavior: true,
 *     node: {
 *         color: 'lightgreen',
 *         size: 120,
 *         highlightStrokeColor: 'blue'
 *     },
 *     link: {
 *         highlightColor: 'lightblue'
 *     }
 * };
 *
 * // Callback to handle click on the graph.
 * // @param {Object} event click dom event
 * const onClickGraph = function(event) {
 *      window.alert('Clicked the graph background');
 * };
 *
 * const onClickNode = function(nodeId, node) {
 *      window.alert('Clicked node ${nodeId} in position (${node.x}, ${node.y})');
 * };
 *
 * const onDoubleClickNode = function(nodeId, node) {
 *      window.alert('Double clicked node ${nodeId} in position (${node.x}, ${node.y})');
 * };
 *
 * const onRightClickNode = function(event, nodeId, node) {
 *      window.alert('Right clicked node ${nodeId} in position (${node.x}, ${node.y})');
 * };
 *
 * const onMouseOverNode = function(nodeId, node) {
 *      window.alert(`Mouse over node ${nodeId} in position (${node.x}, ${node.y})`);
 * };
 *
 * const onMouseOutNode = function(nodeId, node) {
 *      window.alert(`Mouse out node ${nodeId} in position (${node.x}, ${node.y})`);
 * };
 *
 * const onClickLink = function(source, target) {
 *      window.alert(`Clicked link between ${source} and ${target}`);
 * };
 *
 * const onRightClickLink = function(event, source, target) {
 *      window.alert('Right clicked link between ${source} and ${target}');
 * };
 *
 * const onMouseOverLink = function(source, target) {
 *      window.alert(`Mouse over in link between ${source} and ${target}`);
 * };
 *
 * const onMouseOutLink = function(source, target) {
 *      window.alert(`Mouse out link between ${source} and ${target}`);
 * };
 *
 * const onNodePositionChange = function(nodeId, x, y) {
 *      window.alert(`Node ${nodeId} moved to new position x= ${x} y= ${y}`);
 * };
 *
 * // Callback that's called whenever the graph is zoomed in/out
 * // @param {number} previousZoom the previous graph zoom
 * // @param {number} newZoom the new graph zoom
 * const onZoomChange = function(previousZoom, newZoom) {
 *      window.alert(`Graph is now zoomed at ${newZoom} from ${previousZoom}`);
 * };
 *
 *
 * <Graph
 *      id='graph-id' // id is mandatory, if no id is defined rd3g will throw an error
 *      data={data}
 *      config={myConfig}
 *      onClickGraph={onClickGraph}
 *      onClickNode={onClickNode}
 *      onDoubleClickNode={onDoubleClickNode}
 *      onRightClickNode={onRightClickNode}
 *      onClickLink={onClickLink}
 *      onRightClickLink={onRightClickLink}
 *      onMouseOverNode={onMouseOverNode}
 *      onMouseOutNode={onMouseOutNode}
 *      onMouseOverLink={onMouseOverLink}
 *      onMouseOutLink={onMouseOutLink}
 *      onNodePositionChange={onNodePositionChange}
 *      onZoomChange={onZoomChange}/>
 */
var Graph = /*#__PURE__*/ (function(_React$Component) {
  _inherits(Graph, _React$Component);

  var _super = _createSuper(Graph);

  function Graph(props) {
    var _this;

    _classCallCheck(this, Graph);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "_generateFocusAnimationProps", function() {
      // In case an older animation was still not complete, clear previous timeout to ensure the new one is not cancelled
      if (_this.state.enableFocusAnimation) {
        if (_this.focusAnimationTimeout) {
          clearTimeout(_this.focusAnimationTimeout);
        }

        _this.focusAnimationTimeout = setTimeout(function() {
          return _this.setState({
            enableFocusAnimation: false,
          });
        }, _this.state.config.focusAnimationDuration * 1000);
      }

      var transitionDuration = _this.state.enableFocusAnimation ? _this.state.config.focusAnimationDuration : 0;
      return {
        style: {
          transitionDuration: "".concat(transitionDuration, "s"),
        },
        transform: _this.state.focusTransformation,
      };
    });

    _defineProperty(_assertThisInitialized(_this), "_onDragEnd", function() {
      _this.isDraggingNode = false;
      _this.isConnectingNodes = false;

      if (_this.state.draggedNode) {
        if (_this.state.draggingEdge && _this.state.hoveringOverNodeId) {
          _this.props.onNodesConnected(_this.state.draggedNode.id, _this.state.hoveringOverNodeId);

          _this._tick({
            draggedNode: null,
            draggingEdge: null,
          });
        } else {
          _this.onNodePositionChange(_this.state.draggedNode);

          _this._tick({
            draggedNode: null,
          });
        }
      }

      !_this.state.config.staticGraph &&
        _this.state.config.automaticRearrangeAfterDropNode &&
        _this.state.simulation.alphaTarget(_this.state.config.d3.alphaTarget).restart();
    });

    _defineProperty(_assertThisInitialized(_this), "_onDragMove", function(ev, index, nodeList) {
      var id = nodeList[index].id;
      var draggedNode = _this.state.nodes[id];

      if (!_this.state.config.staticGraph) {
        // this is where d3 and react bind
        draggedNode.oldX = draggedNode.x;
        draggedNode.oldY = draggedNode.y;
        var newX = draggedNode.x + _d3Selection.event.dx;
        var newY = draggedNode.y + _d3Selection.event.dy;
        var shouldUpdateNode =
          !_this.state.config.bounded ||
          (0, _graph3.isPositionInBounds)(
            {
              x: newX,
              y: newY,
            },
            _this.state
          );

        if (shouldUpdateNode) {
          if (_this.isDraggingNode) {
            draggedNode.x = newX;
            draggedNode.y = newY; // set nodes fixing coords fx and fy

            draggedNode["fx"] = draggedNode.x;
            draggedNode["fy"] = draggedNode.y;

            _this._tick({
              draggedNode: draggedNode,
            });
          } else if (_this.isConnectingNodes) {
            _this._tick({
              draggingEdge: {
                from: {
                  x: draggedNode.x,
                  y: draggedNode.y,
                },
                to: {
                  x: _d3Selection.event.x,
                  y: _d3Selection.event.y,
                },
              },
              draggedNode: draggedNode,
            });
          }
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onDragStart", function(e) {
      if (_this.ctrlPressed) {
        _this.isConnectingNodes = true;
      } else {
        _this.isDraggingNode = true;
      }

      _this.pauseSimulation();

      if (_this.state.enableFocusAnimation) {
        _this.setState({
          enableFocusAnimation: false,
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_setNodeHighlightedValue", function(id) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return _this._tick(
        (0, _graph3.updateNodeHighlightedValue)(_this.state.nodes, _this.state.links, _this.state.config, id, value)
      );
    });

    _defineProperty(_assertThisInitialized(_this), "_tick", function() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var cb = arguments.length > 1 ? arguments[1] : undefined;
      return cb ? _this.setState(state, cb) : _this.setState(state);
    });

    _defineProperty(_assertThisInitialized(_this), "_zoomConfig", function() {
      var selector = (0, _d3Selection.select)(
        "#".concat(_this.state.id, "-").concat(_graph["default"].GRAPH_WRAPPER_ID)
      );
      var zoomObject = (0, _d3Zoom.zoom)().scaleExtent([_this.state.config.minZoom, _this.state.config.maxZoom]);

      if (!_this.state.config.freezeAllDragEvents) {
        zoomObject.on("zoom", _this._zoomed);
      }

      if (_this.state.config.initialZoom !== null) {
        zoomObject.scaleTo(selector, _this.state.config.initialZoom);
      } // avoid double click on graph to trigger zoom
      // for more details consult: https://github.com/danielcaldas/react-d3-graph/pull/202

      selector.call(zoomObject).on("dblclick.zoom", null);
    });

    _defineProperty(_assertThisInitialized(_this), "_zoomed", function() {
      var transform = _d3Selection.event.transform;
      (0, _d3Selection.selectAll)("#".concat(_this.state.id, "-").concat(_graph["default"].GRAPH_CONTAINER_ID)).attr(
        "transform",
        transform
      );

      _this.setState({
        transform: transform,
      }); // only send zoom change events if the zoom has changed (_zoomed() also gets called when panning)

      if (_this.debouncedOnZoomChange && _this.state.previousZoom !== transform.k && !_this.state.config.panAndZoom) {
        _this.debouncedOnZoomChange(_this.state.previousZoom, transform.k);

        _this.setState({
          previousZoom: transform.k,
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onClickGraph", function(e) {
      var _e$target, _e$target$attributes, _e$target$attributes$;

      if (_this.state.enableFocusAnimation) {
        _this.setState({
          enableFocusAnimation: false,
        });
      } // Only trigger the graph onClickHandler, if not clicked a node or link.
      // toUpperCase() is added as a precaution, as the documentation says tagName should always
      // return in UPPERCASE, but chrome returns lowercase

      var tagName = e.target && e.target.tagName;
      var name =
        e === null || e === void 0
          ? void 0
          : (_e$target = e.target) === null || _e$target === void 0
          ? void 0
          : (_e$target$attributes = _e$target.attributes) === null || _e$target$attributes === void 0
          ? void 0
          : (_e$target$attributes$ = _e$target$attributes.name) === null || _e$target$attributes$ === void 0
          ? void 0
          : _e$target$attributes$.value;
      var svgContainerName = "svg-container-".concat(_this.state.id);

      if (tagName.toUpperCase() === "SVG" && name === svgContainerName) {
        _this.props.onClickGraph && _this.props.onClickGraph(e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onClickNode", function(clickedNodeId, e) {
      var clickedNode = _this.state.nodes[clickedNodeId];

      if (!_this.nodeClickTimer) {
        // Note: onDoubleClickNode is not defined we don't need a long wait
        // to understand weather a second click will arrive soon or not
        // we can immediately trigger the click timer because we're 100%
        // that the double click even is never intended
        var ttl = _this.props.onDoubleClickNode ? _graph["default"].TTL_DOUBLE_CLICK_IN_MS : 0;
        _this.nodeClickTimer = setTimeout(function() {
          if (_this.state.config.collapsible) {
            var leafConnections = (0, _collapse.getTargetLeafConnections)(
              clickedNodeId,
              _this.state.links,
              _this.state.config
            );
            var links = (0, _collapse.toggleLinksMatrixConnections)(
              _this.state.links,
              leafConnections,
              _this.state.config
            );
            var d3Links = (0, _collapse.toggleLinksConnections)(_this.state.d3Links, links);
            var firstLeaf = leafConnections === null || leafConnections === void 0 ? void 0 : leafConnections["0"];
            var isExpanding = false;

            if (firstLeaf) {
              var visibility = links[firstLeaf.source][firstLeaf.target];
              isExpanding = visibility === 1;
            }

            _this._tick(
              {
                links: links,
                d3Links: d3Links,
              },
              function() {
                _this.props.onClickNode && _this.props.onClickNode(clickedNodeId, clickedNode, e);

                if (isExpanding) {
                  _this._graphNodeDragConfig();
                }
              }
            );
          } else {
            _this.props.onClickNode && _this.props.onClickNode(clickedNodeId, clickedNode, e);
          }

          _this.nodeClickTimer = null;
        }, ttl);
      } else {
        _this.props.onDoubleClickNode && _this.props.onDoubleClickNode(clickedNodeId, clickedNode, e);
        _this.nodeClickTimer = clearTimeout(_this.nodeClickTimer);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onRightClickNode", function(event, id) {
      var clickedNode = _this.state.nodes[id];
      _this.props.onRightClickNode && _this.props.onRightClickNode(event, id, clickedNode);
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseOverNode", function(id) {
      if (_this.isDraggingNode || _this.isConnectingNodes) {
        _this.setState(
          _objectSpread(
            _objectSpread({}, _this.state),
            {},
            {
              hoveringOverNodeId: id,
            }
          )
        );

        return;
      }

      var clickedNode = _this.state.nodes[id];
      _this.props.onMouseOverNode && _this.props.onMouseOverNode(id, clickedNode);
      _this.state.config.nodeHighlightBehavior && _this._setNodeHighlightedValue(id, true);
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseOutNode", function(id) {
      if (_this.isDraggingNode) {
        return;
      }

      var clickedNode = _this.state.nodes[id];
      _this.props.onMouseOutNode && _this.props.onMouseOutNode(id, clickedNode);
      _this.state.config.nodeHighlightBehavior && _this._setNodeHighlightedValue(id, false);
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseOverLink", function(source, target) {
      _this.props.onMouseOverLink && _this.props.onMouseOverLink(source, target);

      if (_this.state.config.linkHighlightBehavior) {
        var highlightedLink = {
          source: source,
          target: target,
        };

        _this._tick({
          highlightedLink: highlightedLink,
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseOutLink", function(source, target) {
      _this.props.onMouseOutLink && _this.props.onMouseOutLink(source, target);

      if (_this.state.config.linkHighlightBehavior) {
        var highlightedLink = undefined;

        _this._tick({
          highlightedLink: highlightedLink,
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onNodePositionChange", function(node) {
      if (!_this.props.onNodePositionChange) {
        return;
      }

      var id = node.id,
        x = node.x,
        y = node.y;

      _this.props.onNodePositionChange(id, x, y);
    });

    _defineProperty(_assertThisInitialized(_this), "pauseSimulation", function() {
      return _this.state.simulation.stop();
    });

    _defineProperty(_assertThisInitialized(_this), "resetNodesPositions", function() {
      if (!_this.state.config.staticGraph) {
        var initialNodesState = (0, _graph3.initializeNodes)(_this.props.data.nodes);

        for (var nodeId in _this.state.nodes) {
          var node = _this.state.nodes[nodeId];

          if (node.fx && node.fy) {
            Reflect.deleteProperty(node, "fx");
            Reflect.deleteProperty(node, "fy");
          }

          if (nodeId in initialNodesState) {
            var initialNode = initialNodesState[nodeId];
            node.x = initialNode.x;
            node.y = initialNode.y;
          }
        }

        _this.state.simulation.alphaTarget(_this.state.config.d3.alphaTarget).restart();

        _this._tick();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "restartSimulation", function() {
      return !_this.state.config.staticGraph && _this.state.simulation.restart();
    });

    if (!_this.props.id) {
      (0, _utils.throwErr)(_this.constructor.name, _err["default"].GRAPH_NO_ID_PROP);
    }

    _this.focusAnimationTimeout = null;
    _this.nodeClickTimer = null;
    _this.isDraggingNode = false;
    _this.state = (0, _graph3.initializeGraphState)(_this.props, _this.state);
    _this.debouncedOnZoomChange = _this.props.onZoomChange ? (0, _utils.debounce)(_this.props.onZoomChange, 100) : null;
    return _this;
  }
  /**
   * @deprecated
   * `componentWillReceiveProps` has a replacement method in react v16.3 onwards.
   * that is getDerivedStateFromProps.
   * But one needs to be aware that if an anti pattern of `componentWillReceiveProps` is
   * in place for this implementation the migration might not be that easy.
   * See {@link https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html}.
   * @param {Object} nextProps - props.
   * @returns {undefined}
   */
  // eslint-disable-next-line

  _createClass(Graph, [
    {
      key: "_graphLinkForceConfig",
      value:
        /**
         * Obtain a set of properties which will be used to perform the focus and zoom animation if
         * required. In case there's not a focus and zoom animation in progress, it should reset the
         * transition duration to zero and clear transformation styles.
         * @returns {Object} - Focus and zoom animation properties.
         */

        /**
         * This method runs {@link d3-force|https://github.com/d3/d3-force}
         * against the current graph.
         * @returns {undefined}
         */
        function _graphLinkForceConfig() {
          var forceLink = (0, _d3Force.forceLink)(this.state.d3Links)
            .id(function(l) {
              return l.id;
            })
            .distance(this.state.config.d3.linkLength)
            .strength(this.state.config.d3.linkStrength);
          this.state.simulation.force(_graph["default"].LINK_CLASS_NAME, forceLink);
        },
      /**
       * This method runs {@link d3-drag|https://github.com/d3/d3-drag}
       * against the current graph.
       * @param {Object} e
       * @returns {undefined}
       */
    },
    {
      key: "_graphNodeDragConfig",
      value: function _graphNodeDragConfig(e) {
        var customNodeDrag = (0, _d3Drag.drag)()
          .on("start", this._onDragStart)
          .on("drag", this._onDragMove)
          .on("end", this._onDragEnd);
        (0, _d3Selection.select)("#".concat(this.state.id, "-").concat(_graph["default"].GRAPH_WRAPPER_ID))
          .selectAll(".node")
          .call(customNodeDrag);
      },
      /**
       * Sets d3 tick function and configures other d3 stuff such as forces and drag events.
       * Whenever called binds Graph component state with d3.
       * @returns {undefined}
       */
    },
    {
      key: "_graphBindD3ToReactComponent",
      value: function _graphBindD3ToReactComponent() {
        var _this2 = this;

        if (!this.state.config.d3.disableLinkForce) {
          this.state.simulation.nodes(this.state.d3Nodes).on("tick", function() {
            // Propagate d3Nodes changes to nodes
            var newNodes = {};

            var _iterator = _createForOfIteratorHelper(_this2.state.d3Nodes),
              _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                var node = _step.value;
                newNodes[node.id] = node;
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            _this2._tick({
              d3Nodes: _this2.state.d3Nodes,
              nodes: newNodes,
            });
          });

          this._graphLinkForceConfig();
        }

        if (!this.state.config.freezeAllDragEvents) {
          this._graphNodeDragConfig();
        }
      },
      /**
       * Handles d3 drag 'end' event.
       * @returns {undefined}
       */
    },
    {
      key: "UNSAFE_componentWillReceiveProps",
      value: function UNSAFE_componentWillReceiveProps(nextProps) {
        var _checkForGraphElement = (0, _graph3.checkForGraphElementsChanges)(nextProps, this.state),
          graphElementsUpdated = _checkForGraphElement.graphElementsUpdated,
          newGraphElements = _checkForGraphElement.newGraphElements;

        var state = graphElementsUpdated ? (0, _graph3.initializeGraphState)(nextProps, this.state) : this.state;
        var newConfig = nextProps.config || {};

        var _checkForGraphConfigC = (0, _graph3.checkForGraphConfigChanges)(nextProps, this.state),
          configUpdated = _checkForGraphConfigC.configUpdated,
          d3ConfigUpdated = _checkForGraphConfigC.d3ConfigUpdated;

        var config = configUpdated ? (0, _utils.merge)(_graph2["default"], newConfig) : this.state.config; // in order to properly update graph data we need to pause eventual d3 ongoing animations

        newGraphElements && this.pauseSimulation();
        var transform =
          newConfig.panAndZoom !== this.state.config.panAndZoom
            ? {
                x: 0,
                y: 0,
                k: 1,
              }
            : this.state.transform;
        var focusedNodeId = nextProps.data.focusedNodeId;
        var d3FocusedNode = this.state.d3Nodes.find(function(node) {
          return "".concat(node.id) === "".concat(focusedNodeId);
        });
        var containerElId = "".concat(this.state.id, "-").concat(_graph["default"].GRAPH_WRAPPER_ID);
        var focusTransformation =
          (0, _graph3.getCenterAndZoomTransformation)(d3FocusedNode, this.state.config, containerElId) ||
          this.state.focusTransformation;
        var enableFocusAnimation = this.props.data.focusedNodeId !== nextProps.data.focusedNodeId; // if we're given a function to call when the zoom changes, we create a debounced version of it
        // this is because this function gets called in very rapid succession when zooming

        if (nextProps.onZoomChange) {
          this.debouncedOnZoomChange = (0, _utils.debounce)(nextProps.onZoomChange, 100);
        }

        this.setState(
          _objectSpread(
            _objectSpread({}, state),
            {},
            {
              config: config,
              configUpdated: configUpdated,
              d3ConfigUpdated: d3ConfigUpdated,
              newGraphElements: newGraphElements,
              transform: transform,
              focusedNodeId: focusedNodeId,
              enableFocusAnimation: enableFocusAnimation,
              focusTransformation: focusTransformation,
            }
          )
        );
      },
    },
    {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        // if the property staticGraph was activated we want to stop possible ongoing simulation
        var shouldPause = this.state.config.staticGraph || this.state.config.staticGraphWithDragAndDrop;

        if (shouldPause) {
          this.pauseSimulation();
        }

        if (!this.state.config.staticGraph && (this.state.newGraphElements || this.state.d3ConfigUpdated)) {
          this._graphBindD3ToReactComponent();

          if (!this.state.config.staticGraphWithDragAndDrop) {
            this.restartSimulation();
          }

          this.setState({
            newGraphElements: false,
            d3ConfigUpdated: false,
          });
        } else if (this.state.configUpdated) {
          this._graphNodeDragConfig();
        }

        if (this.state.configUpdated) {
          this._zoomConfig();

          this.setState({
            configUpdated: false,
          });
        }
      },
    },
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this3 = this;

        if (!this.state.config.staticGraph) {
          this._graphBindD3ToReactComponent();
        } // graph zoom and drag&drop all network

        this._zoomConfig();

        this.ctrlPressed = false;
        document.addEventListener("keydown", this.handleKeyDown.bind(this), false);
        document.addEventListener("keyup", this.handleKeyUp.bind(this), false);
        return function() {
          document.removeEventListener("keydown", _this3.handleKeyDown, false);
          document.addEventListener("keyup", _this3.handleKeyUp, false);
        };
      },
    },
    {
      key: "handleKeyDown",
      value: function handleKeyDown(e) {
        this.ctrlPressed = this.ctrlPressed || e.key === "Meta";
      },
    },
    {
      key: "handleKeyUp",
      value: function handleKeyUp(e) {
        this.ctrlPressed = this.ctrlPressed && e.key !== "Meta";
      },
    },
    {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.pauseSimulation();

        if (this.nodeClickTimer) {
          clearTimeout(this.nodeClickTimer);
          this.nodeClickTimer = null;
        }

        if (this.focusAnimationTimeout) {
          clearTimeout(this.focusAnimationTimeout);
          this.focusAnimationTimeout = null;
        }
      },
    },
    {
      key: "render",
      value: function render() {
        var _renderGraph = (0, _graph4.renderGraph)(
            this.state.nodes,
            {
              onClickNode: this.onClickNode,
              onDoubleClickNode: this.onDoubleClickNode,
              onRightClickNode: this.onRightClickNode,
              onMouseOverNode: this.onMouseOverNode,
              onMouseOut: this.onMouseOutNode,
            },
            this.state.d3Links,
            this.state.links,
            {
              onClickLink: this.props.onClickLink,
              onRightClickLink: this.props.onRightClickLink,
              onMouseOverLink: this.onMouseOverLink,
              onMouseOutLink: this.onMouseOutLink,
            },
            this.state.config,
            this.state.highlightedNode,
            this.state.highlightedLink,
            this.state.transform.k
          ),
          nodes = _renderGraph.nodes,
          links = _renderGraph.links,
          defs = _renderGraph.defs;

        var svgStyle = {
          height: this.state.config.height,
          width: this.state.config.width,
        };

        var containerProps = this._generateFocusAnimationProps();

        var sourceCoords, targetCoords;

        if (this.state.draggingEdge) {
          var r = (0, _graph3.getNormalizedNodeCoordinates)(
            {
              sourceId: "s",
              targetId: "t",
              sourceCoords: this.state.draggingEdge.from,
              targetCoords: this.state.draggingEdge.to,
            },
            {
              s: {},
              t: {},
            },
            this.state.config,
            1.25
          );
          sourceCoords = r.sourceCoords;
          targetCoords = r.targetCoords;
        }

        return /*#__PURE__*/ _react["default"].createElement(
          "div",
          {
            id: "".concat(this.state.id, "-").concat(_graph["default"].GRAPH_WRAPPER_ID),
          },
          /*#__PURE__*/ _react["default"].createElement(
            "svg",
            {
              name: "svg-container-".concat(this.state.id),
              style: svgStyle,
              onClick: this.onClickGraph,
            },
            defs,
            /*#__PURE__*/ _react["default"].createElement(
              "g",
              _extends(
                {
                  id: "".concat(this.state.id, "-").concat(_graph["default"].GRAPH_CONTAINER_ID),
                },
                containerProps
              ),
              links,
              nodes,
              this.state.draggingEdge &&
                /*#__PURE__*/ _react["default"].createElement(_.Link, {
                  d: (0, _link.buildLinkPathDefinition)(
                    sourceCoords,
                    targetCoords,
                    _link2.LINE_TYPES.STRAIGHT,
                    [],
                    "s",
                    "t",
                    _link2.SELF_LINK_DIRECTION.TOP_RIGHT
                  ),
                  source: "s",
                  target: "t",
                  markerId: "marker-small",
                  strokeWidth: 1.5,
                  stroke: "green",
                  className: "link",
                  opacity: 1,
                  mouseCursor: "pointer",
                })
            )
          )
        );
      },
    },
  ]);

  return Graph;
})(_react["default"].Component);

exports["default"] = Graph;
