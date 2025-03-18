export const validateBannerDimension = (file) => {
    return new Promise((resolve, reject) =>{
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const width = img.width;
                const height = img.height;
                const ratio = width / height;

                //allow 2.9 - 3.1 ratio
                const isValidRatio = ratio >= 2.9 && ratio <= 3.1; 

                //minimum width === 1200
                const isValidWidth = width >= 1200;

                if(isValidRatio && isValidWidth){
                    resolve(true);
                }else{
                    reject(new Error(`Banner must have 3:1 ratio (like 1200x400) and minimum width of 1200px. Current dimensions: ${width}x${height}`));
                }
            };

            img.onerror = () => reject(new Error('Invalid image file'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Falied to read file'));
        reader.readAsDataURL(file);
    })
}