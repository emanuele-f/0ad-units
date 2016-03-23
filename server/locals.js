'use strict';

var BASEDIR = "server";
var   DATADIR = BASEDIR + "/data";
var     CIVS_DIR = DATADIR + "/civs";
var     TEMPL_DIR = DATADIR + "/templates";
var         STRUCTURES_DIR = TEMPL_DIR + "/structures";
var     EMBLEMS_DIR = DATADIR + "/emblems";
var     ICONS_DIR = DATADIR + "/units";
var     UNITS_GEN_FILE = DATADIR + "/units_gen.json";

module.exports = {
    BASEDIR:BASEDIR,
    DATADIR:DATADIR,
    CIVS_DIR:CIVS_DIR,
    TEMPL_DIR:TEMPL_DIR,
    STRUCTURES_DIR:STRUCTURES_DIR,
    EMBLEMS_DIR:EMBLEMS_DIR,
    ICONS_DIR:ICONS_DIR,
    UNITS_GEN_FILE:UNITS_GEN_FILE,
    
    SERVER_PORT: 3000,
}
