"use strict";

var height = 650;
var width = 1346;

var scale = height / 650;

console.log('Height ' + height);
console.log('Width ' + width);

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game_div');

var player;

var boy = false;
var girl = false;

function getState(starsCount, currentBullets, currentHP, currentLevel) {

	var levels = levels_list;

	var main = {
		create : function() {
			// SOUND
			this.game.sound.mute = false;

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

			this.game.bombs = this.bombs;

			// ENEMIES
			this.enemies = this.game.add.group();

			//ITEMS
			this.items = this.game.add.group();

			// EXIT
			this.exit = new EnemyStatic(0, 0, this.game, 'Lucas', 0);

			// LEVEL
			this.level = levels[currentLevel];

			// WEAPONS
			this.weapons = [];
			this.weapons.push(new Weapon.Basic(this.game, 'bullet'));
			this.weapons.push(new Weapon.Cannon(this.game, 'bullet2'));

			//PLAYER
			var playerSprite = boy ? 'Danny' : 'Jessie';
			this.player = new Player(this.level.playerX, this.level.playerY, this.game, playerSprite, scale, 6);
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

			this.isMute = true;
			this.muteButton = this.game.add.image(this.game.world.width - 65, this.game.world.height - 76, 'unmute');
			this.muteButton.scale.setTo(0.6	, 0.6);
			this.muteButton.inputEnabled = true;
			this.muteButton.events.onInputDown.add(this.mute, this);
		},

		mute: function() {
			if (this.isMute) {
				this.game.bgs.volume = 0;
				this.muteButton.loadTexture('mute');
			} else {
				this.game.bgs.volume = 1;
				this.muteButton.loadTexture('unmute');
			}
			this.isMute = !this.isMute;
		},

		restartLevel: function() {
			if (this.player.low_hp.isPlaying) {
				this.player.low_hp.stop();
			}
			this.game.state.restart();
		},

		pauseGame: function() {
			 this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;
			 if (this.game.physics.arcade.isPaused) {
				 this.pauseButton.loadTexture('play');
				 this.pause_texture.visible = true;
			 } else {
				 this.pauseButton.loadTexture('pause');
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
				this.game.jump_sound.play();

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

			this.game.physics.arcade.collide(this.items, this.platforms);
			this.game.physics.arcade.collide(this.items, this.floor);

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
			this.game.physics.arcade.overlap(this.player, this.items, this.pickItem, null, this);

			this.game.physics.arcade.overlap(this.player, this.exit, this.nextLevel, null, this);

			if (this.isBossLevel) {
				this.game.physics.arcade.collide(this.boss, this.floor, null, null, this);
				this.game.physics.arcade.overlap(this.boss, this.player.currentWeapon, this.hitBoss, null, this);
				this.game.physics.arcade.overlap(this.player, this.boss, this.hitPlayer, null, this);
			}
		},

		nextLevel: function() {
			var stars = this.player.stars;
			var bullets = [this.player.weapon1.bullets, this.player.weapon2.bullets];
			var hp = [this.player.HP, this.player.MAX_HP];
			console.log(hp);
			var nextLvl = currentLevel+1;
			var next = getState(stars, bullets, hp, nextLvl);
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
			this.game.explosion.play();
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
			this.game.explosion.play();
			bomb.kill();
		},

		fire : function() {
			this.player.fire();
		},

		hitEnemy : function(bullet, target) {
			this.game.enemy_hit.play();
			target.damage(bullet.damage);
			bullet.kill();
		},

		checkGameOver : function() {
			if (this.player.HP < 1) {
				if (this.player.low_hp.isPlaying) {
					this.player.low_hp.stop();
				}
				this.game.sound.mute = true;
				this.game.state.start('gameOver');
			}
		},

		pickItem : function(player, item) {
			if (item.type == 'first aid') {
				this.player.recover(2);
			} else if (item.type == 'defense') {
				this.player.powerUp('defense');
			} else if (item.type == 'speed') {
				this.player.powerUp('speed');
			} else if (item.type == 'heart') {
				this.player.upgradeHP();
			} else if (item.type == 'apples') {
				this.player.weapon1.bullets += 15;
				this.player.updateBullets();
			} else if (item.type == 'balls') {
				this.player.weapon2.bullets += 3;
				this.player.updateBullets();
			}
			item.kill();
		},

		loadLevel: function() {
			if (this.levelNameBackground) this.levelNameBackground.destroy();
			if (this.levelName) this.levelName.destroy();

			var level = this.level;

			this.player.stars = starsCount;
			this.player.updateStars();

			this.player.weapon1.bullets = currentBullets[0];
			this.player.weapon2.bullets = currentBullets[1];
			this.player.updateBullets();

			for (var i = 0; i < (currentHP[1] - 6) / 2; i++) {
				this.player.upgradeHP();
			}

			this.player.HP = currentHP[0];
			this.player.updateHearts();

			this.levelNameBackground = this.game.add.image(this.game.world.width/2, 30 * scale, 'level_name_background');
			this.levelNameBackground.anchor.setTo(0.5, 0.5);

			this.levelName = this.game.add.text(this.game.world.width/2, 35 * scale, level.name, {
				font : (25 * scale) + 'px "Arial"',
				fill : '#000000',
			});
			this.levelName.anchor.setTo(0.5, 0.5);

			this.loadPlatforms(level.platformsList);

			this.loadEnemies(level.enemiesList);

			this.loadItems(level.itensList);

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
			this.game.bgs.stop();
			this.game.bgs = this.game.add.audio('boss-theme');
			this.game.bgs.loop = true;
			this.game.bgs.volume = 0.8;
			this.game.bgs.play();

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

		loadItems: function(itemList) {
			for (var i = 0; itemList != undefined && i <  itemList.length; i++) {
				var w = itemList[i];
				if (w.type == 'apples') {
					this.items.add(new ItemType(w.x, w.y, this.game, w.type, 'bullet'));
				} else if (w.type == 'balls') {
					this.items.add(new ItemType(w.x, w.y, this.game, w.type, 'bullet2'));
				} else {
					this.items.add(new ItemType(w.x, w.y, this.game, w.type, 'items'));
				}
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
};

game.state.add('boot', {
	preload: function() {
		this.game.load.image('loading', 'assets/UI/loading.png');
		this.game.load.image('loading2', 'assets/UI/loading2.png');
	},
	create: function() {
		this.game.state.start('load');
	}
});

game.state.add('load', {
	preload : function() {

		var preloading2 = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'loading2');
		preloading2.x -= (preloading2.width)/2;

		var preloading = this.game.add.sprite((this.game.world.width/2), (this.game.world.height/2)+4, 'loading');
		preloading.x -= (preloading.width)/2;

		this.game.load.setPreloadSprite(preloading);

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
		this.game.load.spritesheet('items', 'assets/items/Consumable Items30x30.png', 30, 30);

		//MAP
		this.game.load.image('bg1', 'assets/map/bg1.jpg');
		this.game.load.image('bg2', 'assets/map/bg2.jpg');
		this.game.load.image('bg3', 'assets/map/bg3.png');
		this.game.load.image('platform', 'assets/map/platform.png');

		//BULLETS
		this.game.load.spritesheet('bullet', 'assets/bullets/Apples30x30.png', 30, 30);
		this.game.load.spritesheet('bullet2', 'assets/bullets/Balls30x30.png', 30, 30);
		this.game.load.spritesheet('bomb', 'assets/bullets/Bombs60x35.png', 35, 60);
		this.game.load.spritesheet('bulletEnemy', 'assets/bullets/TickShot15x15.png', 15, 15);


		//EFFECT
		this.game.load.spritesheet('explosion', 'assets/effects/explosion.png', 64, 64);

		//SOUND
		this.game.load.audio('coin-sound', 'assets/sounds/coin.mp3');
		this.game.load.audio('powerup', 'assets/sounds/powerup.wav');
		this.game.load.audio('enemy-hit', 'assets/sounds/enemy_hit.wav');
		this.game.load.audio('player-hit', 'assets/sounds/hit.wav');
		this.game.load.audio('jump', 'assets/sounds/jump.wav');
		this.game.load.audio('bomb-explosion', 'assets/sounds/explosion.wav');
		this.game.load.audio('low-hp', 'assets/sounds/low_hp.wav');
		this.game.load.audio('level-theme', 'assets/sounds/spring-yard-zone.mp3');
		this.game.load.audio('boss-theme', 'assets/sounds/final-boss-theme.mp3');
		this.game.load.audio('boss-dash', 'assets/sounds/boss-dash.wav');
		this.game.load.audio('throw', 'assets/sounds/throw.mp3');

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
		this.game.load.image('pause_texture', 'assets/UI/pause_texture.png');
		this.game.load.image('text_start', 'assets/UI/TEXT_START.png');
		this.game.load.image('text_next', 'assets/UI/TEXT_NEXT.png');
		this.game.load.image('logo', 'assets/UI/beat_em_mall.png');

		this.game.load.image('moves_tutorial', 'assets/tutorials/moves_tutorial.png');
		this.game.load.image('itens_tutorial', 'assets/tutorials/itens_tutorial.png');
		this.game.load.image('tutorial_bg', 'assets/tutorials/tuto_bg.png');
		this.game.load.image('text_box', 'assets/tutorials/text_box.png');
	},
	create: function() {
		this.game.bgs = this.game.add.sound('level-theme');
		this.game.bgs.loop = true;

		this.game.boss_theme = this.game.add.sound('boss-theme');
		this.game.boss_theme.loop = true;

		this.game.jump_sound = this.game.add.sound('jump');
		this.game.explosion = this.game.add.sound('bomb-explosion');
		this.game.enemy_hit = this.game.add.sound('enemy-hit');
	},
	update: function() {
		this.game.state.start('start');
	}
});

game.state.add('start', {
	create: function() {
		this.game.stage.backgroundColor = 0xB3A82D;//0xeefa32;

		this.logo = this.game.add.image(this.game.world.width/2, this.game.world.height/2 - 50, 'logo');
		this.logo.scale.setTo(0.4, 0.4);
		this.logo.anchor.setTo(0.5, 0.5);
		this.game.add.tween(this.logo.scale).to({ x: 0.45, y: 0.45 }, 200).to({ x: 0.4, y: 0.4 }, 200).loop().start();

		this.start_text = this.game.add.image(this.game.world.width/2, this.game.world.height - 100, 'text_start');
		this.start_text.anchor.setTo(0.5, 0.5);
		this.start_text.scale.setTo(0.8, 0.8);
		this.game.add.tween(this.start_text).to({ angle:1.5 }, 200).to({ angle:-1.5 }, 200).loop().start();

		this.start_text.inputEnabled = true;
		this.start_text.events.onInputDown.add(this.startGame, this);
	},
	startGame: function() {
		this.game.state.start('createPlayer');
	},
});

game.state.add('createPlayer', {
	create: function() {
		this.game.stage.backgroundColor = 0xB3A82D;//0xeefa32;

		this.bg = this.game.add.image(0, 0, 'tutorial_bg');
		this.bg.scale.setTo(2, 1);

		this.buffer = [
			"Hey...",
			"Hey...",
			"HEY!",
			"Wake up!",
			"Hello.",
			"My name is Lucas.",
			"I'm here to help you.",
			"A evil magician named Orietnom Leafar is attempting to take control of this world,",
			"your world,",
			"by using it's children as his army.",
			"His first strike was, sadly to you, here, at the Maple Shopping Mall.",
			"He took all the children from their parents.",
			"Only you,",
			"for some reason,",
			"escaped.",
			"You fainted after the explosion.",
			"I fought Orietnom many times in the past,",
			"in many other worlds.",
			"But, now, I am too old and weak.",
			"You must help me defeat Orietnom once again.",
			"I will be your guide.",
			"Follow me."
		];
		this.currentText = 0;

		this.boySelected = false;
		this.girlSelected = false;
		this.story = false;
		this.storyCompleted = false;

		this.addBoyOrGirl();
	},

	playStory: function() {
		if (!this.storyText) {
			this.text_box = this.game.add.image(50, this.game.world.height/2 - 250, 'text_box');
			this.text_box.width = 910;

			this.next_btn = this.game.add.image(795, this.game.world.height/2 + 75, 'text_next');
			this.next_btn.scale.setTo(0.7, 0.7);

			this.next_btn.inputEnabled = true;
			this.next_btn.events.onInputDown.add(function() {
				this.game.add.tween(this.next_btn.scale).to({ x:0.5, y:0.5 }, 100).to({x:0.7, y:0.7}, 100).start();
				this.playStory();
			}, this);

			var style = { font: 'bold 60px Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 850 };
			this.storyText = this.game.add.text(100, this.game.world.height/2 - 50, '', style);
			this.storyText.anchor.setTo(0, 0.5);
			this.storyText.setShadow(1, 1, '#000000', 5);

			this.story = true;
		}
		if (this.currentText >= this.buffer.length) {
			this.storyCompleted = true;
		} else {
			this.storyText.text = this.buffer[this.currentText];
			this.currentText += 1;
		}
	},

	addLucas: function() {
		this.lucas = this.game.add.image(this.game.world.width/2 + 500, this.game.world.height/2 - 50, 'Lucas');
		this.lucas.anchor.setTo(0.5, 0.5);
		this.lucas.scale.setTo(5, 5);
		this.lucas.animations.add('blink', [0, 1], 0.8, true);
		this.lucas.play('blink');

		this.playStory();
	},

	addBoyOrGirl: function() {
		this.question = this.game.add.text(this.game.world.width/2, 80, 'Are you a boy or a girl?', {
			font : '70px "Arial"',
			fill : '#FFFFFF'
		});
		this.question.anchor.setTo(0.5, 0.5);
		this.question.setShadow(1, 1, '#000000', 5);

		this.boy = this.game.add.image(this.game.world.width/2 - 210, this.game.world.height/2, 'Danny');
		this.boy.animations.add('walk', [1, 2, 3, 2], 8, true);
		this.boy.anchor.setTo(0.5, 0.5);
		this.boy.scale.setTo(4, 4);
		this.boy.animations.play('walk');

		this.boy.inputEnabled = true;
		this.boy.events.onInputDown.add(function() {
			this.boySelected = true;
		}, this);

		this.girl = this.game.add.image(this.game.world.width/2 + 300, this.game.world.height/2, 'Jessie');
		this.girl.animations.add('walk', [1, 2, 3, 2], 8, true);
		this.girl.scale.setTo(4, 4);
		this.girl.anchor.setTo(0.5, 0.5);
		this.girl.animations.play('walk');

		this.girl.inputEnabled = true;
		this.girl.events.onInputDown.add(function() {
			this.girlSelected = true;
		}, this);
	},

	update: function() {
		if ((this.boySelected || this.girlSelected) && !this.story && !this.storyCompleted) {
			this.question.destroy();
			this.boy.destroy();
			this.girl.destroy();
			this.addLucas();
		} else if (this.storyCompleted) {
			this.startGame();
		}
	},

	startGame: function() {
		boy = this.boy;
		girl = this.girl;
		this.game.state.start('tutorials');
	}
});

game.state.add('tutorials', {
	create: function() {
		this.game.stage.backgroundColor = 0xB3A82D;

		this.tutorialId = 0;

		this.tutorialImg = this.game.add.image(this.game.world.width/2, this.game.world.height/2, 'moves_tutorial');
		this.tutorialImg.anchor.setTo(0.5, 0.5);

		if (boy) {
			this.player = this.game.add.image(this.game.world.width/2 - 90, this.game.world.height/2 - 110, 'Danny');
		} else {
			this.player = this.game.add.image(this.game.world.width/2 - 90, this.game.world.height/2 - 110, 'Jessie');
		}
		this.player.animations.add('walk', [1, 2, 3, 2], 8, true);
		this.player.anchor.setTo(0.5, 0.5);
		this.player.scale.setTo(2, 2);
		this.player.animations.play('walk');

		if (boy) {
			this.jumper = this.game.add.image(this.game.world.width/2 + 90, this.game.world.height/2 - 110, 'Danny');
		} else {
			this.jumper = this.game.add.image(this.game.world.width/2 + 90, this.game.world.height/2 - 110, 'Jessie');
		}
		this.jumper.anchor.setTo(0.5, 0.5);
		this.jumper.scale.setTo(-2, 2);
		this.game.add.tween(this.jumper).to({y: this.game.world.height/2 - 210}, 500).to({y: this.game.world.height/2 - 110}, 400).loop().start();

		this.nextButton = this.game.add.image(this.game.world.width/2, this.game.world.height - 70, 'text_next');
		this.nextButton.anchor.setTo(0.5, 0.5);
		this.nextButton.inputEnabled = true;
		this.nextButton.events.onInputDown.add(function() {
			this.game.add.tween(this.nextButton.scale).to({ x:0.8, y:0.8 }, 100).to({x:1, y:1}, 100).start();
			if (this.tutorialId == 0) {
				this.tutorialImg.loadTexture('itens_tutorial');
				this.nextButton.loadTexture('text_start');
				this.player.destroy();
				this.jumper.destroy();
				this.tutorialId += 1;
			} else {
				this.startGame();
			}
		}, this);
	},

	startGame: function() {
		this.game.bgs.play();

		this.game.state.add('0', getState(0, [30, 5], [6, 6], 0));
		this.game.state.start('0');
	}
});

game.state.add('gameOver', {
	create: function() {
		var style = { font: 'bold 60px Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 850 };
		this.game_over = this.game.add.text(this.game.world.width/2, this.game.world.height/2 - 50, 'Game Over!', style);
		this.game_over.anchor.setTo(0.5, 0.5);
		this.game_over.setShadow(1, 1, '#000000', 5);

		this.restart = this.game.add.image(this.game.world.width/2, this.game.world.height/2 + 70, 'replay');
		this.restart.anchor.setTo(0.5, 0.5);
		this.restart.inputEnabled = true;
		this.restart.events.onInputDown.add(this.startGame, this);
	},
	startGame: function() {
		this.game.state.start('tutorials');
	}
});

game.state.start('boot');
