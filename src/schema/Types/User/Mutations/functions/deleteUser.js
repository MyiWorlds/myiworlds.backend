import {
  getEntities,
  deleteEntity,
  getEntityByKey,
} from '../../../../../gcp/datastore/queries';
import deleteEntities from '../../../../../gcp/datastore/queries/deleteEntities';
import datastoreClient from '../../../../../gcp/datastore/datastoreConnection';

// Wherever this function gets used it may need some special server requirements as
// data of a user grows to be in the millions
export default async function deleteUser(uid, contextUserUid) {
  let response = {
    status: null,
    message: null,
    uidToDelete: uid,
    wasDeleted: false,
    numberOfClones: 0,
    clonesDeleted: false,
    profileMediaDeleted: false,
  };
  try {
    const getPiiCircles = await getEntities(
      'circles',
      [
        {
          property: 'pii',
          condition: '=',
          value: true,
        },
        {
          property: 'creator',
          condition: '=',
          value: contextUserUid,
        },
      ],
      9999,
      null,
      contextUserUid,
    ).then(res => res.entities);

    if (getPiiCircles.length) {
      const keysToDelete = getPiiCircles.map(item =>
        datastoreClient.key([item.kind, item.uid]),
      );
      await deleteEntities(keysToDelete, contextUserUid);
    }

    // This cleans up any clones that were pii at some point in history
    const getPiiCirclesClones = await getEntities(
      'circles-clones',
      [
        {
          property: 'pii',
          condition: '=',
          value: true,
        },
        {
          property: 'creator',
          condition: '=',
          value: contextUserUid,
        },
      ],
      9999,
      null,
      contextUserUid,
    ).then(res => res.entities);

    if (getPiiCirclesClones.length) {
      const keysToDelete = getPiiCirclesClones.map(item =>
        datastoreClient.key([item.kind, item.uid]),
      );
      await datastoreClient.delete(keysToDelete).then(() => {
        response.numberOfCircleClonesDeleted =
          getPiiCirclesClones.entities.length;
      });
    }

    const userLogin = await getEntities(
      'logins',
      [
        {
          property: 'creator',
          condition: '=',
          value: uid,
        },
      ],
      1,
      null,
      contextUserUid,
    ).then(res => res.entities[0]);

    // Delete Logins
    // Query by creator field with users id
    if (userLogin) {
      const loginsDeleted = await deleteEntity(
        'logins',
        userLogin.uid,
        contextUserUid,
      );

      if (loginsDeleted) {
        response = {
          loginsDeleted: true,
        };
      }
    }

    // Delete Users Profile Media (created by system)
    const user = await getEntityByKey('users', uid, contextUserUid).then(
      res => res.entity,
    );

    if (user.profileMedia) {
      await deleteEntity('users', user.profileMedia, 'APP');
      response.profileMediaDeleted = true;
    }

    // then delete user
    const userDeleted = await deleteEntity('users', uid, contextUserUid);

    if (userDeleted && userDeleted.wasDeleted) {
      response.userDeleted = true;
    }
  } catch (err) {
    console.log(err);
  }
  return response;
}
