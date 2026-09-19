import {useEffect,useMemo,useState} from 'react'

const initialTasks=[
{id:1,title:'Design onboarding flow',owner:'Aarav',status:'In Progress',priority:'High',points:5},
{id:2,title:'Implement analytics cards',owner:'Meera',status:'Todo',priority:'Medium',points:3},
{id:3,title:'Fix mobile navigation',owner:'Kabir',status:'Done',priority:'High',points:2},
{id:4,title:'Add export endpoint',owner:'Ira',status:'In Progress',priority:'Low',points:3},
{id:5,title:'Write release notes',owner:'Aarav',status:'Todo',priority:'Low',points:1},
{id:6,title:'QA recurring billing',owner:'Meera',status:'Done',priority:'Medium',points:5},
]

function StatCard({label,value,trend}){return <div className="stat-card"><span className="muted">{label}</span><strong>{value}</strong><small>{trend}</small></div>}

export default function App(){
const[tasks,setTasks]=useState(initialTasks)
const[query,setQuery]=useState('')
const[status,setStatus]=useState('All')
const[sortBy,setSortBy]=useState('points')
const[selectedTask,setSelectedTask]=useState(null)
const[isDark,setIsDark]=useState(false)
const[lastSaved,setLastSaved]=useState('Just now')

const filteredTasks=useMemo(()=>{
const result=tasks.filter(t=>status==='All'||t.status===status).filter(t=>(t.title+' '+t.owner+' '+t.priority).toLowerCase().includes(query.toLowerCase()))
return [...result].sort((a,b)=>sortBy==='points'?b.points-a.points:sortBy==='priority'?({High:0,Medium:1,Low:2}[a.priority]-{High:0,Medium:1,Low:2}[b.priority]):a.title.localeCompare(b.title))
},[tasks,query,status,sortBy])

const completed=tasks.filter(t=>t.status==='Done').length
const totalPoints=tasks.reduce((s,t)=>s+t.points,0)
const highPriority=tasks.filter(t=>t.priority==='High').length

useEffect(()=>{document.body.dataset.theme=isDark?'dark':'light'},[isDark])
useEffect(()=>{const saved=localStorage.getItem('pulseboard-tasks');if(saved)setTasks(JSON.parse(saved))},[])

function updateStatus(id,nextStatus){setTasks(current=>current.map(t=>t.id===id?{...t,status:nextStatus}:t));setLastSaved('Unsaved changes')}
function saveChanges(){localStorage.setItem('pulseboard-tasks',JSON.stringify(tasks));setLastSaved('Saved just now')}
function resetBoard(){setTasks(initialTasks);setLastSaved('Reset — not saved')}

return <div className="app-shell">
<header className="topbar"><div><p className="eyebrow">PULSEBOARD</p><h1>Engineering Sprint</h1></div><div className="top-actions"><span className="save-state">{lastSaved}</span><button className="ghost" onClick={()=>setIsDark(v=>!v)}>{isDark?'Light mode':'Dark mode'}</button><button className="primary" onClick={saveChanges}>Save changes</button></div></header>
<main>
<section className="hero-grid"><div className="hero-copy"><span className="pill">Sprint 24 · 9 days left</span><h2>Ship the next iteration without losing the plot.</h2><p>Track work, spot bottlenecks, and keep ownership clear across the team.</p></div><div className="stats-grid"><StatCard label="Completed" value={completed+'/'+tasks.length} trend="+2 this week"/><StatCard label="Story points" value={totalPoints} trend="82% planned"/><StatCard label="High priority" value={highPriority} trend="Needs attention"/></div></section>
<section className="toolbar panel"><div className="search-wrap"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tasks, owners..."/></div><select value={status} onChange={e=>setStatus(e.target.value)}><option>All</option><option>Todo</option><option>In Progress</option><option>Done</option></select><select value={sortBy} onChange={e=>setSortBy(e.target.value)}><option value="points">Sort: points</option><option value="priority">Sort: priority</option><option value="title">Sort: title</option></select><button className="ghost" onClick={resetBoard}>Reset</button></section>
<section className="content-grid"><div className="panel task-panel"><div className="section-heading"><div><span className="eyebrow">CURRENT WORK</span><h3>Task board</h3></div><span className="count">{filteredTasks.length} visible</span></div><div className="task-list">{filteredTasks.map(task=><article className="task-row" key={task.id} onClick={()=>setSelectedTask(task)}><div className={'status-dot '+task.status.toLowerCase().replace(' ','-')}/><div className="task-main"><h4>{task.title}</h4><div className="meta"><span>{task.owner}</span><span>•</span><span>{task.points} pts</span></div></div><select value={task.status} onClick={e=>e.stopPropagation()} onChange={e=>updateStatus(task.id,e.target.value)}><option>Todo</option><option>In Progress</option><option>Done</option></select><span className={'priority '+task.priority.toLowerCase()}>{task.priority}</span></article>)}</div></div>
<aside className="panel insight-panel"><div className="section-heading"><div><span className="eyebrow">TEAM PULSE</span><h3>Delivery health</h3></div></div><div className="health-ring"><span>78%</span></div><p className="health-copy">The sprint is on track, but two high-priority tasks are still open.</p><div className="mini-list"><div><span>Meera</span><b>8 pts</b></div><div><span>Aarav</span><b>6 pts</b></div><div><span>Kabir</span><b>2 pts</b></div></div></aside></section>
</main>
{selectedTask&&<div className="modal-backdrop" onClick={()=>setSelectedTask(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelectedTask(null)}>×</button><span className="eyebrow">TASK DETAILS</span><h3>{selectedTask.title}</h3><p>Owner: {selectedTask.owner}</p><p>Priority: {selectedTask.priority} · {selectedTask.points} story points</p><button className="primary wide" onClick={()=>{updateStatus(selectedTask.id,selectedTask.status==='Done'?'Todo':'Done');setSelectedTask(null)}}>{selectedTask.status==='Done'?'Re-open task':'Mark complete'}</button></div></div>}
</div>
}