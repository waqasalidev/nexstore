import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      return toast.error("All fields are required.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send message.");
      }

      toast.success("Your message has been sent successfully.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-hero flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col gap-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.3em] text-gold font-semibold"
          >
            Get In Touch
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-display"
          >
            Contact <span className="text-gradient-gold">NexStore</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm md:text-base leading-relaxed"
          >
            Have a question about our 3D viewers, custom orders, or shipping? Drop us a message and our support team will get back to you within 24 hours.
          </motion.p>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Side (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Contact Info Card */}
            <div className="glass rounded-3xl p-8 border border-white/5 space-y-6">
              <h2 className="text-xl font-bold text-gradient-gold">Support Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Feel free to reach out to us through any of our channels below. Our support hours are Monday to Friday, 9:00 AM — 6:00 PM EST.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold border border-white/10 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Business Email</p>
                    <a href="mailto:support@nexstore.com" className="text-sm font-semibold hover:text-gold transition-colors">support@nexstore.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold border border-white/10 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hotline Support</p>
                    <a href="tel:+18005550199" className="text-sm font-semibold hover:text-gold transition-colors">+1 (800) 555-0199</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold border border-white/10 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Headquarters</p>
                    <p className="text-sm font-semibold">100 Future Way, Suite 3D, New York, NY</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Link Card */}
            <div className="glass rounded-3xl p-8 border border-white/5 text-center space-y-4">
              <h3 className="text-lg font-bold">Frequently Asked Questions</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Check our quick answers section down below before sending your inquiry. Your answer might already be there!
              </p>
              <a href="#faq" className="inline-block px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full text-xs font-semibold border border-white/10 transition-all text-gold">
                Jump to FAQ
              </a>
            </div>
          </motion.div>

          {/* Form Side (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 border border-white/5 space-y-5 shadow-card">
              <h2 className="text-xl font-bold">Send a Message</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground font-semibold px-2">Full Name *</label>
                  <input 
                    required 
                    type="text"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="John Doe" 
                    className="w-full glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground font-semibold px-2">Email Address *</label>
                  <input 
                    required 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="john@example.com" 
                    className="w-full glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground font-semibold px-2">Subject *</label>
                <input 
                  required 
                  type="text"
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder="Inquiry about custom order" 
                  className="w-full glass rounded-full px-4 py-3 outline-none focus:ring-2 ring-gold text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground font-semibold px-2">Message *</label>
                <textarea 
                  required 
                  rows={5}
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Type your message here..." 
                  className="w-full glass rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-gold text-sm min-h-32 leading-relaxed"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-full font-semibold shadow-glow hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>

        {/* FAQ Accordion Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          id="faq" 
          className="glass rounded-3xl p-8 border border-white/5 space-y-6 mt-6"
        >
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <HelpCircle className="w-6 h-6 text-gold" />
            <h2 className="text-2xl font-bold font-display">FAQ Support Desk</h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="item-1" className="border-none glass rounded-xl px-4 py-1">
              <AccordionTrigger className="text-sm font-semibold hover:text-gold text-left py-3">
                How does the 3D product viewer work?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-3">
                NexStore uses cutting-edge WebGL/Three.js technologies. You can click and drag to rotate products 360 degrees, or use scroll wheel/pinch-to-zoom to inspect fine details before making a purchase. If a custom model is not available for a specific item, the page dynamically falls back to an interactive 3D Card showing the item image.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-none glass rounded-xl px-4 py-1">
              <AccordionTrigger className="text-sm font-semibold hover:text-gold text-left py-3">
                What are your shipping rates and delivery times?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-3">
                We offer free standard shipping on all orders over $100. Standard shipping takes 3-5 business days. Express shipping options are available at checkout and deliver within 1-2 business days.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-none glass rounded-xl px-4 py-1">
              <AccordionTrigger className="text-sm font-semibold hover:text-gold text-left py-3">
                Can I return a product if I'm not satisfied?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-3">
                Yes, absolutely! We support a 30-day no-questions-asked return policy. Make sure items are in their original packaging and condition. You can start a return directly from your dashboard or contact our support team.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-none glass rounded-xl px-4 py-1">
              <AccordionTrigger className="text-sm font-semibold hover:text-gold text-left py-3">
                Are my payment transactions secure?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-3">
                We do not store credit card details. All transactions are fully encrypted and securely handled by our industry-standard payment processors.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

      </div>
    </main>
  );
}
