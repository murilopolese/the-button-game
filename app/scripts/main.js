require.config({
    shim: {
        'parse': {
            exports: 'Parse'
        },
        'facebook': {
            exports: 'FB'
        }
    },
    baseUrl: '/bower_components',
    paths: {
        jquery:             'jquery/jquery',
        underscore:         'underscore/underscore',
        backbone:           'backbone/backbone',
        parse:              'parse/index',
        facebook:           'facebook/index',
        game:               '../scripts/game',
    }
});

require(['jquery', 'game'], function($, Game) {
    Game.loadGame(function() {
        
    })
    $('.container').on('click', 'button', function() {
        Game.cicle();
    });
    $('.container').on('click', '.share', function() {
        Game.loginAndSave();
        Game.shareScore();
    });
});