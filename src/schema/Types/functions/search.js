import getEntitiesAndRemoveInvalid from "./getEntitiesAndRemoveInvalid";

const hasFetchedEnough = (circle, requestedNumberOfResults) => {
  return circle.lines.length <
    requestedNumberOfResults &&
    circle.object.cursor.moreResults === 'MORE_RESULTS_AFTER_LIMIT'
};

export default async function search(
  title,
  icon,
  kind,
  filters,
  requestedNumberOfResults,
  cursor,
  userUid
) {
  let circle = {
    uid: title.replace(/\s+/g, '-'),
    title: title || '',
    icon: icon || 'public',
    type: 'QUERY',
    object: {
      kind,
      filters,
      requestedNumberOfResults,
      cursor,
    },
    lines: [],
  };

  circle = await getEntitiesAndRemoveInvalid(
    circle,
    kind,
    filters,
    requestedNumberOfResults,
    cursor,
    userUid,
  );

  const fetchMore = hasFetchedEnough(circle, requestedNumberOfResults);
  var numberOfRetries = 0

  while(fetchMore && numberOfRetries < 3) {
    numberOfRetries++

      const amountToRefetch = requestedNumberOfResults - circle.lines.length;

      circle = await getEntitiesAndRemoveInvalid(
        circle,
        kind,
        filters,
        requestedNumberOfResults,
        circle.object.cursor.endCursor,
        userUid,
      );
  }

  return circle;
};

