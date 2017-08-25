Set.prototype.difference = function(set) {
  var diff = new Set(this);
  for (var v of set) {
    diff.delete(v);
  }
  return diff;
}

// Required by ES6 spec
export const _ = null;
