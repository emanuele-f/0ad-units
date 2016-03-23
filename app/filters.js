'use strict';

var filters = (function () {
    function asc_order(a, b) {
        if (a === null)
            return true;
        return a > b;
    }
    
    function desc_order(a, b) {
        if (a === null)
            return true;
        return a < b;
    }
    
    // order is important: longer first
  var operators = ['>=', '<=', '!=', '=', '>', '<'];
  var opfn = [
    function(a,b) { return a >= b; },
    function(a,b) { return a <= b; },
    function(a,b) { return a != b; },
    function(a,b) {
      if (typeof a === 'string' && typeof b === 'string') {
        a = a.toUpperCase();
        b = b.toUpperCase();
        return a === b || a.startsWith(b);
      }
      return a === b;
    },
    function(a,b) { return a > b; },
    function(a,b) { return a < b; },
  ];
    
  function splitOp(stringa) {
    for (var i=0; i<operators.length; i++) {
      var op = operators[i];
      
      if (stringa.search(op) != -1) {
        var parts = stringa.split(op);
        if (parts.length == 2)
          return {'subj':parts[0].trim(), 'op':opfn[i], 'val':parts[1].trim()};
      }
    }
    return null;
  }
    
    return {
        zadUnitsOrderBy: function(input, orderby) {
            var by;
            var cmp;
            var def = null;
            
            if (! input)
                return;
            
            if (! orderby) {
                orderby = 'Civilization.Name';
                cmp = asc_order;
            } else {
                if (orderby.startsWith('-')) {
                    orderby = orderby.slice(1);
                    cmp = desc_order;
                } else {
                    cmp = asc_order;
                }
            }
            // indicates path to reach the value
            by = orderby.split('.');
            
            // object to array + determine value
            var arr = [];
            var values = []
            for (var u=0; u<input.length; u++) {
                // save key as a property
                input[u].key = u;
                
                arr.push(input[u]);
                
                var best = def;
                var props = propsByPath(input[u], by);
                for (var i=0; i<props.length; i++) {
                  if (cmp(best, props[i]))
                    best = props[i];
                }
                
                values.push(best);
            }
            
            arr.sort(function(a, b) {
                var ia = arr.indexOf(a);
                var ib = arr.indexOf(b);
                return cmp(tryGetNumeric(values[ia]), tryGetNumeric(values[ib]));
            });

            return arr;
        },
        zadUnitsFilter: function(input, filter) {
            if (! filter)
              return input;
                
            var so = splitOp(filter);
            if (! so)
              return;
            
            var op = so.op;
            var cmpval = tryGetNumeric(so.val);
            var parts = so.subj.split(".");
            
            var output = [];
          
            for(var u=0; u<input.length; u++) {
              var props = propsByPath(input[u], parts);
              
              // * means any in this filter
              for (var i=0; i<props.length; i++) {
                if (op(tryGetNumeric(props[i]), cmpval)) {
                  // ok, take it
                  output.push(input[u]);
                  break;
                }
              }
            }
            
            return output;
          },
        startFrom: function(input, start) {
            if (! input)
                return;
                
            start = +start; //parse to int
            return input.slice(start);
        },
        limitTo: function(input, limit) {
            if (! input)
                return;
                
            return input.slice(0, limit);
        }
    };
})();
