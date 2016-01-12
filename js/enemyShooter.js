var EnemyShooter = function(x, y, game, sprite, hp, shootPeriod) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
	this.body.collideWorldBounds = true;

	this.direction = 'right';

	this.animations.add('lhit', [15], 8, false);
	this.animations.add('rhit', [24], 8, false);
	this.shootPeriod = shootPeriod;
	this.shootTime = this.game.time.now + shootPeriod;

	this.tookHit = false;

	this.bullets = this.game.add.group();
	this.bullets.createMultiple(1000, 'bullet2');

	this.hp = hp;
};

EnemyShooter.prototype = Object.create(Phaser.Sprite.prototype);
EnemyShooter.prototype.constructor = Enemy;

EnemyShooter.prototype.update = function() {
	if (this.game.physics.arcade.isPaused) {
		this.animations.stop();
	}

	if (this.alive) {
		this.game.physics.arcade.overlap(main.player, this.bullets, main.bulletHitPlayer, null, main);
		this.game.physics.arcade.overlap(this.bullets, main.platforms, main.killBullet, null, this);
		this.game.physics.arcade.overlap(this.bullets, main.floor, main.killBullet, null, this);

		this.updateDirection();
		this.shoot();
	}

};

EnemyShooter.prototype.damage = function(value) {
	this.hp -= value;

	this.tookHit = true;
	if (this.hp <= 0) {
		this.kill();
	}

	console.log(this.hp);
};

EnemyShooter.prototype.updateDirection = function() {
	//console.log("# " + main.player.x + "    " + this.x);

	if (!this.tookHit || this.animations.getAnimation('lhit').isFinished || this.animations.getAnimation('rhit').isFinished) {
		if (main.player.x > this.x) {
			this.frame = 7;
			this.direction = 'right';
		} else {
			this.frame = 0;
			this.direction = 'left';
		}
		this.tookHit = false;
		this.animations.getAnimation('lhit').isFinished = false;
		this.animations.getAnimation('rhit').isFinished = false;
	} else {
		if (this.direction == 'left') {
			this.animations.play('lhit');
		} else {
			this.animations.play('rhit');
		}
	}
};

EnemyShooter.prototype.shoot = function() {
	if (this.game.time.now > this.shootTime) {
		var b = this.bullets.getFirstDead();
		if (b != null) {
			this.game.physics.arcade.enable(b);
			b.body.allowGravity = false;
			b.checkWorldBounds = true;
			b.outOfBoundsKill = true;

			if (this.direction == 'left') {
				b.reset(this.x - this.width + 30, this.y + this.width/4 + 5);
				b.body.velocity.x = -300;
			} else {
				b.reset(this.x + this.width, this.y + this.width/4 + 5);
				b.body.velocity.x = 300;
			}
		}
		this.shootTime = this.game.time.now + this.shootPeriod;
	}
};
