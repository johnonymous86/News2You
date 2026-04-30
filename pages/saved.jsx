import { withIronSessionSsr } from "iron-session/next";
 import sessionOptions from "../config/session";

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
   
   export default function Saved({ user, isLoggedIn }) {
     const [state, dispatch] = useReducer(reducer, initialState);
   
     useEffect(() => {
       async function loadSaved() {
         try {
           const res = await fetch("/api/saved");
           const data = await res.json();
           if (!res.ok) {
             dispatch({ type: "SET_ERROR", error: data.error || "Ooops...We can't load that article." });
           } else {
             dispatch({ type: "SET_ARTICLES", articles: data });
           }
         } catch (err) {
           dispatch({ type: "SET_ERROR", error: "Uh-oh. Something went wrong." });
         }
       }
       loadSaved();
     }, []);
   
     async function handleMarkRead(id) {
       try {
         const res = await fetch(`/api/saved/${id}`, { method: "PUT" });
         if (res.ok) {
           dispatch({ type: "MARK_READ", id });
         }
       } catch (err) {
         console.error("Error marking article as read:", err);
       }
     }
   
     async function handleRemove(id) {
       try {
         const res = await fetch(`/api/saved/${id}`, { method: "DELETE" });
         if (res.ok) {
           dispatch({ type: "REMOVE_ARTICLE", id });
         }
       } catch ((err) {
         console.error("We can't remove the article:", err);
       }
     }
 
     return (
         <div>
           <Header isLoggedIn={isLoggedIn} username={user.username} />
     
           <main>
             <h1>Your Saved Articles</h1>
     
             {state.loading && <p>Loading News2You...</p>}
             {state.error && <p>{state.error}</p>}
             {!state.loading && !state.error && state.articles.length === 0 && (
               <p>You don't have any saved articles...yet.</p>
             )}
     
             <ul>
               {state.articles.map((article) => (
                 <li key={article}>
                   <a href={article.url} target="_blank" rel="noopener noreferrer">
                     <h2>{article.title}</h2>
                   </a>
                   <p>{article.sourceName}</p>
                   <p>{new Date(article.publishedAt).toLocaleDateString()}</p>
                   <p>{article.isRead ? "Read" : "Unread"}</p>
                   {!article.isRead && (
                     <button onClick={() => handleMarkRead(article._id)}>
                       Already read
                      
                      </button>
                   )}
                   <button onClick={() => handleRemove(article._id)}>
                     Remove 
                   </button>
                 </li>
               ))}
             </ul>
           </main>
         </div>
       );
     }