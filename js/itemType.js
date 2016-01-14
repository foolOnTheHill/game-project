var ItemType = function(x, y, game, type, sprite) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
	this.body.collideWorldBounds = true;
	this.body.allowGravity = true;

	this.type = type;
	

	if (this.type == 'defense') {
		this.animations.add('iddle', [0, 1], 8, true);
	} else if (this.type == 'speed') {
		this.animations.add('iddle', [2, 3], 8, true);
	} else if (this.type == 'heart') {
		this.animations.add('iddle', [4, 5], 8, true);
	} else if (this.type == 'first aid') {
		this.animations.add('iddle', [6, 7], 8, true);
	}
	
	this.animations.play('iddle');
	
};

ItemType.prototype = Object.create(Phaser.Sprite.prototype);
ItemType.prototype.constructor = ItemType;

