enchant();

var game;
var scene;
var player;
var currentLevel;
var enemies;
var bullets;

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
            currentLevel = new Level();
            enemies = new Group();
            bullets = new Group();

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

            this.frame ++;
        });


        game.pushScene(scene);
    };
    game.start();
};
