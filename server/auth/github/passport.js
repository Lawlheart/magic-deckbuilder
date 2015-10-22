exports.setup = function (User, config) {
  var passport = require('passport');
  var GitHubStrategy = require('passport-github').Strategy;

  passport.use(new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({ 'github.id': profile.id }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (user) {
        return done(null, user);
      } else {
        var newUser = new User();

        newUser.github.id = profile.id;
        newUser.github.username = profile.username;
        newUser.github.displayName = profile.displayName;
        newUser.github.publicRepos = profile._json.public_repos;
        newUser.nbrClicks.clicks = 0;

        newUser.save(function (err) {
          if (err) {
            throw err;
          }

          return done(null, newUser);
        });
      }
    });
  }));
};
