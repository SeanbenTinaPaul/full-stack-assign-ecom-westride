// export const formatNumber = (num) => {
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

export const formatNumber = (num) => {
  // ปัดเศษทศนิยม 2 ตำแหน่ง round() 0.5 → 1 | 0.4 → 0
  // 12.345 → 1234.5 |► round() → 1235 |► ()/100 → 12.35
  const roundedNum = Math.round(num * 100) / 100;
  
  // แปลงเป็น string และแยกส่วนจำนวนเต็มกับทศนิยม
  const [integerPart, decimalPart = ''] = roundedNum.toString().split('.');
  
  // เพิ่มเครื่องหมายคั่นหลัก
  const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // \B matches a position where the specified characters are not at the beginning or end of a word. (not at the start of the string)
  // (\d{3} matches every 3 digits, and + matches one or more of the preceding element).
  // (?!\d) part was used to prevent the regular expression from matching the last group of 3 digits
  // No (?!\d) → "123,456,"

  // จัดการทศนิยม
  const formattedDecimal = decimalPart.padEnd(2, '0');
  // "1" → "10" | "12" → "12" | "" → "00"

  // ถ้าทศนิยมเป็น .00 ไม่ต้องแสดง
  return formattedDecimal === '00' ? withCommas : `${withCommas}.${formattedDecimal}`;
};

// export const formatNumber = (num) => {
//   // Convert to number and round to 2 decimal places
//   const rounded = Number(num).toFixed(2);
  
//   // Split into integer and decimal parts
//   const [integerPart, decimalPart] = rounded.split('.');
  
//   // Add commas to integer part
//   const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
//   // Return formatted number with decimal part
//   return decimalPart ? `${withCommas}.${decimalPart}` : withCommas;
// };
