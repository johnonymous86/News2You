import { useState, useEffect } from "react";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
 
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
  const [articles, setArticles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch("/api/feed");
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Uh-oh. We failed to load your feed.");
        } else {
          setArticles(data.articles);
          if (data.message) setMessage(data.message);
        }
      } catch (err) {
        setError("Something doesn't look right.");
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, []);
 
  return (
    <div>
      <Header isLoggedIn={isLoggedIn} username={user.username} />
 
      <main>
        <h1>Your NEWS Feed</h1>
 
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && articles.length === 0 && (
          <p>
            {message || "We can't find anything."}{" "}
            <Link href="/preferences">Update your preferences.</Link>
          </p>
        )}
 
        <ul>
          {articles.map((article) => (
            <li key={article.url}>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h2>{article.title}</h2>
              </a>
              <p>{article.source?.name}</p>
              <p>{article.description}</p>
              <p>{new Date(article.publishedAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
 