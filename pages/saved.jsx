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