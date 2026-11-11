import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Bell, BookOpen, Check, CheckCircle2, ChevronDown,
  CircleHelp, Clock3, Code2, FileText, GraduationCap, LayoutDashboard,
  Menu, Search, SearchX, ShieldCheck, Sparkles, Timer, X
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Demo data                                                           */
/* ------------------------------------------------------------------ */

const STUDENT = { name: "Samriddha", initial: "S" };

const exams = [
  { id: 1, title: "Java Programming Assessment", subject: "Programming", level: "Intermediate", questions: 20, duration: 30, marks: 40, date: "Available now", color: "violet", icon: Code2, description: "Test your knowledge of Java fundamentals, OOP concepts and syntax." },
  { id: 2, title: "Database Management Systems", subject: "Computer Science", level: "Beginner", questions: 25, duration: 40, marks: 50, date: "Available now", color: "blue", icon: LayoutDashboard, description: "SQL, relational models, keys and database normalization." },
  { id: 3, title: "Web Development Basics", subject: "Web Technology", level: "Beginner", questions: 15, duration: 20, marks: 30, date: "Available now", color: "orange", icon: FileText, description: "HTML, CSS, JavaScript and essential web concepts." }
];

const questions = [
  { q: "Which of the following is the correct extension of a Java source file?", options: [".java", ".class", ".js", ".py"], answer: 0 },
  { q: "Which keyword is used to inherit a class in Java?", options: ["implements", "extends", "inherits", "super"], answer: 1 },
  { q: "Which method is the entry point of a standard Java application?", options: ["start()", "run()", "main()", "init()"], answer: 2 },
  { q: "Which of these is not a primitive data type in Java?", options: ["int", "boolean", "String", "char"], answer: 2 },
  { q: "What is the size of an int in Java?", options: ["8 bits", "16 bits", "32 bits", "64 bits"], answer: 2 },
  { q: "Which collection does not allow duplicate elements?", options: ["List", "Set", "ArrayList", "Queue"], answer: 1 },
  { q: "Which operator is used for comparison of equality?", options: ["=", "==", "!=", "equals"], answer: 1 },
  { q: "Which access modifier makes a member visible everywhere?", options: ["private", "protected", "default", "public"], answer: 3 }
];

const ALL = "All exams";
const subjects = [ALL, ...new Set(exams.map(e => e.subject))];
const pad = n => String(n).padStart(2, "0");
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

function Brand({ children }) {
  return (
    <div className="brand">
      <div className="brand-mark"><GraduationCap size={22} /></div>
      <span>exam<span className="brand-accent">flow</span></span>
      {children}
    </div>
  );
}

