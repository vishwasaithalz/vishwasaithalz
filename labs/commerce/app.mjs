import {seedInventory,rupees,safeCart,addToCart,changeQuantity,summarizeCart,placeDemoOrder,filterInventory} from "./core.mjs";

const $=id=>document.getElementById(id),key="vishwas-commerce-sandbox-v1";
const node=(tag,text,className="")=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=String(text);if(className)el.className=className;return el;};
const base=seedInventory();
let inventory=base.map(x=>({...x})),cart={},orders=[];
try{
 const stored=JSON.parse(localStorage.getItem(key)||"null");
 if(stored&&typeof stored==="object"){
  inventory=base.map(item=>{
   const candidate=stored.stocks?.[item.id];
   return {...item,stock:Number.isSafeInteger(candidate)&&candidate>=0&&candidate<=item.stock?candidate:item.stock};
  });
  cart=safeCart(stored.cart,inventory);
  if(Array.isArray(stored.orders))orders=stored.orders.filter(o=>o&&typeof o.id==="string"&&o.mode==="DEMO_NO_PAYMENT"&&Number.isSafeInteger(o.subtotalPaise)).slice(-50);
 }
}catch{}
const notice=message=>{$("status").textContent=message;};
function persist(){
 const stocks=Object.fromEntries(inventory.map(item=>[item.id,item.stock]));
 try{localStorage.setItem(key,JSON.stringify({stocks,cart,orders}));return true}
 catch{notice("Storage blocked. Export receipts before leaving this page.");return false}
}
function renderStats(){
 $("count-products").textContent=inventory.length;
 $("count-stock").textContent=inventory.reduce((sum,p)=>sum+p.stock,0);
 $("count-cart").textContent=summarizeCart(cart,inventory).items;
 $("count-orders").textContent=orders.length;
}
function renderProducts(){
 const rows=filterInventory(inventory,{query:$("search").value,category:$("category").value,sort:$("sort").value});
 const grid=$("product-grid");grid.replaceChildren();$("product-empty").hidden=rows.length>0;
 for(const product of rows){
  const card=node("article",undefined,"card");
  card.append(node("span",product.category.toUpperCase()+" / "+product.id,"card-meta"),
              node("h3",product.icon+" "+product.title),
              node("p",product.note),
              node("div",rupees(product.price),"price"),
              node("p","Sample stock: "+product.stock));
  const foot=node("div",undefined,"card-foot");
  foot.append(node("span",product.stock?"AVAILABLE IN DEMO":"DEMO STOCK DEPLETED","small"));
  const button=node("button","ADD TO CART");button.type="button";button.className="secondary";button.disabled=product.stock<=0;
  button.addEventListener("click",()=>{
   try{cart=addToCart(cart,product.id,inventory);persist();render();notice(product.title+" added to your local cart.")}
   catch(error){notice(error.message)}
  });
  foot.append(button);card.append(foot);grid.append(card);
 }
}
function renderCart(){
 const summary=summarizeCart(cart,inventory),box=$("cart-lines");box.replaceChildren();
 if(!summary.rows.length)box.append(node("p","Your demo cart is empty.","small"));
 for(const line of summary.rows){
  const row=node("div",undefined,"entry"),desc=node("div");
  desc.append(node("strong",line.title),node("div",line.quantity+" × "+rupees(line.unitPaise),"small"));
  const controls=node("div");controls.style.display="flex";controls.style.gap="5px";
  for(const [label,delta] of [["−", -1],["+",1]]){
   const btn=node("button",label);btn.type="button";btn.className="secondary";
   btn.setAttribute("aria-label",(delta===1?"Increase ":"Decrease ")+line.title+" quantity");
   btn.addEventListener("click",()=>{
    try{cart=changeQuantity(cart,line.sku,delta,inventory);persist();render();}
    catch(error){notice(error.message)}
   });controls.append(btn);
  }
  row.append(desc,controls);box.append(row);
 }
 $("subtotal").textContent=rupees(summary.subtotalPaise);
 $("checkout").disabled=summary.items===0;
}
function renderReceipts(){
 const list=$("receipts");list.replaceChildren();
 if(!orders.length)list.append(node("p","No demo orders. No real transaction will be created.","small"));
 for(const order of [...orders].reverse().slice(0,8)){
  const row=node("div",undefined,"entry"),description=node("div");
  description.append(node("strong",order.id),node("div",order.items+" simulated items / "+rupees(order.subtotalPaise),"small"));
  row.append(description,node("span","DEMO","chip"));list.append(row);
 }
}
function render(){renderStats();renderProducts();renderCart();renderReceipts()}
for(const id of ["search","category","sort"])$(id).addEventListener("input",renderProducts);
$("checkout").addEventListener("click",()=>{
 if(!window.confirm("Generate a simulated order and reduce local demo stock? No payment or delivery will occur."))return;
 try{
  const outcome=placeDemoOrder(cart,inventory);
  inventory=outcome.inventory;orders=[...orders,outcome.order].slice(-50);cart={};persist();render();
  notice("Created "+outcome.order.id+" for "+rupees(outcome.order.subtotalPaise)+". This is not a purchase.");
 }catch(error){notice(error.message)}
});
$("export").addEventListener("click",()=>{
 const payload={notice:"Fictional ecommerce records. No real purchases or payments.",createdAt:new Date().toISOString(),orders};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),link=node("a");
 link.href=url;link.download="vishwas-commerce-demo-orders.json";document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);notice("Demo receipts exported.");
});
$("reset").addEventListener("click",()=>{
 if(!window.confirm("Reset sample stock, local cart and generated demo receipts? Export first if you want a copy."))return;
 inventory=seedInventory();cart={};orders=[];persist();render();notice("Local demo reset.");
});
render();
