package com.capstone.moneytree.model

import com.capstone.moneytree.model.node.User
import com.capstone.moneytree.model.node.Stock
import com.capstone.moneytree.model.relationship.Owns
import org.junit.Test

import static com.capstone.moneytree.utils.MoneyTreeTestUtils.*

import spock.lang.Specification

import java.sql.Date;
import java.time.Instant;

/**
 * Unit Tests for the SanitizedStock model.
 */
class SanitizedStockTest extends Specification {
    @Test
    def "it should create a SanitizedStock from an Owns releationship"()

    {

        given:
        "an Owns relationship object created from Owns class"
        Stock stock = Stock.builder().symbol("AAPL").companyName("Apple INC.").build()
        User user = new User()
        Owns newOwnsRel = new Owns(user, stock, Date.from(Instant.now()), 10, 123.45f, 1234.5f)

        when:
        "creating a SanitizedStock out of the given Owns relationship object"
        SanitizedStock sanitizedStock = new SanitizedStock(newOwnsRel)

        then:
        "should create a SanitizedStock by keeping the important fields of OwnsRelationship"
        assert sanitizedStock.getSymbol() == stock.getSymbol()
        assert sanitizedStock.getCompanyName() == stock.getCompanyName()
        assert sanitizedStock.getQuantity() == newOwnsRel.getQuantity()
        assert sanitizedStock.getAvgPrice() == newOwnsRel.getAvgPrice()
        assert sanitizedStock.getTotal() == newOwnsRel.getTotal()
        assert sanitizedStock.getSince() == newOwnsRel.getSince()
    }
}

