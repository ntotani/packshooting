enchant();
var game;
var player;

window.onload = function() {
    game = new Game(320, 320);
    game.preload('icon0.gif');
    game.onload = function() {
        player = new Sprite(16, 16);
        player.x = 152;
        player.y = 152;
        player.image = game.assets['icon0.gif'];
        player.frame = 70;
        var scene = new Scene();
        scene.addChild(player);
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
        });


        game.pushScene(scene);
    };
    game.start();
};
