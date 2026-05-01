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
    addKeyword,
    removeKeyword,
    addSource,
    removeSource,
    setKeywordInput,
    setSourceInput,
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
          <h2>Select a topic below</h2>
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
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => handleKeyPress()(e, addKeyword)}
              placeholder="World Events, etc."
            />
            <button onClick={addKeyword}>Add</button>
          </div>
          <ul>
            {state.keywords.map((kw) => (
              <li key={kw}>
                {kw}
                <button onClick={() => removeKeyword(kw)}>Remove</button>
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
              onChange={(e) => setSourceInput(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, addSource)}
              placeholder="CNN, etc."
            />
            <button onClick={addSource}>Add</button>
          </div>
          <ul>
            {state.sources.map((src) => (
              <li key={src}>
                {src}
                <button onClick={() => removeSource(src)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>

        <button onClick={handleSave}>Save Preferences</button>
      </main>
    </div>
  );
}