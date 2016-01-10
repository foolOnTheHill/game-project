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

	this.hp = hp;
};

EnemyStatic.prototype = Object.create(Phaser.Sprite.prototype);
EnemyStatic.prototype.constructor = Enemy;

EnemyStatic.prototype.update = function() {
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
	//console.log("# " + main.player.x + "    " + this.x);

	if (!this.tookHit || this.animations.getAnimation('hit').isFinished) {
		if (main.player.x > this.x) {
			this.frame = 7;
		} else {
			this.frame = 0;
		}
		this.tookHit = false;
		this.animations.getAnimation('hit').isFinished = false;
	} else {
		this.animations.play('hit');
	}
};
