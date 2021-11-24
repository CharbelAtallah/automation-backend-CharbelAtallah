const faker = require('faker')

function createRandomRoomPayload(){
    const fakeNumber = faker.datatype.number()
    const fakeFloor = faker.datatype.number()
    const fakePrice = faker.commerce.price()
   
    const payload={
        "features":["sea_view"],
        "category":"single",
        "number":fakeNumber,
        "floor":fakeFloor,
        "available":true,
        "price":fakePrice,
    }

    return payload
}

module.exports = {
    createRandomRoomPayload
}