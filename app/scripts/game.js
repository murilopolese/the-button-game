define(['jquery', 'parse', 'facebook'], function($, Parse, FB) {
    // Game score
    var score = 0;
    // How many clicks to add new button
    var beatCicle = 5;
    // Button template
    var template = $('.buttons').html();
    // Initialize parse
    Parse.initialize(
        'V8nCm1Tvy3MCbR1WPTI8DsLRMIUk2zw1q6SaTlsE',
        'jpj4d2JmsnAJxtUrTq97ChfnVp67qI1xnJ6XOJnz'
    );
    Parse.FacebookUtils.init({
      appId: '258333647662740',
      xfbml: true
    });
    // Update your score on screen
    var updateScore = function(s) {
        $('.score').html(s);
    };
    // This runs a cicle of game, usually when button is clicked
    var cicle = function() {
        score++;
        updateScore(score);
        checkCicle();
    };
    // Check if a cicle ended
    var checkCicle = function() {
        if(score%beatCicle == 0) {
            appendButton(template);
            saveYourGame();
        }
    };
    // Append template button
    var appendButton = function(templ) {
        $('.buttons').append(templ);
    };
    // Share score on your timeline
    var shareScore = function() {
        FB.ui({
          method: 'feed',
          link: 'http://facebook.com/the-button-game',
          name: 'I did ' + score + ' points on The Button Game!',
          description: 'Click and click, than click again. After all, click one more time'
        }, function(response){});
    };
    // Login on facebook
    var login = function(cb) {
        if(cb == undefined) {
            cb = function(r) { console.log(r) };
        }
        Parse.FacebookUtils.logIn('email,read_friendlists', {
        success: function(user) {
          FB.api('/me', function(response) {
            if (!response.error) {
              user.set("displayName", response.name);
              user.set("email", response.email);
              user.set('facebookid', user._previousAttributes.authData.facebook.id);
              user.set('fb_info', response);
              user.save(null, {
                success: function(user) {
                  cb();
                },
                error: function(user, error) {
                  console.log("Oops, something went wrong saving your name.");
                }
              });
            } else {
              console.log("Oops something went wrong with facebook.");
            }
          });
        },
        error: function(error) {
          console.log("Oops something went wrong with facebook.");
        }
      });
    };
    // Login and save your score
    var loginAndSave = function(cb) {
        if(cb == undefined) {
            cb = function(r) { console.log(r) };
        }
        login(function() {
            saveYourGame(function() {
                cb();
            })
        })
    };
    // Create a game for you
    var createGame = function(cb) {
        var Game = Parse.Object.extend('Game');
        var yourGame = new Game();
        yourGame.set('points', score);
        yourGame.set('player', Parse.User.current());
        yourGame.save({
            success: function(savedGame) {
                cb(savedGame);
            }
        })
    };
    var getBasicQuery = function() {
        var query = new Parse.Query('Game');
        query.include('player');
        query.equalTo('player', Parse.User.current());
        return query;
    }
    // Save your game
    var saveYourGame = function(cb) {
        if(cb == undefined) {
            cb = function(r) { console.log(r) };
        }
        var query = getBasicQuery();
        query.first({
            success: function(game) {
                // if there is a game, save it
                if(game) {
                    game.set('points', score);
                    game.save({
                        success: function(savedGame) {
                            cb(savedGame);
                        } 
                    });
                } else {
                    // If there is no game for this player, create one
                    createGame(cb);
                }
            }
        })
    };
    // Load saved game
    var loadGame = function(cb) {
        var query = getBasicQuery();
        query.first({
            success: function(game) {
                if(game) {
                    score = parseInt(game.get('points'));
                    updateScore(game.get('points'));
                }
            }
        })
    }

    return {
        cicle: cicle,
        shareScore: shareScore,
        loginAndSave: loginAndSave,
        loadGame: loadGame
    };
});