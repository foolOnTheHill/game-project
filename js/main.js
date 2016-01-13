"use strict";

var height = Math.min(window.innerHeight, 650);
var width = Math.round(2.07 * height);

var scale = height / 650;

console.log('Height ' + height);
console.log('Width ' + width);

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game_div');

var player;

function getState(starsCount, currentLevel) {

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

	var p5 = new Platform(width/2 - 260, height - 110, 1, false);
	var p6 = new Platform(width/2 + 260, height - 110, 1, false);

	var p7 = new Platform(25, height - 200, 0.2, false);
	var p8 = new Platform(width - 25, height - 200, 0.2, false);

	var bossToy = new Boss(200, height - 200, 10, 'ToyTrojan');

	var Tick1 = new Shooter(0, height - 250, 'Tick', 10, 2000);
	var Tick2 = new Shooter(width - 2, height - 250, 'Tick', 10, 2000);

	var bossLevel = new Level('Boss', [p5, p6, p7, p8], {shooters:[Tick1, Tick2], boss: bossToy}, [], [], width - 100, height - 100, null);

	var levels = [bossLevel];

	var main = {
		create : function() {
			//SETTINGS
			this.game.world.setBounds(0, 0, width * scale, height * scale);
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.physics.arcade.gravity.y = 750;

			//BACKGROUND SPRITE
			var background = this.game.add.sprite(0, 0, 'bg3');
			background.scale.setTo(1.5, 2);

			//FLOOR
			this.floor = this.game.add.group();
			this.floor.createMultiple(this.game.world.width / (200 * scale), 'platform');
			this.setFloor();

			//PLATAFORMS
			this.platforms = this.game.add.group();
			this.platforms.createMultiple(550, 'platform');

			// STARS
			this.stars = this.game.add.group();
			this.stars.createMultiple(100, 'Coin');

			//CAMERA
			this.game.camera.follow(this.player, Phaser.Camera.FOLLOW);

			//HOTKEYS
			this.cursors = this.game.input.keyboard.createCursorKeys();
			this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
			this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
			this.changeWeaponButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
			this.changeWeaponButton.onDown.add(this.changeWeapon, this);

			//BOMBS
			this.bombs = this.game.add.group();
			this.bombs.createMultiple(1000, 'bomb');

			// ENEMIES
			this.enemies = this.game.add.group();

			// EXIT
			this.exit = new EnemyStatic(0, 0, this.game, 'Lucas', 0);

			// LEVEL
			this.level = levels[currentLevel];

			// WEAPONS
			this.weapons = [];
			this.weapons.push(new Weapon.Basic(this.game, 'bullet'));
			this.weapons.push(new Weapon.Cannon(this.game, 'bullet2'));

			//PLAYER
			this.player = new Player(this.level.playerX, this.level.playerY, this.game, 'Jessie', scale, 6);
			this.player.weapon1 = this.weapons[0];
			this.player.weapon2 = this.weapons[1];
			this.player.currentWeapon = this.weapons[0];
			this.player.updateBullets();

			//
			this.bulletTime = this.game.time.now + 200;
			this.jumpTime = this.game.time.now + 300;
			this.isBossLevel = true;
			this.boss = null;

			this.game.player = this.player;

			this.loadLevel();

			this.pause_texture = this.game.add.image(0, 0, 'pause_texture');
			this.pause_texture.visible = false;

			this.replayButton = this.game.add.image(this.game.world.width - 70, 15, 'replay');
			this.replayButton.scale.setTo(0.6	, 0.6);
			this.replayButton.inputEnabled = true;
			this.replayButton.events.onInputDown.add(this.restartLevel, this);

			this.pauseButton = this.game.add.image(this.game.world.width - 130, 15, 'pause');
			this.pauseButton.scale.setTo(0.6, 0.6);
			this.pauseButton.inputEnabled = true;
			this.pauseButton.events.onInputDown.add(this.pauseGame, this);

			this.isMute = false;
			this.muteButton = this.game.add.image(this.game.world.width - 65, this.game.world.height - 76, 'unmute');
			this.muteButton.scale.setTo(0.6	, 0.6);
			this.muteButton.inputEnabled = true;
			this.muteButton.events.onInputDown.add(this.mute, this);
		},

		mute: function() {
			this.muteButton.destroy();

			if (this.isMute) {
				this.muteButton = this.game.add.image(this.game.world.width - 65, this.game.world.height - 69, 'mute');
			} else {
				this.muteButton = this.game.add.image(this.game.world.width - 65, this.game.world.height - 76, 'unmute');
			}
			this.muteButton.scale.setTo(0.6	, 0.6);
			this.muteButton.inputEnabled = true;
			this.muteButton.events.onInputDown.add(this.mute, this);
			this.isMute = !this.isMute;
		},

		restartLevel: function() {
			this.game.state.restart();
		},

		pauseGame: function() {
			 this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;
			 if (this.game.physics.arcade.isPaused) {
				 this.pause_texture.visible = true;
			 } else {
				 this.pause_texture.visible = false;
			 }
		},

		setFloor : function() {
			var posX = 0;
			var posY = this.game.world.height - 20 * scale;

			var w = 200 * scale;
			var total = 0;
			while (total <= this.game.world.width) {
				var p = this.floor.getFirstDead();
				if (p != null) {
					p.reset(posX, posY);
					this.game.physics.arcade.enable(p);
					p.body.immovable = true;
					p.body.allowGravity = false;
					p.body.collideWorldBounds = true;
				}
				posX += w;
				total += w;
			}
		},

		setPlatforms : function(positions) {

			for (var i = 0; i < positions.length; i++) {
				var pos = positions[i];
				console.log(pos);
				var p = this.platforms.getFirstDead();
				if (p != null) {
					p.reset(pos[0], pos[1]);
					p.anchor.setTo(0.5, 0.5);
					p.width *= pos[2];
					this.game.physics.arcade.enable(p);
					p.body.immovable = true;
					p.body.allowGravity = false;
					p.body.collideWorldBounds = true;
				}
			}
		},

		movePlayer : function() {
			var vx = this.player.body.velocity.x;
			var vy = this.player.body.velocity.y;

			if (this.cursors.left.isDown && !this.cursors.down.isDown) {

				if (this.player.direction == 1) {
					this.player.scale.x *= -1;

					if (this.player.body.touching.down) {
						this.player.changeDirectionInverval = this.game.time.now + 40;
					} else {
						this.player.changeDirectionInverval = -1;
					}
				}

				if (this.game.time.now > this.player.changeDirectionInverval){
					this.player.body.velocity.x = this.player.speed * -1;
				}

				this.player.playerDirection = 'left';
				this.player.direction = -1;
				this.player.animations.play('walk');

				this.player.downHit = false;
			} else if (this.cursors.right.isDown && !this.cursors.down.isDown) {

				if (this.player.direction == -1) {
					this.player.scale.x *= -1;

					if (this.player.body.touching.down) {
						this.player.changeDirectionInverval = this.game.time.now + 40;
					} else {
						this.player.changeDirectionInverval = -1;
					}
				}

				if (this.game.time.now > this.player.changeDirectionInverval) {
					this.player.body.velocity.x = this.player.speed;
				}

				this.player.playerDirection = 'right';
				this.player.direction = 1;
				this.player.animations.play('walk');

				this.player.downHit = false;
			} else if (this.cursors.down.isDown && this.player.body.touching.down) {
				this.player.body.velocity.x = 0;
				this.player.animations.stop();
				this.player.frame = 6;
				this.player.downHit = true;
			} else {
				if (vx > 0) {
					this.player.body.velocity.x = Math.max(0, vx - 15);
				} else if (vx < 0) {
					this.player.body.velocity.x = Math.min(0, vx + 15);
				} else {
					this.player.animations.stop();
					this.player.frame = 0;
				}
				this.player.downHit = false;
			}

			if (this.jumpButton.isDown && !this.cursors.down.isDown && this.player.body.touching.down && this.game.time.now > this.jumpTime) {
				this.player.body.velocity.y = -400;
				this.jumpTime = this.game.time.now + 800;
			}
		},

		update : function() {
			if (this.game.physics.arcade.isPaused) return;

			this.collisions();
			this.movePlayer();

			if (this.fireButton.isDown) {
				this.player.fire();
			}

			if (this.isBossLevel) {
				if (this.boss != null && !this.boss.alive) {
					this.killedBoss();
				}
			}
		},

		collisions : function() {
			//MAP - UNITS
			this.game.physics.arcade.collide(this.platforms, this.enemies);
			this.game.physics.arcade.collide(this.floor, this.enemies);

			this.game.physics.arcade.collide(this.exit, this.platforms);
			this.game.physics.arcade.collide(this.exit, this.floor);

			this.game.physics.arcade.collide(this.stars, this.platforms);
			this.game.physics.arcade.collide(this.stars, this.floor);

			this.game.physics.arcade.collide(this.platforms, this.player, function(player, plt){
				if (plt.fall && (player.y < plt.y) && (player.x > plt.x - plt.width/2) && (player.x < plt.x + plt.width/2)) {
					plt.body.immovable = false;
					plt.body.velocity.y = 100;
				}
			}, null, this);
			this.game.physics.arcade.collide(this.floor, this.player, null, null, this);

			//BULLETS - MAP
			this.game.physics.arcade.overlap(this.bombs, this.platforms, this.explodeBomb, null, this);
			this.game.physics.arcade.overlap(this.bombs, this.floor, this.explodeBomb, null, this);

			this.game.physics.arcade.overlap(this.player.currentWeapon, this.platforms, this.killBullet, null, this);
			this.game.physics.arcade.overlap(this.player.currentWeapon, this.floor, this.killBullet, null, this);

			//BULLETS - ENEMIES
			this.game.physics.arcade.overlap(this.player.currentWeapon, this.enemies, this.hitEnemy, null, this);

			//PLAYER
			this.game.physics.arcade.overlap(this.player, this.bombs, this.hitBomb, null, this);
			this.game.physics.arcade.overlap(this.player, this.enemies, this.hitPlayer, null, this);
			this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

			this.game.physics.arcade.overlap(this.player, this.exit, this.nextLevel, null, this);

			if (this.isBossLevel) {
				this.game.physics.arcade.collide(this.boss, this.floor, null, null, this);
				this.game.physics.arcade.overlap(this.boss, this.player.currentWeapon, this.hitBoss, null, this);
				this.game.physics.arcade.overlap(this.player, this.boss, this.hitPlayer, null, this);
			}
		},

		nextLevel: function() {
			var stars = this.player.stars;
			var nextLvl = currentLevel+1;
			var next = getState(stars, nextLvl);
			this.game.state.add(''+nextLvl, next);
			this.game.state.start(''+nextLvl);
		},

		killedBoss: function() {
			// Tocar musiquinha, etc
			this.nextLevel();
		},

		hitBoss: function(target, bullet) {
			target.damage(bullet.damage);
			bullet.kill();
		},

		changeWeapon : function() {
			this.player.changeWeapon();
		},

		collectStar: function(p, s) {
			s.kill();
			this.player.collectStar();
		},

		hitPlayer : function(player, enemy) {
			if ((!player.downHit && player.y  > enemy.y) || (player.downHit && enemy.y + enemy.height >= player.y - player.height/2)) {
				if (enemy.isBoss) {
					enemy.hitPlayer();
				}

				this.player.animations.play('hit', null, false, true);
				this.player.damage(enemy.attack);
				this.checkGameOver();
			}
		},

		bulletHitPlayer : function(player, enemy) {
			if ((!player.downHit && player.y  > enemy.y) || (player.downHit && enemy.y + enemy.height >= player.y - player.height/2)) {
				enemy.kill();
				this.player.animations.play('hit', null, false, true);
				this.player.damage(1);
				this.checkGameOver();
			}
		},

		hitBomb : function(player, bomb) {
			bomb.kill();
			this.player.damage(1);
			this.checkGameOver();
		},

		killBullet : function(bullet) {
			bullet.kill();
		},

		explodeBomb: function(bomb) {
			var e = this.game.add.sprite(bomb.x, bomb.y, 'explosion');
			e.animations.add('explode', [0, 1, 2, 3, 21, 22], 20, false);
			e.animations.play('explode', null, false, true);
			bomb.kill();
		},

		fire : function() {
			this.player.fire();
		},

		hitEnemy : function(bullet, target) {
			target.damage(bullet.damage);
			bullet.kill();
		},

		checkGameOver : function() {
			if (this.player.HP < 1) {
				this.restartLevel();
			}
		},

		loadLevel: function() {
			if (this.levelNameBackground) this.levelNameBackground.destroy();
			if (this.levelName) this.levelName.destroy();

			var level = this.level;

			this.player.stars = starsCount;
			this.player.updateStars();

			this.levelNameBackground = this.game.add.image(this.game.world.width/2, 30 * scale, 'level_name_background');
			this.levelNameBackground.anchor.setTo(0.5, 0.5);

			this.levelName = this.game.add.text(this.game.world.width/2, 35 * scale, level.name, {
				font : (25 * scale) + 'px "Arial"',
				fill : '#000000',
			});
			this.levelName.anchor.setTo(0.5, 0.5);

			this.loadPlatforms(level.platformsList);

			this.loadEnemies(level.enemiesList);

			if (level.enemiesList.hasOwnProperty('boss')) {
				this.loadBoss(level.enemiesList.boss);
			}

			this.loadStars(level.starsList);

			if (level.exit != undefined) {
				this.exit.reset(level.exit.x, level.exit.y);
				this.exit.anchor.setTo(0.5, 1);
				this.exit.scale.x = level.exit.scale;
			} else {
				this.exit.kill();
			}
		},

		loadBoss: function(boss) {
			var bossToy = new BossToy(boss.x, boss.y, this.game, boss.hp, boss.sprite);
			this.boss = bossToy;
			this.isBossLevel = true;
		},

		loadPlatforms: function(platformsList) {
			this.platforms.forEachAlive(function(p) {
				p.kill();
			});

			for(var i = 0; i < platformsList.length; i++) {
				var plt = platformsList[i];
				var p = this.platforms.getFirstDead();
				if (p != null) {
					p.reset(plt.x, plt.y);
					p.anchor.setTo(0.5, 0.5);
					p.width *= plt.width;
					this.game.physics.arcade.enable(p);
					p.body.immovable = true;
					p.body.allowGravity = false;
					p.body.collideWorldBounds = true;
					p.fall = plt.fall;
				}
			}
		},

		loadEnemies: function(enemiesList) {
			this.enemies.forEachAlive(function(e) {
				e.kill();
			});

			for (var i = 0; enemiesList.walkers != undefined && i < enemiesList.walkers.length; i++) {
				var w = enemiesList.walkers[i];
				this.enemies.add(new EnemyWalker(w.x, w.y, this.game, w.sprite, w.hp));
			}

			for (var i = 0; enemiesList.shooters != undefined && i < enemiesList.shooters.length; i++) {
				var w = enemiesList.shooters[i];
				this.enemies.add(new EnemyShooter(w.x, w.y, this.game, w.sprite, w.hp, w.shootPeriod));
			}

			for (var i = 0; enemiesList.flyers != undefined && i < enemiesList.flyers.length; i++) {
				var w = enemiesList.flyers[i];
				this.enemies.add(new EnemyFlyer(w.x, w.y, this.game, w.sprite, w.hp, w.isDropper, w.dropPeriod, w.leftAnimation, w.rightAnimation, w.lhitAnimation, w.rhitAnimation));
			}
		},

		loadStars: function(starsList) {

			this.stars.forEachAlive(function(s) {
				s.kill();
			});

			for (var i = 0; i < starsList.length; i++) {
				var st = starsList[i];
				var s = this.stars.getFirstDead();
				if (s != null) {
					s.reset(st.x, st.y);
					s.animations.add('move', [0, 1, 2, 3], 8, true);
					this.game.physics.arcade.enable(s);
					s.body.allowGravity = true;
					s.animations.play('move');
				}
			}
		}
	};

	return main;
}

