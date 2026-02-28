import { ChefHat } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <ChefHat size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                Spice<span className="text-orange-500">Lane</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Delivering authentic Indian flavors to your doorstep, one meal at a time.
            </p>
          </div>

          {[
            { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
            { title: 'Support', links: ['Contact Us', 'FAQ', 'Delivery Info', 'Returns'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-bold text-sm text-gray-700 mb-4 uppercase tracking-wide">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">© 2024 SpiceLane. Made with ❤️ for food lovers.</p>
          <p className="text-xs text-gray-300">Powered by React + Node.js</p>
        </div>
      </div>
    </footer>
  );
}