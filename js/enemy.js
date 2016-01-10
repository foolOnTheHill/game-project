var Enemy = function(x, y, game, sprite) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
    this.body.collideWorldBounds = true;

    //Parameters
    this.hp = 5;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

/*
Enemy.prototype.update = function() {
    console.log(this.x);
};*/

Enemy.prototype.damage = function(value) {
	this.hp -= value;
	if (this.hp <= 0) {
		this.kill();
	}

	//this.reset(this.x + 20, this.y);

	console.log(this.hp);
};
