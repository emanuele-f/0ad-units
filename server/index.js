'use strict';

var express = require('express');
var fs = require('fs');
var server = express();
var loader = require('./loader');
var L = require('./locals');
var utils = require('./utils');

var log = utils.LOG("server");

server.get('/civs.json', (function() {
  var is_generating = false;
  
  return function(req, res) {
    function nowReply() {
      //~ log.debug("Serving civs file...");
      res.sendFile(L.UNITS_GEN_FILE, {root: '.'});
    }
    
    fs.access(L.UNITS_GEN_FILE, fs.R_OK, function(err) {
      if(err && ! is_generating) {
        is_generating = true;
        loader.createUnitsJson(function (){
          is_generating = false;
          nowReply();
        });
      } else {
        // NB: if is_generating is true will cause a 404
        nowReply();
      }
    });
  };
})());

server.get('/session/portraits/emblems/*.png', function(req, res) {
    var parts = req.originalUrl.split("/");
    var target = L.EMBLEMS_DIR + "/" + parts[parts.length-1];
    
    fs.access(target, fs.R_OK, function(err) {
        if (! err)
            res.sendFile(target, {root:'.'});
    });
});

server.get('/units/*.png', function(req, res) {
    var parts = req.originalUrl.split("/");
    var target = L.ICONS_DIR + "/" + parts[parts.length-1];
    
    fs.access(target, fs.R_OK, function(err) {
        if (! err)
            res.sendFile(target, {root:'.'});
    });
});

server.use(express.static('app'));

server.listen(L.SERVER_PORT, function () {
  log.debug('listening on port ' + L.SERVER_PORT);
});
