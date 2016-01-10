var EnemyFlyer = function(x, y, game, sprite, hp, isDropper, dropPeriod, leftAnimation, rightAnimation, hitAnimation) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
	this.body.allowGravity = false;
	this.body.collideWorldBounds = true;

	this.animations.add('left', leftAnimation, 10, true);
	this.animations.add('right', rightAnimation, 10, true);
	this.animations.add('hit', hitAnimation, 8, false);

	this.animations.play("right");

	this.body.velocity.x = 250;
	this.isDropper = isDropper;
	this.dropPeriod = dropPeriod;
	this.dropTime = this.game.time.now + dropPeriod;
	this.hp = hp;

	this.tookHit = false;
};

EnemyFlyer.prototype = Object.create(Phaser.Sprite.prototype);
EnemyFlyer.prototype.constructor = Enemy;

EnemyFlyer.prototype.update = function() {
	this.move();
};

EnemyFlyer.prototype.damage = function(value) {
	this.hp -= value;
	if (this.hp <= 0) {
		this.kill();
	}
	this.tookHit = true;
	console.log(this.hp);
};

EnemyFlyer.prototype.move = function() {
	if (!this.tookHit || this.animations.getAnimation('hit').isFinished) {
		if (this.body.x == 0) {
			this.body.velocity.x = 200;
			this.animations.play('right');
		} else if (this.game.world.width - this.body.x == this.width) {
			this.body.velocity.x = -200;
			this.animations.play('left');
		} else if (this.body.velocity.x == 0) {
			this.body.velocity.x = 200;
			this.animations.play('right');
		}

		if (this.isDropper && this.game.time.now > this.dropTime && this.alive) {
			var c = main.bombs.getFirstDead();
			c.reset(this.x, this.y + this.height);
			this.game.physics.enable(c);
			c.body.bounce = 0.3;
			c.animations.add('fall', [0, 1, 2, 3], 15, true);
			c.animations.play('fall');
			c.outOfBoundsKill = true;
			this.dropTime = this.game.time.now + this.dropPeriod;
		}

		this.tookHit = false;
		this.animations.getAnimation('hit').isFinished = false;
		if (this.body.velocity.x > 0) {
			this.animations.play('right');
		} else {
			this.animations.play('left');
		}
	} else {
		this.animations.play('hit');
	}
};
