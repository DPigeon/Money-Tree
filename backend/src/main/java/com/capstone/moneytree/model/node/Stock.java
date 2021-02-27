package com.capstone.moneytree.model.node;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.neo4j.ogm.annotation.NodeEntity;

import com.capstone.moneytree.model.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NodeEntity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Stock extends Entity {

    String symbol; // or ticker!

    String companyName;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof Stock)) {
            return false;
        }

        Stock stock = (Stock) o;

        return new EqualsBuilder().append(symbol, stock.symbol).append(companyName, stock.companyName).isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(symbol).append(companyName).toHashCode();
    }
}
