var BossToy = function(x, y, game, hp, sprite) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
	this.body.collideWorldBounds = true;

	this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
	this.animations.add('right', [10, 11, 12, 13, 14, 15, 16, 17], 8, true);
	this.animations.add('lhit', [30], 8, false);
	this.animations.add('rhit', [34], 8, false);
	this.animations.add('lstun', [31, 32], 8, true);
	this.animations.add('rstun', [35, 36], 8, true);
	this.animations.add('ldash', [20, 21, 22, 23], 8, true);
	this.animations.add('rdash', [24, 25, 26, 27], 8, true);

	this.animations.play("right");
	this.direction = 'right';

	this.max_hp = hp;
	this.hp = hp;
	this.attack = 2;

	this.tookHit = false;

	this.stuned = false;
	this.dashing = false;

	this.isBoss = true;

	this.hp_bar_border = this.game.add.image(this.game.world.width/2, 100, 'loading2');
	this.hp_bar_border.width = 400;
	this.hp_bar_border.height = 20;
	this.hp_bar_border.anchor.setTo(0.5, 0.5);

	this.hp_bar = this.game.add.image(this.game.world.width/2 - this.hp_bar_border.width/2 + 11, 94, 'loading');
	this.hp_bar.width = 377;
	this.hp_bar.height = 12;
	this.hp_bar.tint = 0x0eb808;
};

BossToy.prototype = Object.create(Phaser.Sprite.prototype);
BossToy.prototype.constructor = Enemy;

BossToy.prototype.update = function() {
	if (this.game.physics.arcade.isPaused) {
		this.animations.stop();
	}
	
	this.move();
};

BossToy.prototype.damage = function(value) {
	if (this.dashing) {
		return;
	}

	if (this.stuned) {
		value *= 2;
	}

	this.hp -= value;
	if (this.hp <= 0) {
		this.kill();
	}
	this.tookHit = true;
	console.log(this.hp);

	this.hp_bar.width = 377 * (this.hp / this.max_hp);
	if (this.hp <= this.max_hp/2) {
		this.hp_bar.tint = 0xe51212;
	}
};

BossToy.prototype.hitPlayer = function() {
	this.touchedPlayer = true;
	this.dashing = false;
};

BossToy.prototype.move = function() {
	console.log(this.playerDetected());
	if (this.playerDetected() && !this.dashing) {
		this.dash();
		return;
	}

	if (this.dashing) {
		var left = this.x == 0;
		var right = this.x == this.game.world.width - this.width;

		if (left || right) {
			
			this.stuned = true;
			this.dashing = false;

			this.outOfStunTime = this.game.time.now + 4000;

			var toX;
			if (left) {
				toX = {x: this.x + 90};
			} else {
				toX = {x: this.x - 90};
			}
			this.game.add.tween(this).to(toX, 400, Phaser.Easing.Bounce.Out, true);
		}
  } else if (this.stuned) {
		if (this.game.time.now > this.outOfStunTime) {
			this.stuned = false;
		}

		if (this.direction == 'left'){
			this.animations.play('lstun');
		} else {
			this.animations.play('rstun');
		}
	} else if (!this.tookHit || this.animations.getAnimation('lhit').isFinished || this.animations.getAnimation('rhit').isFinished) {
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
		this.body.velocity.x = -500;
		this.animations.play('ldash');
	} else {
		this.body.velocity.x = 500;
		this.animations.play('rdash');
	}
	this.dashing = true;
};

BossToy.prototype.spawnEnemy = function() {

};

BossToy.prototype.playerDetected = function() {
	
	var ldetect = this.game.player.x < this.x && Math.abs(this.game.player.x - this.x) < 500 && this.direction == 'left';
	var rdetect = this.game.player.x > (this.x + this.width) && Math.abs(this.game.player.x - this.x) < 500 && this.direction == 'right';
	console.log(this.game.player.x + "    " + this.x);
	return (rdetect || ldetect) && this.y - this.game.player.y < 0;
};