game.state.add('load', {
	preload : function() {
		//ENEMIES
		this.game.load.spritesheet('Tick', 'assets/enemies/Tick41x50.png', 50, 41);
		this.game.load.spritesheet('BrownTeddy', 'assets/enemies/BrownTeddy55x55.png', 55, 55);
		this.game.load.spritesheet('PandaTeddy', 'assets/enemies/PandaTeddy55x55.png', 55, 55);
		this.game.load.spritesheet('DirtyRatz', 'assets/enemies/DirtyRatz52x70.png', 70, 52);
		this.game.load.spritesheet('Helly', 'assets/enemies/Helly70x60.png', 60, 70);
		this.game.load.spritesheet('Planey', 'assets/enemies/Planey45x70.png', 70, 45);
		this.game.load.spritesheet('ToyTrojan', 'assets/enemies/ToyTrojan130x160.png', 160, 130);

		//PLAYERS
		this.game.load.spritesheet('Danny', 'assets/players/Danny70x70.png', 70, 70);
		this.game.load.spritesheet('Jessie', 'assets/players/Jessie70x70.png', 70, 70);

		//NPC
		this.game.load.spritesheet('Lucas', 'assets/npcs/Lucas75x55.png', 55, 75);

		//ITEMS
		this.game.load.spritesheet('Coin', 'assets/items/Money24x25.png', 25, 24);

		//MAP
		this.game.load.image('bg1', 'assets/map/bg1.jpg');
		this.game.load.image('bg2', 'assets/map/bg2.jpg');
		this.game.load.image('bg3', 'assets/map/bg3.png');
		this.game.load.image('platform', 'assets/map/platform.png');

		//BULLETS
		this.game.load.spritesheet('bullet', 'assets/bullets/Apples30x30.png', 30, 30);
		this.game.load.spritesheet('bullet2', 'assets/bullets/Balls30x30.png', 30, 30);
		this.game.load.spritesheet('bomb', 'assets/bullets/Bombs60x35.png', 35, 60);
		this.game.load.image('bulletEnemy', 'assets/bullets/bullet2.png');

		//EFFECT
		this.game.load.spritesheet('explosion', 'assets/effects/explosion.png', 64, 64);

		//SOUND
		//


		//UI
		this.game.load.image('heart_empty', 'assets/UI/UI_HEART_EMPTY.png');
		this.game.load.image('heart_half', 'assets//UI/UI_HEART_HALF.png');
		this.game.load.image('heart_full', 'assets/UI/UI_HEART_FULL.png');
		this.game.load.image('level_name_background', 'assets/UI/UI_INPUT.png');
		this.game.load.image('mute', 'assets/UI/SYMB_MUTE.png');
		this.game.load.image('unmute', 'assets/UI/SYMB_VOLUME.png');
		this.game.load.image('pause', 'assets/UI/SYMB_PAUSE.png');
		this.game.load.image('play', 'assets/UI/SYMB_PLAY.png');
		this.game.load.image('replay', 'assets/UI/SYMB_REPLAY.png');
		this.game.load.image('loading', 'assets/UI/loading.png');
		this.game.load.image('loading2', 'assets/UI/loading2.png');
		this.game.load.image('pause_texture', 'assets/UI/pause_texture.png');

	},
	update: function() {
		this.game.state.add('0', getState(0, 0));
		this.game.state.start('0');
	}
});

game.state.start('load');
