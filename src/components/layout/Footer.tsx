import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-12 md:py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3 text-foreground">tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/#features" className="hover:text-foreground transition-colors">
                  switch finder
                </a>
              </li>
              <li>
                <a href="/#features" className="hover:text-foreground transition-colors">
                  comparisons
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-foreground">product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/#features" className="hover:text-foreground transition-colors">
                  features
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-foreground">company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                {/* "About" link is correctly here */}
                <Link to="/about" className="hover:text-foreground transition-colors">
                  about
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-foreground">connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://www.linkedin.com/in/freddysong/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  linkedin
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src="/assets/icons/switch.ai v2 Logo.png" alt="switch.ai" className="h-6 w-6" />
            <span className="font-semibold lowercase text-foreground">switch.ai</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} switch.ai. all rights reserved.</span>
            <a href="/privacy" className="hover:text-foreground transition-colors">
              privacy
            </a>
            <a href="/terms" className="hover:text-foreground transition-colors">
              terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
