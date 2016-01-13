var EnemyWalker = function(x, y, game, sprite, hp) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
	this.body.collideWorldBounds = true;

	this.animations.add('left', [0, 1, 2, 3, 4], 8, true);
	this.animations.add('right', [7, 8, 9, 10, 11], 8, true);
	this.animations.add('lhit', [14], 8, false);
	this.animations.add('rhit', [24], 8, false); //Mudar animação

	this.animations.play("right");
	this.direction = 'right';

	this.hp = hp;
	this.attack = 1;

	this.tookHit = false;
};

EnemyWalker.prototype = Object.create(Phaser.Sprite.prototype);
EnemyWalker.prototype.constructor = Enemy;

EnemyWalker.prototype.update = function() {
	if (this.game.physics.arcade.isPaused) {
		this.animations.stop();
	}
	
	this.move();
};

EnemyWalker.prototype.damage = function(value) {
	this.hp -= value;
	if (this.hp <= 0) {
		this.kill();
	}
	this.tookHit = true;
	//console.log(this.hp);
};

EnemyWalker.prototype.move = function() {
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
