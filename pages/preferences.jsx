import { useReducer } from "react";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";

const initialState = {
  topics: [],
  keywords: [],
  sources: [],
  keywordInput: "",
  sourceInput: "",
  status: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_TOPIC":
      return {
        ...state,
        topics: state.topics.includes(action.topic)
          ? state.topics.filter((t) => t !== action.topic)
          : [...state.topics, action.topic],
      };
    case "ADD_TAG":
      return {
        ...state,
        [action.list]: [...state[action.list], action.value],
        [action.input]: "",
      };
    case "REMOVE_TAG":
      return {
        ...state,
        [action.list]: state[action.list].filter((item) => item !== action.value),
      };
    case "SET_INPUT":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_STATUS":
      return {
        ...state,
        status: action.status,
      };
    default:
      return state;
  }
}

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
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleKeyPress(e, callback) {
    if (e.key === "Enter") callback();
  }

  function addTag(list, input, value) {
    const trimmed = value.trim();
    if (!trimmed || state[list].includes(trimmed)) return;
    dispatch({ type: "ADD_TAG", list, input, value: trimmed });
  }

  function removeTag(list, value) {
    dispatch({ type: "REMOVE_TAG", list, value });
  }

  async function handleSave() {
    dispatch({ type: "SET_STATUS", status: "" });
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topics: state.topics,
          keywords: state.keywords,
          sources: state.sources,
        }),
      });
      if (res.ok) {
        dispatch({ type: "SET_STATUS", status: "Preferences saved!" });
      } else {
        const { error } = await res.json();
        dispatch({ type: "SET_STATUS", status: `Error: ${error}` });
      }
    } catch (err) {
      dispatch({ type: "SET_STATUS", status: "Uh-oh...Something went wrong." });
    }
  }

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} username={user.username} />

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
                  onChange={() => dispatch({ type: "TOGGLE_TOPIC", topic })}
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
              onChange={(e) => dispatch({ type: "SET_INPUT", field: "keywordInput", value: e.target.value })}
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
              onChange={(e) => dispatch({ type: "SET_INPUT", field: "sourceInput", value: e.target.value })}
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