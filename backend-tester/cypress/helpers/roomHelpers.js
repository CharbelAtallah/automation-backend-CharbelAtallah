const faker = require('faker')

const ENDPOINT_GET_ROOMS='http://localhost:3000/api/rooms'
const ENDPOINT_POST_ROOM='http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOM='http://localhost:3000/api/room/' 
const ENDPOINT_PUT_ROOM='http://localhost:3000/api/Room/1'

function createRandomRoomPayload(){
    const fakeNumber = faker.datatype.number()
    const fakeFloor = faker.datatype.number()
    const fakePrice = faker.datatype.number()
    const fakeId = faker.datatype.number()
   
    const payload={
        "id":fakeId,
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


function deleteRequestAfterGet(cy){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ROOMS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        let lastId = response.body[response.body.length -1].id
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_ROOM+lastId,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        })
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

//Test case 3 
function createRoomAndDelete(cy){
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

        //Delete
        deleteRequestAfterGet(cy)
    }))
}

function editRoom(cy){
    let fakeRoomPayload = createRandomRoomPayload()
    cy.request({
        method:"PUT",
        url:ENDPOINT_PUT_ROOM,
        headers:{
            "X-User-Auth": JSON.stringify(Cypress.env().loginToken),
            "content-type": "application/json",
        },
        body:fakeRoomPayload 
    }).then((response=>{
        const responseAsString = JSON.stringify(response)
        cy.log(responseAsString)
     }))
}



module.exports = {
    createRandomRoomPayload,
    createRoomRequest,
    getAllRoomsRequest,
    createRoomAndDelete,
    editRoom
}