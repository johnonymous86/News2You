import { withIronSessionSsr } from "iron-session/next";
 import sessionOptions from "../config/session";




const initialState = {
  articles: [],
  loading: true,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ARTICLES":
      return {
        ...state,
        articles: action.articles,
        loading: false,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case "MARK_READ":
      return {
        ...state,
        articles: state.articles.map((article) =>
          article._id === action.id ? { ...article, isRead: true } : article
        ),
      };
    case "REMOVE_ARTICLE":
      return {
        ...state,
        articles: state.articles.filter((article) => article._id !== action.id),
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