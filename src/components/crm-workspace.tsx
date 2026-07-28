"use client";

import Link from "next/link";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell,
  BrainCircuit, Building2, CalendarDays, Check, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, CircleDollarSign, Clock3, Copy, Ellipsis,
  ExternalLink, Filter, Globe2, Inbox, LayoutDashboard, Mail, MailCheck,
  Menu, MessageSquareText, PenLine, Phone, Plus, Radio, RefreshCw, Search,
  Send, Settings, Sparkles, Target, TrendingUp, UserRound, UsersRound,
  Webhook, X, Zap,
} from "lucide-react";
import { useState } from "react";
import {
  activities, contacts, initialDeals, meetings, stages, type Deal, type Stage,
} from "@/data/demo";

type View = "Dashboard" | "Contacts" | "Pipeline" | "Email" | "Meetings" | "Reports" | "Team" | "Webhooks";

const navigation: { label: View; icon: React.ComponentType<{ size?: number }> }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Contacts", icon: UsersRound },
  { label: "Pipeline", icon: TrendingUp },
  { label: "Email", icon: Mail },
  { label: "Meetings", icon: CalendarDays },
  { label: "Reports", icon: BarChart3 },
];

const settingsNav: { label: View; icon: React.ComponentType<{ size?: number }> }[] = [
  { label: "Team", icon: UserRound },
  { label: "Webhooks", icon: Webhook },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
});

function Avatar({ initials, size = "normal" }: { initials: string; size?: "small" | "normal" | "large" }) {
  const hues: Record<string, string> = {
    EE: "#7157db", MK: "#167f69", AO: "#d85e43", NJ: "#2877c7", TS: "#af7818",
    DM: "#6c5aa7", SA: "#be4f79", KL: "#262c36", BP: "#3975cf", AW: "#16866d",
    FW: "#a15a38", AP: "#7157db", ME: "#58697c", NG: "#9c6a22",
  };
  return <span className={`crm-avatar avatar-${size}`} style={{ background: hues[initials] ?? "#4c5666" }}>{initials}</span>;
}

