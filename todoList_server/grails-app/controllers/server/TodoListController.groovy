package server

import grails.converters.JSON

class TodoListController {

    def addUser() { // Adds a new username to the list of usernames for selection
        def newUser = new Username(request.JSON)
        newUser.save(flush:true)
        render newUser as JSON
    }

    def index(){   
        render Item.list() as JSON
    }

    def indexUsers(){
        render Username.list() as JSON
    }

    def removeUsernames(){
        Username.executeUpdate('delete from Username')
        render Username.list()
    }

    def clearList() {
        Item.executeUpdate('delete from Item')
        render Item.list()
    }

    def updateList() {
        def newItem = new Item(request.JSON)
        newItem.save(flush:true)
        render newItem as JSON
    }
}
