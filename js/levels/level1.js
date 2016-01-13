
var height = Math.min(window.innerHeight, 650);
var width = Math.round(2.07 * height);

// LEVEL 1-1
var Tick = new Shooter(width / 2 - 25, height - 390, 'Tick', 2, 2000);
var Teddy = new Walker(width / 2, height - 100, 'BrownTeddy', 5);
var Helly = new Flyer(20, height / 2 - 190, 'Helly', 5, false, 800, [0, 1], [8, 9], [16], [24]);
var enemiesList = {
  walkers: [Teddy],
  shooters: [Tick],
  flyers: [Helly]
};

var p1 = new Platform(width / 2, height - 162, 1, false);
var p2 = new Platform(width / 2, height - 299, 1, false);
var p3 = new Platform(width / 2 + 350, height - 259, 0.7, false);
var p4 = new Platform(width / 2 - 425, height - 339, 0.6, false);
var platformsList = [p1, p2, p3, p4];

var star1 = new Star(width / 2 - 10, height - 202);
var star2 = new Star(width / 2 + 340, height - 292);
var starsList = [star1, star2];

var exit = new Exit(width / 2 - 445, height - 469, -1);

var level = new Level('Level 1-1', platformsList, enemiesList, starsList, [], 70, height - 100, exit);

// BOSS
var p5 = new Platform(width/2 - 260, height - 110, 1, false);
var p6 = new Platform(width/2 + 260, height - 110, 1, false);

var p7 = new Platform(25, height - 200, 0.2, false);
var p8 = new Platform(width - 25, height - 200, 0.2, false);

var bossToy = new Boss(200, height - 200, 10, 'ToyTrojan');

var Tick1 = new Shooter(0, height - 250, 'Tick', 10, 2000);
var Tick2 = new Shooter(width - 2, height - 250, 'Tick', 10, 2000);

var bossLevel = new Level('Boss', [p5, p6, p7, p8], {shooters:[Tick1, Tick2], boss: bossToy}, [], [], width - 100, height - 100, null);
