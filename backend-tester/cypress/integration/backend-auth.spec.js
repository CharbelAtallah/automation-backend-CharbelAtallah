/// <reference types="cypress" />

//curl 'http://localhost:3000/api/login' 
//-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0' 
//-H 'Accept: application/json' 
//-H 'Accept-Language: sv-SE,sv;q=0.8,en-US;q=0.5,en;q=0.3' 
//--compressed -H 'Referer: http://localhost:3000/login' 
//-H 'Content-Type: application/json;charset=UTF-8' 
//-H 'Origin: http://localhost:3000/' -H 'Connection: keep-alive' 
//--data-raw '{"username":"tester01","password":"GteteqbQQgSr88SwNExUQv2ydb7xuf8c"}'

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

})