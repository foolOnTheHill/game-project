"use strict";

var height = Math.min(window.innerHeight, 650);
var width = Math.round(2.07 * height);

var scale = height / 650;

var main = {
	preload : function() {
		this.game.load.spritesheet('Tick', 'assets/enemies/Tick41x50.png', 50, 41);
		this.game.load.spritesheet('BrownTeddy', 'assets/enemies/BrownTeddy55x55.png', 55, 55);
		this.game.load.spritesheet('PandaTeddy', 'assets/enemies/PandaTeddy55x55.png', 55, 55);
		this.game.load.spritesheet('DirtyRatz', 'assets/enemies/DirtyRatz52x70.png', 70, 52);
		this.game.load.spritesheet('Helly', 'assets/enemies/Helly70x60.png', 60, 70);
		this.game.load.spritesheet('Planey', 'assets/enemies/Planey45x70.png', 70, 45);

		this.game.load.spritesheet('Danny', 'assets/Danny70x70.png', 70, 70);
		this.game.load.spritesheet('Jessie', 'assets/Jessie70x70.png', 70, 70);

		this.game.load.spritesheet('Lucas', 'assets/Lucas75x55.png', 55, 75);

		this.game.load.spritesheet('Coin', 'assets/Money24x25.png', 25, 24);

		this.game.load.image('platform', 'assets/platform.png');
		//this.game.load.image('bullet', 'assets/bullet.png');

		this.game.load.image('sky', 'assets/test/sky.png');
		this.game.load.image('ground', 'assets/test/platform.png');

		this.game.load.spritesheet('bullet', 'assets/Apples30x30.png', 30, 30);
		this.game.load.spritesheet('bomb', 'assets/Bombs60x35.png', 35, 60);

		this.game.load.image('bullet2', 'assets/test/bullet2.png');
		this.game.load.image('player', 'assets/test/player.png');
		this.game.load.image('enemy', 'assets/test/enemy.png');

		this.game.load.spritesheet('explosion', 'assets/explosion.png', 64, 64);
	},

	create : function() {
		//SETTINGS
		this.game.world.setBounds(0, 0, width * scale, height * scale);
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 750;

		//BACKGROUND SPRITE
		var background = this.game.add.sprite(0, 0, 'sky');
		background.scale.setTo(2, 2);

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

		// WEAPONS
		this.weapons = [];
		this.weapons.push(new Weapon.Basic(this.game, 'bullet'));
		this.weapons.push(new Weapon.Cannon(this.game, 'bullet'));

		//PLAYER
		this.player = new Player(10, this.game.world.height - 70 * scale, this.game, 'Jessie', scale, 5);
		this.player.weapon1 = this.weapons[0];
		this.player.weapon2 = this.weapons[1];
		this.player.currentWeapon = this.weapons[0];

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
		var Tick = new EnemyShooter(this.game.world.width / 2 - 25, this.game.world.height - 390, this.game, 'Tick', 2, 800);
		var Teddy = new EnemyWalker(this.game.world.width / 2, this.game.world.height - 100, this.game, 'BrownTeddy', 5);
		var Helly = new EnemyFlyer(20, this.game.world.height / 2 - 110, this.game, 'Helly', 5, false, 800, /*[0, 1], [2, 3],*/[0, 1], [8, 9], [16, 17, 18, 19, 20]);//[4, 5, 6, 7, 8, 9]);
		var enemiesList = [Tick, Teddy, Helly];

		var p1 = new Platform(this.game.world.width / 2, this.game.world.height - 162, 1, false);
		var p2 = new Platform(this.game.world.width / 2, this.game.world.height - 299, 1, false);
		var p3 = new Platform(this.game.world.width / 2 + 350, this.game.world.height - 259, 0.7, false);
		var p4 = new Platform(this.game.world.width / 2 - 425, this.game.world.height - 339, 0.6, false);
		var platformsList = [p1, p2, p3, p4];

		var star1 = new Star(10, 10);
		var starsList = [star1];

		var exit = new Exit(this.game.world.width / 2 - 445, this.game.world.height - 469, -1);

		var level = new Level(platformsList, enemiesList, starsList, [], exit);

		this.loadLevel(level);

		//
		this.bulletTime = this.game.time.now + 200;
		this.jumpTime = this.game.time.now + 300;
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

		if (this.cursors.left.isDown) {
			this.player.body.velocity.x = -250;

			if (this.player.direction == 1) {
				this.player.scale.x *= -1;
			}

			this.player.playerDirection = 'left';
			this.player.direction = -1;
			this.player.animations.play('walk');

			this.player.downHit = false;
		} else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = 250;

			if (this.player.direction == -1) {
				this.player.scale.x *= -1;
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

		this.collisions();
		this.movePlayer();

		if (this.fireButton.isDown) {
			this.player.fire();
		}
	},

	collisions : function() {
		//MAP - UNITS
		this.game.physics.arcade.collide(this.platforms, this.enemies);
		this.game.physics.arcade.collide(this.floor, this.enemies);

		this.game.physics.arcade.collide(this.exit, this.platforms);
		this.game.physics.arcade.collide(this.exit, this.floor);

		this.game.physics.arcade.collide(this.platforms, this.player, function(player, plt){
			if (plt.fall && (player.y < plt.y) && (player.x > plt.x - plt.width/2) && (player.x < plt.x + plt.width/2)) {
				plt.body.immovable = false;
				plt.body.velocity.y = 100;
			}
		}, null, this);
		this.game.physics.arcade.collide(this.floor, this.player, null, null, this);

		//BULLETS - MAP
		this.game.physics.arcade.collide(this.bombs, this.platforms, this.explodeBomb, null, this);
		this.game.physics.arcade.collide(this.bombs, this.floor, this.explodeBomb, null, this);

		this.game.physics.arcade.collide(this.player.currentWeapon, this.platforms, this.killBullet, null, this);
		this.game.physics.arcade.collide(this.player.currentWeapon, this.floor, this.killBullet, null, this);

		//BULLETS - ENEMIES
		game.physics.arcade.overlap(this.player.currentWeapon, this.enemies, this.hitEnemy, null, this);

		//PLAYER
		this.game.physics.arcade.overlap(this.player, this.bombs, this.hitBomb, null, this);
		this.game.physics.arcade.overlap(this.player, this.enemies, this.hitPlayer, null, this);
	},

	changeWeapon : function() {
		this.player.changeWeapon();
	},

	hitPlayer : function(player, enemy) {
		if ((!player.downHit && player.y  > enemy.y) || (player.downHit && enemy.y + enemy.height >= player.y - player.height/2)) {
			enemy.damage(0);
			this.player.animations.play('hit', null, false, true);
			this.player.damage(1);
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
			this.restart();
		}
	},

	restart : function() {
		this.game.state.restart();
	},

	loadLevel: function(level) {
		this.loadPlatforms(level.platformsList);
		this.loadEnemies(level.enemiesList);

		this.exit.reset(level.exit.x, level.exit.y);
		this.exit.anchor.setTo(0.5, 1);
		this.exit.scale.x = level.exit.scale;
	},

	loadPlatforms: function(platformsList) {
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
		for (var i = 0; i < enemiesList.length; i++) {
			this.enemies.add(enemiesList[i]);
		}
	},

	loadStars: function(starsList) {
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

console.log('Height ' + height);
console.log('Width ' + width);

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game_div');
game.state.add('main', main);
game.state.start('main');
