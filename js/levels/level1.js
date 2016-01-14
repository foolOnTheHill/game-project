
var height = Math.min(window.innerHeight, 650);
var width = Math.round(2.07 * height);

var emptyEnemiesList = {walkers: [], shooters: [], flyers: []};

// LEVEL 1-1
var p1 = new Platform(width/2, height - 100, 1, false);
var exit1 = new Exit(width/2, height - 120, 1);
var Teddy1 = new Walker(width-100, height - 80, 'BrownTeddy', 5);
var starsList1 = [new Star(width/2 - 80, height-40), new Star(width/2 + 50, height-40)];
var Level1_1 = new Level('Level 1-1', [p1], {walkers: [Teddy1]}, starsList1, [], 10, height-70, exit1);

// LEVEL 1-2
var p2 = new Platform(width / 2, height - 162, 1, false);
var exit2 = new Exit(width/2, height - 170, 1)
var Level1_2 = new Level('Level 1-2', [p2], {walkers: [Teddy1]}, starsList1, [], 10, height-70, exit2);

// LEVEL 1-3
var p3 = new Platform(width / 2, height - 162, 1, false);
var p4 = new Platform(width / 2, height - 299, 1, false);
var p5 = new Platform(width / 2 + 350, height - 259, 0.7, false);
var p6 = new Platform(width / 2 - 425, height - 339, 0.6, false);
var starsList2 = [new Star(width / 2 - 10, height - 202), new Star(width / 2 + 340, height - 292)];
var exit3 = new Exit(width / 2 - 445, height - 469, -1);
var Level1_3 = new Level('Level 1-3', [p3, p4, p5, p6], {walkers:[Teddy1]}, starsList2, [], 10, height-70, exit3)

// LEVEL 1-4
var Tick1 = new Shooter(width / 2 - 25, height - 390, 'Tick', 2, 2000);
var Level1_4 = new Level('Level 1-4', [p3, p4, p5, p6], {walkers:[Teddy1], shooters:[Tick1]}, starsList2, [], 10, height-70, exit3)

// LEVEL 1-5
var p7 = new Platform(860, height-162, 5.5, false);
var p8 = new Platform(width-50, height-254, 0.5, false);
var exit4 = new Exit(width-52, height-260, 1);
var Tick2 = new Shooter(width-150, height-222, 'Tick', 2, 2000);
var starsList3 = [new Star(width - 68, height-50), new Star(width-68, height-198)]
var Level1_5 = new Level('Level 1-5', [p7, p8], {walkers: [Teddy1], shooters:[Tick2]}, starsList3, [], 10, height-70, exit4);

// LEVEL 1-6
var p9 = new Platform(400, height-150, 1, false);
var p10 = new Platform(400, height-300, 1, false);
var p11 = new Platform(400, height-450, 1, false);
var p12 = new Platform(width-400, height-150, 1, false);
var p13 = new Platform(width-400, height-300, 1, false);
var p14 = new Platform(width-400, height-450, 1, false);
var p15 = new Platform(width/2, height-220, 0.6, false);
var p16 = new Platform(width/2, height-370, 0.6, false);
var p17 = new Platform(width/2, height-520, 0.6, false);
var exit5 = new Exit(width/2, height-550, 1);
var starsList4 = [new Star(390, height-180), new Star(390, height-330), new Star(390, height-480), new Star(width-410, height-180), new Star(width-410, height-330), new Star(width-410, height-480)];
var Tick3 = new Static(width/2-20, height-270, 'Tick', 1);
var Tick4 = new Shooter(width/2-20, height-420, 'Tick', 2, 2000);
var Planey1 = new Flyer(20, height - 205, 'Planey', 3, false, null, [0, 1], [2, 3], [4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15]);
var Planey2 = new Flyer(width/2, height - 355, 'Planey', 3, false, null, [0, 1], [2, 3], [4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15]);
var Planey3 = new Flyer(width-20, height - 505, 'Planey', 3, false, null, [0, 1], [2, 3], [4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15]);
var Level1_6 = new Level('Level 1-6', [p9, p10, p11, p12, p13, p14, p15, p16, p17], {shooters:[Tick4], walkers:[Teddy1], statics:[Tick3], flyers:[Planey1, Planey2, Planey3]}, starsList4, [], 10, height-70, exit5);

