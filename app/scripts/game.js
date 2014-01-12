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
          name: 'The Button Game',
          description: 'Click and click, than click again. After all, click one more time'
        }, function(response){});
    };

    return {
        cicle: cicle,
        shareScore: shareScore
    }
});