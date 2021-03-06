'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _RIEStatefulBase2 = require('./RIEStatefulBase');

var _RIEStatefulBase3 = _interopRequireDefault(_RIEStatefulBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RIETag = function (_React$Component) {
    _inherits(RIETag, _React$Component);

    function RIETag(props) {
        _classCallCheck(this, RIETag);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RIETag).call(this, props));

        _this.remove = function () {
            _this.props.removeHandler(_this.props.text);
        };

        _this.render = function () {
            return _react2.default.createElement(
                'div',
                { key: _this.props.text },
                _this.props.text,
                _react2.default.createElement(
                    'div',
                    { onClick: _this.remove, className: _this.props.className || "remove" },
                    ' × '
                )
            );
        };

        return _this;
    }

    return RIETag;
}(_react2.default.Component);

RIETag.propTypes = {
    text: _react2.default.PropTypes.string.isRequired,
    removeHandler: _react2.default.PropTypes.func,
    className: _react2.default.PropTypes.string
};

var RIETags = function (_RIEStatefulBase) {
    _inherits(RIETags, _RIEStatefulBase);

    function RIETags(props) {
        _classCallCheck(this, RIETags);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(RIETags).call(this, props));

        _this2.addTag = function (tag) {
            if ([].concat(_toConsumableArray(_this2.props.value)).length < (_this2.props.maxTags || 65535)) {
                _this2.commit(_this2.props.value.add(tag));
            }
        };

        _this2.removeTag = function (tag) {

            clearTimeout(_this2.state.blurTimer);

            if ([].concat(_toConsumableArray(_this2.props.value)).length >= (_this2.props.minTags || 1)) {
                var newSet = _this2.props.value;
                newSet.delete(tag);
                _this2.commit(newSet);
            }
        };

        _this2.componentWillReceiveProps = function (nextProps) {
            if ('value' in nextProps) _this2.setState({ loading: false, invalid: false });
        };

        _this2.keyDown = function (event) {
            if (event.keyCode === 8) {
                // Backspace
                if (event.target.value.length == 0) {
                    var tagToRemove = [].concat(_toConsumableArray(_this2.props.value)).pop();
                    _this2.removeTag(tagToRemove);
                }
            } else if (event.keyCode === 13) {
                // Enter
                event.preventDefault();
                if (event.target.value.length === 0) {
                    _this2.cancelEditing();
                } else {
                    _this2.addTag(event.target.value);
                    event.target.value = "";
                }
            } else if (event.keyCode === 27) {
                // Escape
                _this2.cancelEditing();
            }
        };

        _this2.cancelEditingDelayed = function () {
            _this2.setState({ blurTimer: setTimeout(_this2.cancelEditing, _this2.props.blurDelay || 180) });
        };

        _this2.cancelEditing = function () {
            _this2.setState({ editing: false, invalid: false });
        };

        _this2.componentDidUpdate = function (prevProps, prevState) {
            var inputElem = _reactDom2.default.findDOMNode(_this2.refs.input);
            if (_this2.state.editing) {
                inputElem.focus();
            }
        };

        _this2.renderNormalComponent = function () {
            var tags = [].concat(_toConsumableArray(_this2.props.value)).join(_this2.props.separator || ", ");
            return _react2.default.createElement(
                'span',
                {
                    tabIndex: '0',
                    className: _this2.makeClassString(),
                    onFocus: _this2.startEditing },
                tags
            );
        };

        _this2.makeTagElement = function (text) {
            return _react2.default.createElement(RIETag, { key: text, text: text, removeHandler: _this2.removeTag });
        };

        _this2.renderEditingComponent = function () {
            var elements = [].concat(_toConsumableArray(_this2.props.value)).map(_this2.makeTagElement);
            return _react2.default.createElement(
                'div',
                { tabIndex: '1', onClick: _this2.startEditing, className: _this2.makeClassString() },
                elements,
                _react2.default.createElement('input', {
                    onBlur: _this2.cancelEditingDelayed,
                    onKeyDown: _this2.keyDown,
                    placeholder: _this2.props.placeholder || "New tag",
                    ref: 'input' })
            );
        };

        _this2.state.currentText = "";
        _this2.state.blurTimer = null;
        return _this2;
    }

    return RIETags;
}(_RIEStatefulBase3.default);

RIETags.propTyes = {
    value: _react2.default.PropTypes.object.isRequired,
    maxTags: _react2.default.PropTypes.number,
    minTags: _react2.default.PropTypes.number,
    separator: _react2.default.PropTypes.string,
    elementClass: _react2.default.PropTypes.string,
    blurDelay: _react2.default.PropTypes.number,
    placeholder: _react2.default.PropTypes.string
};
exports.default = RIETags;