// LEVEL 1-7
var p20 = new Platform(0, height-210, 1.1, false);
var p21 = new Platform(498, height-314, 1, true);
var p22 = new Platform(758, height-374, 1, true);
var p23 = new Platform(1018, height-434, 1, true);
var p24 = new Platform(width-53, height-450, 0.5, false);
var starsList5 = [new Star(485, height-355), new Star(778, height-415), new Star(1038, height-465)];
var exit6 = new Exit(width-55, height-500, 1);
var Level1_7 = new Level('Level 1-7', [p20, p21, p22, p23, p24], {}, starsList5, [], 20, height-240, exit6);

// LEVEL 1-8
var p25 = new Platform(0, 200, 1, false);
var p26 = new Platform(550, 350, 1, true);
var p27 = new Platform(900, 290, 1, true);
var p28 = new Platform(width-50, 315, 0.5, false);
var p29 = new Platform(width-20, 210, 0.2, false);
var p30 = new Platform(width-250, 110, 0.5, false);
var p31 = new Platform(0, 315, 0.3, false);
var starsList6 = [new Star(width-25, 180), new Star(width-25, 250)]
var exit7 = new Exit(width-255, 100, 1);
var Tick5 = new Shooter(5, 260, 'Tick', 5, 2000);
var Level1_8 = new Level('Level 1-8', [p25, p26, p27, p28, p29, p30, p31], {shooters:[Tick5]}, starsList6, [], 20, 150, exit7);

// LEVEL 1-9
var p33 = new Platform(width-20, height-110, 0.2, false);
var p35 = new Platform(width-400, height-200, 1.5, false);
var p36 = new Platform(width/2 - 4, height-305, 0.5, true);
var p37 = new Platform(400, height-380, 1.5, false);
var p38 = new Platform(width-250, height-390, 1, false);
var p39 = new Platform(width/2, height-480, 0.5, true);
var p40 = new Platform(width-20, height-450, 0.2, false);
var p41 = new Platform(width-200, height-550, 0.5, false);
var starsList7 = [new Star(width-30, height-50), new Star(width-30, height-150), new Star(width-400, height-250), new Star(width/2-10, height-335), new Star(width/2-10, height-510), new Star(width-200, height-440)]
var exit8 = new Exit(width-210, height-610, 1);
var Planey4 = new Flyer(20, height - 360, 'Planey', 5, true, 800, [0, 1], [2, 3], [4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15]);
var Tick6 = new Shooter(260, height-430, 'Tick', 3, 2000);
var Ratz = new Walker(width-100, height - 80, 'DirtyRatz', 10);
var Level1_9 = new Level('Level 1-9', [p33, p35, p36, p37, p38, p39, p40, p41], {walkers:[Ratz], flyers:[Planey4], shooters:[Tick6]}, starsList7, [], width/2, height-100, exit8);

// LEVEL 1-10
var Tick7 = new Shooter(width/2-20, height-420, 'Tick', 4, 1000);
var Planey5 = new Flyer(20, height - 275, 'Planey', 3, true, 1200, [0, 1], [2, 3], [4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15]);
var Level1_10 = new Level('Level 1-10', [p9, p10, p11, p12, p13, p14, p15, p16, p17], {shooters:[Tick7], walkers:[Ratz], flyers:[Planey5, Planey2, Planey3]}, starsList4, [], 10, height-70, exit5);

var p42 = new Platform(width/2 - 260, height - 110, 1, false);
var p43 = new Platform(width/2 + 260, height - 110, 1, false);

var p44 = new Platform(25, height - 200, 0.2, false);
var p45 = new Platform(width - 25, height - 200, 0.2, false);

var bossToy = new Boss(200, height - 200, 10, 'ToyTrojan');

var Tick7 = new Shooter(0, height - 250, 'Tick', 10, 2000);
var Tick8 = new Shooter(width - 2, height - 250, 'Tick', 10, 2000);

var Level1_11 = new Level('Boss', [p42, p43, p44, p45], {shooters:[Tick7, Tick8], boss: bossToy}, [], [], width - 100, height - 100, null);

var levels_list = [Level1_1, Level1_2, Level1_3, Level1_4, Level1_5, Level1_6, Level1_7, Level1_8, Level1_9, Level1_10, Level1_11];
