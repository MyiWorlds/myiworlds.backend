import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import uuid from 'uuid/v1';
import { createEntity, getEntities } from '../../../../gcp/datastore/queries';
import UserType from '../UserType';
import { passwordHash } from '../../../../utils/index';

const userId = 'viewer000000000000000000000000000001';

const CreateUserMutation = mutationWithClientMutationId({
  name: 'createUser',
  inputFields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    ui: { type: GraphQLString },
    watching: { type: GraphQLString },
    balance: { type: GraphQLString },
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

    // const checkUsername = () =>
    //   getEntities(
    //     'Users',
    //     [
    //       {
    //         property: 'username',
    //         condition: '=',
    //         value: inputFields.username,
    //       },
    //     ],
    //     1,
    //     null,
    //     null,
    //   );

    // const checkEmail = () =>
    //   getEntities(
    //     'Users',
    //     [
    //       {
    //         property: 'email',
    //         condition: '=',
    //         value: inputFields.username,
    //       },
    //     ],
    //     1,
    //     null,
    //     null,
    //   );

    // await checkUsername();
    // await checkEmail();
    // console.log(checkUsername.entities, checkEmail.entities);
    // if (checkUsername.entities || checkEmail.entities) {
    //   return {
    //     message: 'Username or email are already in use',
    //   };
    // }

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
    ];

    requiredFields.forEach(field => {
      entityToCreate.push(field);
    });

    function buildField(name) {
      let field;

      async function encryptPassword() {
        field = {
          name,
          value: passwordHash(inputFields[name]),
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
        ui: indexedField,
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
