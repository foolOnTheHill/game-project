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

	this.direction = 1;
	this.HP = hp;
	this.MAX_HP = 6;
	this.weapon1;
	this.weapon2;
	this.currentWeapon;

	/*this.HPText = this.game.add.text(75 * scale, 45 * scale, 'HP: ' + this.HP, {
		font : (45 * scale) + 'px "Arial"',
		fill : '#FFFFFF'
	});*/

	this.tookHit = false;
	this.hitFlashTime = null;

	this.downHit = false;

	this.heartSprites = [];

	this.createHearts();
	
	//Substituir por sprite
	this.BulletsText = this.game.add.text(10 * scale, 45 * scale, 'Apples: ', {
		font : (32 * scale) + 'px "Arial"',
		fill : '#FFFFFF'
	});
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.damage = function(value) {
	if (!this.tookHit) {
		this.HP -= value;
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
	} else {
		this.currentWeapon = this.weapon1;
	}
};

Player.prototype.updateHPText = function() {
	 this.HPText.text = 'HP: ' + this.HP;
	 this.HPText.anchor.setTo(0.5, 0.5);
};


Player.prototype.update = function() {
	if (this.tookHit) {
		if (this.game.time.now >= this.hitFlashTime) {
			this.tint = 0xffffff;
			this.tookHit = false;
		}
	}
};

Player.prototype.recover = function(r) {
	this.HP = Math.max(this.MAX_HP, this.HP + r);
	this.updateHPText();
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
	
	var h = this.HP % 2;
	var e = Math.floor((this.MAX_HP - this.HP) / 2);
	var f = (numberHearts - h - e);
	
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
	this.BulletsText.text = "Apples: x" + this.currentWeapon.bullets;
};

Player.prototype.addBullets = function(value) {
	this.weapon1.addBullets(value);
	this.updateBullets();
};
