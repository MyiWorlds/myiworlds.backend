import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import uuid from 'uuid/v1';
import {
  updateEntity,
  getEntityByKey,
  getEntities,
} from '../../../../gcp/datastore/queries';
import UserType from '../UserType';
import { passwordHash } from '../../../../utils/index';

// Get from context
const userId = 'viewer00000000000000000000000000001';

// This mutation will most likely only be called after visiting a page from email
const UpdatePasswordMutation = mutationWithClientMutationId({
  name: 'updatePassword',
  inputFields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },

  outputFields: {
    message: {
      type: GraphQLString,
      resolve: payload => payload.message,
    },
    latestVersionOfPassword: {
      type: UserType,
      resolve: async payload =>
        getEntityByKey(
          payload.latestVersionOfEntity.newKind,
          payload.latestVersionOfEntity.new_id,
          userId,
        ).then(response => response.entity),
    },
  },

  mutateAndGetPayload: async inputFields => {
    const entityToUpdate = [];
    const getUser = await getEntities(
      'Users',
      [
        {
          property: 'email',
          condition: '=',
          value: inputFields.email,
        },
      ],
      1,
      null,
      null,
    ).then(response => response.entities[0]);

    const requiredFields = [
      {
        name: '_id',
        value: await uuid(),
      },
      {
        name: 'kind',
        value: 'Users',
        excludeFromIndexes: true,
      },
      {
        name: 'homePublic',
        value: `${inputFields.username}`,
        excludeFromIndexes: true,
      },
      {
        name: 'homePrivate',
        value: `${inputFields.username}/private`,
        excludeFromIndexes: true,
      },
      {
        name: 'balance',
        value: 0,
        excludeFromIndexes: true,
      },
      {
        name: 'level',
        value: 0,
        excludeFromIndexes: true,
      },
      {
        name: 'rating',
        value: 0,
        excludeFromIndexes: true,
      },
    ];

    requiredFields.forEach(field => {
      entityToUpdate.push(field);
    });

    let hash = await passwordHash(inputFields.password);
    hash = Buffer.from(hash).toString('base64');

    function buildField(name) {
      let field;

      function encryptPassword() {
        field = {
          name,
          value: hash,
          excludeFromIndexes: true,
        };
      }

      function indexedField() {
        field = {
          name,
          value: getUser[name],
        };
      }

      function notIndexedField() {
        field = {
          name,
          value: getUser[name],
          excludeFromIndexes: true,
        };
      }

      const entityData = {
        username: indexedField,
        email: indexedField,
        password: encryptPassword,
        balance: notIndexedField,

        default: notIndexedField,
      };
      (entityData[name] || entityData.default)();

      return field;
    }

    Object.keys(getUser).forEach(prop => {
      const object = buildField(prop);
      entityToUpdate.push(object);
    });

    return updateEntity(entityToUpdate, userId);
  },
});
export default UpdatePasswordMutation;
