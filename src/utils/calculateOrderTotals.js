function calculateOrderTotals({ items, taxRate = 0, shippingFee = 0, coupon }) {

    let subtotal = 0;
    let orderItems = [];

    for (const item of items) {
        const {product, quantity, image} = item;
        const price = product.costPrice || 0; // The Product model now uses costPrice for total calculation
        const discount = product.discountPercentage || 0;

        const discountedUnitPrice = price - (price * discount) / 100;
        const itemTotal = discountedUnitPrice * quantity;

        subtotal += itemTotal;

        orderItems.push({
            product: product._id,
            name: product.name,
            image: image || (product.images && product.images[0]) || "", // Schema requires an image
            price: price,
            discountAt: discount,
            itemTotal,
            quantity,
        })
    }

    let couponDiscount = 0;
    if (coupon) {
        couponDiscount = subtotal * (coupon.discountPercentage / 100)
    }

    if(couponDiscount > subtotal) {
        couponDiscount = subtotal;
    }
    
    const discountedSubtotal = subtotal - couponDiscount;
    const taxAmount = discountedSubtotal * taxRate;
    const shipping = shippingFee;

    const total = discountedSubtotal + taxAmount + shipping;

    return { 
        orderItems,         // Snapshot of items purchased
        subtotal,           // Before coupon
        couponDiscount,     // How much coupon removed
        tax: taxAmount,     // Tax amount calculated
        shipping,           // Shipping fee added
        total               // Final amount customer pays
     };
}

module.exports = calculateOrderTotals;