/// <reference types="cypress" />

import * as roomHelpers from '../helpers/roomHelpers'
import * as billHelpers from '../helpers/billHelpers'
import * as createDelHelpersRoom from '../helpers/createDelHelpersRoom'
import * as createDelHelpersBill from '../helpers/createDelHelpersBill'

describe('testing auth', function(){

    it('test case 1 - check room', function(){
        
        roomHelpers.getAllRoomsRequest(cy)
    })

    it('test case 2 - Create a room', function(){
        roomHelpers.createRoomRequest(cy)
    })

    it('test case 3 - Create a room and delete', function(){
        createDelHelpersRoom.createAndDeleteRoom(cy)
        
    })

    it('test case 4 - Create a bill', function(){
        billHelpers.createBillRequest(cy)
    })

    it.only('test case 5 - Create a bill and delete', function(){
            createDelHelpersBill.createAndDeleteBill(cy)
    })

    
})