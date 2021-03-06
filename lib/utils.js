"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDisplayName = getDisplayName;
exports.isPromise = isPromise;
exports.isUndefined = isUndefined;
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function isPromise(thing) {
  try {
    return typeof thing.then === "function";
  } catch (e) {
    return false;
  }
}

function isUndefined(thing) {
  return typeof thing === "undefined";
}
