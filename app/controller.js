'use strict';

var controller = (function() {
    var atkTypes = ["Melee", "Ranged", "Charge"];
    
    var units = [];
    var currentPage = 0;
    
    function placeHolder(i) {
        return "PlaceHolder" + i;
    }
    
    function onCivsLoaded(civs) {
        var allunits = [];
          
          for (var civ in civs) {
              var cu = civs[civ]['units'];
              for (var unit in cu) {
                  // back pointer
                  cu[unit].Civilization = civs[civ];
                  // convert milliseconds to seconds
                  for (var i in atkTypes) {
                      var tp = atkTypes[i];
                      if (tp in cu[unit].Attack) {
                          cu[unit].Attack[tp]['RepeatTime'] /= 1000;
                          cu[unit].Attack[tp]['PrepareTime'] /= 1000;
                      }
                  }
                  allunits.push(cu[unit]);
              }
          }
          units = allunits;
          
          var fu = getFilteredUnits();
          if (fu.length > 0) {
            updatePlaceHolders(fu);
            model.onPageChanged(currentPage);
          }
    }
    
    function requestCivs() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                onCivsLoaded(JSON.parse(xhttp.responseText));
            }
        };
        xhttp.open("GET", "civs.json", true);
        xhttp.send();
    }
    
    function getFilteredUnits() {
        if (!(units) || units.length == 0)
          return [];
        
        // units | zadUnitsFilter | zadUnitsOrderBy | startFrom | limitTo  
        var filtered = filters.zadUnitsFilter(units, model.getUnitFilter());
        return filtered;
    }
    
    var exports = {
        initPlaceHolders: function() {
            // Init placeholders
            var _s = "";
            for (var i=0; i<UNITS_PER_PAGE; i++) {
                _s += "<tr id='" + placeHolder(i) + "'></tr>\n";
            }
            var ph = document.getElementById("placeHolders");
            ph.innerHTML = _s + ph.innerHTML;
            requestCivs();
        },
        updatePlaceHolders: function(filtered) {            
            var datalen = filtered.length;
            
            filtered = filters.limitTo(
              filters.startFrom(
                filters.zadUnitsOrderBy(filtered,
                  model.getUnitOrder()),
                currentPage * UNITS_PER_PAGE),
              UNITS_PER_PAGE);
              
            var i;
            for (i=0; i<Math.min(UNITS_PER_PAGE, filtered.length); i++) {
              var ph = document.getElementById(placeHolder(i));
              ph.className = '';
              
              // remove first 'obj.' and replace if found
              ph.innerHTML = UNIT_TEMPLATE.replace(/{{[0-9a-zA-Z_]*\.([^}]*)}}/g, function(exp, grp){
                var found = propsByPath(filtered[i], grp.split('.'));
                if (found.length == 1)
                  return tryGetFixedOrEscaped(found[0], 1);
                else
                  return '&minus;';
              });
            }
            
            // hide others
            for(; i<UNITS_PER_PAGE; i++) {
              var ph = document.getElementById(placeHolder(i));
              ph.className = 'hidden';
            }
            
            model.onDataChanged(filtered, datalen);
            return true;
        },
        nextPage: function() {
            currentPage = Math.min(currentPage+1, model.getPagesNum()-1);
            var fu = getFilteredUnits();
            if (fu.length > 0) {
                updatePlaceHolders(fu);
                model.onPageChanged(currentPage);
            }
        },
        prevPage: function() {
            currentPage = Math.max(0, currentPage-1);
            var fu = getFilteredUnits();
            if (fu.length > 0) {
                updatePlaceHolders(fu);
                model.onPageChanged(currentPage);
                window.scrollTo(0,document.body.scrollHeight);
            }
        },
        onOrderChanged: function(input) {
            var fu = getFilteredUnits();
            if (fu.length > 0)
                updatePlaceHolders(fu);
        },
        onFilterChanged: function(input) {
            var fu = getFilteredUnits();
            if (fu.length > 0) {
                currentPage = 0;
                updatePlaceHolders(fu);
                model.onPageChanged(currentPage);
            }
        },
    };
    
    var updatePlaceHolders = exports.updatePlaceHolders;
    
    return exports;
})();
