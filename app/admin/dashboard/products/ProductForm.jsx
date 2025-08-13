"use client";
import { useState } from "react";

export default function ProductForm({ initialData }) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      category: "",
      price: "",
      stock: "",
      image: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit logic
    alert("Product saved (dummy)");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-border rounded-2xl p-8 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-6 text-text-primary">
        {initialData ? "Edit Product" : "Add Product"}
      </h2>
      <div className="mb-4">
        <label className="block mb-1 text-text-secondary">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-text-secondary">Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-text-secondary">Price</label>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-text-secondary">Stock</label>
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1 text-text-secondary">Image URL</label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition"
      >
        Save Product
      </button>
    </form>
  );
}