var height = Math.min(window.innerHeight, 650);
var width = Math.round(2.07*height);

var scale = height / 650;

var main = {
  preload: function() {
    this.game.load.spritesheet('Tick', 'assets/enemies/Tick41x50.png', 50, 41);
    this.game.load.spritesheet('BrownTeddy', 'assets/enemies/BrownTeddy55x55.png', 55, 55);
    this.game.load.spritesheet('PandaTeddy', 'assets/enemies/PandaTeddy55x55.png', 55, 55);
    this.game.load.spritesheet('DirtyRatz', 'assets/enemies/DirtyRatz52x70.png', 70, 52);
    this.game.load.spritesheet('Helly', 'assets/enemies/Helly70x60.png', 60, 70);
    this.game.load.spritesheet('Planey', 'assets/enemies/Planey45x70.png', 70, 45);

    this.game.load.spritesheet('Danny', 'assets/Danny70x70.png', 70, 70);
    this.game.load.spritesheet('Jessie', 'assets/Jessie70x70.png', 70, 70);

    this.game.load.spritesheet('Coin', 'assets/Money24x25.png', 25, 24);

    this.game.load.image('platform', 'assets/platform.png');
    this.game.load.image('bullet', 'assets/bullet.png');
  },
  create: function() {
    this.game.stage.backgroundColor = '#abcdef';

    this.game.world.setBounds(0, 0, width*scale, height*scale);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 750;

    this.floor = this.game.add.group();
    this.floor.createMultiple(this.game.world.width / (200*scale), 'platform');

    this.setFloor();

    this.platforms = this.game.add.group();
    this.platforms.createMultiple(550, 'platform');

    this.positions = [[this.game.world.width/2, this.game.world.height - 162, 1],
                      [this.game.world.width/2, this.game.world.height - 299, 1],
                      [this.game.world.width/2 + 350, this.game.world.height - 259, 0.7],
                      [this.game.world.width/2 - 425, this.game.world.height - 339, 0.6]
                    ];

    this.setPlatforms(this.positions);

    this.bullets = this.game.add.group();
    this.bullets.createMultiple(500, 'bullet');

    this.coins = this.game.add.group();
    this.coins.createMultiple(1000, 'Coin');

    // Player
    this.player = this.game.add.sprite(20*scale, this.game.world.height - 70*scale, 'Jessie');
    this.player.frame = 0;
    this.player.animations.add('walk', [1, 2, 3], 8, true);

    this.player.anchor.setTo(0.5, 1);
    this.player.scale.setTo(scale, scale);

    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    this.playerDirection = 'left';

    this.playerHP = 5;
    this.playerHP_Text = this.game.add.text(75*scale, 45*scale, 'HP: '+this.playerHP, {font: (45*scale)+'px "Arial"', fill: '#FFFFFF'});
    this.playerHP_Text.anchor.setTo(0.5, 0.5);

    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW);
    //

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.actionButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

    this.bulletTime = this.game.time.now + 200;
    this.jumpTime = this.game.time.now + 300;

    this.enemiesTeddy = this.game.add.group();
    this.enemiesTeddy.createMultiple(50, 'BrownTeddy');

    this.enemiesTick = this.game.add.group();
    this.enemiesTick.createMultiple(50, 'Tick');

    this.enemiesPlaney = this.game.add.group();
    this.enemiesPlaney.createMultiple(50, 'Planey');

    this.enemiesHelly = this.game.add.group();
    this.enemiesHelly.createMultiple(50, 'Helly');

    this.setEnemyStatic(this.game.world.width/2 - 25, this.game.world.height - 390, this.enemiesTick);
    // this.setEnemyWalker(this.game.world.width/2, this.game.world.height -100, this.enemiesTeddy);
    this.setEnemyFlyer(20, this.game.world.height/2 - 110, 800, this.enemiesPlaney);
  },
  setFloor: function() {
    var posX = 0;
    var posY = this.game.world.height - 20*scale;

    var w = 200*scale;
    var total = 0;
    while (total <= this.game.world.width) {
      var p = this.floor.getFirstDead();
      if (p != null) {
        p.reset(posX, posY);
        this.game.physics.arcade.enable(p);
        p.body.immovable = true;
        p.body.allowGravity = false;
        p.body.collideWorldBounds = true;
      }
      posX += w;
      total += w;
    }
  },
  setPlatforms: function(positions) {

    for (var i = 0; i < positions.length; i++) {
      var pos = positions[i];
      console.log(pos);
      var p = this.platforms.getFirstDead();
      if (p != null) {
        p.reset(pos[0], pos[1]);
        p.anchor.setTo(0.5, 0.5);
        p.width *= pos[2];
        this.game.physics.arcade.enable(p);
        p.body.immovable = true;
        p.body.allowGravity = false;
        p.body.collideWorldBounds = true;
      }
    }
  },
  movePlayer: function() {
    var vx = this.player.body.velocity.x;
    var vy = this.player.body.velocity.y;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -250;

      if (this.playerDirection == 'right') {
        this.player.scale.x *= -1;
      }

      this.playerDirection = 'left';
      this.player.animations.play('walk');
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 250;

      if (this.playerDirection == 'left') {
        this.player.scale.x *= -1;
      }

      this.playerDirection = 'right';
      this.player.animations.play('walk');
    } else if (this.cursors.down.isDown && this.player.body.touching.down) {
      this.player.body.velocity.x = 0;
      this.player.animations.stop();
      this.player.frame = 6;
    } else {
      if (vx > 0) {
        this.player.body.velocity.x = Math.max(0, vx-15);
      } else if (vx < 0){
        this.player.body.velocity.x = Math.min(0, vx+15);
      } else {
        this.player.animations.stop();
        this.player.frame = 0;
      }
    }

    if (this.jumpButton.isDown && !this.cursors.down.isDown && this.player.body.touching.down && this.game.time.now > this.jumpTime) {
      this.player.body.velocity.y = -400;
      this.jumpTime = this.game.time.now + 800;
    }
  },
  setEnemyStatic: function(x, y, group) {
    var e = group.getFirstDead();
    if (e != null) {
      e.reset(x, y);

      this.game.physics.arcade.enable(e);
      e.body.collideWorldBounds = true;

      e.animations.add('hit', [15, 16, 17, 18, 19], 8, false);
    }
  },
  setEnemyWalker: function(x, y, group) {
    var e = group.getFirstDead();
    if (e != null) {
      e.reset(x, y);

      e.animations.add('left', [0, 1, 2, 3, 4], 8, true);
      e.animations.add('right', [7, 8, 9, 10, 11], 8, true);
      e.animations.add('hit', [14, 15, 16, 17, 18, 19], 8, false);

      this.game.physics.arcade.enable(e);

      e.animations.play('right');

      e.body.velocity.x = 200;
      e.body.collideWorldBounds = true;
    }
  },
  setEnemyFlyer: function(x, y, dropPeriod, group) {
    var e = group.getFirstDead();
    if (e != null) {
      e.reset(x, y);
      e.animations.add('left', [0, 1], 10, true);
      e.animations.add('right', [2, 3], 10, true);
      e.animations.add('hit', [4, 5, 6, 7, 8, 9], 8, false);

      this.game.physics.arcade.enable(e);

      e.animations.play('right');

      e.body.velocity.x = 250;
      e.body.allowGravity = false;
      e.body.collideWorldBounds = true;

      e.dropPeriod = dropPeriod;
      e.dropTime = this.game.time.now + dropPeriod;
    }
  },
  update: function() {
    this.game.physics.arcade.collide(this.platforms, this.player, null, null, this);
    this.game.physics.arcade.collide(this.floor, this.player, null, null, this);

    this.game.physics.arcade.collide(this.platforms, this.enemiesTeddy, null, null, this);
    this.game.physics.arcade.collide(this.floor, this.enemiesTeddy, null, null, this);

    this.game.physics.arcade.collide(this.platforms, this.enemiesTick, null, null, this);
    this.game.physics.arcade.collide(this.floor, this.enemiesTick, null, null, this);

    this.game.physics.arcade.collide(this.platforms, this.coins, this.explodeBomb, null, this);
    this.game.physics.arcade.collide(this.floor, this.coins, this.explodeBomb, null, this);

    this.game.physics.arcade.overlap(this.player, this.enemiesTeddy, this.hitPlayer, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemiesPlaney, this.hitPlayer, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemiesHelly, this.hitPlayer, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemiesTick, this.hitPlayer, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.hitBomb, null, this);

    this.movePlayer();
    this.shoot();

    this.enemiesTick.forEachAlive(this.updateEnemyStatic, this);
    this.enemiesTeddy.forEachAlive(this.updateEnemyWalker, this);
    this.enemiesPlaney.forEachAlive(this.updateEnemyFlyer, this);

    if (this.enemiesTeddy.getFirstAlive() == null) {
      this.setEnemyWalker(10, 20, this.enemiesTeddy);
    }
  },
  hitPlayer: function(p, e) {
    e.animations.play('hit', null, false, true);
    // this.updatePlayerHp(1);
  },
  hitBomb: function(p, b) {
    b.kill();
    this.updatePlayerHp(1);
  },
  explodeBomb: function(platform, bomb) {
    bomb.kill();
  },
  updateEnemyStatic: function(e) {
    if (e.animations.getAnimation('hit').isFinished) {
        if (this.player.x > e.x) {
          e.frame = 7;
        } else {
          e.frame = 0;
        }
    }
  },
  updateEnemyWalker: function(t) {
    if (t.body.x == 0){
      t.body.velocity.x = 200;
      t.animations.play('right');
    } else if (this.game.world.width - t.body.x == t.width) {
      t.body.velocity.x = -200;
      t.animations.play('left');
    } else if (t.body.velocity.x == 0) {
      t.body.velocity.x = 200;
      t.animations.play('right');
    }
  },
  updateEnemyFlyer: function(f) {
    this.updateEnemyWalker(f);
    if (this.game.time.now > f.dropTime) {
      var c = this.coins.getFirstDead();
      if (c != null) {
        c.reset(f.x, f.y+f.height);
        this.game.physics.enable(c);
        c.body.bounce = 0.3;
        c.animations.add('round', [0, 1, 2, 3], 10, true);
        c.animations.play('round');
        f.dropTime = this.game.time.now + f.dropPeriod;
      }
    }
  },
  updateHpText: function() {
    this.playerHP_Text.text = 'HP: ' + this.playerHP;
    this.playerHP_Text.anchor.setTo(0.5, 0.5);
  },
  updatePlayerHp: function(hit) {
    this.playerHP = Math.max(0, this.playerHP - hit);
    this.updateHpText();
    if (this.playerHP == 0) {
      this.gameOver();
    }
  },
  gameOver: function() {
    this.game.state.restart();
  },
  shoot: function() {
    if (this.game.time.now > this.bulletTime && this.actionButton.isDown) {
      var b = this.bullets.getFirstDead();
      if (b != null) {
        var x, y = this.player.y - this.player.height/2 + 8*scale, d = 1;
        if (this.playerDirection == 'left') {
          x = this.player.body.x - this.player.width/2;
          d = -1;
        } else {
          x = this.player.body.x + this.player.width/2 + 60*scale;
        }

        this.player.animations.stop();
        this.player.frame = 7;

        b.reset(x, y);
        this.game.physics.arcade.enable(b);
        b.body.allowGravity = false;
        b.body.velocity.x = d*1500;
        b.outOfBoundsKill = true;

        this.bulletTime = this.game.time.now + 200;
      }
    }
  }
};

console.log('Height '+height);
console.log('Width '+width);

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game_div');
game.state.add('main', main);
game.state.start('main');