export function CrmWorkspace() {
  const [view, setView] = useState<View>("Dashboard");
  const [deals, setDeals] = useState(initialDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedContact, setSelectedContact] = useState<(typeof contacts)[number] | null>(null);
  const [emailWriter, setEmailWriter] = useState(false);
  const [meetingSummary, setMeetingSummary] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.company} ${contact.email}`.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredDeals = deals.filter((deal) =>
    `${deal.name} ${deal.company} ${deal.contact}`.toLowerCase().includes(query.toLowerCase()),
  );

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  }

  function moveDeal(id: string, stage: Stage) {
    setDeals((current) => current.map((deal) => deal.id === id ? { ...deal, stage } : deal));
    setSelectedDeal((current) => current?.id === id ? { ...current, stage } : current);
    notify(`Deal moved to ${stage}`);
  }

  function addLead(formData: FormData) {
    const company = String(formData.get("company") || "New company");
    const newDeal: Deal = {
      id: `DEAL-${210 + deals.length}`,
      name: String(formData.get("deal") || `${company} opportunity`),
      company,
      contact: String(formData.get("contact") || "New contact"),
      initials: company.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase(),
      value: Number(formData.get("value") || 25000),
      stage: "New lead", probability: 20, owner: "EE", closeDate: "Sep 30",
      health: "Good", lastActivity: "Just now", nextStep: "Complete lead qualification",
    };
    setDeals((current) => [newDeal, ...current]);
    setAddLeadOpen(false);
    setView("Pipeline");
    notify("Lead added to pipeline");
  }

  return (
    <div className="crm-shell">
      <aside className={`crm-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="crm-brand-row">
          <Link href="/" className="signal-brand">
            <span className="signal-mark"><Radio size={15} /></span>
            <strong>Dynamis</strong><span>Signal</span>
          </Link>
          <button className="crm-mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <button className="workspace-switch" type="button">
          <span>N</span><div><strong>Northstar</strong><small>Business workspace</small></div><ChevronDown size={14} />
        </button>
        <nav className="crm-nav">
          {navigation.map(({ label, icon: Icon }) => (
            <button key={label} type="button" className={view === label ? "active" : ""} onClick={() => { setView(label); setSidebarOpen(false); }}>
              <Icon size={17} /><span>{label}</span>{label === "Email" && <b>3</b>}
            </button>
          ))}
        </nav>
        <p className="nav-label">WORKSPACE</p>
        <nav className="crm-nav">
          {settingsNav.map(({ label, icon: Icon }) => (
            <button key={label} type="button" className={view === label ? "active" : ""} onClick={() => { setView(label); setSidebarOpen(false); }}>
              <Icon size={17} /><span>{label}</span>
            </button>
          ))}
          <button type="button"><Settings size={17} /><span>Settings</span></button>
        </nav>
        <div className="signal-score-card">
          <div><Sparkles size={14} /><span>Signal score</span><strong>86</strong></div>
          <p>Your pipeline data is <b>healthy</b>. Two deals need attention.</p>
          <button type="button" onClick={() => setInsightsOpen(true)}>View insights <ArrowRight size={12} /></button>
        </div>
        <button className="crm-profile" type="button">
          <Avatar initials="EE" /><span><strong>Emmanuel Emirex</strong><small>Workspace admin</small></span><Ellipsis size={16} />
        </button>
      </aside>

      <main className="crm-main">
        <header className="crm-topbar">
          <button className="crm-mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <button className="crm-search" onClick={() => setSearchOpen(true)} type="button">
            <Search size={16} /><span>Search customers, deals, or activity</span><kbd>⌘ K</kbd>
          </button>
          <div className="crm-top-actions">
            <span className="demo-mode"><span /> Live demo</span>
            <button className="ask-signal" type="button" onClick={() => setInsightsOpen(true)}><Sparkles size={14} /> Ask Signal</button>
            <button type="button" aria-label="Notifications" className="bell-button"><Bell size={18} /><i /></button>
            <Avatar initials="EE" />
          </div>
        </header>
        <div className="crm-content">
          <PageHeader view={view} onAdd={() => view === "Email" ? setEmailWriter(true) : setAddLeadOpen(true)} />
          {view === "Dashboard" && <Dashboard deals={deals} onOpenDeal={setSelectedDeal} onView={setView} onInsight={() => setInsightsOpen(true)} />}
          {view === "Contacts" && <ContactsView rows={query ? filteredContacts : contacts} onOpen={setSelectedContact} />}
          {view === "Pipeline" && <Pipeline deals={query ? filteredDeals : deals} onOpen={setSelectedDeal} onDrag={setDraggedDeal} onDrop={(stage) => { if (draggedDeal) moveDeal(draggedDeal, stage); setDraggedDeal(null); }} />}
          {view === "Email" && <EmailView onWrite={() => setEmailWriter(true)} notify={notify} />}
          {view === "Meetings" && <MeetingsView onSummary={() => setMeetingSummary(true)} />}
          {view === "Reports" && <ReportsView />}
          {view === "Team" && <TeamView notify={notify} />}
          {view === "Webhooks" && <WebhooksView notify={notify} />}
        </div>
      </main>

      {selectedDeal && <DealPanel deal={selectedDeal} onClose={() => setSelectedDeal(null)} onWrite={() => setEmailWriter(true)} onMove={(stage) => moveDeal(selectedDeal.id, stage)} />}
      {selectedContact && <ContactPanel contact={selectedContact} onClose={() => setSelectedContact(null)} onWrite={() => setEmailWriter(true)} />}
      {emailWriter && <EmailWriter onClose={() => setEmailWriter(false)} notify={notify} />}
      {meetingSummary && <MeetingSummary onClose={() => setMeetingSummary(false)} notify={notify} />}
      {insightsOpen && <InsightsPanel onClose={() => setInsightsOpen(false)} onWrite={() => { setInsightsOpen(false); setEmailWriter(true); }} />}
      {searchOpen && (
        <Modal title="Search Signal" onClose={() => { setSearchOpen(false); setQuery(""); }} compact>
          <div className="search-input-wrap"><Search size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people, companies, deals…" /></div>
          <div className="crm-search-results"><span>TOP RESULTS</span>
            {(query ? filteredDeals : deals.slice(0, 3)).slice(0, 5).map((deal) => (
              <button key={deal.id} type="button" onClick={() => { setSelectedDeal(deal); setSearchOpen(false); setQuery(""); }}>
                <span className="company-avatar">{deal.initials}</span><div><strong>{deal.company}</strong><small>{deal.name} · {currency.format(deal.value)}</small></div><ArrowRight size={14} />
              </button>
            ))}
          </div>
        </Modal>
      )}
      {addLeadOpen && (
        <Modal title="Add a new lead" onClose={() => setAddLeadOpen(false)}>
          <form action={addLead} className="lead-form">
            <div className="form-pair"><label>Company<input name="company" required placeholder="Company name" /></label><label>Primary contact<input name="contact" required placeholder="Full name" /></label></div>
            <label>Opportunity name<input name="deal" required placeholder="e.g. Enterprise rollout" /></label>
            <div className="form-pair"><label>Estimated value<input name="value" type="number" min="0" placeholder="25000" /></label><label>Owner<select defaultValue="ee"><option value="ee">Emmanuel Emirex</option><option value="mk">Maya Khan</option></select></label></div>
            <label>Notes<textarea placeholder="Add source, context, or qualification notes…" /></label>
            <div className="modal-actions"><button type="button" className="crm-button secondary" onClick={() => setAddLeadOpen(false)}>Cancel</button><button type="submit" className="crm-button primary">Add lead</button></div>
          </form>
        </Modal>
      )}
      {toast && <div className="crm-toast"><Check size={15} /> {toast}</div>}
    </div>
  );
}

function PageHeader({ view, onAdd }: { view: View; onAdd: () => void }) {
  const subtitles: Record<View, string> = {
    Dashboard: "Here’s what’s moving revenue today.",
    Contacts: "People, companies, and every relationship touchpoint.",
    Pipeline: "All active opportunities, from first signal to closed won.",
    Email: "Conversations, engagement, and intelligent follow-up.",
    Meetings: "Customer conversations transformed into useful memory.",
    Reports: "Revenue performance, conversion, and forecast confidence.",
    Team: "Workspace members, roles, and data access.",
    Webhooks: "Securely send Signal events to your systems.",
  };
  return (
    <div className="crm-page-header">
      <div><span className="crm-breadcrumb">Northstar <ChevronRight size={12} /> {view}</span><h1>{view === "Dashboard" ? "Revenue command center" : view}</h1><p>{subtitles[view]}</p></div>
      <div className="page-actions">
        {view === "Dashboard" && <button className="crm-button secondary" type="button"><CalendarDays size={15} /> Jul 1 – Jul 28</button>}
        {!["Reports", "Team", "Webhooks", "Meetings"].includes(view) && (
          <button className="crm-button primary" type="button" onClick={onAdd}>{view === "Email" ? <><Sparkles size={15} /> Write with AI</> : <><Plus size={15} /> Add lead</>}</button>
        )}
      </div>
    </div>
  );
}

