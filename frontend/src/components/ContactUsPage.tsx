import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactUsPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="landing" />
      <section className="py-16 bg-muted/30 flex-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Have a question or need help? Send us a message and we’ll get back to you.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {isSubmitted && (
              <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Name</label>
                    <input id="name" name="name" value={form.name} onChange={handleChange} required className="w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your Name" />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required className="w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@example.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">Subject</label>
                    <input id="subject" name="subject" value={form.subject} onChange={handleChange} required className="w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="How can we help?" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">Message</label>
                    <textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={5} className="w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Write your message here..." />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#153074]">
                      <Send className="w-4 h-4" />
                      {isSubmitting ? "Sending..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactUsPage;

