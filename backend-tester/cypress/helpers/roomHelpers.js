const faker = require('faker')

const ENDPOINT_GET_ROOMS='http://localhost:3000/api/rooms'
const ENDPOINT_POST_ROOM='http://localhost:3000/api/room/new'

function createRandomRoomPayload(){
    const fakeNumber = faker.datatype.number()
    const fakeFloor = faker.datatype.number()
    const fakePrice = faker.datatype.number()
   
    const payload={
        "features":["sea_view"],
        "category":"single",
        "number":fakeNumber,
        "floor":fakeFloor,
        "price":fakePrice,
        "available":true,
    }

    return payload
}

//Test Case 1
function getAllRoomsRequest(cy){
    cy.authenticateSession().then((response =>{
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ROOMS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            cy.log(responseAsString)
        }))
    }))
}

//Assertar rummet
function getRequestRoomAssertion(cy, number,floor){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ROOMS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(number)
        expect(responseAsString).to.have.string(floor)
    }))
}

//Test case 2
function createRoomRequest(cy){
    cy.authenticateSession().then((response =>{
        let fakeRoomPayload = createRandomRoomPayload()

        //Post request to create a room
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_ROOM,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeRoomPayload
        }).then((response =>{
            const responseAsString=JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeRoomPayload.floor)
        }))

        //GET request to fetch all rooms
        getRequestRoomAssertion(cy, fakeRoomPayload.number,fakeRoomPayload.floor)

    }))
}


module.exports = {
    createRandomRoomPayload,
    createRoomRequest,
    getAllRoomsRequest,
}