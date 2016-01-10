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

		this.game.load.spritesheet('Coin', 'assets/Money24x25.png', 25, 24);

		this.game.load.image('platform', 'assets/platform.png');
		//this.game.load.image('bullet', 'assets/bullet.png');

		this.game.load.image('sky', 'assets/test/sky.png');
		this.game.load.image('ground', 'assets/test/platform.png');

		this.game.load.image('bullet', 'assets/test/bullet.png');
		this.game.load.image('bullet2', 'assets/test/bullet2.png');
		this.game.load.image('player', 'assets/test/player.png');
		this.game.load.image('enemy', 'assets/test/enemy.png');

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
		this.positions = [[this.game.world.width / 2, this.game.world.height - 162, 1], [this.game.world.width / 2, this.game.world.height - 299, 1], [this.game.world.width / 2 + 350, this.game.world.height - 259, 0.7], [this.game.world.width / 2 - 425, this.game.world.height - 339, 0.6]];
		this.setPlatforms(this.positions);

		this.weapons = [];

		this.weapons.push(new Weapon.Basic(this.game, 'bullet'));
		this.weapons.push(new Weapon.Cannon(this.game, 'bullet2'));

		//PLAYER
		this.player = new Player(10, this.game.world.height - 70 * scale, this.game, 'Jessie', scale);
		this.player.weapon1 = this.weapons[0];
		this.player.weapon2 = this.weapons[1];
		this.player.currentWeapon = this.weapons[0];

		//CAMERA
		this.game.camera.follow(this.player, Phaser.Camera.FOLLOW);

		//HOTKEYS
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		changeWeaponButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
		changeWeaponButton.onDown.add(this.changeWeapon, this);

		//ENEMIES
		this.enemiesTick = this.game.add.group();
		this.enemyTick = new EnemyStatic(this.game.world.width / 2 - 25, this.game.world.height - 390, this.game, 'Tick');
		this.enemiesTick.add(this.enemyTick);

		this.enemiesTeddy = this.game.add.group();
		var enemyTeddy = new EnemyWalker(this.game.world.width / 2, this.game.world.height - 100, this.game, 'BrownTeddy');
		this.enemiesTeddy.add(enemyTeddy);

		enemyTeddy = new EnemyWalker(200, this.game.world.height - 100, this.game, 'BrownTeddy');
		this.enemiesTeddy.add(enemyTeddy);

		this.enemiesPlaney = this.game.add.group();
		var enemyPlaney = new EnemyFlyer(20, this.game.world.height / 2 - 110, 800, this.game, 'Planey');
		this.enemiesPlaney.add(enemyPlaney);

		//BOMBS
		this.coins = this.game.add.group();
		this.coins.createMultiple(1000, 'Coin');

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

		} else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = 250;

			if (this.player.direction == -1) {
				this.player.scale.x *= -1;
			}

			this.player.playerDirection = 'right';
			this.player.direction = 1;
			this.player.animations.play('walk');

		} else if (this.cursors.down.isDown && this.player.body.touching.down) {
			this.player.body.velocity.x = 0;
			this.player.animations.stop();
			this.player.frame = 6;

		} else {
			if (vx > 0) {
				this.player.body.velocity.x = Math.max(0, vx - 15);
			} else if (vx < 0) {
				this.player.body.velocity.x = Math.min(0, vx + 15);
			} else {
				this.player.animations.stop();
				this.player.frame = 0;
			}
		}

		if (this.jumpButton.isDown && !this.cursors.down.isDown && this.player.body.touching.down && this.game.time.now > this.jumpTime) {
			this.player.body.velocity.y = -400;
			this.jumpTime = this.game.time.now + 800;
		}
	},

	update : function() {

		this.collisions();
		this.movePlayer();

		/*

		this.shoot();

		this.enemiesPlaney.forEachAlive(this.updateEnemyFlyer, this);*/

		//this.enemiesTick.forEachAlive(this.updateEnemyStatic, this);
		//this.enemiesTeddy.forEachAlive(this.updateEnemyWalker, this);

		if (this.fireButton.isDown) {
			this.player.fire();
		}

		/*if (this.enemiesTeddy.getFirstAlive() == null) {
		 this.setEnemyWalker(10, 20, this.enemiesTeddy);
		 }*/
	},

	collisions : function() {
		//MAP - UNITS
		this.game.physics.arcade.collide(this.platforms, this.enemiesTick);
		this.game.physics.arcade.collide(this.floor, this.enemiesTick);

		this.game.physics.arcade.collide(this.platforms, this.enemiesTeddy);
		this.game.physics.arcade.collide(this.floor, this.enemiesTeddy);

		this.game.physics.arcade.collide(this.platforms, this.player, null, null, this);
		this.game.physics.arcade.collide(this.floor, this.player, null, null, this);

		//BULLETS - MAP
		this.game.physics.arcade.collide(this.coins, this.platforms, this.killBullet, null, this);
		this.game.physics.arcade.collide(this.coins, this.floor, this.killBullet, null, this);

		this.game.physics.arcade.collide(this.player.currentWeapon, this.platforms, this.killBullet, null, this);
		this.game.physics.arcade.collide(this.player.currentWeapon, this.floor, this.killBullet, null, this);

		//BULLETS - ENEMIES
		game.physics.arcade.overlap(this.player.currentWeapon, this.enemiesTick, this.hitEnemy, null, this);
		game.physics.arcade.overlap(this.player.currentWeapon, this.enemiesTeddy, this.hitEnemy, null, this);
		game.physics.arcade.overlap(this.player.currentWeapon, this.enemiesPlaney, this.hitEnemy, null, this);

		//PLAYER
		this.game.physics.arcade.overlap(this.player, this.coins, this.hitBomb, null, this);
		this.game.physics.arcade.overlap(this.player, this.enemiesTick, this.hitPlayer, null, this);
		this.game.physics.arcade.overlap(this.player, this.enemiesTeddy, this.hitPlayer, null, this);
		this.game.physics.arcade.overlap(this.player, this.enemiesPlaney, this.hitPlayer, null, this);
	},

	changeWeapon : function() {
		this.player.changeWeapon();
	},

	hitPlayer : function(player) {
		this.player.animations.play('hit', null, false, true);
		this.player.damage(1);
		this.checkGameOver();
	},

	hitBomb : function(player, bomb) {
		bomb.kill();
		this.player.damage(1);
		this.checkGameOver();
	},

	killBullet : function(bullet) {
		bullet.kill();
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
	}
	
	
	/*
	 shoot : function() {
	 if (this.game.time.now > this.bulletTime && this.actionButton.isDown) {
	 var b = this.bullets.getFirstDead();
	 if (b != null) {
	 var x,
	 y = this.player.y - this.player.height / 2 + 8 * scale,
	 d = 1;
	 if (this.playerDirection == 'left') {
	 x = this.player.body.x - this.player.width / 2;
	 d = -1;
	 } else {
	 x = this.player.body.x + this.player.width / 2 + 60 * scale;
	 }

	 this.player.animations.stop();
	 this.player.frame = 7;

	 b.reset(x, y);
	 this.game.physics.arcade.enable(b);
	 b.body.allowGravity = false;
	 b.body.velocity.x = d * 1500;
	 b.outOfBoundsKill = true;

	 this.bulletTime = this.game.time.now + 200;
	 }
	 }
	 }
	 */
};

console.log('Height ' + height);
console.log('Width ' + width);

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game_div');
game.state.add('main', main);
game.state.start('main');
