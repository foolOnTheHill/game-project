var Shooter = function(x, y, sprite, hp, shootPeriod) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.hp = hp;
  this.shootPeriod = shootPeriod;
};

var Static = function(x, y, sprite, hp) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.hp = hp;
};

var Walker = function(x, y, sprite, hp) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.hp = hp;
};

var Flyer = function(x, y, sprite, hp, isDropper, dropPeriod, leftAnimation, rightAnimation, lhitAnimation, rhitAnimation) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.hp = hp;
  this.isDropper = isDropper;
  this.dropPeriod = dropPeriod;
  this.leftAnimation = leftAnimation;
  this.rightAnimation = rightAnimation;
  this.lhitAnimation = lhitAnimation;
  this.rhitAnimation = rhitAnimation;
};

var Boss = function(x, y, hp, sprite) {
  this.x = x;
  this.y = y;
  this.hp = hp;
  this.sprite = sprite;
};

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

var Level = function(levelName, platformsList, enemiesList, starList, itensList, playerX, playerY, exit) {
  this.name = levelName;
  this.platformsList = platformsList;
  this.enemiesList = enemiesList;
  this.starsList = starList;
  this.itensList = itensList;
  this.playerX = playerX;
  this.playerY = playerY;
  this.exit = exit;
};
