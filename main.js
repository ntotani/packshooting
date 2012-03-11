enchant();

var game;
var scene;
var player;
var hitpoint;
var ammo;
var score;
var currentLevel;
var enemies;
var bullets;

var HitPoint = enchant.Class.create(Group, {
    initialize: function(hitpoint, image, frame) {
        Group.call(this);
        this.hitpoint = hitpoint;
        this.max = hitpoint;
        this.image = image;
        this._frame = frame;
        this.sps = new Array(hitpoint);
        for (var i = 0, l = this.sps.length; i < l; i++) {
            this.sps[i] = new Sprite(16,16);
            this.sps[i].image = image;
            this.sps[i].frame = this._frame;
            this.sps[i].x = i*18;
            this.addChild(this.sps[i]);
        }
    },
    dec: function() {
        this.hitpoint--;
        this.removeChild(this.sps[this.hitpoint]);
    },
    inc: function() {
        this.hitpoint++;
        if (this.hitpoint > this.max) {
            var sp = new Sprite(16, 16);
            sp.image = this.image;
            sp.frame = this._frame;
            sp.x = (this.hitpoint-1) * 18;
            this.sps.push(sp);
        }
            this.addChild(this.sps[this.hitpoint-1]);
    }
});

var Enemy = enchant.Class.create(Sprite, {
    initialize: function() {
        Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.gif'];
        this.x = 320;
        this.y = Math.random() * 304;
        this.frame = 11;

        this.addEventListener('enterframe', function() {
            this.x -= 1;
            if (this.x <= -16) {
                this.scene.removeChild(this);
            }
        });
    }
});

var Bullet = enchant.Class.create(Sprite, {
    initialize: function() {
        Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.gif'];
        this.x = 320;
        this.y = Math.random() * 304;
        this.frame = 45;

        this.addEventListener('enterframe', function() {
            this.x -= 1;
            if (this.x <= -16) {
                this.scene.removeChild(this);
            }
        });
    }
});

var Level = enchant.Class.create({
    initalize: function() {
    },
    onframe: function(frame) {
        if (frame % 30 == 0) {
            return {
                enemy: [new Enemy()],
                bullet: [new Bullet()],
                hoge: []
            }
        } else {
            return {
                enemy: [],
                bullet: [],
                hoge: []
            }
        }
    }
});


window.onload = function() {
    game = new Game(320, 320);
    game.preload('icon0.gif');
    game.onload = function() {

        player = new Sprite(16, 16);
        player.x = 152;
        player.y = 152;
        player.image = game.assets['icon0.gif'];
        player.frame = 70;

        scene = new Scene();
        scene.addChild(player);
        scene.addEventListener('enter', function() {

            this.frame = 0;

            hitpoint = new HitPoint(3, game.assets['icon0.gif'], 10);
            hitpoint.y = 304;
            ammo = new HitPoint(5, game.assets['icon0.gif'], 48);
            score = new ScoreLabel(160, 304);
            currentLevel = new Level();

            var uis = new Group();
            uis.addChild(hitpoint);
            uis.addChild(ammo);
            uis.addChild(score);

            enemies = new Group();
            bullets = new Group();

            this.addChild(uis);
            this.addChild(enemies);
            this.addChild(bullets);
        });

        scene.addEventListener('enterframe', function() {
            if (game.input.left) {
                player.x -= 2;
            } if (game.input.right) {
                player.x += 2;
            } if (game.input.up) {
                player.y -= 2;
            } if (game.input.down) {
                player.y += 2;
            }
            var data = currentLevel.onframe(this.frame);

            for (prop in data) {
                if (prop == 'enemy') {
                    data[prop].forEach(function(children) {
                        scene.addChild(children);
                    });
                } else if (prop == 'bullet') {
                    data[prop].forEach(function(children) {
                        bullets.addChild(children);
                    });
                } else {
                }
            };

            enemies.childNodes.forEach(function(enemy) {
                if (player.intersect(enemy)) {
                    hitpoint.dec();
                    enemies.removeChild(enemy);
                }
            });

            bullets.childNodes.forEach(function(bullet) {
                if (player.intersect(bullet)) {
                    ammo.inc();
                    enemies.removeChild(bullet);
                }
            });

            this.frame ++;
        });


        game.pushScene(scene);
    };
    game.start();
};
