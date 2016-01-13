var Player = function(x, y, game, sprite, scale, hp) {
	Phaser.Sprite.call(this, game, x, y, sprite);

	this.frame = 0;
	this.animations.add('walk', [1, 2, 3], 8, true);

	this.anchor.setTo(0.5, 1);
	this.scale.setTo(scale, scale);
	this.scale.x *= -1;

	this.game.physics.arcade.enable(this);
	this.game.add.existing(this);
	this.body.collideWorldBounds = true;

	this.playerDirection = 'left';
	this.changeDirectionInverval = -1;

	this.direction = 1;
	this.HP = hp;
	this.MAX_HP = 6;
	this.attack = 1;
	this.speed = 250;
	this.defense = 0;
	this.weapon1;
	this.weapon2;
	this.currentWeapon;

	this.tookHit = false;
	this.hitFlashTime = null;

	this.downHit = false;

	this.heartSprites = [];
	this.createHearts();

	this.BulletIcon = this.game.add.sprite(10 * scale, 55 * scale, 'bullet');
	this.BulletsText = this.game.add.text(46 * scale, 55 * scale, 'x ', {
		font : (25 * scale) + 'px "Arial"',
		fill : '#FFFFFF'
	});
	this.BulletsText.setShadow(3, 3, '#000000', 5);

	this.stars = 0;

	this.StarIcon = this.game.add.sprite(12 * scale, 98 * scale, 'Coin');
	this.StarIcon.frame = 1;
	this.StarsText = this.game.add.text(46 * scale, 97 * scale, 'x 0', {
		font : (25 * scale) + 'px "Arial"',
		fill : '#FFFFFF'
	});
	this.StarsText.setShadow(3, 3, '#000000', 5);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.damage = function(value) {
	if (!this.tookHit) {
		this.HP -= (value - this.defense);
		this.tint = 0xec5656;
		this.tookHit = true;
		this.hitFlashTime = this.game.time.now + 1200;
		this.updateHearts();
	}
};

Player.prototype.fire = function() {
	//Shooting Animation here!!
	this.currentWeapon.fire(this, this.direction);
	this.updateBullets();
};

Player.prototype.changeWeapon = function() {
	if (this.currentWeapon == this.weapon1) {
		this.currentWeapon = this.weapon2;
		this.BulletIcon.loadTexture('bullet2');
	} else {
		this.currentWeapon = this.weapon1;
		this.BulletIcon.loadTexture('bullet');
	}
	this.updateBullets();
};

Player.prototype.updateHPText = function() {
	 this.HPText.text = 'HP: ' + this.HP;
	 this.HPText.anchor.setTo(0.5, 0.5);
};


Player.prototype.update = function() {
	if (this.game.physics.arcade.isPaused) {
		this.animations.stop();
	}

	if (this.tookHit) {
		if (this.game.time.now >= this.hitFlashTime) {
			this.tint = 0xffffff;
			this.tookHit = false;
		}
	}
};

Player.prototype.recover = function(r) {
	this.HP = Math.min(this.MAX_HP, this.HP + r);
	this.updateHearts();
};

Player.prototype.upgradeHp = function() {
	this.MAX_HP += 2;
	this.HP = this.MAX_HP;

	var n = this.MAX_HP / 2 - 1;
	this.heartSprites[n] = this.game.add.sprite(5 + n * 40, 5, 'heart_full');
	this.heartSprites[n].scale.setTo(0.25, 0.25);

	this.updateHearts();
};


Player.prototype.createHearts = function() {
	var numberHearts = Math.ceil(this.MAX_HP / 2);

	for (var i = 0; i < numberHearts; i++) {
		this.heartSprites[i] = this.game.add.sprite(5 + i * 40, 5, 'heart_full');
		this.heartSprites[i].scale.setTo(0.25, 0.25);
	}

	this.updateHearts();
};

Player.prototype.updateHearts = function() {

	var numberHearts = Math.ceil(this.MAX_HP / 2);
	
	if (this.HP > 0) {
		var h = this.HP % 2;
		var e = Math.floor((this.MAX_HP - this.HP) / 2);
		var f = (numberHearts - h - e);
	} else {
		var h = 0;
		var e = numberHearts;
		var f = 0;
	}
	var index = 0;
	var sprite;

	for (var i = 0; i < f; i++) {
		this.heartSprites[index].loadTexture('heart_full');
		index++;
	}

	if (h == 1) {
		this.heartSprites[index].loadTexture('heart_half');
		index++;
	}

	for (var i = 0; i < e; i++) {
		this.heartSprites[index].loadTexture('heart_empty');
		index++;
	}

};

Player.prototype.updateBullets = function() {
	this.BulletsText.text = "x " + this.currentWeapon.bullets;
};

Player.prototype.updateStars = function() {
	this.StarsText.text = "x " + this.stars;
};

Player.prototype.collectStar = function() {
	this.stars += 1;
	this.updateStars();
};

Player.prototype.addBullets = function(value) {
	this.weapon1.addBullets(value);
	this.updateBullets();
};
