export type Stage = "New lead" | "Qualified" | "Proposal" | "Negotiation" | "Won";
export type Deal = {
  id: string;
  name: string;
  company: string;
  contact: string;
  initials: string;
  value: number;
  stage: Stage;
  probability: number;
  owner: string;
  closeDate: string;
  health: "Strong" | "Good" | "At risk";
  lastActivity: string;
  nextStep: string;
};

export const stages: Stage[] = ["New lead", "Qualified", "Proposal", "Negotiation", "Won"];

export const initialDeals: Deal[] = [
  { id: "DEAL-184", name: "Enterprise rollout", company: "Kora Labs", contact: "Amara Okafor", initials: "KL", value: 120000, stage: "Negotiation", probability: 72, owner: "EE", closeDate: "Aug 12", health: "At risk", lastActivity: "8 days ago", nextStep: "Re-engage security sponsor" },
  { id: "DEAL-191", name: "Finance automation", company: "BrightPay", contact: "Nina Jones", initials: "BP", value: 84000, stage: "Proposal", probability: 64, owner: "MK", closeDate: "Aug 20", health: "Strong", lastActivity: "Today", nextStep: "Solution review at 2:00 PM" },
  { id: "DEAL-176", name: "Regional expansion", company: "Atlas Works", contact: "Tobi Salami", initials: "AW", value: 68000, stage: "Qualified", probability: 48, owner: "AO", closeDate: "Sep 04", health: "Good", lastActivity: "Yesterday", nextStep: "Confirm technical evaluator" },
  { id: "DEAL-198", name: "Customer data hub", company: "Fieldwork", contact: "David Mensah", initials: "FW", value: 156000, stage: "New lead", probability: 24, owner: "EE", closeDate: "Sep 18", health: "Good", lastActivity: "2 days ago", nextStep: "Book discovery call" },
  { id: "DEAL-169", name: "Growth analytics", company: "Aperture", contact: "Maya Khan", initials: "AP", value: 92000, stage: "Won", probability: 100, owner: "MK", closeDate: "Jul 22", health: "Strong", lastActivity: "Today", nextStep: "Introduce onboarding lead" },
  { id: "DEAL-202", name: "Support transformation", company: "Tern Systems", contact: "Sam Adeyemi", initials: "TS", value: 45000, stage: "New lead", probability: 20, owner: "AO", closeDate: "Sep 26", health: "Good", lastActivity: "Today", nextStep: "Qualify current workflow" },
  { id: "DEAL-188", name: "Operations workspace", company: "Meridian", contact: "Zara Bello", initials: "ME", value: 77000, stage: "Proposal", probability: 58, owner: "EE", closeDate: "Aug 28", health: "Good", lastActivity: "3 days ago", nextStep: "Send commercial proposal" },
  { id: "DEAL-181", name: "Executive reporting", company: "Nexus Group", contact: "Kemi Cole", initials: "NG", value: 54000, stage: "Qualified", probability: 42, owner: "MK", closeDate: "Sep 09", health: "At risk", lastActivity: "6 days ago", nextStep: "Identify economic buyer" }
];

export const contacts = [
  { name: "Amara Okafor", role: "VP Operations", company: "Kora Labs", email: "amara@koralabs.co", phone: "+234 803 241 9082", initials: "AO", status: "Customer", value: "$120,000", last: "8 days ago", owner: "EE" },
  { name: "Nina Jones", role: "Finance Director", company: "BrightPay", email: "nina@brightpay.io", phone: "+44 20 7946 0138", initials: "NJ", status: "Opportunity", value: "$84,000", last: "Today", owner: "MK" },
  { name: "Tobi Salami", role: "Head of Growth", company: "Atlas Works", email: "tobi@atlasworks.com", phone: "+234 706 194 2210", initials: "TS", status: "Opportunity", value: "$68,000", last: "Yesterday", owner: "AO" },
  { name: "David Mensah", role: "Chief Data Officer", company: "Fieldwork", email: "david@fieldwork.africa", phone: "+233 24 551 8402", initials: "DM", status: "Lead", value: "$156,000", last: "2 days ago", owner: "EE" },
  { name: "Maya Khan", role: "Revenue Operations", company: "Aperture", email: "maya@aperture.dev", phone: "+1 415 555 0184", initials: "MK", status: "Customer", value: "$92,000", last: "Today", owner: "MK" },
  { name: "Sam Adeyemi", role: "Customer Success Lead", company: "Tern Systems", email: "sam@ternsystems.io", phone: "+234 812 443 1160", initials: "SA", status: "Lead", value: "$45,000", last: "Today", owner: "AO" },
];

export const activities = [
  { type: "email", title: "Nina opened “Next steps for BrightPay”", detail: "Opened 3 times · Latest from London", time: "12 min ago", initials: "NJ" },
  { type: "meeting", title: "Solution review completed", detail: "Kora Labs · 4 decisions · 3 action items", time: "48 min ago", initials: "KL" },
  { type: "deal", title: "Aperture moved to Won", detail: "$92,000 · Growth analytics", time: "2 hrs ago", initials: "AP" },
  { type: "contact", title: "David Mensah added as a lead", detail: "Fieldwork · Source: Partner referral", time: "4 hrs ago", initials: "DM" },
];

export const meetings = [
  { title: "BrightPay solution review", company: "BrightPay", date: "Today, 2:00 PM", duration: "45 min", attendees: "4 attendees", status: "Upcoming", initials: "BP" },
  { title: "Kora security deep dive", company: "Kora Labs", date: "Yesterday, 11:30 AM", duration: "52 min", attendees: "6 attendees", status: "Summarised", initials: "KL" },
  { title: "Atlas discovery", company: "Atlas Works", date: "Jul 25, 10:00 AM", duration: "38 min", attendees: "3 attendees", status: "Summarised", initials: "AW" },
  { title: "Aperture commercial close", company: "Aperture", date: "Jul 22, 4:30 PM", duration: "29 min", attendees: "5 attendees", status: "Summarised", initials: "AP" },
];
