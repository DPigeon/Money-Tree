package com.capstone.moneytree.model;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlpacaOrderResponse {
    @SerializedName(value = "id")
    private String id;
    @SerializedName(value = "client_order_id")
    private String clientOrderId;
    @SerializedName(value = "created_at")
    private String createdAt;
    @SerializedName(value = "updated_at")
    private String updatedAt;
    @SerializedName(value = "submitted_at")
    private String submittedAt;
    @SerializedName(value = "symbol")
    private String symbol;
    @SerializedName(value = "qty")
    private Float qty;
    @SerializedName(value = "filled_qty")
    private String filledQty;
    @SerializedName(value = "filled_avg_price")
    private String filledAvgPrice;
    @SerializedName(value = "side")
    private String orderType;
    @SerializedName(value = "time_in_force")
    private String timeInForce;
}
