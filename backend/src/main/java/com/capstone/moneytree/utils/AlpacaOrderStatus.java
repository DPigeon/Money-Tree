package com.capstone.moneytree.utils;

/**
 * class representing the state of the order passed through a transactions on the alpaca API
 */
public final class AlpacaOrderStatus {

   private AlpacaOrderStatus() {}

   /**
    * The order has been received by Alpaca, and routed to exchanges for execution. This is the usual initial state of an order.
    */
   public static final String NEW = "new";
   /**
    * The order has been partially filled.
    */
   public static final String PARTIALLY_FILLED = "partially_filled";
   /**
    * The order has been filled, and no further updates will occur for the order.
    */
   public static final String FILLED = "filled";
   /**
    * The order is done executing for the day, and will not receive further updates until the next trading day.
    */
   public static final String DONE_FOR_DAY = "done_for_day";
   /**
    * The order has been canceled, and no further updates will occur for the order.
    * This can be either due to a cancel request by the user,
    * or the order has been canceled by the exchanges due to its time-in-force.
    */
   public static final String CANCELED = "canceled";
   /**
    * The order has expired, and no further updates will occur for the order.
    */
   public static final String EXPIRED = "expired";
   /**
    * The order was replaced by another order, or was updated due to a market event such as corporate action.
    */
   public static final String REPLACED = "replaced";
   /**
    * The order is waiting to be canceled.
    */
   public static final String PENDING_CANCEL = "pending_cancel";
   /**
    * The order is waiting to be replaced by another order. The order will reject cancel request while in this state.
    */
   public static final String PENDING_REPLACE = "pending_replace";
   /* -------------- THE FOLLOWING ORDER STATUS ARE RARE AND LIKELY TO NEVER BE WITNESS ------------ */
   /**
    * The order has been received by Alpaca, but hasn't yet been routed to the execution venue.
    * This could be seen often out side of trading session hours.
    */
   public static final String ACCEPTED = "accepted";
   /**
    * The order has been received by Alpaca, and routed to the exchanges, but has not yet been accepted for execution.
    * This state only occurs on rare occasions.
    */
   public static final String PENDING_NEW = "pending_new";
   /**
    * The order has been received by exchanges, and is evaluated for pricing. This state only occurs on rare occasions.
    */
   public static final String ACCEPTED_FOR_BIDDING = "accepted_for_bidding";
   /**
    * The order has been stopped, and a trade is guaranteed for the order, usually at a stated price or better,
    * but has not yet occurred. This state only occurs on rare occasions.
    */
   public static final String STOPPED = "stopped";
   /**
    * The order has been rejected, and no further updates will occur for the order.
    * This state occurs on rare occasions and may occur based on various conditions decided by the exchanges.
    */
   public static final String REJECTED = "rejected";
   /**
    * The order has been suspended, and is not eligible for trading. This state only occurs on rare occasions.
    */
   public static final String SUSPENDED = "suspended";
   /**
    * The order has been completed for the day (either filled or done for day), but remaining settlement calculations are still pending.
    * This state only occurs on rare occasions.
    */
   public static final String CALCULATED = "calculated";
}