require('dotenv').config();
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('./User');

const FacebookTokenStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
  accessToken,
  refreshToken,
  profile,
});

passport.use(new FacebookTokenStrategy({
  clientID: '278032162986576',
  clientSecret: 'ab7646ea919660adb50256e24bbba669',
}, FacebookTokenStrategyCallback));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
}, async (email, password, done) => {
  const user = await User.getUser({ email, password });
  // todo check
  return done(null, user);
}));

const jwtOptions = {
  jwtFromRequest: ExtractJwt,
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, async ({ payload, done }) => {
  const user = await User.getUserById(payload.id);
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
}));

const authenticateFacebook = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('facebook-token', { session: false }, (err, data, info) => {
    if (err) reject(err);
    resolve({ data, info });
  })(req, res);
});


module.exports = {
  authenticateFacebook,
};
