import { useEffect, useState, type FormEvent } from "react";
import { ArrowUp, Clock3, Sparkles } from "lucide-react";
import { GeneratedSurface, type UiDecision } from "./generative-ui/registry";
import "./App.css";

const initialPrompt = "what time is it";

function App() {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [decision, setDecision] = useState<UiDecision | null>(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState("");

  async function generateInterface(value: string) {
    const cleanedPrompt = value.trim();
    if (!cleanedPrompt) return;

    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: cleanedPrompt }),
      });

      if (!response.ok)
        throw new Error("The decision service could not answer.");
      setDecision((await response.json()) as UiDecision);
    } catch {
      setError(
        "Could not reach the decision service. Check that the app server is running.",
      );
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void generateInterface(prompt);
  }

  useEffect(() => {
    let active = true;
    fetch("/api/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: initialPrompt }),
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("The decision service could not answer.");
        return (await response.json()) as UiDecision;
      })
      .then((result) => {
        if (active) setDecision(result);
      })
      .catch(() => {
        if (active)
          setError(
            "Could not reach the decision service. Check that the app server is running.",
          );
      })
      .finally(() => {
        if (active) setPending(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Jev UI home">
          <span className="wordmark-mark">
            <Clock3 size={17} strokeWidth={2.2} />
          </span>
          <span>
            jev<span className="wordmark-light">/ui</span>
          </span>
        </a>
        <div className="topbar-meta">
          <span className="signal-dot" />
          SYSTEM ONE INTERFACE LAB
        </div>
        <span className="edition">
          FIELD NOTE <b>001</b>
        </span>
      </header>

      <section className="workbench" id="home">
        <div className="section-kicker">
          <span>01</span>
          <span className="kicker-line" />A QUESTION, MADE VISIBLE
        </div>
        <div className="prompt-row">
          <h1>
            What should
            <br />
            this feel like?
          </h1>
          <form className="prompt-form" onSubmit={handleSubmit}>
            <label htmlFor="prompt">YOUR PROMPT</label>
            <div className="prompt-control">
              <input
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask for an interface..."
                maxLength={300}
              />
              <button
                type="submit"
                disabled={pending || !prompt.trim()}
                aria-label="Generate interface"
                title="Generate interface"
              >
                <ArrowUp size={19} />
              </button>
            </div>
            <div className="prompt-foot">
              <Sparkles size={13} /> JEV MAKES A DECISION. YOUR CODE RENDERS IT.
            </div>
          </form>
        </div>

        <div className="result-heading">
          <div>
            <span className="result-index">02</span>
            <h2>Generated surface</h2>
          </div>
          <div className="result-state">
            {pending ? (
              <>
                <span className="pulse-dot" /> THINKING
              </>
            ) : decision ? (
              <>
                <span className={`source-dot ${decision.source}`} />{" "}
                {decision.source === "jev" ? "JEV DECISION" : "LOCAL DEMO"}
              </>
            ) : (
              "AWAITING PROMPT"
            )}
          </div>
        </div>

        <div
          className={`surface-frame ${pending ? "is-pending" : ""}`}
          aria-live="polite"
        >
          {pending && (
            <div className="loading-note">
              <span className="pulse-dot" />
              Choosing a component
            </div>
          )}
          {!pending && error && (
            <div className="empty-state">
              <h3>Couldn’t generate this view</h3>
              <p>{error}</p>
            </div>
          )}
          {!pending && !error && decision && (
            <GeneratedSurface decision={decision} />
          )}
          {!pending && !error && !decision && (
            <div className="empty-state">
              <h3>Your next prompt goes here.</h3>
              <p>
                Try asking for the time, then watch a small interface take
                shape.
              </p>
            </div>
          )}
        </div>

        <footer className="workbench-footer">
          <span>
            <span className="footer-mark">J</span> STRUCTURED DECISION{" "}
            <span className="footer-divider">/</span> REGISTERED COMPONENT
          </span>
          <span>NO GENERATED CODE. JUST A BETTER BRANCH.</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
