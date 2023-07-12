import { Faker, en } from "@faker-js/faker";

export const customFaker = new Faker({
    locale: [en],
})

const { commerce, image, database, string, datatype } = customFaker;

export const generateProduct = () => {
    return {
        _id: database.mongodbObjectId(),
        category: commerce.productMaterial(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        price: parseFloat(commerce.price()),
        stock: parseInt(string.numeric(2)),
        code: string.alphanumeric(10),
        thumbnail: image.url(),
        status: datatype.boolean()
    }
}