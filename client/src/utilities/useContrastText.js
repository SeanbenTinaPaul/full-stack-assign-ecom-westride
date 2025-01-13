//npm i colorthief
// import { useState, useEffect } from 'react';
import ColorThief from 'colorthief';

export const calculateTextColor = (imgElement) => {
  const colorThief = new ColorThief();
  const [r, g, b] = colorThief.getColor(imgElement);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b; // Calculate luminance
  return luminance > 128 ? "black" : "white"; // Choose contrast color
};

// export const useContrastText = (imageElement) => {
//   const [textColor, setTextColor] = useState('black');

//   useEffect(() => {
//     if (imageElement) {
//       const colorThief = new ColorThief();
//       const [r, g, b] = colorThief.getColor(imageElement);//เมธอด getColor(image) เพื่อรับค่าสี RGB ของสีหลักจากภาพ
//       const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;//ใช้สูตรแปลงค่าสี RGB เป็นค่า luminance 
//       const contrastColor = luminance > 128 ? 'black' : 'white';
//       /*
//       กำหนดสีข้อความตามความสว่าง:
//         - หากค่า luminance ที่คำนวณได้สูง (สีพื้นหลังสว่าง) ให้กำหนดสีข้อความเป็นสีเข้ม (เช่น สีดำ)
//         - หากค่า luminance ต่ำ (สีพื้นหลังเข้ม) ให้กำหนดสีข้อความเป็นสีอ่อน (เช่น สีขาว)
//       */
//       setTextColor(contrastColor);
//     }
//   }, [imageElement]);

//   return textColor;
// };

/*
   const calculateTextColor = (imgElement, assetId) => {
      const colorThief = new ColorThief();
      const [r, g, b] = colorThief.getColor(imgElement);
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b; // Calculate luminance
      const contrastColor = luminance > 128 ? "black" : "white"; // Choose contrast color
      setTextColors((prev) => ({ ...prev, [assetId]: contrastColor }));
   };
*/