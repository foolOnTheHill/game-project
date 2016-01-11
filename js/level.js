var Platform = function(x, y, width, fall) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.fall = fall;
};

var Star = function(x, y) {
  this.x = x;
  this.y = y;
};

var RecoverPartial;
var RecoverFull;
var UpgradeLife;

var Item = function(x, y, type) {
  this.type = type;
  this.x = x;
  this.y = y;
};

var Exit = function(x, y, scale) {
  this.x = x;
  this.y = y;
  this.scale = scale;
};

var Level = function(levelName, platformsList, enemiesList, starList, itensList, exit) {
  this.name = levelName;
  this.platformsList = platformsList;
  this.enemiesList = enemiesList;
  this.starsList = starList;
  this.itensList = itensList;
  this.exit = exit;
};
