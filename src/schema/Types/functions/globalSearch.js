import getEntitiesAndRemoveInvalid from "./getEntitiesAndRemoveInvalid";
import circleSwitch from './circleSwitch';

export default async function globalSearch(
  circle,
  contextUserUid,
) {
  circle = await circleSwitch(circle, contextUserUid)

  return circle;
};
