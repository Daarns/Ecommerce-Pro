"use client";
import Link from "next/link";
import { featuredProducts } from "@/app/data/dummy-data";
import { Plus } from "lucide-react";

export default function ProductList() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">All Products</h1>
      </div>
      <div className="bg-surface border border-border rounded-2xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-text-secondary border-b border-border">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Seller</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Moderation</th>
            </tr>
          </thead>
          <tbody>
            {featuredProducts.slice(0, 20).map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-surface-elevated transition">
                <td className="py-3 px-4 font-medium text-text-primary">{product.name}</td>
                <td className="py-3 px-4">{product.category}</td>
                <td className="py-3 px-4">{product.seller || "-"}</td>
                <td className="py-3 px-4">Rp {product.price.toLocaleString('id-ID')}</td>
                <td className="py-3 px-4">{product.stock}</td>
                <td className="py-3 px-4">
                  {product.stock > 0 ? (
                    <span className="inline-block px-3 py-1 rounded-full bg-success text-white text-xs font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full bg-error text-white text-xs font-semibold">
                      Out of Stock
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {/* Contoh tombol moderasi */}
                  <button className="px-3 py-1 rounded bg-primary text-white text-xs mr-2">Approve</button>
                  <button className="px-3 py-1 rounded bg-error text-white text-xs">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}