import { FileText, Shield, AlertTriangle } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 py-32 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider">Terms of Protocol</h1>
          <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 md:p-12 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-studio" />
              <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              By accessing and using AnimeScript Pro ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
              The Platform provides an AI-powered studio environment for anime and manga generation.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-studio" />
              <h2 className="text-2xl font-bold text-white">2. Content Ownership & Rights</h2>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Users retain all rights, title, and interest in and to their original prompts and descriptions.
              For users on a paid tier, all generated images and assets belong entirely to the user for commercial and non-commercial use.
              Users on the free tier are granted a non-exclusive license for personal use only.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-studio" />
              <h2 className="text-2xl font-bold text-white">3. Acceptable Use Policy</h2>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              You agree not to use the Platform to generate:
            </p>
            <ul className="list-disc pl-6 text-zinc-400 space-y-2">
              <li>Illegal content or imagery depicting unlawful acts.</li>
              <li>Content that infringes on third-party intellectual property rights.</li>
              <li>Malicious, defamatory, or highly sensitive political content.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
