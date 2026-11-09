import test from "node:test";
import assert from "node:assert/strict";
import {seedCampaigns,createPledge,validPledges,filterCampaigns,hoursFor,metrics,exportSafeData} from "../impact/core.mjs";
import {seedInventory,rupees,safeCart,addToCart,changeQuantity,summarizeCart,placeDemoOrder,filterInventory} from "../commerce/core.mjs";

test("ImpactHub fixtures are original, finite and searchable",()=>{
 const rows=seedCampaigns();
 assert.equal(rows.length,6);
 assert.equal(filterCampaigns(rows,{category:"Education"}).length,1);
 assert.ok(filterCampaigns(rows,{skill:"Technology"}).length>=1);
 assert.equal(filterCampaigns(rows,{query:"no-such-topic"}).length,0);
});
test("ImpactHub records bounded local pledge hours and aggregates safely",()=>{
 const pledge=createPledge({campaignId:"IH01",alias:"Volunteer A",hours:5},"TEST01");
 assert.equal(pledge.hours,5);
 assert.equal(hoursFor("IH01",[pledge]),5);
 assert.equal(metrics(seedCampaigns(),[pledge]).pledges,1);
 assert.equal(validPledges([pledge,{},null]).length,1);
 assert.equal(exportSafeData([pledge]).pledges[0].id,"TEST01");
 assert.throws(()=>createPledge({campaignId:"IH01",alias:"Volunteer A",hours:41}),/1 to 40/);
 assert.throws(()=>createPledge({campaignId:"IH99",alias:"X",hours:1}),/2 to 40/);
 assert.throws(()=>createPledge({campaignId:"invalid",alias:"Volunteer A",hours:2}),/valid campaign/);
});
test("Commerce Sandbox cart checks stock, totals and quantity changes",()=>{
 const stock=seedInventory(),item=stock[0];
 assert.match(rupees(item.price),/₹/);
 const first=addToCart({},item.id,stock),second=addToCart(first,item.id,stock);
 assert.equal(second[item.id],2);
 const summary=summarizeCart(second,stock);
 assert.equal(summary.items,2);
 assert.equal(summary.subtotalPaise,item.price*2);
 assert.deepEqual(changeQuantity(second,item.id,-1,stock),first);
 assert.throws(()=>changeQuantity({},item.id,-1,stock),/outside sample stock/);
 assert.throws(()=>addToCart({},'UNKNOWN',stock),/Unknown demo product/);
 assert.ok(filterInventory(stock,{category:"Tech"}).length>=1);
});
test("Commerce Sandbox mock checkout decrements simulated stock only",()=>{
 const stock=seedInventory(),item=stock[0],cart=addToCart({},item.id,stock);
 const result=placeDemoOrder(cart,stock,"TEST-ORDER");
 assert.equal(result.order.id,"TEST-ORDER");
 assert.equal(result.order.mode,"DEMO_NO_PAYMENT");
 assert.equal(result.order.subtotalPaise,item.price);
 assert.equal(result.inventory[0].stock,item.stock-1);
 assert.equal(stock[0].stock,item.stock);
 assert.throws(()=>placeDemoOrder({},stock),/empty/);
});
test("Commerce Sandbox rejects mutated storage and impossible inventory",()=>{
 const stock=seedInventory();
 assert.deepEqual(safeCart({"SKU101":99999,"UNSAFE":99},stock),{SKU101:stock[0].stock});
 assert.deepEqual(safeCart([1,2],stock),{});
 assert.throws(()=>placeDemoOrder({"SKU101":stock[0].stock+2},stock),/sample stock/);
});
