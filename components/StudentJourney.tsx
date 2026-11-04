'use client';

import {ArrowRight,CalendarDays,MessageSquare} from 'lucide-react';
import {addMonths} from '@/lib/domain';
import {useUI} from './ui';

const steps=[
  {title:'Set your housing profile',detail:'Choose move-in dates, lease length, budget and home preferences.',href:'/app/preferences'},
  {title:'Discover best-fit homes',detail:'See fit reasons and swipe through the sample listings.',href:'/app/discover'},
  {title:'Compare your options',detail:'Select up to four homes and check costs, dates and trade-offs.',href:'/app/compare'},
  {title:'Match with roommates',detail:'Opt in and meet compatible students when you want to.',href:'/app/roommates'},
  {title:'Ask and follow up',detail:'Open a home to ask its demo provider, then track the conversation.',href:'/app/inquiries'},
];

export default function StudentJourney({path}:{path:string}){
  const {boot}=useUI();
  const profile=boot?.profile;
  const moveIn=profile?.start&&profile?.end
    ? profile.start===profile.end?profile.start:profile.start+' to '+profile.end
    : 'Add your dates';
  const moveOut=profile?.start&&profile?.months
    ? addMonths(profile.start,profile.months)
    : 'Set a lease length';
  return <aside className="student-journey" aria-label="Your semester housing plan">
    <div className="journey-heading">
      <span className="eyebrow">YOUR SEMESTER PLAN</span>
      <h2>Best-fit timeline</h2>
      <p>Plan the move, find a fit, and ask questions as you go.</p>
    </div>
    <div className="journey-dates">
      <CalendarDays size={18}/>
      <div><strong>Move-in window</strong><span>{moveIn}</span></div>
      <div><strong>Earliest planned lease end</strong><span>{moveOut}</span></div>
    </div>
    <ol className="journey-steps">
      {steps.map((step,index)=><li key={step.href}>
        <span className="journey-number">{index+1}</span>
        <a href={step.href} aria-current={
          path===step.href||path.startsWith(step.href+'/')||
          (step.href==='/app/preferences'&&['/app/profile','/app/onboarding'].includes(path))||
          (step.href==='/app/inquiries'&&path.startsWith('/app/listings/'))
            ?'step':undefined}>
          <strong>{step.title}<ArrowRight size={14}/></strong>
          <small>{step.detail}</small>
        </a>
      </li>)}
      <li><span className="journey-number">6</span><div><strong>Arrange handover</strong><small>Confirm the actual date, keys and condition directly with the provider. The demo does not record a handover.</small></div></li>
    </ol>
    <a className="journey-ask" href="/app/discover"><MessageSquare size={17}/>Choose a home to ask about<ArrowRight size={15}/></a>
  </aside>;
}
