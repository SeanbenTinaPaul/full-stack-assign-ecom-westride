import moment from "moment";
// import moment from "moment/min/moment-with-locales";

//  "February 3, 2025, 5:35:08 PM"
export const dateMMMMDoYYYYhmsa = (date) => {
   return moment(date).format("MMMM Do YYYY, h:mm:ss a");
};

//   "Feb 3, 25"
export const dateMMMDoYY = (date) => {
   return moment(date).format("MMM Do YY");
};

//  "5 hours ago" หรือ "in 3 days"
export const agoYYYYMMDD = (date) => {
   return moment(date).fromNow();
};

// "18 hours ago"
export const startOfDayFromNow = (date) => {
   return moment(date).startOf('day').fromNow();
};

// เวลาสิ้นสุดของวัน  "in 6 hours"
export const endOfDayFromNow = (date) => {
   return moment(date).endOf('day').fromNow();
};

//  "45 minutes ago"
export const startOfHourFromNow = (date) => {
   return moment(date).startOf('hour').fromNow();
};

// แสดงปฏิทินเมื่อหักวัน/เพิ่มวัน
export const subtract10DaysCalendar = (date) => {
   return moment(date).subtract(10, 'days').calendar();
};

export const subtract6DaysCalendar = (date) => {
   return moment(date).subtract(6, 'days').calendar();
};

export const subtract3DaysCalendar = (date) => {
   return moment(date).subtract(3, 'days').calendar();
};

export const subtract1DayCalendar = (date) => {
   return moment(date).subtract(1, 'days').calendar();
};

export const todayCalendar = (date) => {
   return moment(date).calendar();
};

export const add1DayCalendar = (date) => {
   return moment(date).add(1, 'days').calendar();
};

export const add3DaysCalendar = (date) => {
   return moment(date).add(3, 'days').calendar();
};

export const add10DaysCalendar = (date) => {
   return moment(date).add(10, 'days').calendar();
};

// Locale ปัจจุบัน
export const currentLocale = () => {
   return moment.locale();
};

// รูปแบบเวลาต่าง ๆ
export const formatLT = (date) => {
   return moment(date).format('LT');   //  "5:35 PM"
};

export const formatLTS = (date) => {
   return moment(date).format('LTS');  //  "5:35:08 PM"
};

export const formatL = (date) => {
   return moment(date).format('L');    //  "02/03/2025"
};

export const formatl = (date) => {
   return moment(date).format('l');    //  "2/3/2025"
};

export const formatLL = (date) => {
   return moment(date).format('LL');   // "February 3, 2025"
};

export const formatll = (date) => {
   return moment(date).format('ll');   //  "Feb 3, 2025"
};

export const formatLLL = (date) => {
   return moment(date).format('LLL');  //  "February 3, 2025 5:35 PM"
};

export const formatlll = (date) => {
   return moment(date).format('lll');  //  "Feb 3, 2025 5:35 PM"
};

export const formatLLLL = (date) => {
   return moment(date).format('LLLL'); //  "Monday, February 3, 2025 5:35 PM"
};

export const formatllll = (date) => {
   return moment(date).format('llll'); //  "Mon, Feb 3, 2025 5:35 PM"
};
