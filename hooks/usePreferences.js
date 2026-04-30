import { useReducer, useEffect } from "react";
import { useRouter } from "next/router";

const initialState = {
  topics: [],
  keywords: [],
  sources: [],
  keywordInput: "",
  sourceInput: "",
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
    case "SET_INPUT":
      return { ...state, [action.field]: action.value };
    case "ADD_TAG":
      return {
        ...state,
        [action.list]: [...state[action.list], action.value],
        [action.inputField]: "",
      };
    case "REMOVE_TAG":
      return {
        ...state,
        [action.list]: state[action.list].filter((item) => item !== action.value),
      };
    default:
      return state;
  }
}

export default function usePreferences() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch("/api/preferences");
        const data = await res.json();
        dispatch({
          type: "LOAD_PREFERENCES",
          topics: data.topics,
          keywords: data.keywords,
          sources: data.sources,
        });
      } catch (err) {
        console.error("Error loading preferences:", err);
        dispatch({ type: "LOAD_PREFERENCES", topics: [], keywords: [], sources: [] });
      }
    }
    loadPreferences();
  }, []);

  function addKeyword() {
    const trimmed = state.keywordInput.trim();
    if (!trimmed || state.keywords.includes(trimmed)) return;
    dispatch({ type: "ADD_TAG", list: "keywords", inputField: "keywordInput", value: trimmed });
  }

  function removeKeyword(value) {
    dispatch({ type: "REMOVE_TAG", list: "keywords", value });
  }

  function addSource() {
    const trimmed = state.sourceInput.trim();
    if (!trimmed || state.sources.includes(trimmed)) return;
    dispatch({ type: "ADD_TAG", list: "sources", inputField: "sourceInput", value: trimmed });
  }

  function removeSource(value) {
    dispatch({ type: "REMOVE_TAG", list: "sources", value });
  }

  function toggleTopic(topic) {
    dispatch({ type: "TOGGLE_TOPIC", topic });
  }

  function setKeywordInput(value) {
    dispatch({ type: "SET_INPUT", field: "keywordInput", value });
  }

  function setSourceInput(value) {
    dispatch({ type: "SET_INPUT", field: "sourceInput", value });
  }

  async function handleSave() {
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
        router.push("/feed");
      } else {
        console.error("Error saving preferences:", await res.json());
      }
    } catch (err) {
      console.error("Error saving preferences:", err);
    }
  }

  return {
    state,
    toggleTopic,
    addKeyword,
    removeKeyword,
    addSource,
    removeSource,
    setKeywordInput,
    setSourceInput,
    handleSave,
  };
}