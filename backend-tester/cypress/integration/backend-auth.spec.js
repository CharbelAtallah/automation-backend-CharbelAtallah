/// <reference types="cypress" />

import * as roomHelpers from '../helpers/roomHelpers'

describe('testing auth', function(){

    it('test case 1 - check room', function(){
        cy.authenticateSession().then((response =>{
            cy.request({
                method: "GET",
                url: 'http://localhost:3000/api/rooms',
                headers:{
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
            }).then((response =>{
                cy.log(response.body)
                cy.log(response.body[0].id)
                cy.log(response.body[0].created)
                cy.log(response.body[0].category)
                cy.log(response.body[0].floor)
                cy.log(response.body[0].number)
                cy.log(response.body[0].available)
                cy.log(response.body[0].price)
            }))
        }))
    })

    it('test case 2 - Create a room', function(){
        cy.authenticateSession().then((response =>{

            const payload={
                "features":["sea_view"],
                "category":"single",
                "number":"555",
                "floor":"5",
                "available":true,
                "price":"5000"
            }
cy.request({
                method: "POST",
                url: 'http://localhost:3000/api/room/new',
                headers:{
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body:payload
            }).then((response =>{
                const responseAsString=JSON.stringify(response)
                expect(responseAsString).to.have.string(payload.floor)
            }))
        }))
    })

    it.only('test case 2 - Create a room', function(){
        cy.authenticateSession().then((response =>{
            let fakeRoomPayload = roomHelpers.createRandomRoomPayload()

            //Post request to create a room
            cy.request({
                method: "POST",
                url: 'http://localhost:3000/api/room/new',
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
            cy.request({
                method: "GET",
                url: 'http://localhost:3000/api/rooms',
                headers:{
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
            }).then((response =>{
                const responseAsString = JSON.stringify(response)
                expect(responseAsString).to.have.string(fakeRoomPayload.number)
                expect(responseAsString).to.have.string(fakeRoomPayload.floor)
            }))
        }))
    })

})