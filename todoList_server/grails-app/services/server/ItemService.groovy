package server

import grails.transaction.Transactional

@Transactional
class ItemService {

    def update(Item item) {
        item.save(flush: true)
    }
}
