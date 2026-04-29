import { useState } from "react";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import sessionsOptions from "../config/session";
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

  const AVAILABLE_TOPICS = [
    "test",
  ]


  return (
    <div>
        <Header isLoggedIn={isLoggedIn} username={user.username} />

        <main>
            <h1>Your Preferences</h1>

            <section>
                <p>TOPICS</p>
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
        </main>
    </div>
  )