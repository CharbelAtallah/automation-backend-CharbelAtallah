const faker = require('faker')

const ENDPOINT_GET_BILLS='http://localhost:3000/api/bills'
const ENDPOINT_POST_BILL='http://localhost:3000/api/bill/new'
const ENDPOINT_GET_BILL='http://localhost:3000/api/bill/'

function createRandomBillPayload(){
    const fakeValue = faker.finance.account()
    const billPayload={
        "value":fakeValue,
        //"paid":true,
    }
    return billPayload
}

    // Create Bill
    function createBill(cy){
        let billPayload=createRandomBillPayload()
        //skickar post för att skapa bill
            cy.request({
                method:'POST',
                url:ENDPOINT_POST_BILL,
                headers:{
                    'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                    'Content-Type':'application/json'
                },
                body:billPayload
            }).then((response=>{
                const responseString=JSON.stringify(response.body)
                expect(responseString).to.have.string(billPayload.value)
            }))
    }
    // Get all bills
    function getBillsAndDelete(cy){
            cy.request({
            method:'GET',
            url:ENDPOINT_GET_BILLS,
            headers:{'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
            },
        }).then((response =>{
            return response
        }))
    }

    // Delete Bill
    function deleteLatestBill(cy){
        cy.request({
            method:'GET',
            url:ENDPOINT_GET_BILLS,
            headers:{
                'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response=>{
            let lastId = response.body[response.body.length-1].id
        cy.request({
            method:"DELETE",
            url: ENDPOINT_GET_BILL+lastId,
            headers:{
                'X-User-Auth':JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response=>{

            cy.request({
                method:'GET',
                url:ENDPOINT_GET_BILLS,
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


   function createAndDeleteBill(cy){
       cy.authenticateSession().then((response=>{
        createBill(cy)
        deleteLatestBill(cy)
        getBillsAndDelete(cy)
       }))

   }

   module.exports={
    createAndDeleteBill
}