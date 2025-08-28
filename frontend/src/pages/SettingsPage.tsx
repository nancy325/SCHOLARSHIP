import React, { useState } from "react";

const SettingsPage = () => {
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate password change
    setPassword("");
    alert("Password changed (simulated)");
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");
    alert("Feedback submitted (simulated)");
  };

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="max-w-xl w-full bg-white/90 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Settings</h2>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="flex gap-2">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={handlePasswordChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Change
            </button>
          </form>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-blue-800">Feedback</h3>
          <form onSubmit={handleFeedbackSubmit}>
            <textarea
              placeholder="Your feedback..."
              value={feedback}
              onChange={handleFeedbackChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
              rows={3}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;