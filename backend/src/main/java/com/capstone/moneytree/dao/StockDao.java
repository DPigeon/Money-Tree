package com.capstone.moneytree.dao;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import com.capstone.moneytree.model.node.Stock;

@Repository
public interface StockDao extends Neo4jRepository<Stock, Long> {

    List<Stock> findAll();
    Stock findStockById(Long id);
    Stock findBySymbol(String symbol);
    Stock findByCompanyName(String companyName);
}
