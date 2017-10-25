import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import uuid from 'uuid/v1';
import { createEntity, getEntities } from '../../../../gcp/datastore/queries';
import UserType from '../UserType';
import { passwordHash } from '../../../../utils/index';

const CreateUserMutation = mutationWithClientMutationId({
  name: 'createUser',
  inputFields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    dateCreated: { type: GraphQLString },
  },

  outputFields: {
    message: {
      type: GraphQLString,
      resolve: response => response.message,
    },
    createdUser: {
      type: UserType,
      resolve: async payload => payload.createdEntity,
    },
  },

  mutateAndGetPayload: async inputFields => {
    // Make sure username is lowercase
    inputFields.username = inputFields.username.toLowerCase();

    const passwordTest = await passwordHash(inputFields.password);
    console.log('passwordTest', passwordTest);

    const checkUsername = await getEntities(
      'Users',
      [
        {
          property: 'username',
          condition: '=',
          value: inputFields.username,
        },
      ],
      1,
      null,
      null,
    );
    const checkEmail = await getEntities(
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
    );

    if (checkUsername.entities[0] || checkEmail.entities[0]) {
      const username = checkUsername.entities[0] ? 'Username ' : '';
      const email = checkEmail.entities[0] ? 'Email ' : '';
      const message =
        checkUsername.entities[0] && checkEmail.entities[0]
          ? `${username}and ${email}`
          : username + email;
      return {
        message: `${message}is already in use`,
      };
    }

    const entityToCreate = [];
    const requiredFields = [
      {
        name: '_id',
        value: uuid(),
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
      entityToCreate.push(field);
    });

    function buildField(name) {
      let field;

      async function encryptPassword() {
        field = {
          name,
          value: await passwordHash(inputFields[name]),
          excludeFromIndexes: true,
        };
      }

      function indexedField() {
        field = {
          name,
          value: inputFields[name],
        };
      }

      function notIndexedField() {
        field = {
          name,
          value: inputFields[name],
          excludeFromIndexes: true,
        };
      }

      const entityData = {
        username: indexedField,
        email: indexedField,
        pasword: encryptPassword,
        balance: notIndexedField,
        default: notIndexedField,
      };
      (entityData[name] || entityData.default)();

      return field;
    }

    Object.keys(inputFields).forEach(prop => {
      const object = buildField(prop);
      entityToCreate.push(object);
    });

    return createEntity(entityToCreate);
  },
});

export default CreateUserMutation;
