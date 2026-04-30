import { useReducer, useEffect } from "react";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";

const initialState = {
  articles: [],
  message: "",
  loading: true,
  error: "",
  savedUrls: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FEED":
      return {
        ...state,
        articles: action.articles,
        message: action.message,
        savedUrls: action.savedUrls,
        loading: false,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case "SAVE_ARTICLE":
      return {
        ...state,
        savedUrls: [...state.savedUrls, action.url],
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

export default function Feed({ user, isLoggedIn }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function loadFeed() {
      try {
        const [feedRes, savedRes] = await Promise.all([
          fetch("/api/feed"),
          fetch("/api/saved"),
        ]);

        const feedData = await feedRes.json();
        const savedData = await savedRes.json();

        if (!feedRes.ok) {
          dispatch({ type: "SET_ERROR", error: feedData.error || "Uh-oh. We failed to load your feed." });
        } else {
          dispatch({
            type: "SET_FEED",
            articles: feedData.articles,
            message: feedData.message || "",
            savedUrls: savedData.map((article) => article.url),
          });
        }
      } catch (err) {
        dispatch({ type: "SET_ERROR", error: "Something doesn't look right." });
      }
    }
    loadFeed();
  }, []);

  async function handleSave(article) {
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          url: article.url,
          imageUrl: article.urlToImage,
          sourceName: article.source?.name,
          publishedAt: article.publishedAt,
        }),
      });
      if (res.ok) {
        dispatch({ type: "SAVE_ARTICLE", url: article.url });
      }
    } catch (err) {
      console.error("Error saving article:", err);
    }
  }

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} username={user.username} />

      <main>
        <h1>Your NEWS Feed</h1>

        {state.loading && <p>Loading...</p>}
        {state.error && <p>{state.error}</p>}
        {!state.loading && !state.error && state.articles.length === 0 && (
          <p>
            {state.message || "We can't find anything."}{" "}
            <Link href="/preferences">Update your article preferences.</Link>
          </p>
        )}

        <ul>
          {state.articles.map((article) => (
            <li key={article.url}>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h2>{article.title}</h2>
              </a>
              <p>{article.source?.name}</p>
              <p>{article.description}</p>
              <p>{new Date(article.publishedAt).toLocaleDateString()}</p>
              <button
                onClick={() => handleSave(article)}
                disabled={state.savedUrls.includes(article.url)}
              >
                {state.savedUrls.includes(article.url) ? "Saved" : "Save"}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}