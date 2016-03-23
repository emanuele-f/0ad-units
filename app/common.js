'use strict';

/* Retrieve object properties deep in object his structure using a path specifier
 *  proppath: array of strings whose order reflects the object structure. '*' means any.
 * 
 * Returns an array, since you can specify '*' as path component.
 */
function propsByPath(obj, proppath) {
  var choices = [];
  var nextchoices = [obj];
    
  for(var i=0; i<proppath.length; i++) {
    var prop = proppath[i];
    choices = nextchoices;
    nextchoices = [];
    
    while(choices.length > 0) {
      var o = choices.pop();
      
      if (o === null || typeof o !== 'object')
        continue;
    
      if (prop !== '*') {
        if (prop in o)
          nextchoices.push(o[prop]);
      } else {
        for (var x in o)
          nextchoices.push(o[x]);
      }
    }
  }
  
  return nextchoices;
}

/* Tries to get the the numeric value of v */
function tryGetNumeric(v) {
  var i = parseFloat(v);
  if (! isNaN(i))
      return i;
  return v;
}

function tryGetFixedOrEscaped(v, digits) {
  var i = parseFloat(v);
  if (! isNaN(i))
      return i.toFixed(digits);
  if(! v)
    return v;
  return v.replace(/"/g, "&quot;");
}

var delayedInput = (function() {
    var values = {};
    var timers = {};
    
    return function(pressev, timeout, callback) {
        var input = pressev.target;
        var origvalue = input.value;
        
        // only valid charcodes
        if(! pressev.which)
            return;

        function onTimeout() {
            if (input.value === values[input]) {
                delete timers[input];
                delete values[input];
                
                if (origvalue !== input.value)
                    callback(input);
            } else {
                timers[input] = setTimeout(onTimeout, timeout);
                values[input] = input.value;
            }
        }
        
        if (timers[input])
            clearTimeout(timers[input]);
        timers[input] = setTimeout(onTimeout, timeout);
        values[input] = input.value;
    };
})();

var UNITS_PER_PAGE = 7;
