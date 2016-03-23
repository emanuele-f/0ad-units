'use strict';

var async = require('async');
var utils = require('./utils');
var L = require('./locals');

// not really a module
module.exports = {
    updateFromGit: (function() {
      var BASE_URL = "https://github.com/0ad/0ad/trunk/binaries/data/mods/public"
      var CIVS_URL = BASE_URL + "/simulation/data/civs";
      var TEMPLATES_URL = BASE_URL + "/simulation/templates";
      var EMBLEMS_URL = BASE_URL + "/art/textures/ui/session/portraits/emblems";
      var ICONS_URL = BASE_URL + "/art/textures/ui/session/portraits/units";
      
      var log = utils.LOG("GIT_UPDATE");

      function svnExport(url, dir, callback) {
        return utils.runCommand("svn", ["export", "--force", url, dir], log, callback);
      }
      
      var running = false;
      var pairs = [
        { url:CIVS_URL, dir:L.CIVS_DIR },
        { url:TEMPLATES_URL, dir:L.TEMPL_DIR },
        { url:EMBLEMS_URL, dir:L.EMBLEMS_DIR },
        { url:ICONS_URL, dir:L.ICONS_DIR },
      ];
      
      return function() {
        if (! running) {
          running = true;
          
          log.debug("synching git data...");
          
          async.eachSeries(pairs, function(pair, nextPair){
              svnExport(pair.url, pair.dir, function(code) {
                  if (code != 0) {
                    log.error("failed");
                    running = false;
                    return;
                  }
                  
                  nextPair();
              });
          }, function() {
              log.debug("Success");
              running = false;
          });
        }
      };
    })(),
}

module.exports.updateFromGit();
