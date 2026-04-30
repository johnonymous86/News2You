import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import Nav from "../components/nav";
import usePreferences from "../hooks/usePreferences";

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
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];

export default function Preferences({ user, isLoggedIn }) {
  const {
    state,
    toggleTopic,
    addTag,
    removeTag,
    setInput,
    handleKeyPress,
    handleSave,
  } = usePreferences();

  if (state.loading) return <p>Loading...</p>;

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} username={user.username} />
      <Nav />

      <main>
        <h1>Your Preferences</h1>

        <section>
          <h2>Topics</h2>
          <div>
            {AVAILABLE_TOPICS.map((topic) => (
              <label key={topic}>
                <input
                  type="checkbox"
                  checked={state.topics.includes(topic)}
                  onChange={() => toggleTopic(topic)}
                />
                {topic}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2>Keywords</h2>
          <div>
            <input
              type="text"
              value={state.keywordInput}
              onChange={(e) => setInput("keywordInput", e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, () => addTag("keywords", "keywordInput", state.keywordInput))}
              placeholder="e.g. artificial intelligence"
            />
            <button onClick={() => addTag("keywords", "keywordInput", state.keywordInput)}>Add</button>
          </div>
          <ul>
            {state.keywords.map((kw) => (
              <li key={kw}>
                {kw}
                <button onClick={() => removeTag("keywords", kw)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Sources</h2>
          <div>
            <input
              type="text"
              value={state.sourceInput}
              onChange={(e) => setInput("sourceInput", e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, () => addTag("sources", "sourceInput", state.sourceInput))}
              placeholder="e.g. bbc-news"
            />
            <button onClick={() => addTag("sources", "sourceInput", state.sourceInput)}>Add</button>
          </div>
          <ul>
            {state.sources.map((src) => (
              <li key={src}>
                {src}
                <button onClick={() => removeTag("sources", src)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>

        <button onClick={handleSave}>Save Preferences</button>
        {state.status && <p>{state.status}</p>}
      </main>
    </div>
  );
}