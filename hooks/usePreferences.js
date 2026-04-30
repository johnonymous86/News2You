import { useReducer, useEffect } from "react";

const initialState = {
  topics: [],
  keywords: [],
  sources: [],
  keywordInput: "",
  sourceInput: "",
  status: "",
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_PREFERENCES":
      return {
        ...state,
        topics: action.topics,
        keywords: action.keywords,
        sources: action.sources,
        loading: false,
      };
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

export default function usePreferences() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch("/api/preferences");
        const data = await res.json();
        dispatch({
          type: "LOAD_PREFERENCES",
          topics: data.topics || [],
          keywords: data.keywords || [],
          sources: data.sources || [],
        });
      } catch (err) {
        dispatch({ type: "LOAD_PREFERENCES", topics: [], keywords: [], sources: [] });
      }
    }
    loadPreferences();
  }, []);

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

  function toggleTopic(topic) {
    dispatch({ type: "TOGGLE_TOPIC", topic });
  }

  function setInput(field, value) {
    dispatch({ type: "SET_INPUT", field, value });
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
      dispatch({ type: "SET_STATUS", status: "Something went wrong." });
    }
  }

  return {
    state,
    toggleTopic,
    addTag,
    removeTag,
    setInput,
    handleKeyPress,
    handleSave,
  };
}