// src/App.js
import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api/recipes";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", ingredients: "", steps: "" });
  const [editingId, setEditingId] = useState(null);

  async function fetchRecipes() {
    const res = await fetch(API);
    const json = await res.json();
    setRecipes(json.data || []);
  }

  useEffect(() => { fetchRecipes(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      title: form.title,
      description: form.description,
      ingredients: form.ingredients ? form.ingredients.split("|").map(s => s.trim()) : [],
      steps: form.steps ? form.steps.split("|").map(s => s.trim()) : []
    };

    if (editingId) {
      await fetch(`${API}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      setEditingId(null);
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    }
    setForm({ title: "", description: "", ingredients: "", steps: "" });
    fetchRecipes();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this recipe?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchRecipes();
  }

  function startEdit(r) {
    setEditingId(r._id);
    setForm({
      title: r.title || "",
      description: r.description || "",
      ingredients: (r.ingredients || []).join(" | "),
      steps: (r.steps || []).join(" | ")
    });
    window.scrollTo(0,0);
  }

  return (
    <div style={{ maxWidth: 900, margin: "16px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Recipes</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
               placeholder="Title" required style={{width:"100%", padding:8, marginBottom:8}}/>
        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Description" style={{width:"100%", padding:8, marginBottom:8}}/>
        <input value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})}
               placeholder="Ingredients (separate with | )" style={{width:"100%", padding:8, marginBottom:8}}/>
        <input value={form.steps} onChange={e => setForm({...form, steps: e.target.value})}
               placeholder="Steps (separate with | )" style={{width:"100%", padding:8, marginBottom:8}}/>
        <button type="submit" style={{padding:"8px 12px"}}>
          {editingId ? "Update Recipe" : "Create Recipe"}
        </button>
        {editingId && <button type="button" onClick={()=>{setEditingId(null); setForm({title:"",description:"",ingredients:"",steps:""})}} style={{marginLeft:8}}>Cancel</button>}
      </form>

      <div>
        {recipes.length === 0 && <div>No recipes yet</div>}
        {recipes.map(r => (
          <div key={r._id} style={{border:"1px solid #ddd", padding:12, marginBottom:8}}>
            <h3 style={{margin:"0 0 6px 0"}}>{r.title}</h3>
            <div style={{fontSize:14, marginBottom:8}}>{r.description}</div>
            <div style={{fontSize:13, color:"#333"}}>
              <strong>Ingredients:</strong>
              <ul>{(r.ingredients||[]).map((i,idx)=><li key={idx}>{i}</li>)}</ul>
            </div>
            <div style={{fontSize:13, color:"#333"}}>
              <strong>Steps:</strong>
              <ol>{(r.steps||[]).map((s,idx)=><li key={idx}>{s}</li>)}</ol>
            </div>
            <div style={{marginTop:8}}>
              <button onClick={()=>startEdit(r)} style={{marginRight:8}}>Edit</button>
              <button onClick={()=>handleDelete(r._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
