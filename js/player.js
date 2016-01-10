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
	this.MAX_HP = 5;
  this.weapon1;
  this.weapon2;
  this.currentWeapon;

  this.HPText = this.game.add.text(75 * scale, 45 * scale, 'HP: ' + this.HP, {
		font : (45 * scale) + 'px "Arial"',
		fill : '#FFFFFF'
	});

	this.tookHit = false;
	this.hitFlashTime = null;

	this.downHit = false;

	this.updateHPText();
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.damage = function(value) {
	if (!this.tookHit) {
		this.HP -= value;
		this.tint = 0xec5656;
		this.tookHit = true;
		this.hitFlashTime = this.game.time.now + 1200;
		this.updateHPText();
	}
};

Player.prototype.fire = function() {
	//Shooting Animation here!!
	this.currentWeapon.fire(this, this.direction);
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
	this.MAX_HP += 1;
	this.HP = this.MAX_HP;
	this.updateHPText();
};
