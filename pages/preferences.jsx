import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
      const user = req.session.user;
      if (!user) {
        return {
          redirect: { destination: "/login", permanent: false },
        };
      }
      return {
        props: { user, isLoggedIn: true },
      };
    },
    sessionOptions
  );

  const AVAILABLE_TOPICS = [
    "test",
  ];

  export default function Preferences({ user, isLoggedIn }) {
    const [topics, setTopics] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [sources, setSources] = useState([]);
    const [kewordInput, setKeywordInput] = useState("");
    const [sourceInput, setSourceInput] = useState("");
    const [status, setStatus] = useState("");

    function toggleTopic(topic) {
        setTopics((prev) =>
            prev.includes(topic) 
        ? prev.filter((t) => t !== topic) : [...prev, topic]
        );
    }
    
    function addKeyword() {
        const trimmed = keywordsInput.trim();
        if (!trimmed || keywords.includes (trimmed)) return;
        setKeywords((prev) => [...prev, trimmed]);
        setKeywordInput("");
    }
    
    function removeKeyword(kw) {
        setKeywords((prev) => prev.filter((k) => k !== kw));
    }
    function addSource() {
        const trimmed = sourceInput.trim();
        if (!trimmed || sources.includes(trimmed)) return;
        setSources((prev) => [...prev, trimmed]);
        setSourceInput("");
      }
     
      function removeSource(src) {
        setSources((prev) => prev.filter((s) => s !== src));
      }
     
      async function handleSave() {
        setStatus("");
        try {
          const res = await fetch("/api/preferences", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ topics, keywords, sources }),
          });
          if (res.ok) {
            setStatus("Preferences saved!");
          } else {
            const { error } = await res.json();
            setStatus(`Error: ${error}`);
          }
        } catch (err) {
          setStatus("Something went wrong.");
        }
      }
}


  return (
    <div className="preferences-page">
      <Header isLoggedIn={isLoggedIn} username={user.username} />
 
      <main className="preferences-main">
        <h1 className="preferences-title">Your Preferences</h1>
 
        <section className="preferences-section">
          <h2 className="preferences-section-title">Topics</h2>
          <div className="topics-list">
            {AVAILABLE_TOPICS.map((topic) => (
              <label key={topic} className="topic-label">
                <input
                  className="topic-checkbox"
                  type="checkbox"
                  checked={topics.includes(topic)}
                  onChange={() => toggleTopic(topic)}
                />
                {topic}
              </label>
            ))}
          </div>
        </section>


            <section className="preferences-section">
          <h2 className="preferences-section-title">Keywords</h2>
          <div className="input-row">
            <input
              className="preferences-input"
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, addKeyword)}
              placeholder="e.g. artificial intelligence"
            />
            <button className="add-btn" onClick={addKeyword}>Add</button>
          </div>
          <ul className="tag-list">
            {keywords.map((kw) => (
              <li key={kw} className="tag-item">
                {kw}
                <button className="remove-btn" onClick={() => removeKeyword(kw)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>
 
        <section className="preferences-section">
          <h2 className="preferences-section-title">Sources</h2>
          <div className="input-row">
            <input
              className="preferences-input"
              type="text"
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, addSource)}
              placeholder="e.g. bbc-news"
            />
            <button className="add-btn" onClick={addSource}>Add</button>
          </div>
          <ul className="tag-list">
            {sources.map((src) => (
              <li key={src} className="tag-item">
                {src}
                <button className="remove-btn" onClick={() => removeSource(src)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>
 
      <button className="save-btn" onClick={handleSave}>Save Preferences</button>
      {status && <p className="status-message">{status}</p>}
      </main>
    </div>
  );
}