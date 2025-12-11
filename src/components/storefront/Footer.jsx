"use client"

function Footer() {
  return (
    <footer className="bg-neutral-800 text-gray-300 mt-auto">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full bg-neutral-700 hover:bg-neutral-600 py-3 text-sm transition-colors"
      >
        Back to top
      </button>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Get to Know Us</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About RetailHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Press Releases
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Connect with Us</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Make Money with Us</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sell on RetailHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Become an Affiliate
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Advertise Products
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Let Us Help You</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Your Account
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns Centre
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Customer Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} RetailHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
