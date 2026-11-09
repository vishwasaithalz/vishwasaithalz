// Vishwas Aithal Commerce Sandbox. Fictional stock and order simulation only.
export const seedInventory=()=>[
 {id:"SKU101",title:"Compact mechanical keyboard",category:"Desk",price:289900,stock:8,icon:"⌨️",note:"Fictional demo product"},
 {id:"SKU102",title:"Portable SSD case",category:"Tech",price:149900,stock:12,icon:"💾",note:"Fictional demo product"},
 {id:"SKU103",title:"Analog desk timer",category:"Desk",price:79900,stock:7,icon:"⏱️",note:"Fictional demo product"},
 {id:"SKU104",title:"Minimal daily journal",category:"Stationery",price:44900,stock:15,icon:"📓",note:"Fictional demo product"},
 {id:"SKU105",title:"Retro sticker pack",category:"Stationery",price:29900,stock:20,icon:"🪄",note:"Fictional demo product"},
 {id:"SKU106",title:"USB-C charging cable",category:"Tech",price:59900,stock:18,icon:"🔌",note:"Fictional demo product"}
];
export const categories=["All","Desk","Tech","Stationery"];
export function rupees(paise){if(!Number.isSafeInteger(paise))throw Error("Invalid integer paise.");return (paise/100).toLocaleString("en-IN",{style:"currency",currency:"INR"});}
export function safeCart(raw,inventory){
 if(!raw||typeof raw!=="object"||Array.isArray(raw))return {};
 const result={};
 for(const item of inventory){
  const quantity=raw[item.id];
  if(Number.isSafeInteger(quantity)&&quantity>0)result[item.id]=Math.min(quantity,item.stock,20);
 }
 return result;
}
export function addToCart(cart,id,inventory){
 const item=inventory.find(p=>p.id===id);if(!item)throw Error("Unknown demo product.");
 const clean=safeCart(cart,inventory),next=(clean[id]||0)+1;
 if(next>item.stock)throw Error("Not enough sample stock.");
 if(next>20)throw Error("Maximum 20 units per product.");
 return {...clean,[id]:next};
}
export function changeQuantity(cart,id,change,inventory){
 const clean=safeCart(cart,inventory),item=inventory.find(p=>p.id===id);
 if(!item||!Number.isInteger(change)||Math.abs(change)!==1)throw Error("Invalid cart action.");
 const next=(clean[id]||0)+change;
 if(next<0||next>item.stock||next>20)throw Error("Quantity outside sample stock.");
 if(next===0){delete clean[id];return clean}
 return {...clean,[id]:next};
}
export function summarizeCart(cart,inventory){
 const clean=safeCart(cart,inventory);
 const rows=inventory.filter(p=>clean[p.id]).map(p=>({
  sku:p.id,title:p.title,quantity:clean[p.id],unitPaise:p.price,linePaise:clean[p.id]*p.price
 }));
 const subtotalPaise=rows.reduce((sum,r)=>sum+r.linePaise,0);
 return {rows,items:rows.reduce((sum,r)=>sum+r.quantity,0),subtotalPaise};
}
export function placeDemoOrder(cart,inventory,id="DEMO-"+Math.random().toString(36).slice(2,10).toUpperCase()){
 const summary=summarizeCart(cart,inventory);
 if(!summary.rows.length)throw Error("Cart is empty.");
 const nextInventory=inventory.map(p=>({...p,stock:p.stock-(cart[p.id]||0)}));
 if(nextInventory.some(p=>p.stock<0))throw Error("Not enough sample stock.");
 return {order:{id,createdAt:new Date().toISOString(),...summary,mode:"DEMO_NO_PAYMENT"},inventory:nextInventory};
}
export function filterInventory(inventory,{query="",category="All",sort="featured"}={}){
 const needle=String(query).toLowerCase().trim();
 const rows=inventory.filter(p=>(category==="All"||p.category===category)&&[p.title,p.category,p.note].join(" ").toLowerCase().includes(needle));
 if(sort==="low")rows.sort((a,b)=>a.price-b.price);
 if(sort==="high")rows.sort((a,b)=>b.price-a.price);
 if(sort==="stock")rows.sort((a,b)=>b.stock-a.stock);
 return rows;
}
