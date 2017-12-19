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
// TODO: Create new function inside Logins, also make it accompany emails (implement a type field)
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import uuid from 'uuid/v1';
import db from './db';

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
    displayName: user.displayName,
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Creates or updates the external login credentials
// and returns the currently authenticated user.
async function login(req, provider, profile, tokens) {
  let user;

  if (req.user) {
    // user = await db
    //   .table('users')
    //   .where({ id: req.user.id })
    //   .first();
    user = await getEntityByKey('Users', req.user._id, req.user._id).then(
      response => response.entity,
    );
  }

  if (!user) {
    // user = await db
    //   .table('logins')
    //   .innerJoin('users', 'users.id', 'logins.user_id')
    //   .where({ 'logins.provider': provider, 'logins.id': profile.id })
    //   .first('users.*');

    user = await getEntities(
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
      req.user._id,
    );

    // If there is no user but there is profiles that have verified accounts.
    if (
      !user &&
      profile.emails &&
      profile.emails.length &&
      profile.emails[0].verified === true
    ) {
      // user = await db
      //   .table('users')
      //   .innerJoin('emails', 'emails.user_id', 'users.id')
      //   .where({
      //     'emails.email': profile.emails[0].value,
      //     'emails.verified': true,
      //   })
      //   .first('users.*');

      user = await getEntities(
        'Emails',
        [
          {
            property: 'Users_id',
            condition: '=',
            value: user._id,
          },
          {
            property: 'verified',
            condition: '=',
            value: true,
          },
        ],
        999,
        null,
        user._id,
      );
    }
  }

  let generatedUserId;

  if (!user) {
    // eslint-disable-next-line prefer-destructuring
    // user = (await db
    //   .table('users')
    //   .insert({
    //     display_name: profile.displayName,
    //     image_url:
    //       profile.photos && profile.photos.length
    //         ? profile.photos[0].value
    //         : null,
    //   })
    //   .returning('*'))[0];
    generatedUserId = uuid();

    user = await createUser({
      _id: generatedUserId,
      username: profile.displayName,
    }).then(() => getEntityByKey('Users', generatedUserId, generatedUserId));

    if (profile.emails && profile.emails.length) {
      // await db.table('emails').insert(
      //   profile.emails.map(x => ({
      //     user_id: user.id,
      //     email: x.value,
      //     verified: x.verified || false,
      //   })),
      // );
      await createEntity([
        {
          name: '_id',
          value: '',
        },
        {
          name: 'kind',
          value: 'Emails',
          excludeFromIndexes: true,
        },
        {
          name: 'Users_id',
          value: generatedUserId,
        },
        {
          name: 'email',
          value: profile.email,
        },
        {
          name: 'verified',
          value: profile.verified || false,
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
    }
  }

  // const loginKeys = { user_id: user.id, provider, id: profile.id };
  // const { count } = await db
  //   .table('logins')
  //   .where(loginKeys)
  //   .count('id')
  //   .first();
  const count = await getEntities(
    'Logins',
    [
      {
        property: '_id',
        condition: '=',
        value: profile._id,
      },
      {
        property: 'Users_id',
        condition: '=',
        value: generatedUserId,
      },
      {
        property: 'profile_id',
        condition: '=',
        value: profile.id,
      },
      {
        property: 'provider',
        condition: '=',
        value: provider,
      },
    ],
    999,
    null,
    generatedUserId,
  ).then(entities => entities[0].length);

  if (count === '0') {
    // await db.table('logins').insert({
    //   ...loginKeys,
    //   displayName: profile.displayName,
    //   tokens: JSON.stringify(tokens),
    //   profile: JSON.stringify(profile._json),
    // });
    await createEntity([
      {
        name: '_id',
        value: '',
      },
      {
        name: 'kind',
        value: 'Logins',
        excludeFromIndexes: true,
      },
      {
        name: 'Users_id',
        value: generatedUserId,
      },
      {
        name: 'provider',
        value: provider,
        excludeFromIndexes: true,
      },
      {
        name: 'tokens',
        value: tokens,
        excludeFromIndexes: true,
      },
      {
        name: 'profile',
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
    // await db
    //   .table('logins')
    //   .where(loginKeys)
    //   .update({
    //     displayName: profile.displayName,
    //     tokens: JSON.stringify(tokens),
    //     profile: JSON.stringify(profile._json),
    //     updated_at: db.raw('CURRENT_TIMESTAMP'),
    //   });
    await updateEntity(
      [
        {
          name: '_id',
          value: profile._id,
        },
        {
          name: 'kinds',
          value: 'Logins',
          excludeFromIndexes: true,
        },
        {
          name: 'Users_id',
          value: user._id,
        },
        {
          name: 'tokens',
          value: tokens,
          excludeFromIndexes: true,
        },
        {
          name: 'profile',
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
      ],
      user._id,
    );
  }

  return {
    id: user._id,
    displayName: user.displayName,
    homePublic: user.home,
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
