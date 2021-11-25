const faker = require('faker')

const ENDPOINT_GET_Bills='http://localhost:3000/api/bills'
const ENDPOINT_POST_Bill='http://localhost:3000/api/bill/new'

function createRandomBillPayload(){
    const fakeValue = faker.finance.account()
    const billpayload={
        "value":fakeValue,
        "paid":true,
    }
    return billpayload
}

function getRequestBillAssertion(cy,value){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_Bills,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(value)
    }))
    
}
//Test case 2
function createBillRequest(cy){
    cy.authenticateSession().then((response =>{
        let fakeBillPayload = createRandomBillPayload()

        //Post request to create a Bill
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_Bill,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeBillPayload
        }).then((response =>{
            const responseAsString=JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeBillPayload.value) 
        }))

        //GET request to fetch all rooms
        getRequestBillAssertion(cy, fakeBillPayload.value)

    }))
}

module.exports = {
    createBillRequest,
}