const faker = require('faker')

const ENDPOINT_GET_ROOMS='http://localhost:3000/api/rooms'
const ENDPOINT_POST_ROOM='http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOM='http://localhost:3000/api/room/'


    // skapa information för rummet 
    function createRoomPayload(){
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
    // Create room
    function createRoom(cy){
        let roomPayload=createRoomPayload()
        //skickar post för att skapa rum
            cy.request({
                method:'POST',
                url:ENDPOINT_POST_ROOM,
                headers:{
                    'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                    'Content-Type':'application/json'
                },
                body:roomPayload
            }).then((response=>{
                const responseString=JSON.stringify(response.body)
                expect(responseString).to.have.string(roomPayload.number)
            }))
    }
    // Get all rooms
    function getRoomsAndDelete(cy){
            cy.request({
            method:'GET',
            url:ENDPOINT_GET_ROOMS,
            headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
            },
        }).then((response =>{
            return response
        }))
    }

    // Delete Rum
    function deleteLatestRoom(cy){
        cy.request({
            method:'GET',
            url:ENDPOINT_GET_ROOMS,
            headers:{
                'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response=>{
            let lastId = response.body[response.body.length-1].id
        cy.request({
            method:"DELETE",
            url: ENDPOINT_GET_ROOM+lastId,
            headers:{
                'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response=>{

            cy.request({
                method:'GET',
                url:ENDPOINT_GET_ROOMS,
                headers:{
                    'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
            }).then((response=>{
                var responseString = JSON.stringify(response)
                expect(responseString).to.not.have.string('id: '+lastId)
                //cy.log(responseString)
            }))
        }))
    }))
 }


   function createAndDeleteRoom(cy){
       cy.authenticateSession().then((response=>{
        createRoom(cy)
        deleteLatestRoom(cy)
        getRoomsAndDelete(cy)
       }))
   }

    module.exports={
        createAndDeleteRoom,
    }
