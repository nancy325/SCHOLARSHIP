import React, { useState } from "react";
import { LockKeyhole, MessageSquareText } from "lucide-react";

const SettingsPage = () => {
  const [feedback, setFeedback] = useState("");
  const [feedbackPreview, setFeedbackPreview] = useState("");

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackPreview(feedback.trim());
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Account</p>
        <h1 className="mt-1 text-3xl font-semibold text-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Security and support options for your student account.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground"><LockKeyhole className="h-5 w-5" /></span>
            <div>
              <h2 className="font-semibold text-foreground">Password</h2>
              <p className="text-sm text-muted-foreground">Account security</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">Password changes are not connected to the account service yet. This page will not change or store your password.</p>
          <span className="mt-5 inline-flex rounded-full bg-secondary/25 px-3 py-1 text-xs font-semibold text-foreground">Unavailable</span>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground"><MessageSquareText className="h-5 w-5" /></span>
            <div>
              <h2 className="font-semibold text-foreground">Feedback</h2>
              <p className="text-sm text-muted-foreground">Prepare a local preview</p>
            </div>
          </div>
          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            <label htmlFor="student-feedback" className="text-sm font-medium text-foreground">Your feedback</label>
            <textarea
              id="student-feedback"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
            <button type="submit" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Preview feedback</button>
          </form>
          {feedbackPreview && (
            <div role="status" className="mt-4 rounded-md border border-secondary/40 bg-secondary/10 p-3">
              <p className="text-xs font-semibold uppercase text-foreground">Local preview only; not sent</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{feedbackPreview}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;