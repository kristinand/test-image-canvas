export const getMouseCoordsInElement = (element, { clientX, clientY }) => {
    const { left, top } = element?.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;

    return { x, y };
};
