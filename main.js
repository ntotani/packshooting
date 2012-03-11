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
var shots;

var SplashSprite = enchant.Class.create(Sprite, {
    initialize: function(x, y) {
        var game = enchant.Game.instance;
        Sprite.call(this, image.width, image.height);
        this.x = x;
        this.y = y;
        this.image = game.assets['effect0.gif'];
        game.currentScene.addChild(this);
        this.addEventListener('enterframe', function() {
            if (this.age % 4 == 0) {
                this.frame++;
            } if (this.age > 15) {
                this.scene.removeChild(this);
                this.removeEventListener('enterframe', arguments.callee);
            }
        });
    }
});

var HitPoint = enchant.Class.create(Group, {
    initialize: function(hitpoint, image, frame) {
        Group.call(this);
        this.hitpoint = hitpoint;
        this.max = hitpoint;
        this.image = image;
        this._frame = frame;
        this._col = 10;
        this.sps = new Array(hitpoint);
        for (var i = 0, l = this.sps.length; i < l; i++) {
            this.sps[i] = new Sprite(16,16);
            this.sps[i].image = image;
            this.sps[i].frame = this._frame;
            this.sps[i].x = i * 16;
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
            sp.x = (this.hitpoint-1) % this._col * 16;
            sp.y = parseInt((this.hitpoint-1) / this._col) * 16;
            this.sps.push(sp);
        }
        this.addChild(this.sps[this.hitpoint-1]);
    },
    value: {
        get: function() {
            return this.hitpoint;
        },
        set: function(value) {
            //this.hitpoint = value;
        }
    }
});

var Score = enchant.Class.create(MutableText, {
    initialize: function() {
        MutableText.call(this, 0, 0, game.width/2, 'score:0');
        this._score = 0;
    },
    add: function(n) {
        this._score += n;
        this._update();
    },
    _update: function() {
        this.text = this._score.toString();
        this.setText('score:' + this.text);
    },
    value: {
        get: function() {
            return this._score;
        },
        set: function(n) {
            this._score = n;
            this._update();
        }
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

var Gun = enchant.Class.create(Sprite, {
    initialize: function() {
        Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.gif'];
        this.x = 320;
        this.y = Math.random() * 304;
        this.frame = 30;

        this.addEventListener('enterframe', function() {
            this.x -= 1;
            if (this.x <= -16) {
                this.scene.removeChild(this);
            }
        });
    }
});

var Shot = enchant.Class.create(Sprite, {
    initialize: function(x, y) {
        Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.gif'];
        this.frame = 54;
        this.x = x;
        this.y = y;

        this.addEventListener('enterframe', function() {
            this.x += 1;
            if (this.x >= 320) {
                this.scene.removeChild(this);
            }
        });
    }
});

var Player = enchant.Class.create(Sprite, {
    initialize: function() {
        Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.gif'];
        this.x = 160;
        this.y = 160;
        this.frame = 70;
        this.power = false;
    },
    active: function() {
        if (!this.power) {
            var time = this.age + 30 * 5;
            this.addEventListener('enterframe', function() {
                this.power = true;
                if (this.age % 30 == 0) {
                    this.shot();
                }
                if (this.age >= time) {
                    this.power = false;
                    this.removeEventListener('enterframe', arguments.callee);
                }
            });
        }
    },
    shot: function() {
        if (ammo.value >= 0) {
            var shot = new Shot(this.x, this.y);
            shots.addChild(shot);
            ammo.dec();
        }
    }
});

var Level = enchant.Class.create({
    initalize: function() {
    },
    onframe: function(frame) {
        if (frame % 150 == 149) {
            return {
                enemy: [],
                bullet: [],
                gun: [new Gun()]
            }
        } else if (frame % 30 == 0) {
            return {
                enemy: [new Enemy()],
                bullet: [new Bullet()],
                gun: []
            }
        } else {
            return {
                enemy: [],
                bullet: [],
                gun: []
            }
        }
    }
});


window.onload = function() {
    game = new Game(320, 320);
    game.preload('icon0.gif');
    game.onload = function() {

        player = new Player();

        scene = new Scene();
        scene.addChild(player);
        scene.addEventListener('enter', function() {

            this.frame = 0;

            hitpoint = new HitPoint(3, game.assets['icon0.gif'], 10);
            hitpoint.y = 304;
            ammo = new HitPoint(5, game.assets['icon0.gif'], 48);
            score = new Score();
            score.x = 160;
            score.y = 304;
            currentLevel = new Level();

            var uis = new Group();
            uis.addChild(hitpoint);
            uis.addChild(ammo);
            uis.addChild(score);

            enemies = new Group();
            bullets = new Group();
            shots = new Group();
            guns = new Group();

            this.addChild(uis);
            this.addChild(enemies);
            this.addChild(bullets);
            this.addChild(shots);
            this.addChild(guns);
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
                        enemies.addChild(children);
                    });
                } else if (prop == 'bullet') {
                    data[prop].forEach(function(children) {
                        bullets.addChild(children);
                    });
                } else if (prop == 'gun') {
                    data[prop].forEach(function(children) {
                        guns.addChild(children);
                    });
                }
            };

            enemies.childNodes.forEach(function(enemy) {
                if (player.intersect(enemy)) {
                    hitpoint.dec();
                    enemies.removeChild(enemy);
                    if (hitpoint.value <= 0) {
                        game.end();
                    }
                }
            });

            bullets.childNodes.forEach(function(bullet) {
                if (player.intersect(bullet)) {
                    ammo.inc();
                    bullets.removeChild(bullet);
                }
            });

            guns.childNodes.forEach(function(gun) {
                if (player.intersect(gun)) {
                    guns.removeChild(gun);
                    player.active();
                }
            });

            shots.childNodes.forEach(function(shot) {
                enemies.childNodes.forEach(function(enemy) {
                    if (shot.intersect(enemy)) {
                        enemies.removeChild(enemy);
                        shots.removeChild(shot);
                        score.value += 10;
                    }
                });
            });

            this.frame ++;
        });


        game.pushScene(scene);
    };
    game.start();
};
