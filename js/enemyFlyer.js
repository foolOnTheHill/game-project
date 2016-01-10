var EnemyFlyer = function(x, y, dropPeriod, game, sprite) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
	this.body.allowGravity = false;
	this.body.collideWorldBounds = true;

	this.animations.add('left', [0, 1], 10, true);
	this.animations.add('right', [2, 3], 10, true);
	this.animations.add('hit', [4, 5, 6, 7, 8, 9], 8, false);

	this.animations.play("right");

	this.body.velocity.x = 250;
	this.dropPeriod = dropPeriod;
	this.dropTime = this.game.time.now + dropPeriod;
	this.hp = 5;
		

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

	console.log(this.hp);
};

EnemyFlyer.prototype.move = function() {
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

	if (this.game.time.now > this.dropTime && this.alive) {
		var c = main.coins.getFirstDead();
		c.reset(this.x, this.y + this.height);
		this.game.physics.enable(c);
		c.body.bounce = 0.3;
		c.animations.add('round', [0, 1, 2, 3], 10, true);
		c.animations.play('round');
		this.dropTime = this.game.time.now + this.dropPeriod;
	}

};

