var EnemyWalker = function(x, y, game, sprite) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
	this.body.collideWorldBounds = true;

	this.animations.add('left', [0, 1, 2, 3, 4], 8, true);
	this.animations.add('right', [7, 8, 9, 10, 11], 8, true);
	this.animations.add('hit', [14, 15, 16, 17, 18, 19], 8, false);

	this.animations.play("right");

	this.hp = 5;
};

EnemyWalker.prototype = Object.create(Phaser.Sprite.prototype);
EnemyWalker.prototype.constructor = Enemy;

EnemyWalker.prototype.update = function() {
	this.move();
};

EnemyWalker.prototype.damage = function(value) {
	this.hp -= value;
	if (this.hp <= 0) {
		this.kill();
	}
	
	console.log(this.hp);
};

EnemyWalker.prototype.move = function() {
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
};




