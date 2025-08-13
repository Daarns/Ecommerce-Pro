// Footer.jsx
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border px-6 py-4 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <div className="text-sm text-text-secondary">
          © {currentYear} Admin Dashboard. All rights reserved.
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <button className="text-sm text-text-secondary hover:text-primary transition-colors">
            Privacy Policy
          </button>
          <button className="text-sm text-text-secondary hover:text-primary transition-colors">
            Terms of Service
          </button>
          <button className="text-sm text-text-secondary hover:text-primary transition-colors">
            Support
          </button>
        </div>

        {/* Version Info */}
        <div className="text-xs text-text-secondary bg-surface-elevated px-2 py-1 rounded">
          v2.1.0
        </div>
      </div>
    </footer>
  );
}