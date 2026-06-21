import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LayoutDashboard, ListChecks, GitBranch, Users, CalendarDays, NotebookPen,
  AlertTriangle, Clock, CheckCircle2, Circle, Flag, ChevronRight, X, Plus,
  Pencil, Trash2, Check, CalendarPlus, RotateCcw, Bell, Wallet, FileText,
  Mail, Globe, Target, Sun, Moon
} from "lucide-react";

// ---------- Team (key 'baboloki' is internal — display name is Chipo) ----------
const TEAM = {
  shain:    { name: "Shain",    short: "SM",  role: "Project & Technical Lead — LMS, systems, coordination", color: "#6366f1" },
  tumisang: { name: "Tumisang", short: "TK",  role: "Head of Academics — curriculum & lessons",             color: "#10b981" },
  baboloki: { name: "Chipo",    short: "CM",  role: "Data, Operations, Logistics & Finance",                 color: "#0ea5e9" },
  calvin:   { name: "Calvin",   short: "CD",  role: "Marketing, Branding & Design",                           color: "#a855f7" },
  all:      { name: "Whole team", short: "ALL", role: "Everyone",                                             color: "#64748b" },
};
const TEAM_IDS = ["shain", "tumisang", "baboloki", "calvin"];
const COLORS = ["#6366f1", "#10b981", "#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", "#14b8a6", "#ef4444", "#f97316", "#64748b"];
const STORAGE_KEY = "abiznet_board_v2";
const PROJECT_END = "2026-12-31";

// ---------- Seed data ----------
const SEED_PHASES = [
  { id: "p1", label: "Planning & setup", month: "June", accent: "#6366f1", tasks: [
    { id: "p1-10", title: "Schedule & hold first internal team planning meeting", owner: ["shain"], due: "2026-06-18", done: true },
    { id: "p1-2",  title: "Set up team comms + shared Google Drive workspace", owner: ["baboloki"], due: "2026-06-19", done: true, note: "Shared Drive: https://drive.google.com/drive/folders/1DETnqZvMxUOXponQgxrKyjOp_Hns-4ht" },
    { id: "p1-1",  title: "Decide & register the domain (pick ONE)", owner: ["shain"], due: "2026-06-20" },
    { id: "p1-11", title: "Create the standard lesson-plan template + share Drive with team", owner: ["shain"], due: "2026-06-23", note: "Template captures, per lesson: what it covers · learning objectives & outcomes · key topics/concepts · activities & quiz questions. Plans (outlines), not full lessons yet." },
    { id: "p1-3",  title: "Confirm grant received; open financial tracking sheet", owner: ["baboloki"], due: "2026-06-25" },
    { id: "p1-12", title: "Draft the 8 BUSINESS lesson plans (outline · objectives · topics · quiz activities)", owner: ["baboloki"], due: "2026-06-26", note: "Lesson plans / course outlines only — not the full lessons yet. Share in the Drive." },
    { id: "p1-13", title: "Draft the 8 ACADEMIC lesson plans (outline · objectives · topics · quiz activities)", owner: ["tumisang"], due: "2026-06-26", note: "Lesson plans / course outlines only — not the full lessons yet. Share in the Drive." },
    { id: "p1-5",  title: "Branding: logo, colours & templates", owner: ["calvin"], due: "2026-06-26" },
    { id: "p1-7",  title: "Social media & recruitment strategy + content / posts plan", owner: ["calvin"], due: "2026-06-26", note: "How we attract participants to the cohort." },
    { id: "p1-6",  title: "Design LMS & competition site (plan to hand over to developers)", owner: ["shain"], due: "2026-06-26" },
    { id: "p1-9",  title: "Agree baseline evaluation timing with OAD; request survey", owner: ["shain","baboloki"], due: "2026-06-26" },
    { id: "p1-4",  title: "Weekend review: consolidate all 16 lesson plans into a unified curriculum", owner: ["all"], due: "2026-06-28", note: "Review submissions, align work, consolidate into one plan." },
    { id: "p1-8",  title: "Define weekly assessment & participant filtering plan", owner: ["tumisang","shain"], due: "2026-06-30" },
  ]},
  { id: "p2", label: "Build & recruit", month: "July", accent: "#0ea5e9", tasks: [
    { id: "p2-1", title: "Purchase hosting & deploy the LMS environment", owner: ["shain"], due: "2026-07-05" },
    { id: "p2-4", title: "Create Google Form registration + intake process", owner: ["baboloki"], due: "2026-07-08" },
    { id: "p2-5", title: "Produce recruitment creatives & campus posters", owner: ["calvin"], due: "2026-07-10" },
    { id: "p2-6", title: "Launch recruitment campaign (target 50 applicants)", owner: ["calvin","all"], due: "2026-07-15" },
    { id: "p2-7", title: "Secure university venue for final event (UNAM / BIUST)", owner: ["baboloki","shain"], due: "2026-07-20" },
    { id: "p2-2", title: "Build LMS features (quiz engine, scoring, filtering, progress)", owner: ["shain"], due: "2026-07-25" },
    { id: "p2-3", title: "Develop materials for all 16 lessons", owner: ["tumisang"], due: "2026-07-28" },
    { id: "p2-8", title: "Select & confirm the 50-participant cohort", owner: ["shain","tumisang"], due: "2026-07-31" },
  ]},
  { id: "p3", label: "Astronomy lessons (8)", month: "August", accent: "#8b5cf6", tasks: [
    { id: "p3-1", title: "Administer BASELINE evaluation (before any lessons)", owner: ["baboloki"], due: "2026-08-03", ext: true },
    { id: "p3-2", title: "Run participant onboarding & orientation", owner: ["shain","all"], due: "2026-08-05" },
    { id: "p3-3", title: "Set up cohort communication channels", owner: ["calvin","baboloki"], due: "2026-08-05" },
    { id: "p3-4", title: "Deliver 8 intro astronomy lessons", owner: ["tumisang"], due: "2026-08-28" },
    { id: "p3-5", title: "Run weekly quizzes & track engagement", owner: ["shain"], due: "2026-08-28" },
    { id: "p3-6", title: "Monitor attendance & completion weekly", owner: ["baboloki"], due: "2026-08-28" },
  ]},
  { id: "p4", label: "Skills & entrepreneurship (8)", month: "September", accent: "#ec4899", tasks: [
    { id: "p4-3", title: "Administer MIDLINE evaluation (OAD survey)", owner: ["baboloki"], due: "2026-09-15", ext: true },
    { id: "p4-1", title: "Deliver 8 skills & entrepreneurship lessons (Python, data, CV, pitching)", owner: ["tumisang"], due: "2026-09-25" },
    { id: "p4-2", title: "Continue weekly assessments & filtering rounds", owner: ["shain"], due: "2026-09-25" },
    { id: "p4-4", title: "Track quiz performance; identify front-runners", owner: ["shain"], due: "2026-09-25" },
  ]},
  { id: "p5", label: "Finals & pitch event", month: "October", accent: "#f59e0b", tasks: [
    { id: "p5-1", title: "Mentorship & participant project refinement", owner: ["all"], due: "2026-10-09" },
    { id: "p5-2", title: "Shortlist top 6 finalists / teams", owner: ["shain","tumisang"], due: "2026-10-09" },
    { id: "p5-3", title: "Lock final-event logistics (accommodation, catering, transport)", owner: ["baboloki"], due: "2026-10-10" },
    { id: "p5-4", title: "Confirm judges, mentors, stakeholders & invitations", owner: ["shain","calvin"], due: "2026-10-12" },
    { id: "p5-5", title: "Prepare name tags, event branding & materials", owner: ["calvin"], due: "2026-10-15" },
    { id: "p5-6", title: "Run the 3-day final pitch competition & networking event", owner: ["all"], due: "2026-10-20", ext: true },
    { id: "p5-7", title: "Award seed funding (£350/£250) + top quiz performer (£100)", owner: ["baboloki"], due: "2026-10-22" },
  ]},
  { id: "p6", label: "Evaluation & reporting", month: "November", accent: "#14b8a6", tasks: [
    { id: "p6-1", title: "Administer post-project / endline evaluation", owner: ["baboloki"], due: "2026-11-05", ext: true },
    { id: "p6-2", title: "Collect testimonials, case studies & participant feedback", owner: ["tumisang","baboloki"], due: "2026-11-10" },
    { id: "p6-4", title: "Compare baseline vs endline; assess outcomes achieved", owner: ["shain","baboloki"], due: "2026-11-18" },
    { id: "p6-3", title: "Compile financial report (breakdown + receipts/invoices)", owner: ["baboloki"], due: "2026-11-20", ext: true },
    { id: "p6-5", title: "Draft & submit the OAD Final Project Report", owner: ["shain"], due: "2026-11-28", ext: true },
    { id: "p6-6", title: "Plan future cohorts & collaborations", owner: ["all"], due: "2026-11-30" },
  ]},
];

