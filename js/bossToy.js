var BossToy = function(x, y, game, sprite) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
	this.body.collideWorldBounds = true;

	this.animations.add('left', [0, 1, 2, 3, 4], 8, true);
	this.animations.add('right', [7, 8, 9, 10, 11], 8, true);
	this.animations.add('lhit', [14], 8, false);
	this.animations.add('rhit', [24], 8, false);
	this.animations.add('lstun', [14], 8, false);
	this.animations.add('rstun', [24], 8, false);
	this.animations.add('ldash', [14], 8, false);
	this.animations.add('rdash', [24], 8, false);

	this.animations.play("right");
	this.direction = 'right';

	this.hp = 100;

	this.tookHit = false;
	
	this.stuned = false;
	this.hitPlayer = false;
	this.dashing = false;
};

BossToy.prototype = Object.create(Phaser.Sprite.prototype);
BossToy.prototype.constructor = Enemy;

BossToy.prototype.update = function() {
	if (this.game.physics.arcade.isPaused) {
		this.animations.stop();
	}
	
	this.move();
	
	if (this.playerDetected()) {
		this.dash();
		
	}
	
};

BossToy.prototype.damage = function(value) {
	this.hp -= value;
	if (this.hp <= 0) {
		this.kill();
	}
	this.tookHit = true;
	console.log(this.hp);
};

BossToy.prototype.move = function() {
	if (!this.tookHit || this.animations.getAnimation('lhit').isFinished || this.animations.getAnimation('rhit').isFinished) {
		if (this.body.x == 0) {
			this.body.velocity.x = 200;
			this.animations.play('right');
			this.direction = 'right';
		} else if (this.game.world.width - this.body.x == this.width) {
			this.body.velocity.x = -200;
			this.animations.play('left');
			this.direction = 'left';
		} else if (this.body.velocity.x == 0) {
			this.body.velocity.x = 200;
			this.animations.play('right');
			this.direction = 'right';
		}

		this.tookHit = false;
		this.animations.getAnimation('lhit').isFinished = false;
		this.animations.getAnimation('rhit').isFinished = false;
		if (this.body.velocity.x > 0) {
			this.animations.play('right');
			this.direction = 'right';
		} else {
			this.animations.play('left');
			this.direction = 'left';
		}
	} else {
		if (this.direction == 'left') {
			this.animations.play('lhit');
		} else {
			this.animations.play('rhit');
		}
	}
};

BossToy.prototype.dash = function() {
	if (this.direction == 'left') {
		this.body.velocity.x = -2000;
	} else {
		this.body.velocity.x = 2000;
	}
};

BossToy.prototype.spawnEnemy = function() {
	
};

BossToy.prototype.playerDetected = function() {
	var ldetect = this.game.player.x < this.x && Math.abs(this.game.player.x - this.x) < 300 && this.direction == 'left';
	var rdetect = this.game.player.x > this.x && Math.abs(this.game.player.x - this.x) < 300 && this.direction == 'right';
	
	return (rdetect || ldetect) && this.y - this.game.player.y < 0;
};
