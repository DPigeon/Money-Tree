package com.capstone.moneytree.model;

import java.util.Date;

import com.capstone.moneytree.model.relationship.Owns;
import lombok.Data;

@Data
public class SanitizedStock {
   Long id;
   String symbol;
   String companyName;
   Date since;
   float quantity;
   float avgPrice;
   float total;

   public SanitizedStock(Owns ownsRel) {
      this.id = ownsRel.getId();
      this.symbol = ownsRel.getStock().getSymbol();
      this.companyName = ownsRel.getStock().getCompanyName();
      this.since = ownsRel.getSince();
      this.quantity = ownsRel.getQuantity();
      this.avgPrice = ownsRel.getAvgPrice();
      this.total = ownsRel.getTotal();
   }
}
