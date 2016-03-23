'use strict';

var process = require('child_process');
var async = require('async');
var fs = require('fs');

module.exports = {
    LOG: function (tag) {
      return {
        debug: function(msg) { console.log(tag + " >> " + msg); },
        error: function(msg) { console.error(tag + " >> " + msg); },
        warning: function(msg) { console.warn(tag + " >> " + msg); },
      };
    },
    
    runCommand: function(cmd, args, log, callback) {
        var child = process.spawn(cmd, args);
        
        child.stderr.on('data', (data) => {
          log.error(data.toString().trim());
        });
        child.stdout.on('data', (data) => {
          log.debug(data.toString().trim());
        });
        child.on('close', (code) => {
          var msg = "child process exited with code " + code;
          
          if (code != 0)
            log.warning(msg);
          else
            log.debug(msg);
            
          if (callback)
            callback(code);
        });
        
        return child;
    },
    
    /* Returns the files that can be read by the calling process */
    filterCanRead: function(files, callback) {
      async.filter(files, function(file, advance) {
        fs.access(file, fs.R_OK, function(err) {
          advance(!err);
        });
      }, function (readable) {
        callback(readable);
      });
    },
    
    /* Clones an object */
    clone: function clone(obj) {
      var c = Object.create(null);
      
      for (var x in obj) {
        //~ if (Object.hasOwnProperty(obj, x)) {
        if (typeof obj[x] === 'object' && obj[x] !== null)
          c[x] = clone(obj[x]);
        else
          c[x] = obj[x];
        //~ }
      }
      return c;
    },
}
