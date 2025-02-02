import numberal from "numberal";

export const threeDigitCommaInt = (number) => {
    //1,000
    return numberal(number).format('0,0');
};
export const threeDigitCommaFloat = (number) => {
    //1,000.00
    return numberal(number).format('0,0.00');
};
export const abbrNumFloat = (number) => {
    //1.2 k
    return numberal(number).format('0.0a');
};
export const abbrNumInt = (number) => {
    //1 k
    return numberal(number).format('0a');
}
export const oridinalNum = (number) => {
    //1st
    return numberal(number).format('0o');
}