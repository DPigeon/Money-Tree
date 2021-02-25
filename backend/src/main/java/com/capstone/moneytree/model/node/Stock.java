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

   String exchange;

   String symbol;

   String status;

   String ticker;

   String label;

   String industry;

   String volatility;

   @Override
   public boolean equals(Object o) {
      if (this == o) {
         return true;
      }

      if (!(o instanceof Stock)) {
         return false;
      }

      Stock stock = (Stock) o;

      return new EqualsBuilder()
              .append(exchange, stock.exchange)
              .append(symbol, stock.symbol)
              .append(status, stock.status)
              .append(ticker, stock.ticker)
              .append(label, stock.label)
              .append(industry, stock.industry)
              .append(volatility, stock.volatility)
              .isEquals();
   }

   @Override
   public int hashCode() {
      return new HashCodeBuilder(17, 37)
              .append(exchange)
              .append(symbol)
              .append(status)
              .append(ticker)
              .append(label)
              .append(industry)
              .append(volatility)
              .toHashCode();
   }
}
