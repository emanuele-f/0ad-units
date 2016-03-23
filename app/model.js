'use strict';

var model = (function() {    
    return {
        onDataChanged: function(data, totlen) {
            if (data.length > 0) {
                document.getElementById('mainTable').className = '';
                var numpages = Math.ceil(totlen/UNITS_PER_PAGE);
                document.getElementById('pagesNum').innerHTML = numpages;
            } else {
                document.getElementById('mainTable').className = 'hidden';
            }
        },
        onPageChanged: function(page) {
            var max = parseInt(document.getElementById('pagesNum').innerHTML);
            if (page > max) {
                page = max;
            }
            // now count from 1
            page++;
            document.getElementById('currentPage').innerHTML = page;            
            
            var buttonNext = document.getElementById('buttonNext');
            var buttonPrev = document.getElementById('buttonPrev');
            
            if (page >= max)
                buttonNext.setAttribute('disabled', true);
            else
                buttonNext.removeAttribute('disabled');
                
            if (page == 1)
                buttonPrev.setAttribute('disabled', true);
            else
                buttonPrev.removeAttribute('disabled');
        },
        getPagesNum: function() {
            return parseInt(document.getElementById('pagesNum').innerHTML);
        },
        getUnitFilter: function() {
            return document.getElementById('filterInput').value;
        },
        getUnitOrder: function() {
            return document.getElementById('orderInput').value;
        }
    };
})();
