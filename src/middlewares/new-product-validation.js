export const newProductValidation = (req,res,next) => {
    const regex = /^[0-9]*$/
    let { category, title, description, price, stock, code } = req.body
    let isStockNumber = regex.test(stock)
    let isPriceNumber = regex.test(price)

    if( !category || !title || !description || !price || !stock || !code ){
        res.status(400).json({
            status: 'error',
            message: 'All inputs fields are needed!'
        })
    } else if ( stock < 0 || price < 0 || !isStockNumber || !isPriceNumber ){
        res.status(400).json({
            status: 'error',
            message: 'Stock and price fields must be a positive numbers!'
        })
    } else {
        return next()
    }
}
