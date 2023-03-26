const ImageViewArea = ({ image, clipArea }) => (
    <div className='cut-image-wrapper'>
        <img
            className='cut-image'
            src={image.src}
            width={image.width}
            height={image.height}
            alt='Итоговая картинка'
            // Использую инлайновые стили, чтобы лишний раз не использовать ref
            style={clipArea ? { clipPath: `inset(${clipArea})` } : undefined}
        />
    </div>
);

export default ImageViewArea;
