import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">UrbanEase</h3>
            <p className="text-gray-400 mb-4">
              Your trusted platform for home services. Connect with verified professionals.
            </p>
            <div className="flex space-x-4 text-xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-blue-500"
              >
                <FiFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-sky-400"
              >
                <FiTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-pink-500"
              >
                <FiInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-blue-400"
              >
                <FiLinkedin />
              </a>
            </div>
          </div>

          {/* Company */}
          <nav aria-label="Company">
            <h4 className="text-lg font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white">Services</Link></li>
              <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </nav>

          {/* For Customers */}
          <nav aria-label="For Customers">
            <h4 className="text-lg font-semibold text-white mb-3">For Customers</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="hover:text-white">Browse Services</Link></li>
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/safety" className="hover:text-white">Safety</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Use</Link></li>
            </ul>
          </nav>

          {/* For Professionals */}
          <nav aria-label="For Professionals">
            <h4 className="text-lg font-semibold text-white mb-3">For Professionals</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="hover:text-white">Become a Partner</Link></li>
              <li><Link to="/resources" className="hover:text-white">Resources</Link></li>
              <li><Link to="/support" className="hover:text-white">Support</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
          <p>&copy; 2025 UrbanEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;