const SEED_EVENTS = [
  { id: "ev-onboard",  label: "OAD virtual onboarding",         date: "2026-06-12", type: "meeting",   done: true },
  { id: "ev-meet1",    label: "First internal team meeting",    date: "2026-06-18", type: "meeting",   done: true },
  { id: "ev-review",   label: "Weekend review (lesson plans + alignment)", date: "2026-06-28", type: "meeting", tbd: true },
  { id: "ev-recruit",  label: "Recruitment launch",             date: "2026-07-15", type: "milestone" },
  { id: "ev-cohort",   label: "Cohort starts (baseline first)", date: "2026-08-03", type: "milestone" },
  { id: "ev-final",    label: "Final pitch competition",        date: "2026-10-20", endDate: "2026-10-22", type: "milestone" },
  { id: "ev-complete", label: "Project completion",             date: "2026-12-31", type: "milestone" },
];

const SEED_MILESTONES = [
  { id: "m1", title: "OAD virtual onboarding",            date: "2026-06-12", desc: "Completed", state: "done" },
  { id: "m2", title: "First internal team meeting",       date: "2026-06-18", desc: "Held — tasks delegated, deadline 26 June", state: "done" },
  { id: "m3", title: "Recruitment launch",                date: "2026-07-15", desc: "Target 50 applicants across Botswana & Namibia", state: "future" },
  { id: "m4", title: "Cohort starts + baseline evaluation", date: "2026-08-03", desc: "Baseline survey must run before the first lesson", state: "future" },
  { id: "m5", title: "Midline evaluation",                date: "2026-09-15", desc: "OAD survey administered during delivery", state: "future" },
  { id: "m6", title: "Final pitch competition",           date: "2026-10-20", desc: "3-day in-person event · 6 finalists · seed funding", state: "future" },
  { id: "m7", title: "Project completion + final report", date: "2026-12-31", desc: "All deliverables + OAD final report submitted", state: "future" },
];

