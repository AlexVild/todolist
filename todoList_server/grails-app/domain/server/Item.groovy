package server

class Item {

    String name
    String type
    String priority
    boolean completed
    String comments
    String creator
    String assignedTo

    static constraints = {
        name nullable: false
        priority nullable: true
        type nullable: true
        comments nullable: true
        creator nullable: false
        assignedTo nullable: false
    }
}
