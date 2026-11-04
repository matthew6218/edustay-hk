import type {Home,Profile} from './domain.ts';
import type {AppDatabase,PreparedStatement} from '../db/contracts';
import {districts,amenities} from './domain.ts';
export const DEMO_MODE=true; // This release is an owner-private fictional sandbox, never a live rental service.
export const sampleProfile:Profile={university:'HKU',study:'Degree',arrival:'2027-08-15',start:'2027-08-15',end:'2027-09-01',months:6,budget:35000,districts:['Kennedy Town','Sai Ying Pun','Hung Hom'],roomType:'Any',occupancy:1,amenities:[],complete:true,step:5};
const previousDemoProfile:Profile={...sampleProfile,budget:30000,districts:['Kennedy Town','Sai Ying Pun']};
const previousSampleProfile:Profile={...previousDemoProfile,budget:8000,roomType:'Private room',amenities:['Wi-Fi','Desk','Air conditioning']};
export const providerNames=['Harbour Nest','Westside Living','Campus Corner','Juniper Homes','Urban Chapter','Little Harbour'];
export const studentNames=['Alex','Jamie','Sam','Robin','Taylor','Casey','Jordan','Avery','Morgan','Riley','Quinn','Charlie'];
const realMarketSamples=[
 {source:'28Hse',title:'Kennedy 38 studio',district:'Kennedy Town',type:'Studio',rent:21500,area:264,bedrooms:1,bathrooms:1,url:'https://www.28hse.com/en/rent/apartment/property-4062357'},
 {source:'28Hse',title:'Siu Yee Building two-bedroom',district:'Kennedy Town',type:'Entire flat',rent:17000,area:355,bedrooms:2,bathrooms:1,url:'https://www.28hse.com/en/rent/apartment/property-4077309'},
 {source:'Spacious',title:'The Merton Tower 2 · 487 sq ft',district:'Kennedy Town',type:'Entire flat',rent:30000,area:487,bedrooms:2,bathrooms:1,url:'https://www.spacious.hk/en/hong-kong/41-kennedy-town/151359--the-merton-tower-2/15047664-2-beds-1-bath'},
 {source:'Spacious',title:'The Merton Tower 2 · 997 sq ft',district:'Kennedy Town',type:'Entire flat',rent:64900,area:997,bedrooms:3,bathrooms:2,url:'https://www.spacious.hk/en/hong-kong/41-kennedy-town/151359--the-merton-tower-2/15051395-3-beds-2-baths'},
 {source:'Spacious',title:'The Merton Tower 1 · 470 sq ft',district:'Kennedy Town',type:'Entire flat',rent:28000,area:470,bedrooms:2,bathrooms:1,url:'https://www.spacious.hk/en/hong-kong/41-kennedy-town/151358--the-merton-tower-1/15080531-2-beds-1-bath'},
 {source:'Spacious',title:'The Merton Tower 1 · 491 sq ft',district:'Kennedy Town',type:'Entire flat',rent:32000,area:491,bedrooms:2,bathrooms:1,url:'https://www.spacious.hk/en/hong-kong/41-kennedy-town/151358--the-merton-tower-1/15080532-2-beds-1-bath'},
 {source:'Weave Campus',title:'Weave Campus – Hung Hom',district:'Hung Hom',type:'Studio',rent:11500,area:84,bedrooms:1,bathrooms:1,url:'https://www.weave-living.com/en/hong-kong/weave-campus-hung-hom'},
 {source:'Weave Campus',title:'Weave Campus – Sai Ying Pun',district:'Sai Ying Pun',type:'Studio',rent:20800,area:152,bedrooms:1,bathrooms:1,url:'https://www.weave-living.com/en/hong-kong/weave-campus-sai-ying-pun'},
];
export function seedHomes():Home[]{return Array.from({length:28},(_,i)=>{const real=realMarketSamples[i%realMarketSamples.length],publicSample=i<24;return {id:'home-'+(i+1),providerId:'demo-agent-'+(i%6+1),title:publicSample?real.title+(i>=8?' · reference '+(Math.floor(i/8)+1):''):'Internal demo listing '+(i+1),district:publicSample?real.district:districts[i%12],type:publicSample?real.type:'Private room',rent:publicSample?real.rent:8000,deposit:0,depositConfirmed:false,fee:0,utilities:'Not stated in the public reference snapshot.',area:publicSample?real.area:180,capacity:publicSample?Math.max(1,real.bedrooms):1,bedrooms:publicSample?real.bedrooms:1,bathrooms:publicSample?real.bathrooms:1,from:null,until:null,minMonths:1,maxMonths:12,amenities:[],description:publicSample?'A demo snapshot based on the linked real-world public listing. Price, area, bedroom and bathroom figures were reviewed on 3 November 2026. Availability and all other terms must be confirmed on the original source. EduStay does not republish the source photography.':'An internal fictional record used to test provider workflows.',rules:'Not stated in the public reference snapshot.',accessibility:'Not stated in the public reference snapshot.',images:['/images/room-'+(i%3+1)+'.jpg'],tour:'',status:publicSample?'LIVE':i===24?'PENDING_REVIEW':i===25?'DRAFT':i===26?'RENTED':'PAUSED',confirmedAt:publicSample?'2026-11-03T00:00:00Z':null,createdAt:'2026-10-30T00:00:00Z',sampleSourceName:publicSample?real.source+' · '+real.title:undefined,sampleSourceUrl:publicSample?real.url:undefined,sampleSourceCheckedAt:publicSample?'2026-11-03':undefined,reviewScope:publicSample?'Real-market reference snapshot':''};});}
export function seedSemesterHomes(confirmedAt:string):Home[]{const base=seedHomes()[0];return [
 {...base,id:'home-29',providerId:'demo-agent-1',title:'Fictional semester room · Kennedy Town',district:'Kennedy Town',type:'Private room',rent:22000,area:180,capacity:1,bedrooms:1,bathrooms:1,from:'2027-08-01',until:'2028-07-31',minMonths:4,maxMonths:12,amenities:['Wi-Fi','Desk','Air conditioning'],description:'Fictional room used to demonstrate how a stated stay window can fit a student’s semester plans. This is not a real rental offer.',rules:'Sample house rules: keep shared spaces tidy.',accessibility:'Not assessed in this fictional example.',images:['/images/room-1.jpg'],status:'LIVE',confirmedAt,createdAt:'2026-10-31T00:00:00Z',sampleSourceName:undefined,sampleSourceUrl:undefined,sampleSourceCheckedAt:undefined,reviewScope:'Fictional semester example'},
 {...base,id:'home-30',providerId:'demo-agent-2',title:'Fictional semester room · Sai Ying Pun',district:'Sai Ying Pun',type:'Private room',rent:23000,area:170,capacity:1,bedrooms:1,bathrooms:1,from:'2027-08-10',until:'2028-06-30',minMonths:4,maxMonths:10,amenities:['Wi-Fi','Desk'],description:'Fictional room used to compare a second semester stay window. Dates and features are invented for the demo.',rules:'Sample house rules: quiet hours after 10 pm.',accessibility:'Not assessed in this fictional example.',images:['/images/room-2.jpg'],status:'LIVE',confirmedAt,createdAt:'2026-10-31T00:00:00Z',sampleSourceName:undefined,sampleSourceUrl:undefined,sampleSourceCheckedAt:undefined,reviewScope:'Fictional semester example'},
];}
export async function ensureSeed(db:AppDatabase){
 if(!DEMO_MODE)return;
 if(await db.prepare("SELECT value FROM meta WHERE key='seed-v8'").first())return;
 const now=new Date().toISOString(),statements:PreparedStatement[]=[];
 const user=(id:string,name:string,role:string)=>statements.push(db.prepare('INSERT OR IGNORE INTO users (id,email,name,role,verified,demo,status,createdAt) VALUES (?,?,?,?,1,1,?,?)').bind(id,id+'@example.test',name,role,'ACTIVE',now));
 user('demo-admin','Demo reviewer','ADMIN');
 providerNames.forEach((name,i)=>{const id='demo-agent-'+(i+1);user(id,name,'AGENT');statements.push(db.prepare('INSERT OR IGNORE INTO providers (userId,name,type,status,data,updatedAt) VALUES (?,?,?,?,?,?)').bind(id,name+' · sample',i%2?'LANDLORD':'AGENT',i===5?'APPLIED':'APPROVED',JSON.stringify({contact:name,region:'Hong Kong',bio:'Fictional housing provider for this demo. No licence or ownership checks have been performed.',phone:'',licence:''}),now));});
 studentNames.forEach((name,i)=>{
  const id='demo-student-'+(i+1);user(id,name,'STUDENT');
  const updated=JSON.stringify({...sampleProfile,budget:35000+i*250});
  statements.push(db.prepare('INSERT OR IGNORE INTO profiles (userId,data,updatedAt) VALUES (?,?,?)').bind(id,updated,now));
  statements.push(db.prepare('UPDATE profiles SET data=?,updatedAt=? WHERE userId=? AND data=?').bind(updated,now,id,JSON.stringify({...previousSampleProfile,budget:8000+i*250})));
  statements.push(db.prepare('UPDATE profiles SET data=?,updatedAt=? WHERE userId=? AND data=?').bind(updated,now,id,JSON.stringify({...previousDemoProfile,budget:30000+i*250})));
  if(i<9){
   const roommateData=JSON.stringify({alias:name,university:'HKU',districts:['Kennedy Town','Sai Ying Pun'],budget:8000+i*250,start:'2027-08-15',priorities:['Quiet study','Tidy shared spaces',i%2?'Early mornings':'Cooking together'],bio:['A quiet study corner, a good cup of tea, and weekend walks.','New chapter, new city. Looking for a thoughtful flatmate.','Happy to share a meal and keep our home feeling calm.'][i%3]});
   statements.push(db.prepare('INSERT OR IGNORE INTO roommates (userId,visibility,data,consentAt,updatedAt) VALUES (?,?,?,?,?)').bind(id,'DISCOVERABLE',roommateData,now,now));
   if(i===0)statements.push(db.prepare("UPDATE roommates SET visibility='DISCOVERABLE',consentAt=?,updatedAt=? WHERE userId=? AND visibility='HIDDEN' AND data=? AND updatedAt=consentAt").bind(now,now,id,roommateData));
  }
 });
 const homes=[...seedHomes(),...seedSemesterHomes(now)];
 homes.forEach(h=>{if(h.providerId==='demo-agent-6'&&h.status==='LIVE')h.providerId='demo-agent-1';const {id,providerId,title,district,rent,type,status,createdAt,...data}=h;statements.push(db.prepare('INSERT OR IGNORE INTO listings (id,providerId,title,district,rent,type,status,data,privateAddress,reviewScope,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,providerId,title,district,rent,type,status,JSON.stringify(data),'Fictional address — no physical property',h.reviewScope||'',createdAt,now));});
 homes.filter(h=>h.status==='LIVE').forEach(h=>{const {id,providerId,title,district,rent,type,status,createdAt,...data}=h;statements.push(db.prepare('UPDATE listings SET title=?,district=?,rent=?,type=?,data=?,reviewScope=?,updatedAt=? WHERE id=?').bind(title,district,rent,type,JSON.stringify(data),h.reviewScope||'',now,id));});
 ['SUBMITTED','ACCEPTED','VIEWING_PROPOSED','VIEWING_COMPLETED'].forEach((status,i)=>{const h=seedHomes()[i];statements.push(db.prepare('INSERT OR IGNORE INTO inquiries (id,studentId,providerId,listingId,status,message,snapshot,fit,consentAt,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)').bind('demo-inquiry-'+i,'demo-student-'+(i+2),h.providerId,h.id,status,'Sample enquiry: I am arriving in August. Could we arrange a remote viewing?',JSON.stringify({...sampleProfile,alias:studentNames[i+1]}),'{}',now,now,now));});
 const sampleDay=Date.now()-86_400_000,at=(minutes:number)=>new Date(sampleDay+minutes*60_000).toISOString();
 statements.push(db.prepare('INSERT OR IGNORE INTO inquiries (id,studentId,providerId,listingId,status,message,snapshot,fit,consentAt,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)').bind('demo-inquiry-alex','demo-student-1','demo-agent-1','home-1','ACCEPTED','Hi, is this sample home suitable for an August move-in? I would like to understand the viewing options.',JSON.stringify({...sampleProfile,alias:'Alex'}),'{}',at(0),at(0),at(30)));
 [
  ['demo-student-1','Hi Harbour Nest, could I arrange a remote viewing before I arrive in Hong Kong?'],
  ['demo-agent-1','Hi Alex. Yes, we can discuss a video viewing. The linked source listing may change, so please check the current details first.'],
  ['demo-student-1','Thanks. I will compare the listing details and send a couple of times that work for me.'],
 ].forEach(([sender,body],i)=>statements.push(db.prepare("INSERT OR IGNORE INTO messages (id,contextId,senderId,body,createdAt) SELECT ?,?,?,?,? WHERE EXISTS (SELECT 1 FROM inquiries WHERE id='demo-inquiry-alex')").bind('demo-housing-message-'+i,'demo-inquiry-alex',sender,body,at(10+i*10))));
 statements.push(db.prepare("INSERT OR IGNORE INTO connections (id,senderId,recipientId,pair,status,createdAt) SELECT ?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM roommates WHERE userId='demo-student-1' AND visibility='DISCOVERABLE') AND EXISTS (SELECT 1 FROM roommates WHERE userId='demo-student-2' AND visibility='DISCOVERABLE')").bind('demo-connection-alex-jamie','demo-student-1','demo-student-2','demo-student-1:demo-student-2','ACCEPTED',at(0)));
 [
  ['demo-student-1','Hi Jamie! I noticed we both like a quiet study space. How do you usually plan shared chores?'],
  ['demo-student-2','Hi Alex! I like a simple weekly rota and keeping the kitchen tidy after cooking.'],
  ['demo-student-1','That sounds good to me. We can compare move-in plans before deciding anything.'],
 ].forEach(([sender,body],i)=>statements.push(db.prepare("INSERT OR IGNORE INTO messages (id,contextId,senderId,body,createdAt) SELECT ?,?,?,?,? WHERE EXISTS (SELECT 1 FROM connections WHERE id='demo-connection-alex-jamie')").bind('demo-roommate-message-'+i,'demo-connection-alex-jamie',sender,body,at(12+i*10))));
 statements.push(db.prepare("INSERT OR IGNORE INTO meta (key,value) VALUES ('seed-v8',?)").bind(now));
 await db.batch(statements);
}
