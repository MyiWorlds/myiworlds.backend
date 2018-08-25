import getEntitiesAndRemoveInvalid from './getEntitiesAndRemoveInvalid';
import mapLines from './mapLines';

const circleSwitch = async (circle, contextUserUid) => {
  switch(circle.type) {
    case 'QUERY': {
      circle = await getEntitiesAndRemoveInvalid(
        circle,
        contextUserUid
      );
      return circle;
    }

    case 'QUERIES':
    case 'LINES': {
      circle = await mapLines(circle, contextUserUid);
      return circle;
    }

    default: {
      return circle;
    }
  }
};

export default circleSwitch;