// ---------- helpers ----------
const parseDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const fmt = (s) => parseDate(s).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const fmtLong = (s) => parseDate(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const toICSDate = (s) => s.replace(/-/g, "");
const addDay = (s) => { const d = parseDate(s); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const newId = () => "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const sortTasks = (a) => [...a].sort((x, y) => { if (!x.due) return 1; if (!y.due) return -1; return parseDate(x.due) - parseDate(y.due); });
const clone = (x) => JSON.parse(JSON.stringify(x));

// Bump SEED_REV whenever the seed gains NEW tasks/events you want pushed live.
// mergeSeed is ADDITIVE only: it adds any seed items missing from the live board
// (matched by id) and never edits or deletes what's already there, so nobody's
// tick-offs, edits or notes are lost. It runs once per rev, then records the rev.
const SEED_REV = 3;
const mergeSeed = (b) => {
  if (b && b.rev === SEED_REV) return b;
  const out = clone(b || {});
  out.phases = out.phases || [];
  out.events = out.events || [];
  out.milestones = out.milestones || [];
  out.notes = out.notes || {};
  const find = (arr, id) => arr.find((x) => x.id === id);
  SEED_PHASES.forEach((sp) => {
    const ph = find(out.phases, sp.id);
    if (!ph) { out.phases.push(clone(sp)); return; }
    sp.tasks.forEach((st) => { if (!find(ph.tasks, st.id)) ph.tasks.push(clone(st)); });
  });
  SEED_EVENTS.forEach((se) => { if (!find(out.events, se.id)) out.events.push(clone(se)); });
  SEED_MILESTONES.forEach((sm) => { if (!find(out.milestones, sm.id)) out.milestones.push(clone(sm)); });
  out.rev = SEED_REV;
  return out;
};

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tasks",    label: "Tasks",    icon: ListChecks },
  { id: "timeline", label: "Timeline", icon: GitBranch },
  { id: "team",     label: "Team",     icon: Users },
  { id: "meetings", label: "Meetings", icon: CalendarDays },
  { id: "notes",    label: "Notes",    icon: NotebookPen },
];

export default function Dashboard() {
  const [board, setBoard] = useState(null);
  const [tab, setTab] = useState("overview");
  const [synced, setSynced] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);
  const [openPhaseId, setOpenPhaseId] = useState(null);
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [showDone, setShowDone] = useState(true);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);
  const [dark, setDark] = useState(() => { try { return localStorage.getItem("abz_theme") === "dark"; } catch (e) { return false; } });
  const boardRef = useRef(board);
  boardRef.current = board;
  // ----- live-sync guards (fix for "dashboard reloads while I'm typing") -----
  const editingRef = useRef(false);   // true while the add/edit modal is open
  const typingRef = useRef(0);        // timestamp of the last note keystroke
  const pendingRef = useRef(null);    // a remote update parked until you stop typing
  const noteDraftRef = useRef({});    // in-progress note text, survives re-renders

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const todayStr = useMemo(() => `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`, [today]);
  const daysTo = (s) => Math.round((parseDate(s) - today) / 86400000);

  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem("abz_theme", dark ? "dark" : "light");
    } catch (e) {}
  }, [dark]);

  // normalise any loaded board so all sections exist
  const normalise = (b) => ({
    phases: b.phases || clone(SEED_PHASES),
    events: b.events || clone(SEED_EVENTS),
    milestones: b.milestones || clone(SEED_MILESTONES),
    notes: b.notes || {},
    rev: b.rev,
  });

  // Are we mid-edit? If so, don't let a remote update overwrite the screen.
  const isBusy = () => editingRef.current || (Date.now() - typingRef.current < 4000);

  // Apply an incoming board from Supabase — but only when you're not typing,
  // and only if it's actually different (kills the self-triggered reloads).
  const applyRemote = (raw) => {
    let next;
    try { next = normalise(JSON.parse(raw)); } catch (e) { return; }
    if (isBusy()) { pendingRef.current = raw; return; }
    setBoard((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    setSynced(true); setLastSynced(new Date());
  };

  // ----- load + realtime -----
  useEffect(() => {
    let unsub = () => {};
    (async () => {
      let loaded = null;
      try {
        if (window.storage) {
          const r = await window.storage.get(STORAGE_KEY, true);
          if (r && r.value) loaded = normalise(JSON.parse(r.value));
        }
      } catch (e) { /* none */ }
      if (!loaded) loaded = normalise({});           // fresh board → full seed
      const hadRev = loaded.rev;
      loaded = mergeSeed(loaded);                     // additively pull in any new tasks/events
      setBoard(loaded);
      if (hadRev !== SEED_REV) persist(loaded, true); // save merged board so the team gets the new items

      if (window.storage && window.storage.subscribe) {
        unsub = window.storage.subscribe(STORAGE_KEY, (val) => applyRemote(val));
      }
    })();
    return () => unsub();
    // eslint-disable-next-line
  }, []);

  // ----- poll fallback every 30s -----
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        if (window.storage) {
          const r = await window.storage.get(STORAGE_KEY, true);
          if (r && r.value) applyRemote(r.value);
        }
      } catch (e) { setSynced(false); }
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // ----- flush any parked remote update once you've stopped typing -----
  useEffect(() => {
    const id = setInterval(() => {
      if (pendingRef.current && !isBusy()) {
        const raw = pendingRef.current; pendingRef.current = null; applyRemote(raw);
      }
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // ----- track whether the edit modal is open -----
  useEffect(() => { editingRef.current = !!editing; }, [editing]);

  const persist = async (next, silent) => {
    if (!silent) setBoard(next);
    try {
      if (window.storage) {
        await window.storage.set(STORAGE_KEY, JSON.stringify(next), true);
        setSynced(true); setLastSynced(new Date());
      }
    } catch (e) { setSynced(false); }
  };

  // ----- task mutations -----
  const toggleTask = (id) => persist({
    ...board,
    phases: board.phases.map((p) => ({ ...p, tasks: p.tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t) })),
  });
  const openNewTask = (phaseId) => { setDraft({ id: newId(), title: "", owner: ["all"], due: todayStr, note: "", ext: false, done: false, phaseId }); setEditing({ mode: "task", isNew: true }); };
  const openEditTask = (t, phaseId) => { setDraft({ ...t, note: t.note || "", phaseId }); setEditing({ mode: "task", isNew: false }); };
  const commitTask = () => {
    const d = draft;
    const owner = d.owner && d.owner.length ? d.owner : ["all"];
    const t = { id: d.id, title: d.title.trim(), owner, due: d.due || "", note: (d.note || "").trim(), ext: !!d.ext, done: !!d.done };
    let phases = board.phases.map((p) => ({ ...p, tasks: p.tasks.filter((x) => x.id !== t.id) }));
    phases = phases.map((p) => p.id === d.phaseId ? { ...p, tasks: sortTasks([...p.tasks, t]) } : p);
    persist({ ...board, phases }); close();
  };
  const removeTask = (id) => { persist({ ...board, phases: board.phases.map((p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== id) })) }); close(); };

  // ----- phase mutations -----
  const openNewPhase = () => { setDraft({ id: newId(), label: "", month: "", accent: COLORS[0] }); setEditing({ mode: "phase", isNew: true }); };
  const openEditPhase = (p) => { setDraft({ ...p }); setEditing({ mode: "phase", isNew: false }); };
  const commitPhase = () => {
    const d = draft;
    if (!d.label.trim()) return;
    let phases;
    if (board.phases.find((p) => p.id === d.id)) {
      phases = board.phases.map((p) => p.id === d.id ? { ...p, label: d.label.trim(), month: d.month.trim(), accent: d.accent } : p);
    } else {
      phases = [...board.phases, { id: d.id, label: d.label.trim(), month: d.month.trim(), accent: d.accent, tasks: [] }];
    }
    persist({ ...board, phases }); close();
  };
  const removePhase = (id) => { persist({ ...board, phases: board.phases.filter((p) => p.id !== id) }); setOpenPhaseId(null); close(); };

  // ----- milestone mutations -----
  const openNewMilestone = () => { setDraft({ id: newId(), title: "", date: todayStr, desc: "", state: "future" }); setEditing({ mode: "milestone", isNew: true }); };
  const openEditMilestone = (m) => { setDraft({ ...m }); setEditing({ mode: "milestone", isNew: false }); };
  const commitMilestone = () => {
    const d = draft;
    if (!d.title.trim()) return;
    const others = board.milestones.filter((m) => m.id !== d.id);
    const m = { id: d.id, title: d.title.trim(), date: d.date, desc: (d.desc || "").trim(), state: d.state };
    const milestones = [...others, m].sort((a, b) => parseDate(a.date) - parseDate(b.date));
    persist({ ...board, milestones }); close();
  };
  const removeMilestone = (id) => { persist({ ...board, milestones: board.milestones.filter((m) => m.id !== id) }); close(); };

  // ----- event mutations -----
  const openNewEvent = () => { setDraft({ id: newId(), label: "", date: todayStr, type: "meeting", done: false }); setEditing({ mode: "event", isNew: true }); };
  const openEditEvent = (e) => { setDraft({ ...e }); setEditing({ mode: "event", isNew: false }); };
  const commitEvent = () => {
    const d = draft;
    if (!d.label.trim()) return;
    const others = board.events.filter((x) => x.id !== d.id);
    const e = { id: d.id, label: d.label.trim(), date: d.date, type: d.type, done: !!d.done, endDate: d.endDate };
    const events = [...others, e].sort((a, b) => parseDate(a.date) - parseDate(b.date));
    persist({ ...board, events }); close();
  };
  const removeEvent = (id) => { persist({ ...board, events: board.events.filter((e) => e.id !== id) }); close(); };

  // ----- notes -----
  const saveNote = (id, text) => persist({ ...board, notes: { ...board.notes, [id]: text } });

  const close = () => { setEditing(null); setDraft(null); };

  const resetBoard = () => {
    if (!window.confirm("Reset the whole board to the original plan? All edits and tick-offs are lost for everyone.")) return;
    persist({ phases: clone(SEED_PHASES), events: clone(SEED_EVENTS), milestones: clone(SEED_MILESTONES), notes: {} });
  };

  // ----- calendar export -----
  const exportICS = () => {
    if (!board) return;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const items = [];
    board.events.forEach((e) => items.push({ uid: e.id, start: e.date, end: e.endDate ? addDay(e.endDate) : addDay(e.date), title: e.label }));
    board.phases.forEach((p) => p.tasks.forEach((t) => { if (t.ext && !t.done) items.push({ uid: t.id, start: t.due, end: addDay(t.due), title: t.title }); }));
    const L = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//AstroBizNet//Dashboard//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:AstroBizNet"];
    items.filter((i) => i.start).forEach((i) => {
      L.push("BEGIN:VEVENT", `UID:${i.uid}@astrobiznet`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${toICSDate(i.start)}`, `DTEND;VALUE=DATE:${toICSDate(i.end)}`, `SUMMARY:AstroBizNet · ${i.title}`, "TRANSP:TRANSPARENT");
      ["-P7D", "-P1D"].forEach((o) => L.push("BEGIN:VALARM", `TRIGGER:${o}`, "ACTION:DISPLAY", `DESCRIPTION:Reminder: ${i.title}`, "END:VALARM"));
      L.push("END:VEVENT");
    });
    L.push("END:VCALENDAR");
    try {
      const blob = new Blob([L.join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "astrobiznet-calendar.ics";
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch (e) { window.alert("Couldn't download here."); }
  };

  // ----- derived -----
  const matchOwner = (t) => ownerFilter === "all" || t.owner.includes(ownerFilter);
  const allTasks = useMemo(() => board ? board.phases.flatMap((p) => p.tasks) : [], [board]);
  const counts = useMemo(() => {
    const total = allTasks.length, done = allTasks.filter((t) => t.done).length;
    return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
  }, [allTasks]);
  const taskState = (t) => { if (t.done) return "done"; if (!t.due) return "scheduled"; const d = daysTo(t.due); return d < 0 ? "overdue" : d <= 7 ? "week" : "scheduled"; };
  const buckets = useMemo(() => {
    const open = allTasks.filter((t) => !t.done && t.due && matchOwner(t));
    const s = (a, b) => parseDate(a.due) - parseDate(b.due);
    return {
      overdue: open.filter((t) => daysTo(t.due) < 0).sort(s),
      week: open.filter((t) => daysTo(t.due) >= 0 && daysTo(t.due) <= 7).sort(s),
      soon: open.filter((t) => daysTo(t.due) >= 8 && daysTo(t.due) <= 21).sort(s),
    };
    // eslint-disable-next-line
  }, [allTasks, ownerFilter]);
  const ownerStats = (id) => { const l = allTasks.filter((t) => t.owner.includes(id)); return { open: l.filter((t) => !t.done).length, total: l.length }; };
  const daysLeft = daysTo(PROJECT_END);

  const STATE = {
    overdue:   { bar: "#f43f5e", chip: "#fecdd3", text: "#9f1239" },
    week:      { bar: "#f59e0b", chip: "#fde68a", text: "#92400e" },
    scheduled: { bar: "#cbd5e1", chip: "#e2e8f0", text: "#475569" },
    done:      { bar: "#10b981", chip: "#f1f5f9", text: "#94a3b8" },
  };

  if (!board) return <div className="min-h-screen grid place-items-center text-slate-400" style={{ fontFamily: "ui-sans-serif, system-ui" }}>Loading your board…</div>;

  const openPhase = board.phases.find((p) => p.id === openPhaseId);

  // ---------- shared bits ----------
  const chipInactive = dark ? { background: "#1b2436", borderColor: "#2b3550", color: "#aeb8cc" } : { background: "#fff", borderColor: "#e2e8f0", color: "#475569" };
  const OwnerChip = ({ id }) => { const m = TEAM[id] || TEAM.all; return (
    <span className="inline-flex items-center gap-1 rounded-full font-medium" style={{ background: m.color + "1f", color: m.color, padding: "1px 7px", fontSize: 11 }}>
      <span className="rounded-full" style={{ width: 5, height: 5, background: m.color }} />{m.short}
    </span>); };

  const TaskRow = ({ t, phaseId }) => {
    const st = taskState(t), d = t.due ? daysTo(t.due) : null;
    return (
      <div className="group flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-slate-50" style={{ borderLeft: `3px solid ${STATE[st].bar}` }}>
        <button onClick={() => toggleTask(t.id)} className="mt-0.5 shrink-0">
          {t.done ? <CheckCircle2 size={18} style={{ color: "#10b981" }} /> : <Circle size={18} className="text-slate-300 hover:text-slate-400" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className={"text-sm leading-snug " + (t.done ? "line-through text-slate-400" : "text-slate-800")}>
            {t.title}{t.ext && !t.done && <Flag size={12} className="inline -mt-0.5 ml-1" style={{ color: "#f43f5e" }} />}
          </div>
          {t.note && <div className="text-[12px] text-slate-500 mt-0.5 italic">{t.note}</div>}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {t.owner.map((o) => <OwnerChip key={o} id={o} />)}
            {t.due && (
              <span className="inline-flex items-center gap-1 rounded-full text-xs font-medium px-2 py-0.5" style={{ background: STATE[st].chip, color: STATE[st].text }}>
                <CalendarDays size={11} /> {fmt(t.due)}
                {!t.done && d < 0 && <span className="font-semibold"> · {Math.abs(d)}d late</span>}
                {!t.done && d >= 0 && d <= 7 && <span className="font-semibold"> · {d === 0 ? "today" : d + "d"}</span>}
              </span>
            )}
          </div>
        </div>
        <button onClick={() => openEditTask(t, phaseId)} className="shrink-0 p-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100">
          <Pencil size={14} />
        </button>
      </div>
    );
  };

  const MiniTask = ({ t }) => { const st = taskState(t), d = t.due ? daysTo(t.due) : null; return (
    <button onClick={() => toggleTask(t.id)} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50">
      <Circle size={18} className="text-slate-300 shrink-0" />
      <span className="flex-1 min-w-0 text-[15px] text-slate-700 truncate">{t.title}</span>
      <span className="flex items-center gap-2 shrink-0">
        {t.owner.slice(0, 2).map((o) => { const m = TEAM[o] || TEAM.all; return (
          <span key={o} className="inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap" style={{ background: m.color + "1f", color: m.color, padding: "2px 9px", fontSize: 12 }}>
            <span className="rounded-full" style={{ width: 5, height: 5, background: m.color }} />{m.name}
          </span>); })}
        {t.due && <span className="inline-flex items-center gap-1 rounded-full text-[12px] font-semibold px-2.5 py-1 tabular-nums" style={{ background: STATE[st].chip, color: STATE[st].text }}>{fmt(t.due)}{!t.done && d >= 0 && d <= 7 && <span> · {d === 0 ? "today" : d + "d"}</span>}{!t.done && d < 0 && <span> · {Math.abs(d)}d late</span>}</span>}
      </span>
    </button>
  ); };

  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" }} className="min-h-screen app-root text-slate-900 flex">

      {/* ---------- Sidebar ---------- */}
      <aside className="w-[150px] shrink-0 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen self-start">
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="text-[13px] font-semibold text-slate-800">AstroBizNet</div>
          <div className="text-[10px] text-slate-400">Mission Control</div>
        </div>
        <nav className="flex-1 py-2">
          {NAV.map((n) => {
            const Icon = n.icon, active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                className={"w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors " + (active ? "text-indigo-600 font-medium bg-indigo-50/60 border-r-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50")}>
                <Icon size={16} />{n.label}
              </button>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="rounded-full" style={{ width: 6, height: 6, background: synced ? "#10b981" : "#f43f5e" }} />
            {synced ? "Live sync on" : "Sync issue"}
          </div>
          <button onClick={() => setDark((v) => !v)} className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md py-1.5">
            {dark ? <Sun size={13} /> : <Moon size={13} />}{dark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <main className="flex-1 min-w-0">
        {/* topbar */}
        <header className="relative overflow-hidden text-white px-6 py-4" style={{ background: "radial-gradient(120% 160% at 90% -20%, #2a3473 0%, #141a35 50%, #0b0f23 100%)" }}>
          <div className="absolute inset-0 opacity-60 pointer-events-none" style={{ backgroundImage: "radial-gradient(1px 1px at 20% 40%, #fff, transparent), radial-gradient(1px 1px at 60% 30%, #c7d2fe, transparent), radial-gradient(1px 1px at 80% 60%, #fff, transparent), radial-gradient(1px 1px at 45% 70%, #e0e7ff, transparent)" }} />
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div className="text-2xl font-bold tracking-tight">AstroBizNet — Mission Control</div>
            <div className="text-[13px] font-medium text-indigo-200/90 tabular-nums">{counts.done} of {counts.total} complete · {counts.pct}% · {daysLeft} days left</div>
          </div>
          <div className="relative h-1.5 rounded-full bg-white/15 overflow-hidden mt-3">
            <div className="h-full rounded-full" style={{ width: counts.pct + "%", background: "linear-gradient(90deg,#818cf8,#22d3ee)" }} />
          </div>
        </header>

        <div className="px-8 py-7 max-w-[1500px] mx-auto w-full">
          {tab === "overview" && <Overview />}
          {tab === "tasks" && <Tasks />}
          {tab === "timeline" && <Timeline />}
          {tab === "team" && <Team />}
          {tab === "meetings" && <Meetings />}
          {tab === "notes" && <Notes />}
        </div>
      </main>

      {/* ---------- Phase drawer ---------- */}
      {openPhase && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpenPhaseId(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-white z-50 flex flex-col border-l border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
              <span className="rounded-full shrink-0" style={{ width: 10, height: 10, background: openPhase.accent }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">{openPhase.label}</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider">{openPhase.month}</div>
              </div>
              <button onClick={() => openEditPhase(openPhase)} className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 inline-flex items-center gap-1"><Pencil size={13} /> Edit</button>
              <button onClick={() => openNewTask(openPhase.id)} className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 inline-flex items-center gap-1"><Plus size={13} /> Task</button>
              <button onClick={() => setOpenPhaseId(null)} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="px-4 py-2.5 border-b border-slate-100">
              {(() => { const dc = openPhase.tasks.filter((t) => t.done).length, tc = openPhase.tasks.length, pct = tc ? Math.round(dc/tc*100) : 0; return (
                <>
                  <div className="h-1 rounded-full bg-slate-100 overflow-hidden mb-1.5"><div className="h-full rounded-full" style={{ width: pct + "%", background: openPhase.accent }} /></div>
                  <div className="flex justify-between text-[11px] text-slate-400"><span>{dc} of {tc} done</span><span>{tc ? pct + "%" : "—"}</span></div>
                </>
              ); })()}
            </div>
            <div className="flex-1 overflow-auto p-2">
              {openPhase.tasks.filter(matchOwner).length === 0
                ? <div className="text-xs text-slate-400 px-3 py-4">No tasks match the current filter.</div>
                : openPhase.tasks.filter(matchOwner).map((t) => <TaskRow key={t.id} t={t} phaseId={openPhase.id} />)}
              <button onClick={() => openNewTask(openPhase.id)} className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-indigo-600 text-sm mt-1"><Plus size={15} /> Add task to this phase</button>
            </div>
          </div>
        </>
      )}

      {/* ---------- Editor modal ---------- */}
      {editing && draft && <EditorModal />}
    </div>
  );

  // ================= PANES =================

  function Overview() {
    const nextM = board.milestones.find((m) => m.state !== "done" && daysTo(m.date) >= 0) || board.milestones.find((m) => m.state !== "done");
    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat label="Overdue" value={buckets.overdue.length} color="#f43f5e" />
          <Stat label="Due this week" value={buckets.week.length} color="#f59e0b" />
          <Stat label="Next 2 weeks" value={buckets.soon.length} color="#6366f1" />
          <Stat label="Complete" value={counts.pct + "%"} color="#10b981" />
        </div>

        <div className="rounded-2xl px-7 py-6 mb-6 flex items-center gap-5 text-white" style={{ background: "radial-gradient(140% 220% at 100% 0%, #2a3473 0%, #141a35 60%)" }}>
          <span className="grid place-items-center rounded-full shrink-0" style={{ width: 58, height: 58, background: "rgba(129,140,248,.2)" }}><Flag size={26} style={{ color: "#a5b4fc" }} /></span>
          <div className="flex-1 min-w-0">
            {nextM ? <>
              <div className="text-[13px] text-indigo-200/90 mb-1">Next milestone · {fmtLong(nextM.date)} · {daysTo(nextM.date) >= 0 ? (daysTo(nextM.date) === 0 ? "today" : daysTo(nextM.date) + " days away") : "overdue"}</div>
              <div className="text-2xl font-bold leading-tight">{nextM.title}</div>
              {nextM.desc && <div className="text-sm text-indigo-100/80 mt-1">{nextM.desc}</div>}
            </> : <div className="text-lg">No upcoming milestones.</div>}
          </div>
        </div>

        <SectionLabel>Phase progress</SectionLabel>
        <div className="grid gap-4 mb-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(225px, 1fr))" }}>
          {board.phases.map((p) => { const dc = p.tasks.filter((t) => t.done).length, tc = p.tasks.length, pct = tc ? Math.round(dc/tc*100) : 0; return (
            <button key={p.id} onClick={() => { setTab("tasks"); setOpenPhaseId(p.id); }} className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:-translate-y-0.5 transition-all p-5 flex items-center gap-4 text-left">
              <Ring pct={pct} color={p.accent} size={70} />
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-slate-800 leading-tight break-words" style={{ overflowWrap: "anywhere" }}>{p.label}</div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1">{p.month}</div>
                <div className="text-[13px] text-slate-500 mt-1.5 font-medium">{dc}/{tc} tasks</div>
              </div>
            </button>
          ); })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <SectionLabel><Bell size={14} className="inline -mt-0.5 mr-1.5" /> Action centre</SectionLabel>
            <div className="bg-white rounded-2xl border border-slate-200 p-2">
              {[...buckets.overdue, ...buckets.week].length === 0
                ? <div className="text-sm text-slate-400 px-3 py-7 text-center">Nothing urgent right now 🎉</div>
                : [...buckets.overdue, ...buckets.week].slice(0, 8).map((t) => <MiniTask key={t.id} t={t} />)}
            </div>
          </div>
          <div>
            <SectionLabel>Don't get caught out</SectionLabel>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-[14px] text-slate-600 space-y-3.5">
              <div className="flex gap-2.5"><Wallet size={18} className="shrink-0 mt-0.5 text-teal-600" /><span><b>Keep every receipt.</b> The finance report needs proof of expenditure.</span></div>
              <div className="flex gap-2.5"><Clock size={18} className="shrink-0 mt-0.5 text-amber-600" /><span>Final report due <b>within 30 days</b> of the OAD's request.</span></div>
              <div className="flex gap-2.5"><Flag size={18} className="shrink-0 mt-0.5 text-indigo-500" /><span>Tell the OAD <b>before</b> any major budget or timeline change.</span></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function FilterBar() {
    return (
      <div className="flex items-center gap-2.5 flex-wrap mb-5">
        <span className="text-sm font-semibold text-slate-500 mr-1">Filter:</span>
        <button onClick={() => setOwnerFilter("all")} className={"text-sm font-medium px-4 py-2 rounded-full border " + (ownerFilter === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200")}>Everyone</button>
        {TEAM_IDS.map((id) => { const active = ownerFilter === id, m = TEAM[id]; return (
          <button key={id} onClick={() => setOwnerFilter(id)} className="text-sm font-medium px-4 py-2 rounded-full border inline-flex items-center gap-2" style={active ? { background: m.color, borderColor: m.color, color: "#fff" } : chipInactive}>
            <span className="rounded-full" style={{ width: 8, height: 8, background: active ? "#fff" : m.color }} />{m.name}
          </button>); })}
      </div>
    );
  }

  function Tasks() {
    return (
      <>
        <FilterBar />
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))" }}>
          {board.phases.map((p) => {
            const dc = p.tasks.filter((t) => t.done).length, tc = p.tasks.length, pct = tc ? Math.round(dc/tc*100) : 0;
            const overdue = p.tasks.filter((t) => !t.done && t.due && daysTo(t.due) < 0).length;
            const week = p.tasks.filter((t) => !t.done && t.due && daysTo(t.due) >= 0 && daysTo(t.due) <= 7).length;
            return (
              <button key={p.id} onClick={() => setOpenPhaseId(p.id)} className="text-left bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:-translate-y-0.5 transition-all p-5 flex items-center gap-5 group">
                <Ring pct={pct} color={p.accent} size={86} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[17px] font-bold text-slate-800 leading-tight break-words" style={{ overflowWrap: "anywhere" }}>{p.label}</div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1">{p.month}</div>
                    </div>
                    <span onClick={(e) => { e.stopPropagation(); openEditPhase(p); }} className="p-1.5 rounded-md text-slate-300 hover:text-indigo-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100"><Pencil size={15} /></span>
                  </div>
                  <div className="text-[14px] font-medium text-slate-500 mt-2.5">{dc}/{tc} tasks done</div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {overdue > 0 && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#FCEBEB", color: "#A32D2D" }}>{overdue} overdue</span>}
                    {week > 0 && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#FAEEDA", color: "#854F0B" }}>{week} this week</span>}
                    {dc === tc && tc > 0 && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#EAF3DE", color: "#3B6D11" }}>Complete</span>}
                  </div>
                </div>
              </button>
            );
          })}
          <button onClick={openNewPhase} className="rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-white flex items-center justify-center gap-2 text-[15px] min-h-[128px]">
            <Plus size={18} /> Add new phase
          </button>
        </div>
      </>
    );
  }

  function Timeline() {
    const meta = { done: { c: "#10b981", bg: "#EAF3DE", t: "#3B6D11", label: "Done" }, now: { c: "#4f46e5", bg: "#EEEDFE", t: "#3C3489", label: "In progress" }, future: { c: "#94a3b8", bg: "#EEF2F7", t: "#475569", label: "Upcoming" } };
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Project milestones</SectionLabel>
          <button onClick={openNewMilestone} className="text-sm px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 inline-flex items-center gap-1.5"><Plus size={15} /> Add milestone</button>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(295px, 1fr))" }}>
          {board.milestones.map((m) => { const d = m.date ? daysTo(m.date) : null; const ms = meta[m.state] || meta.future; return (
            <div key={m.id} className="group bg-white rounded-2xl border border-slate-200 p-5" style={{ borderTop: `4px solid ${ms.c}` }}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: ms.bg, color: ms.t }}>{ms.label}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditMilestone(m)} className="p-1.5 rounded-md text-slate-300 hover:text-indigo-600 hover:bg-slate-50"><Pencil size={14} /></button>
                  <button onClick={() => removeMilestone(m.id)} className="p-1.5 rounded-md text-slate-300 hover:text-rose-600 hover:bg-slate-50"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="text-[17px] font-bold text-slate-800 leading-tight">{m.title}</div>
              <div className="text-[13px] text-slate-400 mt-1.5 font-medium">{fmtLong(m.date)}{d !== null && m.state !== "done" ? (d === 0 ? " · today" : d > 0 ? ` · ${d}d away` : ` · ${Math.abs(d)}d ago`) : ""}</div>
              {m.desc && <div className="text-[13px] text-slate-500 mt-2.5 leading-relaxed">{m.desc}</div>}
            </div>
          ); })}
          <button onClick={openNewMilestone} className="rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-white flex items-center justify-center gap-2 text-[15px] min-h-[150px]"><Plus size={18} /> Add milestone</button>
        </div>
      </>
    );
  }

  function Team() {
    return (
      <>
        <SectionLabel>Team members</SectionLabel>
        <div className="grid gap-4 mb-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {TEAM_IDS.map((id) => { const m = TEAM[id], s = ownerStats(id), pct = s.total ? Math.round((s.total - s.open) / s.total * 100) : 0; return (
            <div key={id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
              <span className="grid place-items-center rounded-full text-lg font-bold text-white shrink-0" style={{ width: 52, height: 52, background: m.color }}>{m.short}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[17px] font-bold text-slate-800">{m.name}</div>
                <div className="text-[13px] text-slate-400 leading-snug mt-0.5">{m.role}</div>
                <div className="text-[13px] font-medium text-slate-500 mt-2">{s.open} open · {s.total} total</div>
              </div>
              <Ring pct={pct} color={m.color} size={64} />
            </div>
          ); })}
        </div>
        <SectionLabel>OAD grant contact</SectionLabel>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-[15px] text-slate-600 space-y-2.5 max-w-2xl">
          <div className="flex items-center gap-2.5"><Users size={18} className="text-slate-400" /> Ramasamy Venugopal — OAD Operations & Programs</div>
          <div className="flex items-center gap-2.5"><Mail size={18} className="text-slate-400" /> <span style={{ color: "#185FA5" }}>rv@astro4dev.org</span></div>
          <div className="flex items-center gap-2.5"><Globe size={18} className="text-slate-400" /> <span style={{ color: "#185FA5" }}>www.astro4dev.org</span></div>
        </div>
      </>
    );
  }

  function Meetings() {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Dates & meetings</SectionLabel>
          <button onClick={openNewEvent} className="text-sm px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 inline-flex items-center gap-1.5"><Plus size={15} /> Add date</button>
        </div>
        <div className="grid gap-4 mb-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {board.events.map((k) => { const past = k.done, d = daysTo(k.date); const accent = past ? "#10b981" : d < 0 ? "#94a3b8" : k.type === "meeting" ? "#6366f1" : "#14b8a6"; return (
            <div key={k.id} className="group bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4" style={{ borderLeft: `4px solid ${accent}` }}>
              <Flag size={22} className="shrink-0" style={{ color: accent }} />
              <div className="flex-1 min-w-0">
                <div className={"text-[16px] font-bold " + (past ? "text-slate-400 line-through" : "text-slate-800")}>{k.label}{k.tbd && <span className="text-amber-500 text-[12px] font-semibold no-underline"> · confirm</span>}</div>
                <div className="text-[13px] text-slate-400 mt-0.5 font-medium">{fmtLong(k.date)}{k.endDate ? " – " + fmtLong(k.endDate) : ""}</div>
              </div>
              {!past && d >= 0 && <div className="text-right shrink-0"><div className="text-2xl font-bold text-slate-700 tabular-nums leading-none">{d}</div><div className="text-[11px] text-slate-400 mt-0.5">days</div></div>}
              <button onClick={() => openEditEvent(k)} className="shrink-0 p-1.5 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100"><Pencil size={15} /></button>
            </div>
          ); })}
        </div>
        <SectionLabel>Calendar export</SectionLabel>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 max-w-2xl">
          <div className="text-[14px] text-slate-500">Download all deadlines & meetings as .ics (with reminders)</div>
          <button onClick={exportICS} className="text-sm px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2 shrink-0"><CalendarPlus size={16} /> Export .ics</button>
        </div>
        <div className="text-center mt-6">
          <button onClick={resetBoard} className="text-[12px] text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"><RotateCcw size={12} /> Reset board to template</button>
        </div>
      </>
    );
  }

  function Notes() {
    return (
      <>
        <SectionLabel>Team notepads — anyone can read, everyone can write</SectionLabel>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))" }}>
          {TEAM_IDS.map((id) => <NotePad key={id} id={id} />)}
        </div>
      </>
    );
  }

  function NotePad({ id }) {
    const m = TEAM[id];
    const ref = useRef(null);
    const [saved, setSaved] = useState(false);
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100">
          <span className="grid place-items-center rounded-full text-[12px] font-bold text-white shrink-0" style={{ width: 32, height: 32, background: m.color }}>{m.short}</span>
          <span className="text-[16px] font-bold text-slate-800 flex-1">{m.name}</span>
          {saved && <span className="text-[12px] text-emerald-600 font-medium">Saved ✓</span>}
        </div>
        <textarea ref={ref} defaultValue={noteDraftRef.current[id] ?? (board.notes[id] || "")}
          onInput={(e) => { setSaved(false); typingRef.current = Date.now(); noteDraftRef.current[id] = e.target.value; }} rows={9}
          placeholder="Write anything — blockers, ideas, links, reminders…"
          className="w-full px-5 py-4 text-[15px] text-slate-700 resize-y focus:outline-none leading-relaxed" />
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
          <button onClick={() => { saveNote(id, ref.current.value); delete noteDraftRef.current[id]; setSaved(true); }} className="text-[13px] px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">Save</button>
        </div>
      </div>
    );
  }

  // ================= EDITOR MODAL =================
  function EditorModal() {
    const mode = editing.mode;
    const titleMap = {
      task: editing.isNew ? "Add task" : "Edit task",
      phase: editing.isNew ? "Add phase" : "Edit phase",
      milestone: editing.isNew ? "Add milestone" : "Edit milestone",
      event: editing.isNew ? "Add date / meeting" : "Edit date / meeting",
    };
    const commit = { task: commitTask, phase: commitPhase, milestone: commitMilestone, event: commitEvent }[mode];
    const remove = { task: () => removeTask(draft.id), phase: () => removePhase(draft.id), milestone: () => removeMilestone(draft.id), event: () => removeEvent(draft.id) }[mode];
    const canSave = mode === "task" ? draft.title?.trim() : mode === "phase" ? draft.label?.trim() : mode === "milestone" ? draft.title?.trim() : draft.label?.trim();

    return (
      <div className="fixed inset-0 z-[60] grid place-items-end sm:place-items-center bg-black/40 p-0 sm:p-4" onClick={close}>
        <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
            <h3 className="font-semibold text-slate-800">{titleMap[mode]}</h3>
            <button onClick={close} className="p-1 rounded-md text-slate-400 hover:bg-slate-100"><X size={18} /></button>
          </div>

          <div className="p-5 space-y-4">
            {mode === "task" && <>
              <Field label="Task"><input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="What needs doing?" className="fi" /></Field>
              <Field label="Assigned to">
                <div className="flex flex-wrap gap-1.5">
                  {TEAM_IDS.map((id) => { const m = TEAM[id], on = draft.owner.includes(id) && !draft.owner.includes("all"); return (
                    <button key={id} onClick={() => { const cur = draft.owner.filter((o) => o !== "all"); const next = on ? cur.filter((o) => o !== id) : [...cur, id]; setDraft({ ...draft, owner: next.length ? next : ["all"] }); }} className="text-xs font-medium px-2.5 py-1.5 rounded-full border inline-flex items-center gap-1.5" style={on ? { background: m.color, borderColor: m.color, color: "#fff" } : chipInactive}>
                      <span className="rounded-full" style={{ width: 7, height: 7, background: on ? "#fff" : m.color }} />{m.name}
                    </button>); })}
                  <button onClick={() => setDraft({ ...draft, owner: ["all"] })} className="text-xs font-medium px-2.5 py-1.5 rounded-full border" style={draft.owner.includes("all") ? { background: "#64748b", borderColor: "#64748b", color: "#fff" } : chipInactive}>Whole team</button>
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Due date"><input type="date" value={draft.due} onChange={(e) => setDraft({ ...draft, due: e.target.value })} className="fi" /></Field>
                <Field label="Phase"><select value={draft.phaseId} onChange={(e) => setDraft({ ...draft, phaseId: e.target.value })} className="fi">{board.phases.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select></Field>
              </div>
              <Field label="Note (optional)"><textarea value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} rows={2} className="fi" /></Field>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"><input type="checkbox" checked={draft.ext} onChange={(e) => setDraft({ ...draft, ext: e.target.checked })} className="accent-rose-500" /><Flag size={14} className="text-rose-500" /> Hard deadline (adds to calendar export)</label>
            </>}

            {mode === "phase" && <>
              <Field label="Phase name"><input autoFocus value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="e.g. Planning & setup" className="fi" /></Field>
              <Field label="Period / month"><input value={draft.month} onChange={(e) => setDraft({ ...draft, month: e.target.value })} placeholder="e.g. June or Jul – Aug" className="fi" /></Field>
              <Field label="Accent colour">
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => <button key={c} onClick={() => setDraft({ ...draft, accent: c })} className="rounded-full" style={{ width: 24, height: 24, background: c, outline: draft.accent === c ? "2px solid #1e293b" : "none", outlineOffset: 2 }} />)}
                </div>
              </Field>
            </>}

            {mode === "milestone" && <>
              <Field label="Title"><input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Recruitment launch" className="fi" /></Field>
              <Field label="Date"><input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="fi" /></Field>
              <Field label="Description (optional)"><input value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} placeholder="Short context" className="fi" /></Field>
              <Field label="Status">
                <div className="flex gap-1.5">
                  {[["done", "Done"], ["now", "Current"], ["future", "Upcoming"]].map(([v, lab]) => (
                    <button key={v} onClick={() => setDraft({ ...draft, state: v })} className={"text-sm font-medium px-3 py-1.5 rounded-lg border flex-1 " + (draft.state === v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200")}>{lab}</button>
                  ))}
                </div>
              </Field>
            </>}

            {mode === "event" && <>
              <Field label="Title"><input autoFocus value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="e.g. OAD check-in call" className="fi" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date"><input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="fi" /></Field>
                <Field label="End (optional)"><input type="date" value={draft.endDate || ""} onChange={(e) => setDraft({ ...draft, endDate: e.target.value || undefined })} className="fi" /></Field>
              </div>
              <Field label="Type">
                <div className="flex gap-1.5">
                  {[["meeting", "Meeting"], ["milestone", "Milestone"]].map(([v, lab]) => (
                    <button key={v} onClick={() => setDraft({ ...draft, type: v })} className={"text-sm font-medium px-3 py-1.5 rounded-lg border flex-1 " + (draft.type === v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200")}>{lab}</button>
                  ))}
                </div>
              </Field>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"><input type="checkbox" checked={draft.done} onChange={(e) => setDraft({ ...draft, done: e.target.checked })} className="accent-emerald-500" /> Mark as done / past</label>
            </>}
          </div>

          <div className="flex items-center gap-2 px-5 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
            {!editing.isNew && <button onClick={remove} className="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg font-medium"><Trash2 size={15} /> Delete</button>}
            <div className="ml-auto flex gap-2">
              <button onClick={close} className="text-sm text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100 font-medium">Cancel</button>
              <button disabled={!canSave} onClick={commit} className="inline-flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-40"><Check size={15} /> Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function Stat({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5">
      <div className="text-[12px] uppercase tracking-wider text-slate-400 mb-2 font-medium">{label}</div>
      <div className="text-5xl font-bold tabular-nums leading-none" style={{ color }}>{value}</div>
    </div>
  );
}
function SectionLabel({ children }) {
  return <h3 className="text-[13px] uppercase tracking-[0.14em] font-bold text-slate-500 mb-3">{children}</h3>;
}
function Ring({ pct, color, size = 72 }) {
  const r = (size - 9) / 2, circ = 2 * Math.PI * r, len = (pct / 100) * circ, cx = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--ring-track)" strokeWidth="8" />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${len} ${circ - len}`} transform={`rotate(-90 ${cx} ${cx})`} />
      <text x={cx} y={cx} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.27} fontWeight="700" fill="currentColor" className="text-slate-700">{pct}%</text>
    </svg>
  );
}
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
