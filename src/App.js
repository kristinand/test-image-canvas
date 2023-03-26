import { useState } from 'react';
import ImageEditingArea from './components/ImageEditingArea';
import ImageViewArea from './components/ImageViewArea';
import './App.css';

const imageExtensions = ['.jpg', '.jpeg', '.png'];

const App = () => {
    const [image, setImage] = useState(null);
    const [clipArea, setClipArea] = useState(null);

    const onUpoadImage = (event) => {
        const file = event.target.files[0];

        if (file) {
            const isAllowedExtension = imageExtensions.includes(`.${file.type.split('/')[1]}`);
            if (!isAllowedExtension) {
                alert('Некорректное расширение файла.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = function () {
                const img = new Image();
                img.src = this.result;
                img.onload = function () {
                    setImage(this);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <main className='main'>
            <div className='upload-button-wrapper'>
                <label htmlFor='upload' tabIndex={1} className='upload-button'>
                    <input id='upload' type='file' accept={imageExtensions.join(', ')} onChange={onUpoadImage} />
                    Загрузить файл
                </label>
            </div>

            {image && (
                <>
                    <ImageEditingArea image={image} setClipArea={setClipArea} />
                    <ImageViewArea image={image} clipArea={clipArea} />
                </>
            )}
        </main>
    );
};

export default App;
