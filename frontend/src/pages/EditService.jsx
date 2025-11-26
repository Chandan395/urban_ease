import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getToken } from "../utils/auth";

const API = "http://localhost:5000/api";

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Salon",
    "Painting",
    "Home Appliance Repair",
    "Pest Control",
    "Fitness & Yoga",
    "Gardening",
  ];

  useEffect(() => {
    async function loadService() {
      try {
        const res = await fetch(`${API}/services/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load");

        setTitle(data.title || "");
        setCategory(data.category || "");
        setDescription(data.description || "");
        setPrice(data.price || "");
        setImage(data.image || "");
      } catch (err) {
        toast.error("Failed to load service");
        console.log(err)
      }
    }

    loadService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login");
        setIsLoading(false);
        return;
      }

      let res;

      if (imageFile) {
        const fd = new FormData();
        fd.append("title", title);
        fd.append("category", category);
        fd.append("description", description);
        fd.append("price", price);
        fd.append("image", imageFile);

        res = await fetch(`${API}/services/${id}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      } else {
        res = await fetch(`${API}/services/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            category,
            description,
            price,
            image,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Service updated");
      navigate("/provider");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Service</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Service Title"
          required
        />

        <select
          className="w-full border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          className="w-full border p-2 rounded"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (₹)"
          required
        />

        <input
          className="w-full border p-2 rounded"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL (optional)"
        />

        <input
          type="file"
          className="w-full border p-2 rounded"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        {(image || imageFile) && (
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : image}
            alt="Preview"
            className="w-40 h-40 rounded-md object-cover border"
          />
        )}

        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Service Description"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
