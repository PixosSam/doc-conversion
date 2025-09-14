import Image from "next/image";
import Link from "next/link";

// Gradient background wrapper
const GradientSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`w-full ${className} bg-gradient-to-br from-[#c31432] from-30% to-[#240b36]`}
  >
    {children}
  </section>
);

// Hero Section
const Hero = ({
  title,
  subtitle,
  ctaText,
}: {
  title: string;
  subtitle: string;
  ctaText: string;
}) => (
  <GradientSection className="py-16 px-4 text-white">
    <div className="max-w-7xl mx-auto relative">
      {/* Navigation buttons */}
      <div className="absolute right-4 top-0 space-x-4">
        <Link
          href="/login"
          className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full hover:bg-white/10 transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-white text-[#c31432] px-6 py-2 rounded-full hover:bg-gray-100 transition"
        >
          Sign Up
        </Link>
      </div>
      
      {/* Hero content */}
      <div className="flex flex-col items-center text-center pt-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">{title}</h1>
        <p className="text-lg sm:text-2xl mb-8 max-w-2xl">{subtitle}</p>
        <Link
          href="/signup"
          className="bg-white text-[#c31432] font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  </GradientSection>
);

// Features Section
const Features = ({
  features,
}: {
  features: { icon: React.ReactNode; title: string; desc: string }[];
}) => (
  <section className="py-16 px-4 bg-white flex flex-col items-center">
    <h2 className="text-3xl font-bold mb-10 text-[#c31432]">Features</h2>
    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-5xl w-full">
      {features.map((f, i) => (
        <div
          key={i}
          className="flex flex-col items-center bg-gradient-to-br from-[#c31432]/10 to-[#240b36]/10 rounded-xl p-6 shadow hover:scale-105 transition"
        >
          <div className="mb-4 text-4xl">{f.icon}</div>
          <h3 className="font-semibold text-xl mb-2 text-[#240b36]">{f.title}</h3>
          <p className="text-gray-700 text-center">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

// Code Example Section
const CodeExample = ({
  title,
  code,
}: {
  title: string;
  code: string;
}) => (
  <GradientSection className="py-16 px-4 text-white flex flex-col items-center">
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    <pre className="bg-black/60 rounded-lg p-6 text-sm w-full max-w-2xl overflow-x-auto">
      <code>{code}</code>
    </pre>
  </GradientSection>
);

// Call to Action Section
const CTA = ({
  title,
  buttonText,
  buttonHref,
}: {
  title: string;
  buttonText: string;
  buttonHref: string;
}) => (
  <section className="py-12 px-4 flex flex-col items-center bg-white">
    <h2 className="text-2xl font-bold mb-4 text-[#240b36]">{title}</h2>
    <a
      href={buttonHref}
      className="bg-gradient-to-br from-[#c31432] to-[#240b36] text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition"
    >
      {buttonText}
    </a>
  </section>
);

// Footer Section
const Footer = ({
  text,
}: {
  text: string;
}) => (
  <footer className="py-6 px-4 text-center text-white bg-gradient-to-br from-[#c31432] from-30% to-[#240b36]">
    {text}
  </footer>
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero
        title="Lightning-fast HTML Conversion API"
        subtitle="Convert HTML to PDF or Image in milliseconds. Simple, reliable, and built for developers. More formats coming soon!"
        ctaText="Get Started"
      />

      <Features
        features={[
          {
            icon: <span>⚡</span>,
            title: "Blazing Fast",
            desc: "Our API is optimized for speed, delivering conversions in milliseconds.",
          },
          {
            icon: <span>🖼️</span>,
            title: "HTML to Image",
            desc: "Convert HTML to high-quality images with a simple API call.",
          },
          {
            icon: <span>📄</span>,
            title: "HTML to PDF",
            desc: "Generate PDFs from HTML effortlessly, perfect for invoices, reports, and more.",
          },
          {
            icon: <span>🔒</span>,
            title: "Secure",
            desc: "Your data is encrypted in transit and never stored.",
          },
          {
            icon: <span>🔌</span>,
            title: "Easy Integration",
            desc: "RESTful API with clear docs and examples. Works with any language.",
          },
          {
            icon: <span>🚀</span>,
            title: "More Formats Coming",
            desc: "We’re adding more output formats soon. Stay tuned!",
          },
        ]}
      />

      <CodeExample
        title="Convert HTML to PDF in Seconds"
        code={`POST https://api.html2convert.com/v1/pdf
Content-Type: application/json

{
  "html": "<h1>Hello, world!</h1>"
}

// Response: PDF file
`}
      />

      <CTA
        title="Ready to supercharge your workflow?"
        buttonText="Sign Up Free"
        buttonHref="#"
      />

      <Footer text="© 2025 HTML2Convert. All rights reserved." />
    </div>
  );
}