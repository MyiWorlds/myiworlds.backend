import { createEntity } from '../../../../../gcp/datastore/queries';
import buildCircle from './buildCircle';

export default async function createCircle(inputFields, contextUserId) {
  if (contextUserId !== inputFields.creator) {
    return {
      message: 'Sorry, your id does not match the creator of this circles id.',
    };
  }
  const builtCircle = await buildCircle(inputFields);

  return createEntity(builtCircle, contextUserId);
}
