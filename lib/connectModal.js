"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends =
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

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.default = connectModal;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _hoistNonReactStatics = require("hoist-non-react-statics");

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _actions = require("./actions");

var _utils = require("./utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var INITIAL_MODAL_STATE = {};

function connectModal(_ref) {
  var name = _ref.name,
    resolve = _ref.resolve,
    _ref$destroyOnHide = _ref.destroyOnHide,
    destroyOnHide =
      _ref$destroyOnHide === undefined ? true : _ref$destroyOnHide;

  return function(WrappedComponent) {
    var ConnectModal = (function(_Component) {
      _inherits(ConnectModal, _Component);

      function ConnectModal(props, context) {
        _classCallCheck(this, ConnectModal);

        var _this = _possibleConstructorReturn(
          this,
          (ConnectModal.__proto__ || Object.getPrototypeOf(ConnectModal)).call(
            this,
            props,
            context
          )
        );

        _this.handleHide = function() {
          _this.props.hide(name);
        };

        _this.handleDestroy = function() {
          _this.props.destroy(name);
        };

        var show = props.modal.show;

        _this.state = { show: show };
        return _this;
      }

      _createClass(ConnectModal, [
        {
          key: "componentWillReceiveProps",
          value: function componentWillReceiveProps(nextProps) {
            var _this2 = this;

            var modal = nextProps.modal;
            var store = this.context.store;

            if ((0, _utils.isUndefined)(modal.show)) {
              return this.unmount();
            }

            if (!modal.show) {
              return destroyOnHide ? this.props.destroy(name) : this.hide();
            }

            if (!resolve) {
              this.show();
            }

            if (resolve) {
              var resolveResult = resolve({ store: store, props: modal.props });
              if (!(0, _utils.isPromise)(resolveResult)) {
                return this.show();
              }
              resolveResult.then(function() {
                _this2.show();
              });
            }
          }
        },
        {
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            this.props.destroy(name);
          }
        },
        {
          key: "show",
          value: function show() {
            this.setState({ show: true });
          }
        },
        {
          key: "hide",
          value: function hide() {
            this.setState({ show: false });
          }
        },
        {
          key: "unmount",
          value: function unmount() {
            this.setState({ show: undefined });
          }
        },
        {
          key: "render",
          value: function render() {
            var show = this.state.show;

            var _props = this.props,
              modal = _props.modal,
              hide = _props.hide,
              destroy = _props.destroy,
              ownProps = _objectWithoutProperties(_props, [
                "modal",
                "hide",
                "destroy"
              ]);

            if ((0, _utils.isUndefined)(show)) {
              return null;
            }

            return _react2.default.createElement(
              WrappedComponent,
              _extends({}, ownProps, modal.props, {
                show: show,
                handleHide: this.handleHide,
                handleDestroy: this.handleDestroy
              })
            );
          }
        }
      ]);

      return ConnectModal;
    })(_react.Component);

    ConnectModal.displayName =
      "ConnectModal(" + (0, _utils.getDisplayName)(WrappedComponent) + ")";
    ConnectModal.propTypes = {
      modal: _propTypes2.default.object.isRequired
    };
    ConnectModal.contextTypes = {
      store: _propTypes2.default.object.isRequired
    };

    return (0, _reactRedux.connect)(
      function(state) {
        return {
          modal: state.get("modal")[name] || INITIAL_MODAL_STATE
        };
      },
      function(dispatch) {
        return _extends(
          {},
          (0, _redux.bindActionCreators)(
            { hide: _actions.hide, destroy: _actions.destroy },
            dispatch
          )
        );
      }
    )((0, _hoistNonReactStatics2.default)(ConnectModal, WrappedComponent));
  };
}
