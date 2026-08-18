"use client";

import { useState, useEffect } from "react";

interface Turf {
  _id: string;
  turfName: string;
  location: string;
  sportType: string;
  contact: string;
}

export default function Home() {
  const [form, setForm] = useState({
    turfName: "",
    location: "",
    sportType: "",
    contact: "",
  });

  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const API = "http://localhost:5000";

  const fetchTurfs = async () => {
    try {
      const res = await fetch(`${API}/turfs`);
      const data = await res.json();
      setTurfs(data);
    } catch (err) {
      console.log("Error fetching turfs:", err);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API}/turfs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setEditingId(null);
      } else {
        await fetch(`${API}/turfs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setForm({ turfName: "", location: "", sportType: "", contact: "" });
      fetchTurfs();
    } catch (err) {
      console.log("Error saving turf:", err);
    }
  };

  const handleEdit = (turf: Turf) => {
    setEditingId(turf._id);
    setForm({
      turfName: turf.turfName,
      location: turf.location,
      sportType: turf.sportType,
      contact: turf.contact,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ turfName: "", location: "", sportType: "", contact: "" });
  };

  

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/turfs/${id}`, { method: "DELETE" });
      fetchTurfs();
    } catch (err) {
      console.log("Error deleting turf:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">

      <nav className="bg-green-700 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-bold">TurfBooking</h1>
        </div>
      </nav>

      <section className="px-6 py-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800">Book Your Turf</h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Find the perfect turf for football, cricket and other sports and book
          your slot easily.
        </p>
      </section>

      <section className="flex justify-center px-4 pb-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white rounded-lg shadow p-8 space-y-5"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            {editingId ? "Edit Turf" : "Register a Turf"}
          </h3>

          <div>
            <label htmlFor="turfName" className="block text-sm font-medium text-gray-700 mb-1">
              Turf Name
            </label>
            <input
              id="turfName"
              name="turfName"
              type="text"
              required
              placeholder="e.g. Green Arena"
              value={form.turfName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              placeholder="e.g.S G palya, Bangalore"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="sportType" className="block text-sm font-medium text-gray-700 mb-1">
              Sport Type
            </label>
            <select
              id="sportType"
              name="sportType"
              required
              value={form.sportType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:border-green-500"
            >
              <option value="" disabled>Select a sport</option>
              <option value="Football">Football</option>
              <option value="Cricket">Cricket</option>
              <option value="Badminton">Badminton</option>
              <option value="Tennis">Tennis</option>
              <option value="Basketball">Basketball</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              id="contact"
              name="contact"
              type="tel"
              required
              placeholder="e.g. 98765 43210"
              value={form.contact}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            className={`w-full rounded px-4 py-2 font-semibold text-white ${
              editingId
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {editingId ? "Update Turf" : "Register Turf"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full rounded bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="px-4 pb-12 mx-auto w-full max-w-4xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Registered Turfs</h3>
        {turfs.length === 0 ? (
          <p className="text-gray-500">No turfs registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow text-left">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-4 py-3">Turf Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Sport</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {turfs.map((turf) => (
                  <tr key={turf._id} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-gray-800">{turf.turfName}</td>
                    <td className="px-4 py-3 text-gray-800">{turf.location}</td>
                    <td className="px-4 py-3 text-gray-800">{turf.sportType}</td>
                    <td className="px-4 py-3 text-gray-800">{turf.contact}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(turf)}
                        className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(turf._id)}
                        className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="bg-gray-800 px-6 py-6 text-center text-white mt-auto">
        <p>TurfBooking System. All rights reserved.</p>
      </footer>

    </main>
  );
}