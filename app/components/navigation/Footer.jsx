import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">EcommercePro</h3>
            <p className="text-text-secondary">
              Your trusted marketplace for everything you need. Shop with confidence and get the best deals.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-text-muted hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-text-muted hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-text-muted hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-text-secondary hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-text-secondary hover:text-primary transition-colors">Contact</a></li>
              <li><a href="/faq" className="text-text-secondary hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="/shipping" className="text-text-secondary hover:text-primary transition-colors">Shipping Info</a></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary">Categories</h4>
            <ul className="space-y-2">
              <li><a href="/products/electronics" className="text-text-secondary hover:text-primary transition-colors">Electronics</a></li>
              <li><a href="/products/fashion" className="text-text-secondary hover:text-primary transition-colors">Fashion</a></li>
              <li><a href="/products/home" className="text-text-secondary hover:text-primary transition-colors">Home & Living</a></li>
              <li><a href="/products/sports" className="text-text-secondary hover:text-primary transition-colors">Sports</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">nandana219@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">+62 857 3065 2366</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">Kota Malang, Indonesia</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-text-muted">
            © 2025 Daarns. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}