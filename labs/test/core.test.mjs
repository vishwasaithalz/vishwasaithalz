import test from "node:test";
import assert from "node:assert/strict";
import {safeUrl,normalizeTags,createTicket,filterTickets,ticketStats,parseStored,addBookmark,filterBookmarks,createQuote,pageItems,demoTickets,demoFeed} from "../core.mjs";

test("reject non-http links and malformed addresses",()=>{
 assert.equal(safeUrl("javascript:alert(1)"),null);
 assert.equal(safeUrl("data:text/html,x"),null);
 assert.equal(safeUrl("not a url"),null);
 assert.equal(safeUrl("https://example.org/"),"https://example.org/");
});
test("normalize duplicate tags",()=>{
 assert.deepEqual(normalizeTags("Code, code, UI , "),["code","ui"]);
});
test("create and filter support records",()=>{
 const first=createTicket({title:"Improve keyboard labels",priority:"High",owner:"UX"},"DEMO-1");
 assert.equal(first.priority,"High");
 assert.throws(()=>createTicket({title:"x"}),/3 to 120/);
 const records=[first,{...first,id:"DEMO-2",status:"Resolved",priority:"Low"}];
 assert.equal(filterTickets(records,{priority:"High"}).length,1);
 assert.equal(filterTickets(records,{status:"Resolved"}).length,1);
 assert.equal(filterTickets(records,{q:"keyboard"}).length,2);
 assert.deepEqual(ticketStats(records),{total:2,open:1,active:0,resolved:1});
});
test("storage decoder recovers malformed payloads",()=>{
 assert.deepEqual(parseStored("{broken"),[]);
 assert.deepEqual(parseStored('{"x":1}'),[]);
 assert.deepEqual(parseStored('[{"id":"x"}]'),[{id:"x"}]);
});
test("bookmark store validates URL and supports search",()=>{
 assert.throws(()=>addBookmark({title:"Bad",url:"file:///tmp/a"}),/HTTP or HTTPS/);
 const b=addBookmark({title:"Reference",url:"https://developer.mozilla.org",tags:"docs, code",notes:"Useful docs"},"B-1");
 assert.deepEqual(b.tags,["docs","code"]);
 assert.equal(filterBookmarks([b],"developer.mozilla.org").length,1);
 assert.equal(filterBookmarks([b],"missing").length,0);
});
test("quote validation protects local records",()=>{
 assert.throws(()=>createQuote("short"),/8 to 320/);
 assert.equal(createQuote("Ship it with tests.","Vishwas","Q-1").text,"Ship it with tests.");
});
test("finite feed pages remain bounded",()=>{
 const feed=demoFeed();
 assert.equal(feed.length,96);
 assert.equal(pageItems(feed,0,12).length,12);
 assert.equal(pageItems(feed,7,12).length,12);
 assert.deepEqual(pageItems(feed,8,12),[]);
 assert.deepEqual(pageItems(feed,-1,12),[]);
 assert.equal(demoTickets().length,8);
});
