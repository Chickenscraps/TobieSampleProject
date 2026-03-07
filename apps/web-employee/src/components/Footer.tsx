export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-tobie-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left: Logo + Year */}
          <div>
            <span className="text-xl font-bold tracking-tight">Tobie</span>
            <p className="text-sm text-brand-muted mt-1">
              &copy; {currentYear} Tobie, Inc. All rights reserved.
            </p>
          </div>

          {/* Center: Disclaimer */}
          <div className="md:text-center">
            <p className="text-sm text-brand-muted leading-relaxed">
              This content is provided for reference purposes only. In all
              cases, the official plan documents govern.
            </p>
          </div>

          {/* Right: Last updated */}
          <div className="md:text-right">
            <p className="text-sm text-brand-muted">Last updated: March 2026</p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-brand-muted">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-700">&middot;</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Use
            </a>
            <span className="text-gray-700">&middot;</span>
            <a href="#" className="hover:text-white transition-colors">
              Accessibility
            </a>
            <span className="text-gray-700">&middot;</span>
            <a href="#" className="hover:text-white transition-colors">
              HIPAA Notice
            </a>
            <span className="text-gray-700">&middot;</span>
            <a href="#" className="hover:text-white transition-colors">
              Contact HR
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
