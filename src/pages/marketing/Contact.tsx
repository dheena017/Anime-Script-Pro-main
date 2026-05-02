import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 py-32 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider">Contact Support</h1>
          <p className="text-zinc-400 text-lg">We're here to help. Send us a message and our team will get back to you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col items-center text-center hover:border-studio/30 transition-colors">
            <Mail className="w-8 h-8 text-studio mb-4" />
            <h3 className="font-bold text-white mb-2">Email</h3>
            <p className="text-sm text-zinc-400">support@animescript.pro</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col items-center text-center hover:border-studio/30 transition-colors">
            <MessageSquare className="w-8 h-8 text-studio mb-4" />
            <h3 className="font-bold text-white mb-2">Discord</h3>
            <p className="text-sm text-zinc-400">Join our community server</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col items-center text-center hover:border-studio/30 transition-colors">
            <Phone className="w-8 h-8 text-studio mb-4" />
            <h3 className="font-bold text-white mb-2">Enterprise</h3>
            <p className="text-sm text-zinc-400">1-800-ANIME-PRO</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Name</label>
                <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-studio transition-colors" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Email</label>
                <input required type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-studio transition-colors" placeholder="your@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Message</label>
              <textarea required rows={5} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-studio transition-colors resize-none" placeholder="How can we help you?" />
            </div>
            <Button type="submit" className="w-full h-14 bg-studio text-black font-black uppercase tracking-widest hover:bg-studio/90 transition-all text-sm rounded-xl">
              {isSubmitted ? 'Message Sent!' : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;




