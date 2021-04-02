import { User, UserProfile } from 'src/app/interfaces/user';
import { Injectable } from '@angular/core';
import { Transaction } from '../interfaces/transaction';
import { UserSearch } from '../interfaces/userSearch';
import { AlpacaUserPosition } from '../interfaces/alpacaPosition';
import { Stock } from '../interfaces/stock';
import { MarketClock } from '../interfaces/market-clock';
import { StockHistory } from '../interfaces/stockHistory';
import { StockPercentage } from './../interfaces/stock-percentage';

@Injectable({
  providedIn: 'root',
})
export class DataFormatter {
  constructor() {
    // is empty
  }

  userFormatter(response: any): User {
    let formattedUser: User;
    return (formattedUser = {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      username: response.username,
      avatarURL: response.avatarURL,
      coverPhotoURL: response.coverPhotoURL,
      email: response.email,
      score: response.score,
      rank: response.rank,
      balance: response.balance,
      alpacaApiKey: response.alpacaApiKey,
      biography: response.biography,
    });
  }

  userCompleteProfileFormatter(response: any): UserProfile {
    const user: UserProfile = this.userFormatter(response);
    user.followers = response.followers;
    user.following = response.following;
    user.transactions = this.transactionListFormatter(response.transactions);
    user.portfolio = response.ownedStocks;
    return user;
  }
  userListFormatter(response: any): User[] {
    const result: User[] = [];
    for (const fetchedUser of response.body) {
      result.push({
        id: fetchedUser.id,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        username: fetchedUser.username,
        avatarURL: fetchedUser.avatarURL,
        score: fetchedUser.score,
        rank: fetchedUser.rank,
        balance: fetchedUser.balance,
      });
    }
    return result;
  }

  userSearchFormatter(response: any): UserSearch[] {
    const result: UserSearch[] = [];
    response.forEach((e) => {
      result.push({
        id: e.username,
        firstName: e.firstName,
        lastName: e.lastName,
        avatarURL: e.avatarURL,
        email: e.email,
      });
    });
    return result;
  }

  transactionListFormatter(response: any): Transaction[] {
    const result: Transaction[] = [];
    for (const fetchedTransaction of response) {
      result.push({
        qty: fetchedTransaction.quantity,
        timeInForce: fetchedTransaction.purchasedAt,
        type: fetchedTransaction.moneyTreeOrderType,
        client_order_id: fetchedTransaction.clienOrderId,
        status: fetchedTransaction.status,
        averagePricePerShare: fetchedTransaction.avgPrice,
        symbol: fetchedTransaction.symbol,
        total: fetchedTransaction.total,
      });
    }
    return result;
  }

  alpacaUserPositionFormatter(response: any): AlpacaUserPosition[] {
    const result: AlpacaUserPosition[] = [];
    response.forEach((e) => {
      result.push({
        symbol: e.symbol,
        avgEntryPrice: e.avgEntryPrice,
        qty: e.qty,
        currentPrice: e.currentPrice,
      });
    });
    return result;
  }

  // Stock Service data formatters:
  IEXtoModel(iex: any): Stock {
    const stock: Stock = {
      tickerSymbol: iex.company.symbol,
      companyName: iex.company.companyName,
      industry: iex.company.industry,
      volatility: 'low',
      stockChange: iex.book.quote.change,
      stockChangePercent: iex.book.quote.changePercent * 100,
      stockValue: iex.book.quote.latestPrice,
      logo: iex.logo.url,
      stats: {
        open: iex.book.quote.open,
        high: iex.book.quote.high,
        low: iex.book.quote.low,
        volume: iex.book.quote.volume,
        mktCap: iex.book.quote.marketCap,
        stock52weekHigh: iex.book.quote.week52High,
        stock52weekLow: iex.book.quote.week52Low,
        avgVolume: iex.book.quote.avgTotalVolume,
      },
    };
    return stock;
  }
  YahooDataToModel(response: any): StockHistory {
    const stockHistoricalData: StockHistory = {
      symbol: response.chart.result[0].meta.symbol,
      closePrice: response.chart.result[0].indicators.quote[0].close,
      timestamp: response.chart.result[0].timestamp,
      currency: response.chart.result[0].meta.currency,
    };
    return stockHistoricalData;
  }
  marketClockFormatter(response: any): MarketClock {
    const fromattedMarketClock: MarketClock = {
      isOpen: response.body.isOpen,
      nextClose: response.body.nextClose,
      nextOpen: response.body.nextOpen,
      timestamp: response.body.timestamp,
    };
    return fromattedMarketClock;
  }

  stockListFormatter(response: any): Stock[] {
    const result: Stock[] = [];
    for (const fetchedStock of response.body) {
      result.push({
        companyName: fetchedStock.companyName,
        tickerSymbol: fetchedStock.symbol,
        since: fetchedStock.since,
        avgPrice: fetchedStock.avgPrice,
        quantity: fetchedStock.quantity,
      });
    }
    return result;
  }

  stockPercentageFormatter(response: any): StockPercentage[] {
    const result: StockPercentage[] = [];
    // tslint:disable-next-line:forin
    for (const key in response) {
      result.push({
        symbol: key,
        percentage: response[key],
      });
    }
    return result;
  }
}