/** Circular countdown: the ring drains as time runs out. */
function TimerPill({ seconds, total }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const fraction = total > 0 ? Math.max(0, seconds / total) : 0;
  const state = seconds < 60 ? "critical" : seconds < 300 ? "warning" : "ok";
  const time = `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

  return (
    <div className={`timer timer-${state}`} role="timer" aria-label={`Time remaining ${time}`}>
      <svg viewBox="0 0 52 52" className="timer-ring" aria-hidden="true">
        <circle className="timer-track" cx="26" cy="26" r={radius} />
        <circle
          className="timer-progress" cx="26" cy="26" r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
        />
      </svg>
      <div className="timer-text">
        <small>Time remaining</small>
        <b>{time}</b>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

function App() {
  const [page, setPage] = useState("exams");
  const [selectedExam, setSelectedExam] = useState(exams[0]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(ALL);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(30 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const filtered = useMemo(() => exams.filter(e =>
    (filter === ALL || e.subject === filter) &&
    (e.title.toLowerCase().includes(query.toLowerCase()) || e.subject.toLowerCase().includes(query.toLowerCase()))
  ), [query, filter]);

  useEffect(() => {
    if (page !== "exam" || submitted) return;
    const timer = setInterval(() => setSeconds(s => {
      if (s <= 1) { clearInterval(timer); setSubmitted(true); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [page, submitted]);

  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = e => e.key === "Escape" && setConfirmOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen]);

  const startExam = (exam) => {
    setSelectedExam(exam); setAnswers({}); setCurrent(0);
    setSeconds(exam.duration * 60); setSubmitted(false); setConfirmOpen(false); setPage("exam");
  };
  const finishExam = () => { setConfirmOpen(false); setSubmitted(true); };
  const clearFilters = () => { setQuery(""); setFilter(ALL); };
  const answeredCount = Object.keys(answers).length;
  const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);

  /* ---------------- Start Exam (distraction-free CBT) ---------------- */
  if (page === "exam") {
    const isLast = current === questions.length - 1;
    const remaining = questions.length - answeredCount;

    return (
      <div className="exam-shell">
        <header className="exam-bar">
          <div className="exam-bar-left">
            {!submitted && (
              <button className="back-link" onClick={() => setPage("exams")} aria-label="Back to exams">
                <ArrowLeft size={18} /><span>Back to exams</span>
              </button>
            )}
            {submitted ? <Brand /> : (
              <div className="exam-bar-title">
                <h1>{selectedExam.title}</h1>
                <p><span className="live-dot" /> Live examination <span className="sep">/</span> <span className="exam-marks">{selectedExam.marks} marks</span></p>
              </div>
            )}
          </div>
          {!submitted && (
            <>
              <div className="student-chip"><div className="avatar">{STUDENT.initial}</div><span>{STUDENT.name}</span></div>
              <TimerPill seconds={seconds} total={selectedExam.duration * 60} />
            </>
          )}
        </header>

        {!submitted ? (
          <>
            <div className="exam-progress" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answeredCount} aria-label="Answered questions">
              <i style={{ width: `${answeredCount / questions.length * 100}%` }} />
            </div>

            <div className="exam-body">
              <section className="question-card" aria-labelledby="question-text">
                <div className="question-head">
                  <span className="question-number">Question {pad(current + 1)}<span> of {pad(questions.length)}</span></span>
                  <span className="mark-chip">1 mark</span>
                </div>

                <h2 id="question-text">{questions[current].q}</h2>
                <p className="choose-label">Select one correct answer</p>

                <div className="options-list" role="radiogroup" aria-labelledby="question-text">
                  {questions[current].options.map((option, i) => {
                    const selected = answers[current] === i;
                    return (
                      <button
                        key={option} type="button" role="radio" aria-checked={selected}
                        className={`option ${selected ? "selected" : ""}`}
                        onClick={() => setAnswers(prev => ({ ...prev, [current]: i }))}
                      >
                        <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                        <span className="option-text">{option}</span>
                        <Check size={18} className="option-check" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>

                <div className="question-footer">
                  <button className="secondary-button" disabled={current === 0} onClick={() => setCurrent(v => v - 1)}>
                    <ArrowLeft size={17} /> Previous
                  </button>
                  <span className="footer-count">{pad(current + 1)} / {pad(questions.length)}</span>
                  <button className="primary-button" onClick={() => isLast ? setConfirmOpen(true) : setCurrent(v => v + 1)}>
                    {isLast ? "Finish exam" : "Save & next"} <ArrowRight size={17} />
                  </button>
                </div>
              </section>

              <aside className="palette-card" aria-label="Question palette">
                <div className="palette-heading">
                  <h3>Question palette</h3>
                  <p>Jump to any question</p>
                </div>

                <div className="palette-grid">
                  {questions.map((_, i) => {
                    const isAnswered = answers[i] !== undefined;
                    const isCurrent = current === i;
                    return (
                      <button
                        key={i} type="button"
                        aria-current={isCurrent ? "true" : undefined}
                        aria-label={`Question ${i + 1}, ${isAnswered ? "answered" : "not answered"}${isCurrent ? ", current" : ""}`}
                        onClick={() => setCurrent(i)}
                        className={`${isCurrent ? "current" : ""} ${isAnswered ? "answered" : ""}`}
                      >
                        {pad(i + 1)}
                      </button>
                    );
                  })}
                </div>

                <div className="legend">
                  <span><i className="legend-answered" /> Answered</span>
                  <span><i className="legend-current" /> Current</span>
                  <span><i className="legend-unanswered" /> Not answered</span>
                </div>

                <div className="palette-summary">
                  <div><b>{answeredCount}</b><span>Answered</span></div>
                  <div><b>{remaining}</b><span>Remaining</span></div>
                </div>

                <button className="submit-button" onClick={() => setConfirmOpen(true)}>
                  <CheckCircle2 size={18} /> Submit examination
                </button>
                <p className="submit-hint">You can review your answers before submitting.</p>
              </aside>
            </div>

            <div className="exam-bottom-note"><ShieldCheck size={16} /> Your progress is saved locally in this demo while you answer.</div>

            {confirmOpen && (
              <div className="modal-backdrop" onClick={() => setConfirmOpen(false)}>
                <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={e => e.stopPropagation()}>
                  <div className="modal-icon"><CheckCircle2 size={26} /></div>
                  <h2 id="confirm-title">Submit your examination?</h2>
                  <p>
                    {remaining > 0
                      ? `You have ${remaining} unanswered ${remaining === 1 ? "question" : "questions"}. Once submitted, you can’t change your answers.`
                      : "You’ve answered every question. Once submitted, you can’t change your answers."}
                  </p>
                  <div className="modal-stats">
                    <div><b>{answeredCount}</b><span>Answered</span></div>
                    <div><b>{remaining}</b><span>Unanswered</span></div>
                  </div>
                  <div className="modal-actions">
                    <button className="secondary-button" autoFocus onClick={() => setConfirmOpen(false)}>Keep reviewing</button>
                    <button className="submit-button" onClick={finishExam}>Submit now</button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="result-wrap">
            <div className="result-card">
              <div className="result-icon"><CheckCircle2 size={40} /></div>
              <h1>{seconds === 0 ? "Time is up!" : `Well done, ${STUDENT.name}!`}</h1>
              <p>Your demo examination has been submitted.</p>
              <div className="score-circle"><strong>{score}</strong><span>out of {questions.length}</span></div>
              <div className="result-stats">
                <div><b>{answeredCount}</b><span>Answered</span></div>
                <div><b>{questions.length - answeredCount}</b><span>Unanswered</span></div>
                <div><b>{Math.round(score / questions.length * 100)}%</b><span>Score</span></div>
              </div>
              <button className="primary-button" onClick={() => setPage("exams")}>Return to available exams <ArrowRight size={17} /></button>
              <p className="demo-disclaimer">Demo mode: answers are evaluated in your browser. No result is sent to a server.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------------- Available Exams (dashboard) ---------------- */
  return (
    <div className="app-shell">
      {mobileMenu && <div className="drawer-backdrop" onClick={() => setMobileMenu(false)} />}
      <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
        <Brand>
          <button className="mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18} /></button>
        </Brand>
        <div className="workspace-label">Student workspace</div>
        <nav className="side-nav">
          <button className="nav-item active" aria-current="page" onClick={() => setMobileMenu(false)}><LayoutDashboard size={18} />Available Exams</button>
          <button className="nav-item" onClick={() => { setFilter(ALL); setMobileMenu(false); }}><BookOpen size={18} />My Learning</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={18} /></div>
            <b>Need help?</b>
            <p>Have questions about your examination?</p>
            <button onClick={() => alert("Please contact your examination coordinator.")}>Get support <ArrowRight size={14} /></button>
          </div>
          <div className="profile-mini">
            <div className="avatar">{STUDENT.initial}</div>
            <div className="profile-text"><b>{STUDENT.name}</b><span>Student account</span></div>
            <ChevronDown size={16} className="muted" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu /></button>
          <div className="breadcrumb">Student Portal <span>/</span> <b>Available Exams</b></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Search"><Search size={18} /></button>
            <button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button>
            <div className="top-avatar">{STUDENT.initial}</div>
          </div>
        </header>

        <section className="content-wrap">
          <div className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={14} /> Your learning space</div>
              <h1>{greeting()}, {STUDENT.name}</h1>
              <p className="subheading">Ready to challenge yourself? Pick an exam and do your best.</p>
            </div>

            <div className="hero-bubbles" aria-hidden="true">
              {[1, 3, 0, 2].map((filledIndex, row) => (
                <div className="bubble-row" key={row}>
                  {["A", "B", "C", "D"].map((letter, i) => (
                    <span key={letter} className={i === filledIndex ? "filled" : ""}>{letter}</span>
                  ))}
                </div>
              ))}
            </div>

            <div className="hero-stats">
              <div className="hero-stat"><div className="stat-icon"><FileText size={18} /></div><div><strong>{pad(exams.length)}</strong><span>Available exams</span></div></div>
              <div className="hero-stat"><div className="stat-icon"><CheckCircle2 size={18} /></div><div><strong>08</strong><span>Exams completed</span></div></div>
              <div className="hero-stat"><div className="stat-icon"><Clock3 size={18} /></div><div><strong>5.5h</strong><span>Time invested</span></div></div>
            </div>
          </div>

          <div className="section-heading">
            <div><h2>Explore examinations</h2><p>Choose from the exams currently available to you.</p></div>
            <div className="exam-count"><span className="live-dot" /> {filtered.length} {filtered.length === 1 ? "exam" : "exams"} available</div>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <Search size={18} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search exams or subjects" aria-label="Search exams or subjects" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}
            </label>
            <div className="filter-chips" role="group" aria-label="Filter by subject">
              {subjects.map(subject => (
                <button
                  key={subject} type="button"
                  className={`chip ${filter === subject ? "active" : ""}`}
                  aria-pressed={filter === subject}
                  onClick={() => setFilter(subject)}
                >
                  {subject}
                  <span>{subject === ALL ? exams.length : exams.filter(e => e.subject === subject).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="exam-grid">
            {filtered.map(exam => {
              const Icon = exam.icon;
              return (
                <article className="exam-card" key={exam.id}>
                  <div className="card-top">
                    <div className={`subject-icon ${exam.color}`}><Icon size={22} /></div>
                    <span className="available-pill"><i /> Available</span>
                  </div>
                  <div className="exam-meta">{exam.subject} <span>/</span> {exam.level}</div>
                  <h3>{exam.title}</h3>
                  <p className="exam-description">{exam.description}</p>
                  <div className="exam-details">
                    <div><FileText size={16} /><b>{exam.questions}</b><span>Questions</span></div>
                    <div><Timer size={16} /><b>{exam.duration} min</b><span>Duration</span></div>
                    <div><CheckCircle2 size={16} /><b>{exam.marks}</b><span>Total marks</span></div>
                  </div>
                  <button className="start-button" onClick={() => startExam(exam)}>
                    Start examination <ArrowRight size={17} />
                  </button>
                </article>
              );
            })}
            {filtered.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon"><SearchX size={26} /></div>
                <b>No exams match your search</b>
                <p>Try a different keyword or clear your filters.</p>
                <button className="secondary-button" onClick={clearFilters}>Clear filters</button>
              </div>
            )}
          </div>

          <div className="notice-bar"><ShieldCheck size={18} /><span><b>Before you begin:</b> Make sure you have a stable internet connection and enough time to complete your exam.</span></div>
          <footer className="footer">© 2026 ExamFlow Student Portal <span>Need assistance? Contact your exam administrator.</span></footer>
        </section>
      </main>
    </div>
  );
}

export default App;
