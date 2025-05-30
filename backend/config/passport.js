import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Check if user exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2. Check if email exists in database
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
            // 3A. If email exists but is local account, link Google credentials
            if (!existingUser.isGoogleUser) {
                existingUser.googleId = profile.id;
                existingUser.isGoogleUser = true;
                await existingUser.save();
                return done(null, existingUser);
            }
            // 3B. If email exists and is already Google account
            return done(null, false, { message: 'This email is already registered with Google' });
        }

        // 4. Create new Google user if email doesn't exist
        user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            isGoogleUser: true
        });

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));