(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = global || self, factory(global.reactHelmetHooks = {}, global.React));
}(this, function (exports, React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var isArray = Array.isArray;
  var keyList = Object.keys;
  var hasProp = Object.prototype.hasOwnProperty;
  var hasElementType = typeof Element !== 'undefined';

  function equal(a, b) {
    // fast-deep-equal index.js 2.0.1
    if (a === b) return true;

    if (a && b && typeof a == 'object' && typeof b == 'object') {
      var arrA = isArray(a)
        , arrB = isArray(b)
        , i
        , length
        , key;

      if (arrA && arrB) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0;)
          if (!equal(a[i], b[i])) return false;
        return true;
      }

      if (arrA != arrB) return false;

      var dateA = a instanceof Date
        , dateB = b instanceof Date;
      if (dateA != dateB) return false;
      if (dateA && dateB) return a.getTime() == b.getTime();

      var regexpA = a instanceof RegExp
        , regexpB = b instanceof RegExp;
      if (regexpA != regexpB) return false;
      if (regexpA && regexpB) return a.toString() == b.toString();

      var keys = keyList(a);
      length = keys.length;

      if (length !== keyList(b).length)
        return false;

      for (i = length; i-- !== 0;)
        if (!hasProp.call(b, keys[i])) return false;
      // end fast-deep-equal

      // start react-fast-compare
      // custom handling for DOM elements
      if (hasElementType && a instanceof Element && b instanceof Element)
        return a === b;

      // custom handling for React
      for (i = length; i-- !== 0;) {
        key = keys[i];
        if (key === '_owner' && a.$$typeof) {
          // React-specific: avoid traversing React elements' _owner.
          //  _owner contains circular references
          // and is not needed when comparing the actual elements (and not their owners)
          // .$$typeof and ._store on just reasonable markers of a react element
          continue;
        } else {
          // all other properties should be traversed as usual
          if (!equal(a[key], b[key])) return false;
        }
      }
      // end react-fast-compare

      // fast-deep-equal index.js 2.0.1
      return true;
    }

    return a !== a && b !== b;
  }
  // end fast-deep-equal

  var reactFastCompare = function exportedEqual(a, b) {
    try {
      return equal(a, b);
    } catch (error) {
      if ((error.message && error.message.match(/stack|recursion/i)) || (error.number === -2146828260)) {
        // warn on circular references, don't crash
        // browsers give this different errors name and messages:
        // chrome/safari: "RangeError", "Maximum call stack size exceeded"
        // firefox: "InternalError", too much recursion"
        // edge: "Error", "Out of stack space"
        console.warn('Warning: react-fast-compare does not handle circular references.', error.name, error.message);
        return false;
      }
      // some other error. we should definitely know about these
      throw error;
    }
  };

  var Context = React__default.createContext({});
  function Provider(props) {
    var setHelmet = function setHelmet(state) {
      if (props.setHelmet) {
        props.setHelmet(state);
        return;
      }

      console.log("Setting helmet state: ", state);
      return;
    };

    var value = React.useRef({
      setHelmet: setHelmet,
      instances: []
    });
    return React__default.createElement(Context.Provider, {
      value: value.current
    }, props.children);
  }

  var Helmet = React__default.memo(function Helmet(props) {
    var children = props.children,
        other = _objectWithoutProperties(props, ["children"]);

    var newProps = other;

    function mapTagChildrenToProps(tag, tagChildren) {
      if (!tagChildren) {
        return null;
      }

      switch (tag.type) {
        case "style":
          {
            return {
              cssText: tagChildren
            };
          }

        case "script":
          {
            return {
              text: tagChildren
            };
          }

        default:
          {
            throw new Error("<".concat(tag.type, "> with children. Not implemented!"));
          }
      }
    }

    function mapTagsToProps(tags, newProps) {
      var collectedTags = {};
      React__default.Children.forEach(tags, function (tag) {
        var _objectSpread3;

        if (!tag || !tag.props) {
          return;
        }

        var _tag$props = tag.props,
            tagChildren = _tag$props.children,
            tagProps = _objectWithoutProperties(_tag$props, ["children"]);

        switch (tag.type) {
          case "meta":
          case "link":
          case "style":
          case "script":
            {
              collectedTags = _objectSpread({}, collectedTags, _defineProperty({}, tag.type, [].concat(_toConsumableArray(collectedTags[tag.type] || []), [_objectSpread({}, tagProps, mapTagChildrenToProps(tag, tagChildren))])));
              break;
            }

          default:
            {
              switch (tag.type) {
                case "html":
                  newProps = _objectSpread({}, newProps, {
                    htmlAttrs: _objectSpread({}, newProps.htmlAttrs, tagProps)
                  });
                  break;

                case "body":
                  newProps = _objectSpread({}, newProps, {
                    bodyAttrs: _objectSpread({}, newProps.bodyAttrs, tagProps)
                  });
                  break;

                case "title":
                  newProps = _objectSpread({}, newProps, (_objectSpread3 = {}, _defineProperty(_objectSpread3, tag.type, tagChildren), _defineProperty(_objectSpread3, "titleAttrs", _objectSpread({}, tagProps)), _objectSpread3));
                  break;

                default:
                  newProps = _objectSpread({}, newProps, _defineProperty({}, tag.type, _objectSpread({}, tagProps)));
                  break;
              }
            }
        }
      }); // merge props with collected multi tags

      var result = _objectSpread({}, newProps);

      var tagNames = Object.keys(collectedTags);

      for (var i = 0; i < tagNames.length; i++) {
        var tagName = tagNames[i];
        result = _objectSpread({}, result, _defineProperty({}, tagName, collectedTags[tagName]));
      }

      return result;
    }

    if (children) {
      newProps = mapTagsToProps(children, newProps);
    } // trigger helmet state sync


    var _useContext = React.useContext(Context),
        instances = _useContext.instances,
        setHelmet = _useContext.setHelmet;

    var instance = React.useRef(newProps);
    instance.current = newProps; // register and unregister a helmet instance

    React.useEffect(function () {
      instances.push(instance);
      return function () {
        var index = instances.indexOf(instance);
        instances.splice(index, 1);
      };
    }, [instances]); // if helmet has changed then collect state from all helmet instances

    React.useEffect(function () {
      var propsList = instances.map(function (instance) {
        return instance.current;
      });
      var state = collectHelmet(propsList);
      setHelmet(state);
    }, [newProps]);
    return null;
  }, function (prevProps, nextProps) {
    return reactFastCompare(prevProps, nextProps);
  });

  function collectHelmet(propsList) {
    return propsList.reduce(function (result, props) {
      return _objectSpread({}, result, props);
    }, {});
  }

  exports.Helmet = Helmet;
  exports.Provider = Provider;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
