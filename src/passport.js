/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable no-param-reassign, no-underscore-dangle, max-len */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import uuid from 'uuid/v1';
import datastoreClient from './gcp/datastore/datastoreConnection';

import {
  getEntities,
  createEntity,
  updateEntity,
} from './gcp/datastore/queries';
import createUser from './schema/Types/User/Mutations/functions/createUser';

passport.serializeUser((user, done) => {
  done(null, {
    uid: user.uid,
    profileMedia: user.profileMedia,
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Creates or updates the external login credentials
// and returns the currently authenticated user.
async function login(req, provider, profile, tokens) {
  let user;

  if (req.user && req.user.uid) {
    const entityKey = await datastoreClient.key(['users', req.user.uid]);
    [user] = await datastoreClient.get(entityKey);
  }

  if (!user) {
    const loginUser = await getEntities(
      'logins',
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
      'APP',
    );

    if (loginUser && loginUser.entities && loginUser.entities.length > 0) {
      const entityKey = await datastoreClient.key([
        'users',
        loginUser.entities[0].creator,
      ]);
      [user] = await datastoreClient.get(entityKey);
    }
  }

  let generatedUserUid;

  if (!user) {
    generatedUserUid = uuid();

    const entityKey = await datastoreClient.key(['users', generatedUserUid]);
    [user] = await createUser(
      {
        email: profile.emails[0].value,
        profileMedia: profile.photos[0].value,
        dateCreated: Date.now(),
        dateUpdated: Date.now(),
      },
      generatedUserUid,
    ).then(() => datastoreClient.get(entityKey));
  } else {
    generatedUserUid = user.uid;
  }

  const logins = await getEntities(
    'logins',
    [
      {
        property: 'uid',
        condition: '=',
        value: `${provider}:${profile.id}`,
      },
      {
        property: 'creator',
        condition: '=',
        value: user.uid,
      },
    ],
    1,
    null,
    generatedUserUid,
  );

  if (!logins.entities.length) {
    await createEntity([
      {
        name: 'uid',
        value: `${provider}:${profile.id}`,
      },
      {
        name: 'kind',
        value: 'logins',
        excludeFromIndexes: true,
      },
      {
        name: 'creator',
        value: generatedUserUid,
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
          name: 'uid',
          value: `${provider}:${profile.id}`,
        },
        {
          name: 'kind',
          value: 'logins',
          excludeFromIndexes: true,
        },
        {
          name: 'creator',
          value: user.uid,
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
      user.uid,
    );
  }

  return {
    uid: user.uid,
    profileMedia: user.profileMedia,
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

export default passport;
