export const universities = ['HKU','CUHK','HKUST','CityUHK','PolyU','HKBU','LingnanU','EdUHK','HKMU','Other'];
export const districts = ['Kennedy Town','Sai Ying Pun','Sheung Wan','Wan Chai','Causeway Bay','North Point','Hung Hom','Kowloon Tong','Mong Kok','Sha Tin','Tai Wai','Tai Po'];
export const amenities = ['Wi-Fi','Air conditioning','Desk','Laundry','Kitchen','Lift','Private bathroom','Furnished'];
export const priorities = ['Early mornings','Night owl','Tidy shared spaces','Quiet study','Cooking together','Occasional guests','Smoke-free','Pet-friendly'];
export const roomTypes = ['Any','Private room','Studio','Shared room','Entire flat'];
export type Role = 'STUDENT'|'AGENT'|'ADMIN'|'MODERATOR'|'SUPPORT'|'REVIEWER';
export type Profile = { university?:string; study?:string; arrival?:string; start?:string; end?:string; months?:number; budget?:number; minBudget?:number; districts?:string[]; roomType?:string; occupancy?:number; amenities?:string[]; flexible?:boolean; locale?:string; step?:number; complete?:boolean };
export type Home = { id:string; providerId:string; title:string; district:string; type:string; rent:number; deposit:number; fee:number; utilities:string; area:number; capacity:number; bedrooms:number; bathrooms:number; from:string|null; until:string|null; minMonths:number; maxMonths:number; amenities:string[]; description:string; rules:string; accessibility:string; images:string[]; tour:string; status:string; confirmedAt:string|null; createdAt:string; providerName?:string; providerType?:string; match?:Fit; saved?:boolean; interaction?:string; reviewScope?:string };
export type Fit = { eligible:boolean; score:number|null; scoreVersion:string; positiveReasons:string[]; tradeoffs:string[]; unknowns:string[]; hardFilterReasons:string[]; criteria:number; breakdown:{label:string; points:number; max:number}[] };
export type User = {id:string;name:string;role:Role;email:string;verified:number;demo:number;status:string};
export const transitions:Record<string,string[]> = {SUBMITTED:['ACCEPTED','MORE_INFO_NEEDED','DECLINED'],MORE_INFO_NEEDED:['ACCEPTED','DECLINED'],ACCEPTED:['VIEWING_PROPOSED','CLOSED_BY_AGENT'],VIEWING_PROPOSED:['VIEWING_CONFIRMED','ACCEPTED','CLOSED_BY_AGENT'],VIEWING_CONFIRMED:['VIEWING_COMPLETED','ACCEPTED','CLOSED_BY_AGENT'],VIEWING_COMPLETED:['LEASE_REPORTED','NOT_PROCEEDING']};
export function validDate(value:unknown):value is string { return typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value; }
export function profileError(p:Profile,complete=false):string|null {
  if(p.budget!==undefined&&(!Number.isInteger(p.budget)||p.budget<1000||p.budget>100000))return 'Monthly budget must be between HK$1,000 and HK$100,000.';
  if(p.minBudget!==undefined&&(p.minBudget<0||p.minBudget>(p.budget??0)))return 'Minimum budget must not exceed maximum budget.';
  if(p.start&&!validDate(p.start)||p.end&&!validDate(p.end)||p.arrival&&!validDate(p.arrival))return 'Enter a valid calendar date.';
  if(p.start&&p.end&&p.start>p.end)return 'Latest move-in must be on or after earliest move-in.';
  if(p.months!==undefined&&(!Number.isInteger(p.months)||p.months<1||p.months>36))return 'Choose a lease between 1 and 36 months.';
  if(p.occupancy!==undefined&&(!Number.isInteger(p.occupancy)||p.occupancy<1||p.occupancy>8))return 'Occupancy must be between 1 and 8.';
  if(p.university&&!universities.includes(p.university))return 'Choose a university from the list.';
  if(p.districts?.some(d=>!districts.includes(d))||p.amenities?.some(a=>!amenities.includes(a)))return 'Choose valid areas and amenities.';
  if(p.roomType&&!roomTypes.includes(p.roomType))return 'Choose a valid room type.';
  if(complete&&(!p.university||!p.start||!p.end||!p.budget||!p.months||!p.arrival||!p.study))return 'Complete your university, study category, arrival, move-in dates, lease and budget.';
  return null;
}
export function addMonths(date:string,months:number){const d=new Date(date+'T00:00:00Z');const day=d.getUTCDate();d.setUTCMonth(d.getUTCMonth()+months,1);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));return d.toISOString().slice(0,10);}
export function matchHome(p:Profile,h:Home):Fit {
 const result:Fit={eligible:true,score:null,scoreVersion:'v1',positiveReasons:[],tradeoffs:[],unknowns:['Commute time unavailable'],hardFilterReasons:[],criteria:0,breakdown:[]};
 const fail=(s:string)=>result.hardFilterReasons.push(s);
 if(h.status!=='LIVE')fail('Listing is not available');
 if(p.budget&&h.rent>p.budget&&(!p.flexible||h.rent>p.budget*1.1))fail('Above your monthly budget');
 if(p.occupancy&&p.occupancy>h.capacity)fail('Not enough occupant capacity');
 if(p.roomType&&p.roomType!=='Any'&&p.roomType!==h.type)fail('Different room type');
 if(p.months&&(p.months<h.minMonths||p.months>h.maxMonths))fail('Lease length does not fit');
 const move=p.start&&h.from?(p.start>h.from?p.start:h.from):p.start;
 if(p.end&&h.from&&h.from>p.end)fail('Available after your move-in window');
 if(move&&h.until&&(move>h.until||(p.months&&addMonths(move,p.months)>h.until)))fail('Availability does not cover your lease');
 if(!h.from||!h.confirmedAt)result.unknowns.push('Availability not confirmed');
 if(h.confirmedAt&&Date.now()-Date.parse(h.confirmedAt)>30*86400000)result.unknowns.push('Availability not recently confirmed');
 const part=(label:string,points:number,max:number)=>result.breakdown.push({label,points,max});
 if(p.budget){const ratio=h.rent/p.budget;part('Budget',ratio<=.8?30:ratio<=1?30-(ratio-.8)*60:5,30);(ratio<=1?result.positiveReasons:result.tradeoffs).push(ratio<=1?'Within your monthly budget':'Up to 10% above your budget');}
 if(p.districts?.length){const index=p.districts.indexOf(h.district);part('Neighbourhood',index===0?20:index>0?15:0,20);(index>=0?result.positiveReasons:result.tradeoffs).push(index>=0?'In your preferred neighbourhood':'Outside your preferred areas');}
 if(p.start&&p.end&&h.from&&h.confirmedAt){const fits=!result.hardFilterReasons.some(r=>/lease|move-in|Availability/.test(r));part('Move-in & lease',fits?20:0,20);if(fits)result.positiveReasons.push('Listed dates fit your plans');}
 if(p.roomType&&p.roomType!=='Any'){part('Room & space',h.type===p.roomType?15:0,15);if(h.type===p.roomType)result.positiveReasons.push('Your preferred room type');}
 if(p.amenities?.length){const found=p.amenities.filter(a=>h.amenities.includes(a));part('Amenities',10*found.length/p.amenities.length,10);const missing=p.amenities.filter(a=>!h.amenities.includes(a));if(missing.length)result.tradeoffs.push('Not listed: '+missing.join(', '));else result.positiveReasons.push('All requested amenities');}
 if(!h.tour)result.tradeoffs.push('Photo gallery; no 3D tour');
 result.criteria=result.breakdown.length;result.eligible=result.hardFilterReasons.length===0;
 const max=result.breakdown.reduce((s,b)=>s+b.max,0);result.score=max?Math.round(100*result.breakdown.reduce((s,b)=>s+b.points,0)/max):null;
 return result;
}
export function roommateFit(a:{districts:string[];budget:number;start:string;priorities:string[]},b:typeof a){
 const shared=a.districts.filter(d=>b.districts.includes(d));const days=Math.abs(Date.parse(a.start)-Date.parse(b.start))/86400000;const ratio=Math.min(a.budget,b.budget)/Math.max(a.budget,b.budget);
 const overlap=a.priorities.filter(p=>b.priorities.includes(p));
 return {eligible:shared.length>0&&days<=62&&ratio>=.65,score:Math.round(40*(shared.length?1:0)+25*Math.max(0,1-days/90)+20*ratio+(a.priorities.length?15*overlap.length/a.priorities.length:0)),reasons:[shared.length?shared.join(', '):'Different areas',days<=31?'Similar move-in month':'Flexible move-in needed',overlap.length?overlap.join(' · '):'Explore your living habits together'],limited:!a.priorities.length||!b.priorities.length};
}
export function allowedTour(url:string){if(!url)return true;try{const u=new URL(url);return u.protocol==='https:'&&['my.matterport.com','kuula.co'].includes(u.hostname)&&!u.username&&!u.password;}catch{return false;}}
