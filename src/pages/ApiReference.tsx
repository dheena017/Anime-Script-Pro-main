import { Terminal, Zap } from 'lucide-react';

export function ApiReferencePage() {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 py-32 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wider">API Reference</h1>
          <p className="text-zinc-400 text-lg">Build powerful integrations with the AnimeScript Pro God Mode Engine API. Integrate anime generation directly into your workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 sticky top-32">
              <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Navigation</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#introduction" className="text-studio hover:text-white transition-colors">Introduction</a></li>
                <li><a href="#authentication" className="text-zinc-400 hover:text-white transition-colors">Authentication</a></li>
                <li><a href="#endpoints" className="text-zinc-400 hover:text-white transition-colors">Endpoints</a></li>
                <li><a href="#webhooks" className="text-zinc-400 hover:text-white transition-colors">Webhooks</a></li>
                <li><a href="#errors" className="text-zinc-400 hover:text-white transition-colors">Errors</a></li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3 space-y-12">
            <section id="introduction" className="space-y-6">
              <h2 className="text-3xl font-black text-white">Introduction</h2>
              <p className="text-zinc-400 leading-relaxed">
                The AnimeScript Pro API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-zinc-900/20 border border-white/5 rounded-2xl flex items-start gap-4">
                  <Terminal className="w-6 h-6 text-studio shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">REST API</h4>
                    <p className="text-sm text-zinc-500">Standard RESTful interface for all generation and studio management tasks.</p>
                  </div>
                </div>
                <div className="p-6 bg-zinc-900/20 border border-white/5 rounded-2xl flex items-start gap-4">
                  <Zap className="w-6 h-6 text-studio shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Websockets</h4>
                    <p className="text-sm text-zinc-500">Real-time progress updates for long-running generation tasks.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="authentication" className="space-y-6">
              <h2 className="text-3xl font-black text-white">Authentication</h2>
              <p className="text-zinc-400 leading-relaxed">
                Authenticate your API requests by including your secret API key in the request headers. You can manage your API keys in the Developer Dashboard.
              </p>
              <div className="bg-black/80 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-2 border-b border-white/10 bg-white/5 text-xs text-zinc-500 font-mono">Example Request</div>
                <pre className="p-4 text-sm text-zinc-300 overflow-x-auto font-mono">
                  <code>
{`curl -X POST https://api.animescript.pro/v1/generations \\
  -H "Authorization: Bearer sk_test_123456789" \\
  -H "Content-Type: application/json"`}
                  </code>
                </pre>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiReferencePage;
