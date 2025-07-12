import "@uiw/react-md-editor/dist/mdeditor.css"; 
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setSubmitting(true);
    const user = auth.currentUser;
    console.log("Current Firebase user:", user);
    if (!user) {
      alert("You must be logged in to ask a question.");
      setSubmitting(false);
      return;
    }
    const author = user.displayName || user.email || "User";
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const questionObj = {
      title,
      description,
      tags: tagsArray,
      author,
    };
    console.log("Submitting question:", questionObj);
    const { error } = await supabase.from("questions").insert([questionObj]);
    setSubmitting(false);
    if (error) {
      alert("Error submitting question: " + error.message);
      return;
    }
    navigate("/?page=1");
  };

  return (
    <div className="ask-question-container">
      <h1>Ask a Question</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={submitting}
          />
        </div>
        <button type="submit" disabled={submitting || !title.trim() || !description.trim()}>
          {submitting ? "Submitting..." : "Submit Question"}
        </button>
      </form>
    </div>
  );
};

export default AskQuestion; 