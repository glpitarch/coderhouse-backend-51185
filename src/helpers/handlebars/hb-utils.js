export default class HandlebarsUtils {
    async isAdmin (userSession) {
        return userSession.role == 'admin' ? true : false
    }

    async isExternalAcces (userSession) {
        const isExternalAcces = userSession.password == '' ? true : false
        return isExternalAcces
    }

    async addCartIdToProducts (cid, products) {
        try {
            products.forEach(product => {
                product['cartId'] = cid
            })
            return products
        } catch (error) {
            return error.message
        }
    }

    async addCartIdToProducts (cid, products) {
        try {
            products.forEach(product => {
                product['cartId'] = cid
            })
            return products
        } catch (error) {
            return error.message
        }
    }

    async totalPricePucharse (productsInCart) {
        try {
            let totalPrices = []
            productsInCart.forEach(product => {
                let totalPriceItem = product._id.price * product.quantity
                product["totalPrice"] = totalPriceItem
                totalPrices.push(product.totalPrice)
            })
            let totalPricePucharse = 0
            if (productsInCart.length > 0) {
                totalPricePucharse = totalPrices.reduce((acc, price) => {
                    return acc + price
                })
            }
            return totalPricePucharse
        } catch (error) {
            return error.message
        }
    }
}