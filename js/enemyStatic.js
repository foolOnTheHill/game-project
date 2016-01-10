var EnemyStatic = function(x, y, game, sprite) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
	this.body.collideWorldBounds = true;

	this.animations.add('hit', [15, 16, 17, 18, 19], 8, false);

	this.hp = 5;
};

EnemyStatic.prototype = Object.create(Phaser.Sprite.prototype);
EnemyStatic.prototype.constructor = Enemy;

EnemyStatic.prototype.update = function() {
	this.updateDirection();
};

EnemyStatic.prototype.damage = function(value) {
	this.hp -= value;
	if (this.hp <= 0) {
		this.kill();
	}

	console.log(this.hp);
};

EnemyStatic.prototype.updateDirection = function(player) {
	//console.log("# " + main.player.x + "    " + this.x);
		
	if (this.animations.getAnimation('hit').isFinished) {
		if (main.player.x > this.x) {
			this.frame = 7;
		} else {
			this.frame = 0;
		}
	}
};

