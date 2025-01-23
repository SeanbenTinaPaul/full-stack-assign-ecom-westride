// export const formatNumber = (num) => {
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

export const formatNumber = (num) => {
  // ปัดเศษทศนิยม 2 ตำแหน่ง
  const roundedNum = Math.round(num * 100) / 100;
  
  // แปลงเป็น string และแยกส่วนจำนวนเต็มกับทศนิยม
  const [integerPart, decimalPart = ''] = roundedNum.toString().split('.');
  
  // เพิ่มเครื่องหมายคั่นหลัก
  const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // จัดการทศนิยม
  const formattedDecimal = decimalPart.padEnd(2, '0');
  
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
