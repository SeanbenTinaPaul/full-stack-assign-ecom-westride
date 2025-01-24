export const binarySearchProdId = (products, targetId) => {
   //use spread operator to avoid mutating the original products array
   let productArr = [...products].sort((a, b) => a.id - b.id);
   let left = 0;
   let right = productArr.length - 1;

   while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (productArr[mid].id === targetId) {
         return productArr[mid];
      }
      if (productArr[mid].id < targetId) {
         left = mid + 1;
      } else {
         right = mid - 1;
      }
   }
   return null;
};
/*
  const updateCarts = carts.map((cartItem) => {
         //เอา p เพราะใหม่กว่า แต่เก็บ countCart ของเดิมไว้
         let latestProd = products.find((p) => p.id === cartItem.id);
         return latestProd
            ? {
                 ...latestProd,
                 countCart: cartItem.countCart,
                 buyPrice: cartItem.buyPrice,
                 buyPriceNum: cartItem.buyPriceNum,
                 preferDiscount: cartItem.preferDiscount
              }
            : cartItem;
      });
  */
