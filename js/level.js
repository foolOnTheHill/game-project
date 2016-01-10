var Platform = function(x, y, width, movement, fall) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.movement = movement;
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
}

var Exit = function(x, y) {
  this.x = x;
  this.y = y;
};

var Level = function(platformsList, enemiesList, starList, itensList, exitPosition) {
  this.platformsList = platformsList;
  this.enemiesList = enemiesList;
  this.starList = starList;
  this.itensList = itensList;
  this.exitPosition = exitPosition;
};
