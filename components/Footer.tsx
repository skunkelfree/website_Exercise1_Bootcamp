const LINKS = [
  { label: "About", delay: "0s" },
  { label: "Work", delay: "0.4s" },
  { label: "Services", delay: "0.8s" },
  { label: "Contact", delay: "1.2s" },
  { label: "Privacy Policy", delay: "1.6s" },
  { label: "Imprint", delay: "2.0s" },
];

export default function Footer() {
  return (
    <footer className="px-8 py-12 border-t border-[#e0e0e0]">
      {/* Top row: brand + nav links */}
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* Brand */}
        <div>
          <span
            className="footer-color text-sm font-semibold tracking-[0.2em] uppercase block mb-2"
            style={{ animationDelay: "0s" }}
          >
            Mountain Space
          </span>
          <p
            className="footer-color text-xs leading-relaxed max-w-xs"
            style={{ animationDelay: "0.6s", opacity: 0.7 }}
          >
            Elevating ideas to new heights.
            <br />
            Where creativity meets altitude.
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {LINKS.map(({ label, delay }) => (
            <a
              key={label}
              href="#"
              className="footer-color text-xs font-medium tracking-[0.15em] uppercase transition-opacity duration-200 hover:opacity-50"
              style={{ animationDelay: delay }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom row: copyright */}
      <div className="mt-10 pt-6 border-t border-[#e0e0e0] flex items-center justify-between">
        <span
          className="footer-color text-[10px] tracking-[0.2em] uppercase"
          style={{ animationDelay: "2.4s" }}
        >
          © {new Date().getFullYear()} Mountain Space
        </span>
        <span
          className="footer-color text-[10px] tracking-[0.15em] uppercase"
          style={{ animationDelay: "3.0s" }}
        >
          All rights reserved
        </span>
      </div>
    </footer>
  );
}
