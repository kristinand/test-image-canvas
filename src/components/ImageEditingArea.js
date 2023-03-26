import { useRef, useEffect, useState, useCallback } from 'react';
import { drawCircle } from '../utils/drawCircle';
import { getMouseCoordsInElement } from '../utils/getMouseCoordsInElement';
import { isCoordsInCircle } from '../utils/isCoordsInCircle';
import { debounce } from '../utils/debounce';

const radius = 30;

const ImageEditingArea = ({ image, setClipArea }) => {
    const canvasWidth = image.width + 2 * radius;
    const canvasHeight = image.height + 2 * radius;

    const [draggedFrame, setDraggedFrame] = useState(null);
    const [frame1Coords, setFrame1Coords] = useState({ x: radius, y: radius });
    const [frame2Coords, setFrame2Coords] = useState({ x: image.width + radius, y: image.height + radius });
    const ref = useRef(null);

    useEffect(() => {
        // При смене картинки сбрасываем рамку
        setFrame1Coords({ x: radius, y: radius });
        setFrame2Coords({ x: image.width + radius, y: image.height + radius });
    }, [image.width, image.height]);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const draw = () => {
            const ctx = ref.current.getContext('2d');
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.strokeStyle = 'red';
            ctx.strokeRect(
                frame1Coords.x,
                frame1Coords.y,
                frame2Coords.x - frame1Coords.x,
                frame2Coords.y - frame1Coords.y
            );
            drawCircle(ctx, { ...frame1Coords, radius });
            drawCircle(ctx, { ...frame2Coords, radius });
        };

        const getClipArea = () => {
            let top, bottom, left, right;

            if (frame1Coords.y < frame2Coords.y) {
                top = frame1Coords.y - radius;
                bottom = canvasHeight - radius - frame2Coords.y;
            } else {
                top = frame2Coords.y - radius;
                bottom = canvasHeight - radius - frame1Coords.y;
            }

            if (frame1Coords.x < frame2Coords.x) {
                left = frame1Coords.x - radius;
                right = canvasWidth - radius - frame2Coords.x;
            } else {
                left = frame2Coords.x - radius;
                right = canvasWidth - radius - frame1Coords.x;
            }

            setClipArea(`${top}px ${right}px ${bottom}px ${left}px`);
        };

        draw();
        getClipArea();
    }, [canvasHeight, canvasWidth, frame1Coords, frame2Coords, setClipArea]);

    const onMouseDown = (event) => {
        const mouseCoords = getMouseCoordsInElement(ref.current, event);

        if (isCoordsInCircle(mouseCoords, { ...frame1Coords, radius })) {
            setDraggedFrame('left');
        } else if (isCoordsInCircle(mouseCoords, { ...frame2Coords, radius })) {
            setDraggedFrame('right');
        }
    };

    const getCoordsInBounds = useCallback(
        ({ x, y }) => {
            let newX = x <= radius ? radius : x;
            let newY = y <= radius ? radius : y;

            const rightBound = canvasWidth - radius;
            if (x > rightBound) {
                newX = rightBound;
            }

            const bottomBound = canvasHeight - radius;
            if (y > bottomBound) {
                newY = bottomBound;
            }

            return { x: newX, y: newY };
        },
        [canvasHeight, canvasWidth]
    );

    const onMouseMove = useCallback(
        (event) => {
            if (!draggedFrame) {
                return;
            }

            const { x, y } = getCoordsInBounds(getMouseCoordsInElement(ref.current, event));

            if (draggedFrame === 'left') {
                setFrame1Coords({ x, y });
            } else if (draggedFrame === 'right') {
                setFrame2Coords({ x, y });
            }
        },
        [draggedFrame, getCoordsInBounds]
    );

    // Избегаем частых обновлений состояния, используя debounce
    const onMouseMoveDebounced = useCallback(debounce(onMouseMove, 100), [onMouseMove]);

    const onMouseUp = () => {
        setDraggedFrame(null);
    };

    return (
        <div className='original-image-wrapper'>
            <canvas
                ref={ref}
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMoveDebounced}
                onMouseUp={onMouseUp}
            />
            <img
                className='original-image'
                src={image.src}
                width={image.width}
                height={image.height}
                alt='Исходная картинка'
            />
        </div>
    );
};

export default ImageEditingArea;
