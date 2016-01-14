var Bullet = function (game, sprite, damage) {
    Phaser.Sprite.call(this, game, 30, 30, sprite);

    this.damage = damage;

    this.game.physics.arcade.enable(this);

    this.game.add.existing(this);
    this.body.allowGravity = false;

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.animations.add('fly', [0, 1, 2, 3], 12, true);

    //this.tracking = false;
    //this.scaleSpeed = 0;
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, dir) {

    this.reset(x, y);

    this.body.velocity.x = speed * dir;
    this.scale.set(1);

    this.animations.play('fly');

    //this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

    //this.angle = angle;
};


var Weapon = {};

Weapon.Basic = function (game, sprite) {
	this.MAX_BULLETS = 100;
	this.bullets = 100;

  Phaser.Group.call(this, game, game.world, 'Basic', false, true, Phaser.Physics.ARCADE);

  this.game = game;

  this.nextFire = 0;
  this.bulletSpeed = 600;
  this.fireRate = 200;

  for (var i = 0; i < 100; i++) {
      this.add(new Bullet(game, sprite, 1), true);
  }

  this.throw_sound = this.game.add.sound('throw');
  this.throw_sound.volume = 0.6;

  return this;
};

Weapon.Basic.prototype = Object.create(Phaser.Group.prototype);
Weapon.Basic.prototype.constructor = Weapon.Basic;

Weapon.Basic.prototype.fire = function (source, dir) {
	if (this.game.time.time < this.nextFire) { return; }

	var offset = 20 - (dir * 40);
    var x = source.x - offset;
    var y = source.y - 50;

    if (this.bullets > 0) {
      this.throw_sound.play();

  		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, dir);
    	this.nextFire = this.game.time.time + this.fireRate;
    	this.bullets--;
    }
};

Weapon.Basic.prototype.addBullets = function(value) {
	this.bullets = Math.min(this.bullets + value, this.MAX_BULLETS);
};

Weapon.Cannon = function (game, sprite) {
	this.bullets = 10;

    Phaser.Group.call(this, game, game.world, 'Cannon', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 500;

    this.game = game;

    for (var i = 0; i < 100; i++) {
        this.add(new Bullet(game, sprite, 3), true);
    }

    this.throw_sound = this.game.add.sound('throw');
    this.throw_sound.volume = 0.6;

    return this;
};

Weapon.Cannon.prototype = Object.create(Phaser.Group.prototype);
Weapon.Cannon.prototype.constructor = Weapon.Cannon;

Weapon.Cannon.prototype.fire = function (source, dir) {
	//console.log(this.bullets);
	if (this.game.time.time < this.nextFire) { return; }

    var offset = 20 - (dir * 40);
    var x = source.x - offset;
    var y = source.y - 50;

    if (this.bullets > 0) {
      this.throw_sound.play();

  		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, dir);
    	this.nextFire = this.game.time.time + this.fireRate;
    	this.bullets--;
    }
};