function Dashboard({ deals, onOpenDeal, onView, onInsight }: { deals: Deal[]; onOpenDeal: (deal: Deal) => void; onView: (view: View) => void; onInsight: () => void }) {
  const pipeline = deals.filter((deal) => deal.stage !== "Won").reduce((sum, deal) => sum + deal.value, 0);
  const weighted = deals.reduce((sum, deal) => sum + deal.value * deal.probability / 100, 0);
  return (
    <div className="dashboard-view">
      <section className="crm-metrics">
        <Metric icon={CircleDollarSign} label="Pipeline value" value={currency.format(pipeline)} change="+12.8%" positive context="vs. last month" />
        <Metric icon={Target} label="Weighted forecast" value={currency.format(weighted)} change="+8.4%" positive context="74% of target" />
        <Metric icon={TrendingUp} label="Win rate" value="31.4%" change="+3.2%" positive context="last 90 days" />
        <Metric icon={UsersRound} label="New leads" value="46" change="-4.1%" context="vs. last month" />
      </section>
      <section className="dashboard-grid">
        <article className="crm-panel momentum-panel">
          <div className="panel-title"><div><h3>Pipeline momentum</h3><p>Qualified pipeline added and closed over time</p></div><button type="button">Last 6 months <ChevronDown size={13} /></button></div>
          <div className="chart-legend"><span><i className="green" /> Pipeline added</span><span><i className="violet" /> Closed won</span></div>
          <div className="revenue-chart">
            <div className="chart-axis"><span>$240k</span><span>$180k</span><span>$120k</span><span>$60k</span><span>$0</span></div>
            <div className="chart-canvas">
              <svg viewBox="0 0 680 210" preserveAspectRatio="none">
                <defs><linearGradient id="greenArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#adf060" stopOpacity=".25" /><stop offset="100%" stopColor="#adf060" stopOpacity="0" /></linearGradient></defs>
                {[10, 57, 104, 151, 198].map((y) => <line key={y} x1="0" x2="680" y1={y} y2={y} />)}
                <path className="chart-area" d="M0 180 C55 150 80 160 125 135 S205 150 260 100 S350 125 405 72 S510 95 565 45 S630 52 680 20 L680 210 L0 210Z" />
                <path className="chart-line green-line" d="M0 180 C55 150 80 160 125 135 S205 150 260 100 S350 125 405 72 S510 95 565 45 S630 52 680 20" />
                <path className="chart-line violet-line" d="M0 195 C70 185 92 188 130 168 S218 178 265 147 S355 160 410 123 S520 137 570 98 S642 112 680 75" />
              </svg>
              <div className="chart-months">{["Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month) => <span key={month}>{month}</span>)}</div>
            </div>
          </div>
        </article>
        <article className="crm-panel focus-panel">
          <div className="panel-title"><div><h3>Today’s focus</h3><p>Prioritised by Signal</p></div><button type="button" className="icon-button" onClick={onInsight}><Sparkles size={15} /></button></div>
          <div className="focus-list">
            <button type="button" onClick={() => onOpenDeal(deals[0])}><span className="focus-icon risk"><Mail size={15} /></span><div><strong>Re-engage Kora Labs</strong><p>No reply for 8 days · $120k at risk</p></div><ArrowRight size={14} /></button>
            <button type="button" onClick={() => onView("Meetings")}><span className="focus-icon meeting"><CalendarDays size={15} /></span><div><strong>Prep BrightPay review</strong><p>Meeting starts in 42 minutes</p></div><ArrowRight size={14} /></button>
            <button type="button" onClick={() => onView("Email")}><span className="focus-icon engaged"><MailCheck size={15} /></span><div><strong>Follow up with Atlas</strong><p>Proposal opened 3 times today</p></div><ArrowRight size={14} /></button>
            <button type="button" onClick={() => onOpenDeal(deals[3])}><span className="focus-icon lead"><UserRound size={15} /></span><div><strong>Qualify Fieldwork</strong><p>New referral · potential $156k</p></div><ArrowRight size={14} /></button>
          </div>
          <button className="all-actions" type="button" onClick={onInsight}>View all recommended actions <ArrowRight size={13} /></button>
        </article>
      </section>
      <section className="dashboard-lower">
        <article className="crm-panel pipeline-snapshot">
          <div className="panel-title"><div><h3>Pipeline snapshot</h3><p>Value and conversion by stage</p></div><button type="button" onClick={() => onView("Pipeline")}>View pipeline <ArrowRight size={13} /></button></div>
          <div className="stage-summary">
            {stages.map((stage, index) => {
              const stageDeals = deals.filter((deal) => deal.stage === stage);
              const value = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
              return <div key={stage}><span><i className={`stage-color stage-${index}`} />{stage}</span><strong>{currency.format(value)}</strong><small>{stageDeals.length} deal{stageDeals.length === 1 ? "" : "s"}</small><div><b style={{ width: `${Math.min(100, 28 + value / 2200)}%` }} /></div></div>;
            })}
          </div>
        </article>
        <article className="crm-panel activity-panel">
          <div className="panel-title"><div><h3>Live activity</h3><p>Across your workspace</p></div><button type="button" className="icon-button"><Ellipsis size={16} /></button></div>
          <div className="activity-list">{activities.map((item) => <div key={item.title}><Avatar initials={item.initials} /><div><strong>{item.title}</strong><p>{item.detail}</p><small>{item.time}</small></div></div>)}</div>
        </article>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, change, context, positive }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string; change: string; context: string; positive?: boolean }) {
  return <article><div className="metric-top"><span><Icon size={16} /></span><button type="button"><Ellipsis size={15} /></button></div><p>{label}</p><strong>{value}</strong><div className={`metric-change ${positive ? "positive" : "negative"}`}>{positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}<b>{change}</b><span>{context}</span></div></article>;
}

function ContactsView({ rows, onOpen }: { rows: typeof contacts; onOpen: (contact: (typeof contacts)[number]) => void }) {
  return (
    <section className="crm-panel contacts-panel">
      <div className="table-toolbar"><div className="view-switch"><button className="active" type="button">All contacts <b>{rows.length}</b></button><button type="button">My contacts</button><button type="button">Recently active</button></div><div><button type="button"><Filter size={14} /> Filter</button><button type="button"><RefreshCw size={14} /></button></div></div>
      <div className="contact-table">
        <div className="contact-table-head"><span>Contact</span><span>Company</span><span>Status</span><span>Open value</span><span>Last activity</span><span>Owner</span><span /></div>
        {rows.map((contact) => (
          <button className="contact-row" type="button" key={contact.email} onClick={() => onOpen(contact)}>
            <span><Avatar initials={contact.initials} /><div><strong>{contact.name}</strong><small>{contact.email}</small></div></span>
            <span><strong>{contact.company}</strong><small>{contact.role}</small></span>
            <span><i className={`contact-status status-${contact.status.toLowerCase()}`} />{contact.status}</span>
            <span>{contact.value}</span><span>{contact.last}</span><span><Avatar initials={contact.owner} size="small" /></span><span><Ellipsis size={15} /></span>
          </button>
        ))}
      </div>
      <div className="table-footer"><span>Showing {rows.length} of 2,184 contacts</span><div><button type="button" disabled><ChevronLeft size={14} /></button><b>1</b><button type="button"><ChevronRight size={14} /></button></div></div>
    </section>
  );
}

function Pipeline({ deals, onOpen, onDrag, onDrop }: { deals: Deal[]; onOpen: (deal: Deal) => void; onDrag: (id: string) => void; onDrop: (stage: Stage) => void }) {
  return (
    <div className="pipeline-view">
      <div className="pipeline-toolbar"><div><button className="active" type="button">Board</button><button type="button">List</button><button type="button">Forecast</button></div><div><button type="button"><Filter size={14} /> Filter</button><button type="button">All owners <ChevronDown size={13} /></button></div></div>
      <div className="pipeline-board">
        {stages.map((stage, stageIndex) => {
          const stageDeals = deals.filter((deal) => deal.stage === stage);
          const total = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
          return (
            <section className="pipeline-column" key={stage} onDragOver={(event) => event.preventDefault()} onDrop={() => onDrop(stage)}>
              <div className="pipeline-column-head"><i className={`stage-color stage-${stageIndex}`} /><strong>{stage}</strong><b>{stageDeals.length}</b><button type="button"><Plus size={14} /></button></div>
              <p className="column-total">{currency.format(total)}<span>{stage === "Won" ? "100%" : `${20 + stageIndex * 18}%`} weighted</span></p>
              <div className="deal-card-list">
                {stageDeals.map((deal) => (
                  <button className="deal-card" draggable type="button" key={deal.id} onDragStart={() => onDrag(deal.id)} onClick={() => onOpen(deal)}>
                    <div className="deal-card-company"><span className="company-avatar">{deal.initials}</span><div><strong>{deal.company}</strong><small>{deal.id}</small></div><Ellipsis size={15} /></div>
                    <h3>{deal.name}</h3><strong className="deal-value">{currency.format(deal.value)}</strong>
                    <div className="deal-card-meta"><span><CalendarDays size={12} /> {deal.closeDate}</span><span className={`health health-${deal.health.toLowerCase().replace(" ", "-")}`}><i />{deal.health}</span></div>
                    <div className="deal-card-bottom"><Avatar initials={deal.owner} size="small" /><span>{deal.nextStep}</span></div>
                  </button>
                ))}
                <button className="inline-add-deal" type="button"><Plus size={14} /> Add opportunity</button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function EmailView({ onWrite, notify }: { onWrite: () => void; notify: (message: string) => void }) {
  const emails = [
    { sender: "Nina Jones", company: "BrightPay", subject: "Re: Next steps and commercial proposal", preview: "Thanks, this is helpful. I’ve shared it with our CFO and…", time: "12:42 PM", state: "replied", opens: "3 opens", initials: "NJ" },
    { sender: "Amara Okafor", company: "Kora Labs", subject: "Security review follow-up", preview: "We’re still aligning internally on the data residency piece…", time: "Yesterday", state: "opened", opens: "1 open", initials: "AO" },
    { sender: "Tobi Salami", company: "Atlas Works", subject: "Atlas × Dynamis — discovery recap", preview: "The timeline works on our side. Could you include the analytics…", time: "Jul 26", state: "replied", opens: "5 opens", initials: "TS" },
    { sender: "David Mensah", company: "Fieldwork", subject: "Introduction from Amina", preview: "Great to meet you. We’re currently reviewing our customer data…", time: "Jul 25", state: "opened", opens: "2 opens", initials: "DM" },
  ];
  const [selected, setSelected] = useState(emails[0]);
  return (
    <section className="email-layout crm-panel">
      <aside className="mailboxes">
        <button className="compose-button" type="button" onClick={onWrite}><PenLine size={15} /> Compose</button>
        <nav><button className="active" type="button"><Inbox size={15} /> Inbox <b>3</b></button><button type="button"><Send size={15} /> Sent</button><button type="button"><Clock3 size={15} /> Scheduled</button><button type="button"><MailCheck size={15} /> Tracked</button></nav>
        <div className="email-health"><span><Zap size={14} /> Email health</span><strong>98.7%</strong><p>Excellent sender reputation</p></div>
      </aside>
      <div className="email-list">
        <div className="email-list-head"><strong>Inbox</strong><button type="button"><Filter size={14} /></button></div>
        {emails.map((email) => (
          <button type="button" key={email.subject} className={selected.subject === email.subject ? "active" : ""} onClick={() => setSelected(email)}>
            <Avatar initials={email.initials} /><div><span><strong>{email.sender}</strong><small>{email.time}</small></span><b>{email.subject}</b><p>{email.preview}</p><footer><em className={`email-state ${email.state}`}>{email.state === "replied" ? <MessageSquareText size={10} /> : <MailCheck size={10} />}{email.state}</em><small>{email.opens}</small></footer></div>
          </button>
        ))}
      </div>
      <article className="email-reader">
        <div className="email-reader-head"><div><span className="email-state replied"><MessageSquareText size={11} /> Replied</span><span>Tracked · 3 opens</span></div><div><button type="button"><ArrowRight size={15} /></button><button type="button"><Ellipsis size={15} /></button></div></div>
        <h2>{selected.subject}</h2>
        <div className="email-sender"><Avatar initials={selected.initials} /><div><strong>{selected.sender}</strong><span>{selected.company} · to me</span></div><small>{selected.time}</small></div>
        <div className="email-body"><p>Hi Emmanuel,</p><p>{selected.preview} the broader leadership group this morning.</p><p>The approach looks solid. Before we move forward, could you send over a clearer breakdown of the implementation timeline and the support available during migration?</p><p>Best,<br />{selected.sender.split(" ")[0]}</p></div>
        <div className="email-context-card"><Sparkles size={15} /><div><strong>Signal context</strong><p>This reply shows strong buying intent. Address migration support and propose a 20-minute implementation call.</p></div></div>
        <div className="reply-actions"><button type="button" className="crm-button primary" onClick={onWrite}><Sparkles size={14} /> Draft reply with AI</button><button type="button" className="crm-button secondary" onClick={() => notify("Reply composer opened")}><ArrowRight size={14} /> Reply</button></div>
      </article>
    </section>
  );
}

function MeetingsView({ onSummary }: { onSummary: () => void }) {
  return (
    <div className="meetings-layout">
      <section className="crm-panel meetings-list">
        <div className="panel-title"><div><h3>Recent and upcoming</h3><p>Connected customer conversations</p></div><button type="button">Connect calendar</button></div>
        {meetings.map((meeting) => (
          <button type="button" key={meeting.title} onClick={meeting.status === "Summarised" ? onSummary : undefined}>
            <span className="company-avatar large">{meeting.initials}</span>
            <div><strong>{meeting.title}</strong><p>{meeting.company}</p><span><CalendarDays size={12} /> {meeting.date}<i />{meeting.duration}<i />{meeting.attendees}</span></div>
            <b className={`meeting-status ${meeting.status.toLowerCase()}`}>{meeting.status === "Summarised" && <Sparkles size={11} />}{meeting.status}</b><ChevronRight size={15} />
          </button>
        ))}
      </section>
      <aside className="meeting-upcoming crm-panel">
        <span className="next-label">UP NEXT · IN 42 MINUTES</span><Avatar initials="BP" size="large" /><h3>BrightPay solution review</h3><p>Nina Jones + 3 others</p>
        <div><span><Clock3 size={14} /> 2:00 – 2:45 PM</span><span><Globe2 size={14} /> Google Meet</span></div>
        <button type="button" className="crm-button primary"><ExternalLink size={14} /> Join meeting</button>
        <button type="button" className="crm-button secondary">View account brief</button>
        <div className="prep-card"><Sparkles size={14} /><div><strong>Signal prepared a brief</strong><p>3 talking points, 2 open questions, and latest account activity.</p><button type="button">Open meeting brief</button></div></div>
      </aside>
    </div>
  );
}

function ReportsView() {
  const ownerData = [["Emmanuel", 14, "$286k", "36%"], ["Maya", 11, "$214k", "32%"], ["Amara", 9, "$173k", "27%"]];
  return (
    <div className="reports-view">
      <section className="report-highlights">
        <article><span>Revenue closed</span><strong>$418,200</strong><p><ArrowUpRight size={13} /> 18.6% vs prior period</p></article>
        <article><span>Average deal size</span><strong>$46,470</strong><p><ArrowUpRight size={13} /> 6.2% vs prior period</p></article>
        <article><span>Sales cycle</span><strong>42 days</strong><p><ArrowDownRight size={13} /> 5 days faster</p></article>
      </section>
      <section className="reports-grid">
        <article className="crm-panel conversion-panel">
          <div className="panel-title"><div><h3>Funnel conversion</h3><p>Lead-to-win progression</p></div><button type="button">This quarter <ChevronDown size={13} /></button></div>
          <div className="funnel">
            {[["New leads", "184", "100%", 100], ["Qualified", "96", "52.2%", 76], ["Proposal", "58", "31.5%", 58], ["Negotiation", "34", "18.5%", 42], ["Won", "21", "11.4%", 28]].map(([label, count, percent, width], index) => (
              <div key={String(label)}><span>{label}</span><i style={{ width: `${width}%` }} className={`funnel-${index}`}><b>{count}</b></i><small>{percent}</small></div>
            ))}
          </div>
        </article>
        <article className="crm-panel source-panel">
          <div className="panel-title"><div><h3>Pipeline by source</h3><p>Where qualified value originates</p></div><button className="icon-button" type="button"><Ellipsis size={16} /></button></div>
          <div className="donut-wrap"><div className="donut"><span><strong>$842k</strong><small>Total</small></span></div><div className="source-legend">{[["Partner referral", "36%", "green"], ["Outbound", "28%", "purple"], ["Inbound", "22%", "blue"], ["Events", "14%", "orange"]].map(([label, percent, color]) => <div key={label}><span><i className={color} />{label}</span><strong>{percent}</strong></div>)}</div></div>
        </article>
      </section>
      <section className="crm-panel leaderboard">
        <div className="panel-title"><div><h3>Team performance</h3><p>Open pipeline and conversion by owner</p></div><button type="button">Export CSV <ArrowDownRight size={13} /></button></div>
        <div className="leader-head"><span>Owner</span><span>Open deals</span><span>Pipeline</span><span>Win rate</span><span>Attainment</span></div>
        {ownerData.map(([name, count, value, win], index) => <div className="leader-row" key={name}><span><Avatar initials={index === 0 ? "EE" : index === 1 ? "MK" : "AO"} /><strong>{name}</strong></span><span>{count}</span><span>{value}</span><span>{win}</span><span><i><b style={{ width: `${86 - index * 12}%` }} /></i>{86 - index * 12}%</span></div>)}
      </section>
    </div>
  );
}

function TeamView({ notify }: { notify: (message: string) => void }) {
  const members = [
    ["EE", "Emmanuel Emirex", "emmanuel@northstar.co", "Admin", "Active", "Just now"],
    ["MK", "Maya Khan", "maya@northstar.co", "Manager", "Active", "18 min ago"],
    ["AO", "Amara Okafor", "amara@northstar.co", "Member", "Active", "1 hr ago"],
    ["TS", "Tobi Salami", "tobi@northstar.co", "Member", "Invited", "—"],
  ];
  return <section className="crm-panel team-panel"><div className="panel-title"><div><h3>Workspace members</h3><p>4 seats used of 10</p></div><button type="button" className="crm-button primary" onClick={() => notify("Invitation sent")}><Plus size={14} /> Invite member</button></div><div className="team-head"><span>Member</span><span>Role</span><span>Status</span><span>Last active</span><span /></div>{members.map(([initials, name, email, role, status, last]) => <div className="team-row" key={email}><span><Avatar initials={initials} /><div><strong>{name}</strong><small>{email}</small></div></span><span><button type="button">{role} <ChevronDown size={12} /></button></span><span><i className={status === "Active" ? "active" : ""} />{status}</span><span>{last}</span><span><Ellipsis size={15} /></span></div>)}</section>;
}

function WebhooksView({ notify }: { notify: (message: string) => void }) {
  const [endpointEnabled, setEndpointEnabled] = useState(true);
  return (
    <div className="webhooks-view">
      <section className="webhook-intro crm-panel"><div className="webhook-icon"><Webhook size={23} /></div><div><h3>Webhook endpoints</h3><p>Send signed, real-time CRM events to your applications and automation tools.</p></div><button className="crm-button primary" type="button" onClick={() => notify("Endpoint creation opened")}><Plus size={14} /> Add endpoint</button></section>
      <section className="crm-panel endpoint-card">
        <div className="endpoint-top"><div><span className="endpoint-state"><i /> Production</span><h3>Revenue operations sync</h3><p>https://api.northstar.co/hooks/dynamis</p></div><button className={`toggle ${endpointEnabled ? "on" : ""}`} type="button" onClick={() => setEndpointEnabled((value) => !value)}><i /></button></div>
        <div className="endpoint-events"><span>EVENTS</span><div>{["contact.created", "deal.stage_changed", "email.opened", "meeting.summarised"].map((event) => <b key={event}>{event}</b>)}</div></div>
        <div className="endpoint-meta"><span>Signing secret <code>whsec_••••••••••e7a2</code><button type="button" onClick={() => notify("Secret copied")}><Copy size={12} /></button></span><span>Created Jul 18, 2026</span><button type="button"><Ellipsis size={15} /></button></div>
      </section>
      <section className="crm-panel deliveries">
        <div className="panel-title"><div><h3>Recent deliveries</h3><p>Latest attempts for this workspace</p></div><button type="button" onClick={() => notify("Test event delivered")}><Send size={13} /> Send test event</button></div>
        <div className="delivery-head"><span>Event</span><span>Endpoint</span><span>Status</span><span>Response time</span><span>Delivered</span></div>
        {[["deal.stage_changed", "Revenue operations sync", "200", "184 ms", "4 min ago"], ["email.opened", "Revenue operations sync", "200", "142 ms", "18 min ago"], ["meeting.summarised", "Revenue operations sync", "200", "221 ms", "1 hr ago"], ["contact.created", "Revenue operations sync", "200", "158 ms", "4 hrs ago"]].map((row) => <div className="delivery-row" key={`${row[0]}-${row[4]}`}><span><Zap size={13} />{row[0]}</span><span>{row[1]}</span><span><i />{row[2]}</span><span>{row[3]}</span><span>{row[4]}</span></div>)}
      </section>
    </div>
  );
}

function DealPanel({ deal, onClose, onWrite, onMove }: { deal: Deal; onClose: () => void; onWrite: () => void; onMove: (stage: Stage) => void }) {
  return (
    <div className="drawer-overlay" onMouseDown={onClose}>
      <aside className="crm-drawer deal-drawer" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-top"><span>{deal.id}</span><div><button type="button"><Ellipsis size={18} /></button><button type="button" onClick={onClose}><X size={19} /></button></div></div>
        <div className="drawer-body">
          <div className="deal-drawer-title"><span className="company-avatar large">{deal.initials}</span><div><h2>{deal.name}</h2><p>{deal.company}</p></div></div>
          <div className="deal-headline"><div><span>DEAL VALUE</span><strong>{currency.format(deal.value)}</strong></div><div><span>PROBABILITY</span><strong>{deal.probability}%</strong></div><div><span>EXPECTED CLOSE</span><strong>{deal.closeDate}</strong></div></div>
          <div className="drawer-actions"><button className="crm-button primary" type="button" onClick={onWrite}><Mail size={14} /> Email contact</button><button className="crm-button secondary" type="button"><Phone size={14} /> Log call</button><button className="crm-button secondary" type="button"><CalendarDays size={14} /> Meet</button></div>
          <section className="deal-details"><h3>Deal details</h3><div><span>Stage</span><select value={deal.stage} onChange={(event) => onMove(event.target.value as Stage)}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select><span>Health</span><b className={`health health-${deal.health.toLowerCase().replace(" ", "-")}`}><i />{deal.health}</b><span>Owner</span><b><Avatar initials={deal.owner} size="small" /> Emmanuel Emirex</b><span>Primary contact</span><b>{deal.contact}</b><span>Next step</span><b>{deal.nextStep}</b></div></section>
          <section className="deal-ai-brief"><div><Sparkles size={15} /><strong>Signal brief</strong></div><p>{deal.health === "At risk" ? "Engagement has dropped despite strong initial interest. Re-anchor on the business case and make the next step easy to accept." : "Momentum is healthy. Keep the decision process moving and confirm ownership of the next milestone."}</p><button type="button" onClick={onWrite}>Draft recommended follow-up <ArrowRight size={12} /></button></section>
          <section className="drawer-timeline"><h3>Activity</h3>{activities.slice(0, 3).map((item) => <div key={item.title}><i /><div><strong>{item.title}</strong><p>{item.detail}</p><small>{item.time}</small></div></div>)}</section>
        </div>
      </aside>
    </div>
  );
}

function ContactPanel({ contact, onClose, onWrite }: { contact: (typeof contacts)[number]; onClose: () => void; onWrite: () => void }) {
  return (
    <div className="drawer-overlay" onMouseDown={onClose}>
      <aside className="crm-drawer contact-drawer" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-top"><span>CONTACT</span><button type="button" onClick={onClose}><X size={19} /></button></div>
        <div className="contact-hero"><Avatar initials={contact.initials} size="large" /><h2>{contact.name}</h2><p>{contact.role} at <strong>{contact.company}</strong></p><span className={`contact-status status-${contact.status.toLowerCase()}`}><i />{contact.status}</span></div>
        <div className="contact-quick"><button type="button" onClick={onWrite}><Mail size={15} /> Email</button><button type="button"><Phone size={15} /> Call</button><button type="button"><CalendarDays size={15} /> Meet</button><button type="button"><Ellipsis size={15} /> More</button></div>
        <div className="drawer-body contact-body">
          <section><h3>Contact details</h3><div className="contact-detail"><span><Mail size={14} /> Email</span><strong>{contact.email}</strong><span><Phone size={14} /> Phone</span><strong>{contact.phone}</strong><span><Building2 size={14} /> Company</span><strong>{contact.company}</strong><span><UserRound size={14} /> Owner</span><strong><Avatar initials={contact.owner} size="small" /> Emmanuel Emirex</strong></div></section>
          <section className="relationship-summary"><div><Sparkles size={14} /><strong>Relationship summary</strong></div><p>{contact.name.split(" ")[0]} is a key evaluator with strong product engagement. They care most about implementation risk, adoption, and clear commercial outcomes.</p></section>
          <section className="drawer-timeline"><h3>Recent activity</h3>{activities.slice(0, 3).map((item) => <div key={item.title}><i /><div><strong>{item.title}</strong><p>{item.detail}</p><small>{item.time}</small></div></div>)}</section>
        </div>
      </aside>
    </div>
  );
}

function EmailWriter({ onClose, notify }: { onClose: () => void; notify: (message: string) => void }) {
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [tone, setTone] = useState("Warm and concise");
  function generate() {
    setGenerating(true);
    window.setTimeout(() => { setGenerated(true); setGenerating(false); }, 900);
  }
  return (
    <Modal title="Write with Signal" onClose={onClose} wide>
      <div className="ai-writer">
        <aside>
          <div className="ai-badge"><BrainCircuit size={16} /> AI email writer</div>
          <label>Recipient<select defaultValue="nina"><option value="nina">Nina Jones · BrightPay</option><option value="amara">Amara Okafor · Kora Labs</option></select></label>
          <label>What should this email achieve?<textarea defaultValue="Follow up after the solution review. Share the implementation timeline and propose a short call with our onboarding lead." /></label>
          <div className="form-pair"><label>Tone<select value={tone} onChange={(event) => setTone(event.target.value)}><option>Warm and concise</option><option>Direct</option><option>Consultative</option></select></label><label>Length<select defaultValue="short"><option value="short">Short</option><option value="medium">Medium</option></select></label></div>
          <div className="context-checks"><span>Use CRM context</span><label><input type="checkbox" defaultChecked /> Recent emails</label><label><input type="checkbox" defaultChecked /> Deal details</label><label><input type="checkbox" defaultChecked /> Meeting summary</label></div>
          <button className="crm-button ai-generate" type="button" onClick={generate} disabled={generating}><Sparkles size={15} />{generating ? "Writing…" : generated ? "Regenerate draft" : "Generate email"}</button>
        </aside>
        <article className="email-draft">
          {generated ? (
            <>
              <div className="draft-fields"><span>To <b>Nina Jones &lt;nina@brightpay.io&gt;</b></span><span>Subject <b>BrightPay implementation plan + next step</b></span></div>
              <div className="draft-copy"><p>Hi Nina,</p><p>Thanks again for the thoughtful conversation today. Based on the priorities you shared, I’ve outlined a focused six-week implementation plan that gives your team early value without overloading Finance during month-end.</p><p>I’d also like to introduce you to Amara, our onboarding lead, for a short working session. She can walk through migration support and answer the capacity questions your CFO raised.</p><p>Would Tuesday at 11:00 AM work for a 20-minute call?</p><p>Best,<br />Emmanuel</p></div>
              <div className="draft-footer"><span><Sparkles size={12} /> Grounded in 3 CRM sources · {tone}</span><div><button type="button"><Copy size={13} /></button><button className="crm-button primary" type="button" onClick={() => { notify("Email scheduled for 9:00 AM"); onClose(); }}><Send size={13} /> Send email</button></div></div>
            </>
          ) : (
            <div className="draft-empty"><span><Sparkles size={24} /></span><h3>Your draft will appear here</h3><p>Signal will use the selected relationship context to create a relevant, human-sounding email.</p></div>
          )}
        </article>
      </div>
    </Modal>
  );
}

function MeetingSummary({ onClose, notify }: { onClose: () => void; notify: (message: string) => void }) {
  return (
    <div className="drawer-overlay" onMouseDown={onClose}>
      <aside className="crm-drawer summary-drawer" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-top"><span><Sparkles size={13} /> AI MEETING SUMMARY</span><button type="button" onClick={onClose}><X size={19} /></button></div>
        <div className="drawer-body">
          <div className="summary-title"><span className="company-avatar large">KL</span><div><h2>Kora security deep dive</h2><p>Yesterday · 52 min · 6 attendees</p></div></div>
          <div className="summary-tabs"><button className="active" type="button">Summary</button><button type="button">Transcript</button><button type="button">Analytics</button></div>
          <section className="executive-summary"><span>EXECUTIVE SUMMARY</span><p>Kora’s security and infrastructure teams are aligned on the technical approach. The remaining concern is data residency for their EU expansion. A phased rollout is preferred, beginning with the Nigerian operations team.</p></section>
          <section className="summary-section"><h3><CheckCircle2 size={15} /> Decisions</h3><ul><li>Proceed with a phased rollout beginning in Nigeria</li><li>Use SSO and SCIM from the first implementation phase</li><li>Run the EU data residency review in parallel</li></ul></section>
          <section className="summary-section"><h3><Target size={15} /> Action items</h3><div className="action-item"><input type="checkbox" /><span><strong>Send updated security architecture</strong><small>Emmanuel · Due Jul 29</small></span></div><div className="action-item"><input type="checkbox" /><span><strong>Confirm EU hosting roadmap</strong><small>Product team · Due Aug 1</small></span></div><div className="action-item"><input type="checkbox" /><span><strong>Schedule procurement review</strong><small>Amara · Due Aug 2</small></span></div></section>
          <section className="summary-section sentiment"><h3><Activity size={15} /> Conversation signals</h3><div><span>Sentiment <b>Positive</b></span><i><b style={{ width: "82%" }} /></i></div><div><span>Buying intent <b>High</b></span><i><b style={{ width: "88%" }} /></i></div><div><span>Risk <b>Medium</b></span><i><b className="risk-bar" style={{ width: "43%" }} /></i></div></section>
          <div className="summary-actions"><button className="crm-button secondary" type="button"><Copy size={13} /> Copy summary</button><button className="crm-button primary" type="button" onClick={() => { notify("Follow-up task created"); onClose(); }}><Plus size={13} /> Create follow-up</button></div>
        </div>
      </aside>
    </div>
  );
}

function InsightsPanel({ onClose, onWrite }: { onClose: () => void; onWrite: () => void }) {
  return (
    <div className="drawer-overlay" onMouseDown={onClose}>
      <aside className="crm-drawer insight-drawer" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-top"><span><Sparkles size={13} /> SIGNAL INTELLIGENCE</span><button type="button" onClick={onClose}><X size={19} /></button></div>
        <div className="insight-hero"><span><BrainCircuit size={24} /></span><h2>Good morning, Emmanuel.</h2><p>Here are the signals most likely to affect revenue today.</p></div>
        <div className="insight-list">
          <article className="critical"><span><Mail size={15} /></span><div><small>DEAL RISK</small><h3>Kora Labs needs a re-engagement</h3><p>No response in 8 days, but the security brief was viewed twice yesterday. A concise follow-up can use that signal.</p><button type="button" onClick={onWrite}>Draft follow-up <ArrowRight size={12} /></button></div></article>
          <article><span><TrendingUp size={15} /></span><div><small>BUYING SIGNAL</small><h3>BrightPay engagement is rising</h3><p>Nina and two new stakeholders opened the proposal. Consider bringing an implementation lead into the next call.</p><button type="button">Open opportunity <ArrowRight size={12} /></button></div></article>
          <article><span><Target size={15} /></span><div><small>FORECAST</small><h3>July forecast confidence improved</h3><p>Recent meeting and email activity increased weighted coverage from 69% to 74%.</p><button type="button">View forecast <ArrowRight size={12} /></button></div></article>
        </div>
        <div className="ask-box"><input placeholder="Ask about your pipeline…" /><button type="button"><ArrowRight size={15} /></button></div>
      </aside>
    </div>
  );
}

function Modal({ title, onClose, children, compact, wide }: { title: string; onClose: () => void; children: React.ReactNode; compact?: boolean; wide?: boolean }) {
  return <div className="modal-overlay" onMouseDown={onClose}><div className={`crm-modal ${compact ? "compact" : ""} ${wide ? "wide" : ""}`} onMouseDown={(event) => event.stopPropagation()}><div className="crm-modal-head"><h2>{title}</h2><button type="button" onClick={onClose}><X size={19} /></button></div>{children}</div></div>;
}
