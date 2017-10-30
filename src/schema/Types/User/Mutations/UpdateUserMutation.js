// import { mutationWithClientMutationId } from 'graphql-relay';
// import { GraphQLString, GraphQLNonNull } from 'graphql';
// import {
//   updateEntity,
//   getEntityByKey,
// } from '../../../../gcp/datastore/queries';
// import UserType from '../UserType';

// // Pull from context
// const userId = 'viewer00000000000000000000000000001';

// const UpdateUserMutation = mutationWithClientMutationId({
//   name: 'updateUser',
//   inputFields: {
//     username: { type: new GraphQLNonNull(GraphQLString) },
//     email: { type: new GraphQLNonNull(GraphQLString) },
//     dateCreated: { type: GraphQLString },
//   },

//   outputFields: {
//     message: {
//       type: GraphQLString,
//       resolve: payload => payload.message,
//     },
//     updatedUser: {
//       type: UserType,
//       resolve: async payload =>
//         getEntityByKey('Users', payload.createdEntityId, userId).then(
//           response => response.entity,
//         ),
//     },
//     latestVersionOfUser: {
//       type: UserType,
//       resolve: async payload =>
//         getEntityByKey(
//           payload.latestVersionOfEntity.newKind,
//           payload.latestVersionOfEntity.new_id,
//           userId,
//         ).then(response => response.entity),
//     },
//   },

//   mutateAndGetPayload: async inputFields => {
//     const entityToUpdate = [];
//     // Need to get the actual saved entity (passwords wont be supplied from frontend)
//     const getUser = await getEntityByKey('Users', inputFields._id, userId);

//     const requiredFields = [
//       {
//         name: 'kind',
//         value: 'Users',
//         excludeFromIndexes: true,
//       },
//     ];

//     entityToUpdate.push(requiredFields[0]);

//     function buildField(name) {
//       let field;

//       function indexedField() {
//         field = {
//           name,
//           value: getUser[name],
//         };
//       }

//       function notIndexedField() {
//         field = {
//           name,
//           value: getUser[name],
//           excludeFromIndexes: true,
//         };
//       }

//       const entityData = {
//         _id: indexedField,
//         // type: indexedField,
//         // creator: indexedField,
//         // editors: indexedField,
//         // dateUpdated: indexedField,
//         // dateCreated: indexedField,
//         // slug: indexedField,
//         // title: indexedField,
//         // subtitle: indexedField,
//         // description: indexedField,
//         // public: indexedField,
//         // tags: indexedField,
//         // order: indexedField,

//         default: notIndexedField,
//       };
//       (entityData[name] || entityData.default)();

//       return field;
//     }

//     Object.keys(getUser).forEach(prop => {
//       const object = buildField(prop);
//       entityToUpdate.push(object);
//     });

//     return updateEntity(entityToUpdate, userId);
//   },
// });
// export default UpdateUserMutation;
