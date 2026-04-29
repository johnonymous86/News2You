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
            prev.includes(topic) ? prev.filter((t) => !== topic) : [...prev, topic]
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
    <div>
        <Header isLoggedIn={isLoggedIn} username={user.username} />

        <main>
            <h1>Your Preferences</h1>

            <section>
                <h2>TOPICS</h2>
                {AVAILABLE_TOPICS.map((topic) =>(
                    <label key={topic}>
                        <input
                        type="checkbox"
                        checked={topics.includes(topic)}
                        onChange={() => toggleTopic(topic)}
                        />
                        {topic}
                        </label>
                ))}
            </section>

            <section>
          <h2>Keywords</h2>
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            placeholder="e.g. artificial intelligence"
          />
          <button onClick={addKeyword}>Add</button>
          <ul>
            {keywords.map((kw) => (
              <li key={kw}>
                {kw} <button onClick={() => removeKeyword(kw)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>
 
        <section>
          <h2>Sources</h2>
          <input
            type="text"
            value={sourceInput}
            onChange={(e) => setSourceInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSource()}
            placeholder="e.g. bbc-news"
          />
          <button onClick={addSource}>Add</button>
          <ul>
            {sources.map((src) => (
              <li key={src}>
                {src} <button onClick={() => removeSource(src)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>
 
        <button onClick={handleSave}>Save Preferences</button>
        {status && <p>{status}</p>}
      </main>
    </div>
  );
}