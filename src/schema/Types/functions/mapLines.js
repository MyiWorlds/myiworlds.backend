import circleSwitch from './circleSwitch';

const mapLines = async (circle, contextUserUid) => {
  circle.lines = await Promise.all(
    circle.lines.map(async circleChild => await circleSwitch(circleChild, contextUserUid))
  );

  return circle;
};

export default mapLines;
