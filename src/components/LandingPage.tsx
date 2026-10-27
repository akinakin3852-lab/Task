import { useState } from 'react';
import {
  ArrowRight,
  Check,
  FolderKanban,
  ListChecks,
  Users,
  Zap,
  Shield,
  BarChart3,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';

export function LandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const features = [
    {
      icon: ListChecks,
      title: 'Task management',
      desc: 'Create, assign, and track tasks with priorities, due dates, and status updates.',
    },
    {
      icon: Users,
      title: 'Team collaboration',
      desc: 'Keep everyone aligned with shared workspaces and real-time activity feeds.',
    },
    {
      icon: BarChart3,
      title: 'Progress insights',
      desc: 'See your team\'s momentum at a glance with live dashboard metrics.',
    },
    {
      icon: Shield,
      title: 'Secure by default',
      desc: 'Your data is protected with row-level security and encrypted at rest.',
    },
    {
      icon: Zap,
      title: 'Fast and reliable',
      desc: 'Built on modern infrastructure for instant load times and zero downtime.',
    },
    {
      icon: FolderKanban,
      title: 'Organized workspaces',
      desc: 'Group related work so your team always knows where to find things.',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      desc: 'For individuals getting started.',
      features: ['Up to 50 tasks', '1 workspace', 'Basic dashboard', 'Email support'],
      cta: 'Get started',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/mo',
      desc: 'For growing teams.',
      features: ['Unlimited tasks', '5 workspaces', 'Advanced analytics', 'Priority support', 'Custom workflows'],
      cta: 'Start free trial',
      highlight: true,
    },
    {
      name: 'Business',
      price: '$29',
      period: '/mo',
      desc: 'For organizations at scale.',
      features: ['Everything in Pro', 'Unlimited workspaces', 'Role permissions', 'Audit logs', 'Dedicated support'],
      cta: 'Contact sales',
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">FAQ</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <button onClick={onEnterApp} className="btn-primary">
                Go to dashboard <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <button onClick={() => openAuth('signin')} className="btn-ghost">Sign in</button>
                <button onClick={() => openAuth('signup')} className="btn-primary">Get started</button>
              </>
            )}
          </div>
          <button
            className="rounded-lg p-2 text-slate-600 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-slate-100 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-600">Features</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-600">Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-600">FAQ</a>
              <div className="flex flex-col gap-2 pt-2">
                {user ? (
                  <button onClick={onEnterApp} className="btn-primary">Go to dashboard</button>
                ) : (
                  <>
                    <button onClick={() => { openAuth('signin'); setMobileMenuOpen(false); }} className="btn-secondary">Sign in</button>
                    <button onClick={() => { openAuth('signup'); setMobileMenuOpen(false); }} className="btn-primary">Get started</button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-60" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-slate-50/50 to-white" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Now with smart task priorities
            </div>
            <h1 className="animate-fade-in-up mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Everything your team needs,
              <br className="hidden sm:block" /> organized in one place
            </h1>
            <p className="animate-fade-in-up animate-delay-100 mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Plan, track, and ship work together. Organize brings tasks, priorities, and
              progress insights into a single, beautifully simple dashboard your team will
              actually want to use.
            </p>
            <div className="animate-fade-in-up animate-delay-200 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => (user ? onEnterApp() : openAuth('signup'))}
                className="btn-primary w-full px-6 py-3 text-base sm:w-auto"
              >
                {user ? 'Open your dashboard' : 'Start for free'}
                <ArrowRight className="h-5 w-5" />
              </button>
              <a href="#features" className="btn-secondary w-full px-6 py-3 text-base sm:w-auto">
                See features
              </a>
            </div>
            <p className="animate-fade-in-up animate-delay-300 mt-4 text-sm text-slate-500">
              No credit card required. Free plan available forever.
            </p>
          </div>

          {/* Hero preview */}
          <div className="animate-fade-in-up animate-delay-300 mx-auto mt-16 max-w-5xl">
            <div className="card overflow-hidden shadow-xl ring-1 ring-slate-200/50">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-2 text-xs font-medium text-slate-400">app.organize.com/dashboard</span>
              </div>
              <div className="grid grid-cols-1 gap-4 bg-slate-50/50 p-6 sm:grid-cols-3">
                {[
                  { label: 'Total tasks', value: '24', icon: ListChecks, color: 'text-slate-700' },
                  { label: 'In progress', value: '8', icon: Zap, color: 'text-amber-600' },
                  { label: 'Completed', value: '12', icon: Check, color: 'text-emerald-600' },
                ].map((stat) => (
                  <div key={stat.label} className="card p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{stat.label}</span>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 p-6">
                {[
                  { title: 'Design new landing page', status: 'In progress', priority: 'High' },
                  { title: 'Review pull requests', status: 'To do', priority: 'Medium' },
                  { title: 'Update API documentation', status: 'Done', priority: 'Low' },
                ].map((task) => (
                  <div key={task.title} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        task.status === 'Done' ? 'bg-emerald-500' : task.status === 'In progress' ? 'bg-amber-500' : 'bg-slate-300'
                      }`} />
                      <span className="text-sm font-medium text-slate-800">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${
                        task.priority === 'High' ? 'bg-red-50 text-red-600' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                      }`}>{task.priority}</span>
                      <span className="hidden text-xs text-slate-400 sm:block">{task.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-400">Trusted by teams at</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {['Northwind', 'Acme Co', 'Vertex', 'Lumina', 'Cobalt', 'Driftly'].map((name) => (
              <span key={name} className="text-lg font-bold tracking-tight text-slate-500">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built for teams that ship
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Every feature is designed to reduce friction and help your team move faster,
              without the clutter of bloated project tools.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card group p-6 transition-all duration-200 hover:shadow-md"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-slate-100 bg-slate-50/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Start free. Upgrade when your team grows. No hidden fees.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card relative p-8 ${
                  plan.highlight ? 'ring-2 ring-slate-900 shadow-lg' : ''
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{plan.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>
                <button
                  onClick={() => (user ? onEnterApp() : openAuth('signup'))}
                  className={`mt-6 w-full ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </button>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 space-y-6">
            {[
              { q: 'Is there really a free plan?', a: 'Yes. The Free plan is available forever with up to 50 tasks. No credit card required to sign up.' },
              { q: 'Can I upgrade or downgrade later?', a: 'Absolutely. You can change your plan at any time from your account settings, and changes take effect immediately.' },
              { q: 'Is my data secure?', a: 'Your data is protected with row-level security in the database and encrypted in transit and at rest. Each user can only access their own data.' },
              { q: 'Do you offer team collaboration?', a: 'Yes. Pro and Business plans include shared workspaces so your whole team can collaborate in real time.' },
            ].map((item) => (
              <div key={item.q} className="card p-6">
                <h3 className="font-semibold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 bg-slate-900 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to get organized?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            Join your team on Organize. Set up your dashboard in under two minutes.
          </p>
          <button
            onClick={() => (user ? onEnterApp() : openAuth('signup'))}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-slate-900 shadow-sm transition-all hover:bg-slate-100 active:scale-[0.98]"
          >
            {user ? 'Open your dashboard' : 'Start for free'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Logo />
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <a href="#features" className="hover:text-slate-900">Features</a>
              <a href="#pricing" className="hover:text-slate-900">Pricing</a>
              <a href="#faq" className="hover:text-slate-900">FAQ</a>
              <a href="#" className="hover:text-slate-900">Privacy</a>
              <a href="#" className="hover:text-slate-900">Terms</a>
            </nav>
          </div>
          <p className="mt-6 text-center text-sm text-slate-400 sm:text-left">
            © 2026 Organize. All rights reserved.
          </p>
        </div>
      </footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </div>
  );
}
