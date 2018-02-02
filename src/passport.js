/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable no-param-reassign, no-underscore-dangle, max-len */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import uuid from 'uuid/v1';
import db from './db';
import datastoreClient from './gcp/datastore/dbconnection';

import {
  getEntityByKey,
  getEntities,
  createEntity,
  updateEntity,
} from './gcp/datastore/queries';
import createUser from './schema/Types/User/Mutations/functions/createUser';

passport.serializeUser((user, done) => {
  done(null, {
    id: user._id,
    // Might need to add a boolean for if the account was just created
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Creates or updates the external login credentials
// and returns the currently authenticated user.
async function login(req, provider, profile, tokens) {
  let user;

  if (req.user && req.user._id) {
    const key = await datastoreClient.key(['Users', req.user._id]);
    [user] = await datastoreClient.get(key);
  }

  if (!user) {
    const login = await getEntities(
      'Logins',
      [
        {
          property: 'provider',
          condition: '=',
          value: provider,
        },
        {
          property: 'profile',
          condition: '=',
          value: profile.id,
        },
      ],
      999,
      null,
      'SERVER',
    );

    if (login && login.entities && login.entities.length > 0) {
      const key = await datastoreClient.key([
        'Users',
        login.entities[0].creator,
      ]);
      [user] = await datastoreClient.get(key);
    }
  }

  let generatedUserId;

  if (!user) {
    generatedUserId = uuid();

    const userKey = await datastoreClient.key(['Users', generatedUserId]);
    [user] = await createUser(
      {
        email: profile.emails[0].value,
        dateCreated: Date.now(),
        dateUpdated: Date.now(),
      },
      generatedUserId,
    ).then(() => datastoreClient.get(userKey));
  }

  const logins = await getEntities(
    'Logins',
    [
      {
        property: '_id',
        condition: '=',
        value: `${provider}:${profile.id}`,
      },
      {
        property: 'creator',
        condition: '=',
        value: user._id,
      },
    ],
    1,
    null,
    generatedUserId,
  );

  if (!logins.entities.length) {
    const createLogin = await createEntity([
      {
        name: '_id',
        value: `${provider}:${profile.id}`,
      },
      {
        name: 'kind',
        value: 'Logins',
        excludeFromIndexes: true,
      },
      {
        name: 'creator',
        value: generatedUserId,
      },
      {
        name: 'provider',
        value: provider,
      },
      {
        name: 'profile',
        value: profile.id,
      },
      {
        name: 'tokens',
        value: tokens,
        excludeFromIndexes: true,
      },
      {
        name: 'profileInfo',
        value: profile._json,
        excludeFromIndexes: true,
      },
      {
        name: 'dateCreated',
        value: Date.now(),
      },
      {
        name: 'dateUpdated',
        value: Date.now(),
      },
    ]);
  } else {
    await updateEntity(
      [
        {
          name: '_id',
          value: `${provider}:${profile.id}`,
        },
        {
          name: 'kind',
          value: 'Logins',
          excludeFromIndexes: true,
        },
        {
          name: 'creator',
          value: user._id,
        },
        {
          name: 'profile',
          value: profile.id,
        },
        {
          name: 'tokens',
          value: tokens,
          excludeFromIndexes: true,
        },
        {
          name: 'provider',
          value: provider,
        },
        {
          name: 'profileInfo',
          value: profile._json,
          excludeFromIndexes: true,
        },
        {
          name: 'dateCreated',
          value: logins.entities[0].dateCreated,
        },
        {
          name: 'dateUpdated',
          value: Date.now(),
        },
      ],
      user._id,
    );
  }

  return {
    id: user._id,
  };
}

// https://github.com/jaredhanson/passport-google-oauth2
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: '/login/google/return',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = await login(req, 'google', profile, {
          accessToken,
          refreshToken,
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

// https://github.com/jaredhanson/passport-facebook
// https://developers.facebook.com/docs/facebook-login/permissions/
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      profileFields: [
        'id',
        'cover',
        'name',
        'age_range',
        'link',
        'gender',
        'locale',
        'picture',
        'timezone',
        'updated_time',
        'verified',
        'email',
      ],
      callbackURL: '/login/facebook/return',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        if (profile.emails.length)
          profile.emails[0].verified = !!profile._json.verified;
        profile.displayName =
          profile.displayName ||
          `${profile.name.givenName} ${profile.name.familyName}`;
        const user = await login(req, 'facebook', profile, {
          accessToken,
          refreshToken,
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

// https://github.com/jaredhanson/passport-twitter
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      callbackURL: '/login/twitter/return',
      includeEmail: true,
      includeStatus: false,
      passReqToCallback: true,
    },
    async (req, token, tokenSecret, profile, done) => {
      try {
        if (profile.emails && profile.emails.length)
          profile.emails[0].verified = true;
        const user = await login(req, 'twitter', profile, {
          token,
          tokenSecret,
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

export default passport;
