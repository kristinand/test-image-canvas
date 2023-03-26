export const isCoordsInCircle = ({ x, y }, { x: circleX, y: circleY, radius }) => {
    return Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2)) <= radius;
};
