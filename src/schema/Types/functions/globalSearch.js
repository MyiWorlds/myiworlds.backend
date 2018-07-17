import getEntitiesAndRemoveInvalid from "./getEntitiesAndRemoveInvalid";
import search from "./search";

const hasFetchedEnough = (circle, requestedNumberOfResults) => {
  return circle.lines.length <
    requestedNumberOfResults &&
    circle.object.cursor.moreResults === 'MORE_RESULTS_AFTER_LIMIT'
};

const searchEntities = async (
  title,
  icon,
  kind,
  filters,
  requestedNumberOfResults,
  cursor,
  userUid,
  circle,
  extraFilter
) => {
  const userViewableFilters = extraFilter ? filters.concat(extraFilter) : filters;
  circle.lines = circle.lines.concat(
    await search(
      title,
      icon,
      kind,
      userViewableFilters,
      requestedNumberOfResults,
      cursor,
      userUid
    )
  );
};

export default async function globalSearch(
  getMyCreations,
  getMyViewable,
  getMyEditable,
  getAllResults,
  kind,
  filters,
  requestedNumberOfResults,
  cursor,
  userUid
) {
  let circle = {
    uid: 'search',
    icon: 'search',
    type: 'LINES_QUERY',
    object: {
      kind,
      filters,
      requestedNumberOfResults,
      cursor,
    },
    lines: [],
  };

  if (userUid) {
    if (getMyCreations) {
      let searchCreated = await searchEntities(
        'My Creations',
        'account_circle',
        kind,
        filters,
        requestedNumberOfResults,
        cursor,
        userUid,
        circle,
        {
          property: 'creator',
          condition: '=',
          value: userUid,
        },
      );

      circle.lines = circle.lines.concat(searchCreated);
    }

    if (getMyViewable) {
      let searchViewable = await searchEntities(
        'Viewable',
        'remove_red_eye',
        kind,
        filters,
        requestedNumberOfResults,
        cursor,
        userUid,
        circle,
        {
          property: 'viewers',
          condition: '=',
          value: userUid,
        },
      );

      circle.lines = circle.lines.concat(getMyViewable);
    }

    if (getMyEditable) {
      let searchEditable = await searchEntities(
        'Editable',
        'edit',
        kind,
        filters,
        requestedNumberOfResults,
        cursor,
        userUid,
        circle,
        {
          property: 'editors',
          condition: '=',
          value: userUid,
        },
      );

      circle.lines = circle.lines.concat(getMyEditable);
    }

  }

  if (getAllResults) {
    let searchPublic = await searchEntities(
      'All Results',
      'public',
      kind,
      filters,
      requestedNumberOfResults,
      cursor,
      userUid,
      circle,
      {
        property: 'public',
        condition: '=',
        value: true,
      },
    );

    circle.lines = circle.lines.concat(searchPublic);
  }

  circle.lines = circle.lines.filter(circle => typeof circle === 'object');

  return circle;
};

