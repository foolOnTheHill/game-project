var EnemyStatic = function(x, y, game, sprite, hp) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
	this.body.collideWorldBounds = true;

	try {
		this.animations.add('hit', [15, 16, 17, 18, 19], 8, false);
	} catch(e) {
		this.animations.add('hit', [0, 1], 8, false);
	}

	this.tookHit = false;
	this.direction = 'left';

	this.hp = hp;
};

EnemyStatic.prototype = Object.create(Phaser.Sprite.prototype);
EnemyStatic.prototype.constructor = Enemy;

EnemyStatic.prototype.update = function() {
	if (this.game.physics.arcade.isPaused) {
		this.animations.stop();
	}

	this.updateDirection();
};

EnemyStatic.prototype.damage = function(value) {
	this.hp -= value;

	this.tookHit = true;
	if (this.hp <= 0) {
		this.kill();
	}

	console.log(this.hp);
};

EnemyStatic.prototype.updateDirection = function() {
	//console.log("# " + this.game.player.player.x + "    " + this.x);

	if (!this.tookHit || this.animations.getAnimation('hit').isFinished) {
		if (this.game.player.x > this.x) {
			this.frame = 7;
			this.direction = 'right';
		} else {
			this.frame = 0;
			this.direction = 'left';
		}
		this.tookHit = false;
		this.animations.getAnimation('hit').isFinished = false;
	} else {
		this.animations.play('hit');
	}
};
