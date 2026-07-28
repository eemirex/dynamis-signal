import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  MailCheck,
  Radio,
  Sparkles,
  TrendingUp,
  UsersRound,
  Webhook,
} from "lucide-react";

const proof = [
  { value: "42%", label: "less admin work" },
  { value: "2.4×", label: "faster follow-up" },
  { value: "18%", label: "higher win rate" },
];

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="site-nav">
        <Link href="/" className="signal-brand" aria-label="Dynamis Signal home">
          <span className="signal-mark"><Radio size={16} /></span>
          <strong>Dynamis</strong><span>Signal</span>
        </Link>
        <div className="site-links">
          <a href="#product">Product</a>
          <a href="#intelligence">Intelligence</a>
          <a href="#security">Security</a>
        </div>
        <Link href="/workspace" className="site-nav-cta">
          Explore the CRM <ArrowRight size={15} />
        </Link>
      </nav>

      <section className="signal-hero">
        <div className="hero-grid" />
        <div className="signal-hero-copy">
          <div className="signal-eyebrow"><Sparkles size={14} /> AI CRM for modern revenue teams</div>
          <h1>
            Know who matters.
            <span> Know what to do next.</span>
          </h1>
          <p>
            Dynamis Signal turns every customer, email, meeting, and deal into
            one clear revenue picture—then helps your team act on it.
          </p>
          <div className="signal-hero-actions">
            <Link href="/workspace" className="signal-primary">
              Open interactive demo <ArrowRight size={16} />
            </Link>
            <a href="#product" className="signal-secondary">See the product</a>
          </div>
          <div className="hero-note"><span><Check size={12} /></span>No account or setup required</div>
        </div>

        <div className="signal-product-shot" aria-label="Dynamis Signal product preview">
          <div className="shot-topbar">
            <span className="shot-mark"><Radio size={11} /></span>
            <div className="shot-search">Search customers, deals, activity…</div>
            <span className="shot-ai"><Sparkles size={8} /> Ask Signal</span>
            <span className="shot-avatar">EE</span>
          </div>
          <div className="shot-body">
            <aside className="shot-sidebar">
              <strong>Northstar</strong>
              {["Home", "Contacts", "Pipeline", "Conversations", "Meetings"].map((item, i) => (
                <span className={i === 0 ? "active" : ""} key={item}><i />{item}</span>
              ))}
            </aside>
            <div className="shot-content">
              <div className="shot-heading"><div><small>GOOD MORNING, EMMANUEL</small><h3>Revenue command center</h3></div><button>+ Add lead</button></div>
              <div className="shot-metrics">
                <div><span>Pipeline value</span><strong>$842k</strong><small>↗ 12.8%</small></div>
                <div><span>Weighted forecast</span><strong>$356k</strong><small>74% coverage</small></div>
                <div><span>Win rate</span><strong>31.4%</strong><small>↗ 3.2%</small></div>
              </div>
              <div className="shot-panels">
                <div className="shot-chart">
                  <span>PIPELINE MOMENTUM</span>
                  <svg viewBox="0 0 320 115" aria-hidden="true">
                    <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b6f36b" stopOpacity=".35" /><stop offset="100%" stopColor="#b6f36b" stopOpacity="0" /></linearGradient></defs>
                    <path className="area" d="M0 105 C35 89 48 94 72 76 S116 86 145 56 S190 63 218 34 S262 48 320 10 L320 115 L0 115Z" />
                    <path className="line" d="M0 105 C35 89 48 94 72 76 S116 86 145 56 S190 63 218 34 S262 48 320 10" />
                  </svg>
                </div>
                <div className="shot-focus">
                  <span>TODAY&apos;S FOCUS</span>
                  {[
                    ["KL", "Reply to Kora Labs", "Deal at risk"],
                    ["BP", "Prep for BrightPay", "Meeting in 42m"],
                    ["AS", "Follow up with Atlas", "Email opened 3×"],
                  ].map(([initials, title, meta]) => (
                    <div key={title}><i>{initials}</i><p><strong>{title}</strong><small>{meta}</small></p></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="ai-float">
            <span><BrainCircuit size={16} /></span>
            <div><strong>Signal insight</strong><p>Kora Labs has gone quiet for 8 days. Draft a follow-up?</p></div>
            <b>Draft</b>
          </div>
        </div>
      </section>

      <section className="logo-strip">
        <span>BUILT FOR REVENUE TEAMS AT</span>
        <div><b>aperture</b><b>northstar</b><b>fieldwork</b><b>atlas</b><b>brightpay</b></div>
      </section>

      <section className="signal-features" id="product">
        <div className="section-intro">
          <span className="signal-eyebrow">ONE REVENUE MEMORY</span>
          <h2>Every relationship, finally in focus.</h2>
          <p>Signal gathers the details your team usually loses and turns them into momentum.</p>
        </div>
        <div className="feature-bento">
          <article className="feature-wide">
            <div className="feature-icon"><TrendingUp size={20} /></div>
            <h3>A pipeline you can trust</h3>
            <p>See deal health, forecast confidence, next steps, and stalled opportunities without chasing updates.</p>
            <div className="pipeline-mini">
              {["New lead", "Qualified", "Proposal", "Negotiation"].map((stage, index) => (
                <div key={stage}><span>{stage}<b>{4 - index}</b></span><i style={{ height: `${38 + index * 17}px` }} /></div>
              ))}
            </div>
          </article>
          <article>
            <div className="feature-icon warm"><MailCheck size={20} /></div>
            <h3>Email that moves deals</h3>
            <p>Write thoughtful follow-ups in your voice and know when a prospect engages.</p>
            <div className="email-mini"><span>Re: Northstar rollout</span><p>Hi Amara — based on our conversation, I&apos;ve outlined the fastest path to…</p><b><Sparkles size={11} /> Personalised by Signal</b></div>
          </article>
          <article>
            <div className="feature-icon blue"><UsersRound size={20} /></div>
            <h3>Meetings that remember</h3>
            <p>Turn transcripts into decisions, objections, commitments, and owned next steps.</p>
            <ul className="summary-mini"><li><Check size={11} /> Decision: phased rollout</li><li><Check size={11} /> Concern: migration capacity</li><li><Check size={11} /> Next: security review Friday</li></ul>
          </article>
          <article className="feature-wide webhook-card">
            <div><div className="feature-icon dark"><Webhook size={20} /></div><h3>Open where it matters</h3><p>Signed webhooks and a clean API connect Signal to the rest of your operating stack.</p></div>
            <pre><code>{`{
  "event": "deal.stage_changed",
  "data": {
    "deal": "Kora expansion",
    "stage": "negotiation"
  }
}`}</code></pre>
          </article>
        </div>
      </section>

      <section className="intelligence-section" id="intelligence">
        <div>
          <span className="signal-eyebrow light">SIGNAL INTELLIGENCE</span>
          <h2>AI that works from context, not guesswork.</h2>
          <p>Every suggestion is grounded in the relationship history your team already owns.</p>
        </div>
        <div className="intelligence-list">
          {[
            ["01", "Draft the right message", "Create emails from deal context, last interaction, objections, and your desired outcome."],
            ["02", "Capture what was decided", "Summarize meetings into a reusable record with risks, actions, and next steps."],
            ["03", "Surface the next best action", "Find stalled deals, buying signals, missing stakeholders, and overdue commitments."],
          ].map(([number, title, copy]) => (
            <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>
          ))}
        </div>
      </section>

      <section className="proof-section" id="security">
        <div><span className="signal-eyebrow">DESIGNED FOR ACCOUNTABILITY</span><h2>Less CRM maintenance.<br />More customer momentum.</h2></div>
        <div className="proof-grid">{proof.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
      </section>

      <footer className="signal-footer">
        <div className="signal-brand"><span className="signal-mark"><Radio size={16} /></span><strong>Dynamis</strong><span>Signal</span></div>
        <p>Revenue intelligence, without the theatre.</p>
        <span>© {new Date().getFullYear()} Dynamis</span>
      </footer>
    </main>
  );
}
