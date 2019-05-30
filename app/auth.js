const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');

const FacebookTokenStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
    accessToken,
    refreshToken,
    profile,
});

passport.use(new FacebookTokenStrategy({
    clientID: '278032162986576',
    clientSecret: 'ab7646ea919660adb50256e24bbba669',
}, FacebookTokenStrategyCallback));

const authenticateFacebook = (req, res) => new Promise((resolve, reject) => {
    passport.authenticate('facebook-token', { session: false }, (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
    })(req, res);
});

module.exports = {
  authenticateFacebook
};
