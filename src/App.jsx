// SUPPORT_DESK_REBUILD_V1
import { useEffect, useMemo, useState } from 'react'

const tickets=[
{id:1042,title:'Checkout fails for returning customers',customer:'Riya Sen',priority:'High',status:'Open',assignee:'Aarav',category:'Billing',messages:5},
{id:1041,title:'Cannot export monthly report',customer:'Kunal Shah',priority:'Medium',status:'Pending',assignee:'Meera',category:'Reports',messages:3},
{id:1040,title:'Invite link redirects to login',customer:'Nisha Roy',priority:'High',status:'Open',assignee:'Kabir',category:'Auth',messages:8},
{id:1039,title:'Dark mode preference resets',customer:'Dev Malhotra',priority:'Low',status:'Resolved',assignee:'Aarav',category:'UI',messages:2},
{id:1038,title:'Webhook events arrive twice',customer:'Ananya Das',priority:'High',status:'Open',assignee:'Meera',category:'Integrations',messages:11},
{id:1037,title:'Invoice PDF has wrong timezone',customer:'Rohit Jain',priority:'Medium',status:'Pending',assignee:'Ira',category:'Billing',messages:4},
]

const agents=['All agents','Aarav','Meera','Kabir','Ira']
const states=['All status','Open','Pending','Resolved']

export default function App(){
const[list,setList]=useState(tickets)
const[selectedId,setSelectedId]=useState(1042)
const[q,setQ]=useState('')
const[state,setState]=useState('All status')
const[agent,setAgent]=useState('All agents')
const[sort,setSort]=useState('latest')
const[reply,setReply]=useState('')
const[sending,setSending]=useState(false)
const[dark,setDark]=useState(false)

useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light'},[dark])

const rows=useMemo(()=>{let r=list.filter(t=>(state==='All status'||t.status===state)&&(agent==='All agents'||t.assignee===agent)&&(t.title+' '+t.customer+' '+t.category).toLowerCase().includes(q.toLowerCase()));if(sort==='priority'){const rank={High:0,Medium:1,Low:2};r=[...r].sort((a,b)=>rank[a.priority]-rank[b.priority])}if(sort==='activity')r=[...r].sort((a,b)=>b.messages-a.messages);return r},[list,state,agent,q,sort])
const selected=list.find(t=>t.id===selectedId)||rows[0]
const open=list.filter(t=>t.status==='Open').length
const pending=list.filter(t=>t.status==='Pending').length
const urgent=list.filter(t=>t.priority==='High'&&t.status!=='Resolved').length

function update(id,status){setList(x=>x.map(t=>t.id===id?{...t,status}:t))}
function send(){if(!reply.trim()||!selected)return;setSending(true);setTimeout(()=>{setList(x=>x.map(t=>t.id===selected.id?{...t,messages:t.messages+1,status:'Pending'}:t));setReply('');setSending(false)},600)}

return <div className="app-shell">
<aside className="sidebar"><div className="brand"><b>HelpDesk</b><span>PRO</span></div><button className="nav active">▣ Inbox <em>{open}</em></button><button className="nav">◫ My tickets</button><button className="nav">◉ Customers</button><button className="nav">⌁ Automations</button><div className="spacer"/><button className="nav">⚙ Settings</button><div className="user"><b>Support Lead</b><small>Online</small></div></aside>
<main className="main"><header className="header"><div><span className="kicker">SUPPORT OPERATIONS</span><h1>Inbox</h1></div><div className="actions"><button onClick={()=>setDark(v=>!v)}>{dark?'☀':'☾'}</button><button className="primary">＋ New ticket</button></div></header>
<section className="stats"><div><span>Open</span><b>{open}</b><small>+3 today</small></div><div><span>Pending</span><b>{pending}</b><small>Awaiting customer</small></div><div><span>High priority</span><b>{urgent}</b><small>Needs attention</small></div><div><span>SLA health</span><b>96%</b><small>↑ 2.4% this week</small></div></section>
<section className="filters"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tickets, customers, categories..."/><select value={state} onChange={e=>setState(e.target.value)}>{states.map(x=><option key={x}>{x}</option>)}</select><select value={agent} onChange={e=>setAgent(e.target.value)}>{agents.map(x=><option key={x}>{x}</option>)}</select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="latest">Sort: latest</option><option value="priority">Sort: priority</option><option value="activity">Sort: activity</option></select></section>
<section className="grid"><div className="panel queue"><div className="panel-head"><div><span className="kicker">QUEUE</span><h2>{rows.length} tickets</h2></div><small>● Live</small></div>{rows.map(t=><button className={'ticket '+(selected?.id===t.id?'selected':'')} key={t.id} onClick={()=>setSelectedId(t.id)}><div><span>#{t.id}</span><i className={t.priority.toLowerCase()}>{t.priority}</i><i className={t.status.toLowerCase()}>{t.status}</i></div><strong>{t.title}</strong><p>{t.customer} · {t.category}</p><small>{t.assignee} · {t.messages} messages</small></button>)}</div>
<div className="panel conversation">{selected&&<><div className="conversation-head"><div><span className="kicker">#{selected.id} · {selected.category}</span><h2>{selected.title}</h2><p>{selected.customer} · customer report</p></div><select value={selected.status} onChange={e=>update(selected.id,e.target.value)}><option>Open</option><option>Pending</option><option>Resolved</option></select></div><div className="messages"><article><b>{selected.customer}</b><small>10:12</small><p>Checkout started failing after I updated my card. Existing subscriptions still work, but new payments show an error.</p></article><article className="agent"><b>Support Lead</b><small>10:18</small><p>Thanks for the report. I’m checking payment logs and account state now.</p></article><article><b>{selected.customer}</b><small>10:24</small><p>The issue seems to happen only with the saved payment method.</p></article></div><div className="composer"><textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Write a reply..."/><button className="primary" disabled={sending||!reply.trim()} onClick={send}>{sending?'Sending...':'Send reply'}</button></div></>}</div>
<aside className="panel details"><span className="kicker">CUSTOMER</span><h3>{selected?.customer}</h3><p>Pro account · 18.4k MRR</p><hr/><span className="kicker">CUSTOMER HEALTH</span><div className="score">84 <small>/100</small></div><div className="bar"><i/></div><hr/><span className="kicker">INTERNAL NOTE</span><div className="note">3 failed payment attempts this month. Check saved payment token before escalating.</div></aside></section></main>
</div>
}
