const BitMEXClient = require('bitmex-realtime-api');
const client = new BitMEXClient({testnet: true});
const bitmex = require('nl-bitmex');
//Jaka Keys
// secret: JgFboxXp6FDMBfB0Yd1iQs4hV13hvolW1eAEN9sW8CQmKnGx
// id: RSJHPxHDxiPzkq2UTHVK-DhW
//My Keys
const Key = "as4fgU35coYwTOlZF2mXjFKP";
const Secret = "3-rS7xZ4vuSBGmUFLMcTjQ-Msdjze-q5W75KHX0tIUWdc26O";
// const Key = "RSJHPxHDxiPzkq2UTHVK-DhW";
// const Secret = "JgFboxXp6FDMBfB0Yd1iQs4hV13hvolW1eAEN9sW8CQmKnGx";
require("./index.js");
require("./lib/position");
require("./functions");



setInterval(() => {

// Gets 1m Chart Tickers
    bitmex.instrument({siteprefix: "testnet", 
        endpoint: "quote", 
        method: "GET", 
        symbol: "XBTUSD", }, function (c) {

          if (c.message == "Done") {
            for (var i = 0; i < c.result.length; i++) {
              var row = c.result[i];
    
              var bidPrice = row["bidPrice"];
              var lastPrice = row["lastPrice"];
              var askPrice = row["askPrice"];
              var tick = row["lastTickDirection"];
              var dailyHigh = row["highPrice"];
              var dailyLow =  row["lowPrice"];
            
    
          console.log("bid Price " + bidPrice);
          console.log("last Price " + lastPrice);
          console.log("ask Price " + askPrice);
          console.log("tick " + tick);
          console.log(c);
          
          
        takePrice = Math.floor(dailyHigh + dailyLow / 2 + 200);

          let newPrice;
          let Decide;
          
          if( tick === "MinusTick") {
             Decide = "Buy";
          } else if(tick === "PlusTick") {
             Decide = "Sell";
          }  

          let buyPrice = newPrice = Math.floor(lastPrice - 1);

          while (Decide === "Buy"){
              newPrice = Math.floor(lastPrice - 1);
              break;
          }

          while (Decide === "Sell"){
            newPrice = buyPrice - 8;
            break;
        }

        

        
          
             
        // Places Bulk Orders With DCA Both ways
    
       // let tradeAmount = Math.floor(Math.random() * 10 * 10 );

       let tradeAmount = 35;

          if ( tradeAmount <= 30){
            tradeAmount = 45;
          }
          
          bitmex.customprivate({siteprefix: "testnet", 
          endpoint: "order/bulk", 
          method: "POST", 
          orders: JSON.stringify(
        [
              {symbol: "XBTUSD", orderQty: tradeAmount, price: newPrice,  ordType: "Limit",   side: Decide}, 
               {symbol: "XBTUSD", orderQty: tradeAmount, price: newPrice ,  ordType: "Limit",   side: Decide}, 
                {symbol: "XBTUSD", orderQty: tradeAmount, price: newPrice, ordType: "Limit",   side: Decide}, 
              
              {symbol: "XBTUSD", orderQty: tradeAmount, price: newPrice,  ordType: "Limit",   side: Decide}, 
                {symbol: "XBTUSD", orderQty: tradeAmount, price: newPrice,  ordType: "Limit",   side: Decide}, 
               {symbol: "XBTUSD", orderQty: tradeAmount, price: newPrice, ordType: "Limit",   side: Decide}, 
       
        ]),   
               apikey: Key, apisecret: Secret}, 
          
          (cb) => {
            if (cb.message == "Done") {
              console.log(cb.result);
            } else if (cb.message == "Error") {
              console.log(cb.error);
            } else {
              console.log(cb.message);
            }
          });
          
          // Take Profit

        bitmex.customprivate({siteprefix: "testnet", 
        endpoint: "order", 
        method: "POST", 
        symbol: "XBTUSD", 
        orderQty: 100,
        ordType: "MarketIfTouched", stopPx: lastPrice + 50, side: "Sell",  
        apikey: Key, apisecret: Secret}, (cb) => {
            if (cb.message == "Done") {
              console.log(cb.result);
            } else if (cb.message == "Error") {
              console.log(cb.error);
            } else {
              console.log(cb.message);
            }
         
        });

        bitmex.customprivate({siteprefix: "testnet", 
        endpoint: "order/All", 
        method: "DELETE", 
        querystring: "orderID=THEORDERID", 
        apikey: Key, apisecret: Secret}, (cb) => {
          console.log(cb);
        });
         
    // Code Ends
            }}
        });
    // Code Ends
    }, 60000); 
    
  
    
    
    //Repeats Process Every 1m
    clearInterval();
    
    //Cancels All Unfilled Orders after 1 minute

          
         