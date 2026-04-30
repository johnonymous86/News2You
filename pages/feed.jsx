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
 
