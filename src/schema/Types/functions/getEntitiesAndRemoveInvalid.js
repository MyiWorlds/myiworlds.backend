import { getEntities } from "../../../gcp/datastore/queries";
import removeAllInvalid from "./removeAllInvalid";

export default async function getEntitiesAndRemoveInvalid(
  circle,
  kind,
  filters,
  requestedNumberOfResults,
  cursor,
  userUid,
) {
  const result = await getEntities(
    kind,
    filters,
    requestedNumberOfResults,
    cursor,
    userUid,
  );

  const resultsFiltered = removeAllInvalid(result.entities);

  circle.lines = circle.lines.concat(resultsFiltered)
  circle.object.cursor = result.cursor;

  return circle;
}
