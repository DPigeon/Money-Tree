package com.capstone.moneytree.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.capstone.moneytree.exception.AlpacaException;

import net.jacobpeterson.alpaca.enums.OrderSide;
import net.jacobpeterson.alpaca.enums.OrderTimeInForce;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.capstone.moneytree.dao.StockDao;
import com.capstone.moneytree.dao.TransactionDao;
import com.capstone.moneytree.dao.UserDao;
import com.capstone.moneytree.dao.RelationshipDao.MadeDao;
import com.capstone.moneytree.dao.RelationshipDao.ToFulfillDao;
import com.capstone.moneytree.facade.AlpacaSession;
import com.capstone.moneytree.model.MoneyTreeOrderType;
import com.capstone.moneytree.model.TransactionStatus;
import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.model.node.Transaction;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.model.relationship.ToFulfill;
import com.capstone.moneytree.model.relationship.Made;
import com.capstone.moneytree.service.api.StockMarketDataService;
import com.capstone.moneytree.service.api.TransactionService;

import net.jacobpeterson.alpaca.AlpacaAPI;
import net.jacobpeterson.domain.alpaca.order.Order;
import pl.zankowski.iextrading4j.api.stocks.v1.KeyStats;

@Service
@Transactional
public class DefaultTransactionService implements TransactionService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultTransactionService.class);

    private final TransactionDao transactionDao;
    private final UserDao userDao;
    private final StockDao stockDao;
    private final MadeDao madeDao;
    private final ToFulfillDao toFulfillDao;
    private final AlpacaSession session;
    private final StockMarketDataService stockMarketDataService;

    @Autowired
    public DefaultTransactionService(TransactionDao transactionDao, UserDao userDao, StockDao stockDao, MadeDao madeDao,
                                     ToFulfillDao toFulfillDao, AlpacaSession session, StockMarketDataService stockMarketDataService) {
        this.transactionDao = transactionDao;
        this.userDao = userDao;
        this.stockDao = stockDao;
        this.madeDao = madeDao;
        this.toFulfillDao = toFulfillDao;
        this.session = session;
        this.stockMarketDataService = stockMarketDataService;
    }

    @Override
    public List<Transaction> getAllTransactions() {
        LOGGER.info("Getting all transactions...");
        return transactionDao.findAll();
    }

    @Override
    public List<Transaction> getTransactionsByOrderType(MoneyTreeOrderType moneyTreeOrderType) {
        return transactionDao.findByMoneyTreeOrderType(moneyTreeOrderType);
    }

    @Override
    public List<Transaction> execute(String userId, Order order) {

        /* Get user for that transaction */
        User user = userDao.findUserById(Long.parseLong(userId));
        // TODO if user is null =>

        String alpacaKey = user.getAlpacaApiKey();

        /* Build the transaction and persist and update user balance */
        executeTransaction(alpacaKey, order, user);
        user = userDao.save(user);

        return getUserTransactions(user.getId());
    }

    private void executeTransaction(String alpacaKey, Order order, User user) {
        Transaction transaction;
        try {
            AlpacaAPI api = session.alpaca(alpacaKey);
            Order alpacaOrder = api.requestNewMarketOrder(order.getSymbol(), Integer.parseInt(order.getQty()),
                    OrderSide.valueOf(order.getSide().toUpperCase()), OrderTimeInForce.DAY);

            Stock stock = stockDao.findBySymbol(order.getSymbol());
            if (stock == null) { // if database does not have this stock object create and save it
                KeyStats stockInfo = stockMarketDataService.getKeyStats(order.getSymbol());
                stock = Stock.builder().symbol(order.getSymbol()).companyName(stockInfo.getCompanyName()).build();
                stockDao.save(stock);
            }

            LOGGER.info("Executed order {}", alpacaOrder.getClientOrderId());

            transaction = constructTransactionFromOrder(alpacaOrder);
            transactionDao.save(transaction);

            /*
             * create and save two relationships: Made and ToFulfill. User Made Transaction
             * and Transaction ToFulfill Stock. The fulfillmentDate will be set when the
             * order is completed (fulfilled), and similarly the OWNS relationships will be
             * created when the order is completed
             */

            Made madeRelationship = new Made(user, transaction, transaction.getPurchasedAt());
            madeDao.save(madeRelationship);

            ToFulfill toFulfillRelationship = new ToFulfill(transaction, stock, null);
            toFulfillDao.save(toFulfillRelationship);

            user.setBalance(Float.parseFloat(api.getAccount().getCash()));
        } catch (

                Exception e) {
            throw new AlpacaException(e.getMessage());
        }

    }

    private Transaction constructTransactionFromOrder(Order alpacaOrder) {
        Transaction transaction = Transaction.builder().status(TransactionStatus.PENDING).purchasedAt(alpacaOrder.getCreatedAt())
                .clientOrderId(alpacaOrder.getClientOrderId())
                .moneyTreeOrderType(MoneyTreeOrderType
                        .valueOf(alpacaOrder.getType().toUpperCase() + "_" + alpacaOrder.getSide().toUpperCase()))
                .quantity(Float.parseFloat(alpacaOrder.getQty())).purchasedAt(alpacaOrder.getSubmittedAt())
                .symbol(alpacaOrder.getSymbol()).build();
        if (alpacaOrder.getFilledAvgPrice() != null) {
            transaction.setAvgPrice(Float.parseFloat(alpacaOrder.getFilledAvgPrice()));
        }
        return transaction;
    }

    @Override
    public List<Transaction> getUserTransactions(Long userId) {
        List<Made> allMadeRels = madeDao.findByUserId(userId);
        List<Transaction> userTransactions = new ArrayList<>();
        for (Made rel : allMadeRels) {
            userTransactions.add(rel.getTransaction());
        }
        return userTransactions;
    }

}
