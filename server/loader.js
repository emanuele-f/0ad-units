'use strict';

var fs = require("fs");
var async = require("async");
var xml2js = require('xml2js');

var L = require("./locals");
var utils = require("./utils");

module.exports = (function() {
  // may cause troubles but solves a lot of troubles :|
  var PARSER_OPTIONS = {explicitArray: false};
  var parser = new xml2js.Parser(PARSER_OPTIONS);
  
  // only copy to base whose fields of spec which are in base, applying filter fn
  function copyToBaseNumFields(base, spec) {
    for (var x in base) {
      if (x in spec) {
        var v = parseFloat(spec[x]);
        if (! isNaN(v))
          base[x] = v;
      }
    }
  }
  function copyToBaseAllFields(base, spec) {
    for (var x in base) {
      if (x in spec)
        base[x] = spec[x];
    }
  }
  
  var loader = {
    /* Returns (callback) available civilizations identifier names */
    getCivIds: function(callback) {
        fs.readdir(L.CIVS_DIR, function (err, files) {
          if (err) {
            log.error(err);
            callback([]);
          } else {
            var r = [];
            for (var f=0; f<files.length; f++)
              r.push(files[f].split(".json")[0]);
            callback(r);
          }
      });
    },
    
    /* Returns (callback) the available constructor buildings for the given civilization */
    getUnitBuilders: (function() {
      // matches structures to esclude
      var excludegen = "^{civ}_(field|corral|defense_tower|farmstead|market|outpost|storehouse|wall_(.+)|wallset_(.+)|wooden_towen|house)\.xml$";
      var log = utils.LOG('getUnitBuilders');
      
      return function(civ, callback) {
        var exclude = new RegExp(excludegen.replace("{civ}", civ));
        
        fs.readdir(L.STRUCTURES_DIR, function (err, files) {
          if (err) {
            log.error(err);
            return callback([]);
          }
          
          var builds = [];
          
          for (var i=0; i<files.length; i++) {
            var f = files[i];
            
            if (f.startsWith(civ + "_") && f.endsWith('.xml') && f.search(exclude) == -1)
              builds.push(L.STRUCTURES_DIR + "/" + f);
          }
          
          utils.filterCanRead(builds, callback);
        });
      };
    })(),
    
    /* Returns (callback) the unit files for the given unit builder */
    getUnitFiles: (function () {
      var log = utils.LOG("getUnitFiles");
      
      function recStructure(civ, builder, d, callback) {
        fs.readFile(builder, function(err, file) {
          if (err) {
            log.error(err);
            return callback(d);
          }
          
          parser.parseString(file, function (err, data) {
            if (err) {
              log.error(err);
              return callback(d);
            }
            
            function goOn() {
              // units
              var entities;
              try {
                entities = data.Entity.ProductionQueue.Entities;
              } catch (err) {}
              if (entities && entities['$'] && entities['$'].datatype === 'tokens') {
                // strip then fill then complete
                var files = entities['_'].
                  replace(/-| |\t|(^|\n)\s*(\n|$)/g, '').
                  replace(/\{civ\}/g, civ).
                  replace(/([^\n]+)(\n|$)/g, L.TEMPL_DIR + '/$1.xml$2').split("\n");
                  
                // verify they exist
                return utils.filterCanRead(files, function(result) {
                  Array.prototype.push.apply(d, result);
                  callback(d);
                });
              }
              return callback(d);
            }
            
            // parent structure
            var parent;
            try { 
              parent = data.Entity['$'].parent;
            } catch (err) {}
            if (parent)
              return recStructure(civ, L.TEMPL_DIR + '/' + parent + '.xml', d, goOn);
            else
              return goOn();
          });
        });
      }
      
      return function(civ, builder, callback) {
        return recStructure(civ, builder, [], callback);
      }
    })(),
    
    /* Returns (callback) civilization details */
    loadCivDetails: (function() {
      var civ_proto = {'Name':'', 'Emblem':'', 'History':''};
      var log = utils.LOG('loadCivDetails');
      
      return function(civfile, callback) {
        var civ = utils.clone(civ_proto);
        
        fs.readFile(civfile, function(err, data){
          if (err) {
            log.error(err);
            return callback(civ);
          }
          
          var parsed;
          try {
            parsed = JSON.parse(data);
          } catch (err) {
            log.error(err);
            return callback(civ);
          }
            
          copyToBaseAllFields(civ, parsed);
          
          return callback(civ);
        });
      };
    })(),
    
    /* Create a unit instance from template file */
    loadUnitFile: (function() {
      var log = utils.LOG("getUnitProperties");
      
      var proto_common = { 'Health': 0, 'Attack': {}, 'WalkSpeed': 0, 'RunSpeed': 0,
        'Armour': {'Hack': 0, 'Pierce': 0, "Crush": 0},
        'Cost': { 'Food': 0, 'Wood': 0, 'Stone': 0, 'Metal': 0, 'Population': 0, 'BuildTime': 0 },
        'Identity': { 'GenericName': '', 'History': '', 'SpecificName':'', 'Icon':'' },
        'Bonuses' : [] };
        
      var _proto_attack_common = {'Hack' : 0, 'Pierce' : 0, 'Crush' : 0,
        'MaxRange': 0, 'MinRange': 0, 'PrepareTime': 0, 'RepeatTime': 0
      };
        
      var proto_attack_melee = utils.clone(_proto_attack_common);
        
      var proto_attack_ranged = utils.clone(_proto_attack_common);
      proto_attack_ranged['ProjectileSpeed'] = 0;
      proto_attack_ranged['Spread'] = 0;

      var proto_attack_charge = utils.clone(_proto_attack_common);
      
      function recUnit(unitfile, unit, callback) {        
        fs.readFile(unitfile, function(err, file) {        
          if (err) {
            log.error(err);
            return callback(unit);
          }
          
          parser.parseString(file, function (err, data) {
            function goOn() {
              if (! data.Entity) {
                log.warning("Malformed file: " + unitfile);
                return callback(unit);
              }
              var entity = data.Entity;
              
              if (entity.Attack) {
                if (entity.Attack.Melee) {
                  if (! unit.Attack.Melee)
                    unit.Attack.Melee = utils.clone(proto_attack_melee);
                  copyToBaseNumFields(unit.Attack.Melee, entity.Attack.Melee);
                  if (entity.Attack.Melee.Bonuses && entity.Attack.Melee.Bonuses.BonusCavMelee)
                    unit.Bonuses.BonusCavMelee = parseFloat(entity.Attack.Melee.Bonuses.BonusCavMelee.Multiplier);
                }
                
                if (entity.Attack.Ranged) {
                  if (! unit.Attack.Ranged)
                    unit.Attack.Ranged = utils.clone(proto_attack_ranged);
                  copyToBaseNumFields(unit.Attack.Ranged, entity.Attack.Ranged);
                  if (entity.Attack.Ranged.Bonuses && entity.Attack.Ranged.Bonuses.BonusCavMelee)
                    unit.Bonuses.BonusCavMelee = parseFloat(entity.Attack.Ranged.Bonuses.BonusCavMelee.Multiplier);
                }
                
                if (entity.Attack.Charge) {
                  if (! unit.Attack.Ranged)
                    unit.Attack.Charge = utils.clone(proto_attack_charge);
                  copyToBaseNumFields(unit.Attack.Charge, entity.Attack.Charge);
                  if (entity.Attack.Charge.Bonuses && entity.Attack.Charge.Bonuses.BonusCavMelee)
                    unit.Bonuses.BonusCavMelee = parseFloat(entity.Attack.Charge.Bonuses.BonusCavMelee.Multiplier);
                }
              }
              
              if (entity.Armour)
                copyToBaseNumFields(unit.Armour, entity.Armour);
                
              if (entity.Cost) {
                copyToBaseNumFields(unit.Cost, entity.Cost);
                
                if(entity.Cost.Resources) {
                  // Case conversion
                  if(entity.Cost.Resources.food)
                    unit.Cost.Food = entity.Cost.Resources.food;
                  if(entity.Cost.Resources.wood)
                    unit.Cost.Wood = entity.Cost.Resources.wood;
                  if(entity.Cost.Resources.stone)
                    unit.Cost.Stone = entity.Cost.Resources.stone;
                  if(entity.Cost.Resources.metal)
                    unit.Cost.Metal = entity.Cost.Resources.metal;
                }
              }
                
              if (entity.Identity)
                copyToBaseAllFields(unit.Identity, entity.Identity);
                
              copyToBaseNumFields(unit, entity);
              if (entity.UnitMotion) {
                if (entity.UnitMotion.WalkSpeed)
                  unit.WalkSpeed = parseFloat(entity.UnitMotion.WalkSpeed);
                if (entity.UnitMotion.Run && entity.UnitMotion.Run.Speed)
                  unit.RunSpeed = parseFloat(entity.UnitMotion.Run.Speed);
              }
              if (entity.Health && entity.Health.Max)
                unit.Health = parseFloat(entity.Health.Max);
                
              callback(unit);
            }
          
            if (err) {
              log.error(err);
              return callback(unit);
            }
            
            // parent structure
            var parent;
            try { 
              parent = data.Entity['$'].parent;
            } catch (err) {}
            if (parent)
              return recUnit(L.TEMPL_DIR + '/' + parent + '.xml', unit, goOn);
            else
              return goOn();
          });
        });
      }
      
      return function(unitfile, callback) {
        var unit = utils.clone(proto_common);
        recUnit(unitfile, unit, callback);
      }
      
    })(),
    
    loadUnits: function(log, callback) {
      var units = {};
      
      loader.getCivIds(function(civs){
        async.eachSeries(civs, function(civ, nextCiv) {
          log.debug(civ);
          
          loader.loadCivDetails(L.CIVS_DIR + "/" + civ + ".json", function(details) {
            units[civ] = details;
            units[civ].units = {};
            
            loader.getUnitBuilders(civ, function(builds) {
              async.eachSeries(builds, function(builder, nextBuild) {
                log.debug("  " + builder);
                loader.getUnitFiles(civ, builder, function(ufiles) {
                  async.eachSeries(ufiles, function(ufile, nextUfile) {
                    log.debug("    " + ufile);
                    
                    loader.loadUnitFile(ufile, function(unit) {
                      var u = ufile.replace(/^(.*)\.xml$/, '$1').split("/").pop();
                      units[civ].units[u] = unit;
                      nextUfile();
                    });
                  }, function(){ nextBuild(); });
                });
              }, function(){ nextCiv(); });
            });
          });
        }, function() { callback(units); });
      });
    },

    /* Returns (callback) true if unit json file generated successfully, false otherwise */
    createUnitsJson: function (callback) {
      var log = utils.LOG("createUnitsJson");
      
      loader.loadUnits(log, function(units) {
        fs.writeFile(L.UNITS_GEN_FILE, JSON.stringify(units), function(err) {
          if (err)
            log.error(err);
          else
            log.debug("Saved");
            
          if (callback)
            callback(!!err);
        });
      });
    }
  };
  
  return loader;
})();
