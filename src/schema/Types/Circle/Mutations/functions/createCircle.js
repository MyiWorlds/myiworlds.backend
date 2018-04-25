import { createEntity } from '../../../../../gcp/datastore/queries';
import buildCircle from './buildCircle';

export default async function createCircle(inputFields, contextUserUid) {
  if (contextUserUid !== inputFields.creator) {
    return {
      message:
        'Sorry, your uid does not match the creator of this circles uid.',
    };
  }
  const builtCircle = await buildCircle(inputFields);

  return createEntity(builtCircle, contextUserUid);
}
