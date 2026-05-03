import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {  HiChartBar, HiGlobe, HiShieldCheck, HiShoppingBag } from "react-icons/hi";
import { TbTargetArrow } from "react-icons/tb";
import { HiRocketLaunch } from "react-icons/hi2";
import { NavLink } from "react-router-dom";

const stats = [
  { value: "100+", label: "Active Vendors" },
  { value: "500+", label: "Products Listed" },
  { value: "98%", label: "Happy Shoppers" },
  { value: "20", label: "Countries Reached" },
];

const features = [
  { icon: <HiShoppingBag />, title: "Multi-Vendor Marketplace", desc: "Thousands of independent sellers curated under one roof. Every niche, every style, every budget." },
  { icon: <HiShieldCheck/> , title: "Verified & Secure", desc: "Every vendor goes through our trust verification process. Your payments and data are always protected." },
  { icon:  <HiChartBar/> , title: "Vendor Analytics", desc: "Real-time dashboards and sales insights help vendors grow smarter and faster." },
  { icon: <HiRocketLaunch/>, title: "Fast Fulfillment", desc: "Integrated logistics ensure reliable, speedy delivery straight to your door." },
  { icon: <TbTargetArrow/>, title: "Targeted Promotions", desc: "Vendors can run flash deals, bundle offers, and loyalty programs to attract buyers." },
  { icon: <HiGlobe/>, title: "Global Reach", desc: "Shop or sell across borders with multi-currency support and localised storefronts." },
];

const AboutPage = () => {
  useEffect(() => {
    console.log("VERSION 12345");
    AOS.init({ duration: 600, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <div className="text-gray-800 bg-white">

      <section className="bg-violet-700 py-20 px-6 text-center text-white">
        <h1
          data-aos="fade-down"
          className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
        >
          Welcome to ShopNest
        </h1>
        <p
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-lg md:text-xl opacity-90 max-w-xl mx-auto mb-8 leading-relaxed"
        >
          The marketplace where vendors grow and shoppers explore endless possibilities.
        </p>
        <div data-aos="fade-up" data-aos-delay="200" className="flex gap-3 justify-center flex-wrap">
          <a href="/" className="bg-white text-violet-700 font-bold text-sm px-7 py-3 rounded-lg hover:bg-violet-50 transition">
            Start Shopping
          </a>
          <NavLink to={"/SellerRegister"} className="border-2 border-white text-white font-bold text-sm px-7 py-3 rounded-lg hover:bg-white hover:text-violet-700 transition">
            Become a Vendor
          </NavLink>
        </div>
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              className="border border-violet-100 bg-violet-50 rounded-xl p-6 text-center"
            >
              <div className="text-4xl font-extrabold text-violet-700 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-violet-50 border-y border-violet-100 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 data-aos="fade-up" className="text-3xl font-bold text-violet-700 mb-4">Who We Are</h2>
          <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600 leading-relaxed mb-4">
            ShopNest is a dynamic multi-vendor eCommerce platform designed to empower entrepreneurs and delight shoppers.
            We connect local and global sellers with a vast audience, making online shopping more diverse, accessible, and rewarding.
          </p>
          <p data-aos="fade-up" data-aos-delay="150" className="text-gray-600 leading-relaxed">
            Our platform provides vendors with the tools they need to succeed — from analytics and promotions to logistics and customer support — all under one roof.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div data-aos="fade-right" className="border-l-4 border-violet-700 bg-violet-50 rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="text-xl font-semibold text-violet-700 mb-2">For Shoppers</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Explore thousands of products across countless categories. With verified vendors, exclusive deals,
              and seamless delivery — your shopping experience just got better.
            </p>
          </div>
          <div data-aos="fade-left" className="border-l-4 border-violet-700 bg-violet-50 rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-xl font-semibold text-violet-700 mb-2">For Vendors</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Launch, manage, and grow your business on ShopNest. Get insights, promotion tools, and a trusted
              platform that scales with your success.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-violet-50 border-y border-violet-100 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 data-aos="fade-up" className="text-3xl font-bold text-violet-700 text-center mb-10">
            Why Choose ShopNest?
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="bg-white border border-violet-100 rounded-xl p-5"
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h4 className="font-semibold text-gray-800 mb-2">{f.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-3xl mx-auto text-center">
        <h2 data-aos="fade-up" className="text-3xl font-bold text-violet-700 mb-4">Our Mission</h2>
        <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600 leading-relaxed">
          To foster an inclusive, trusted, and innovative space where buyers and sellers thrive together.
          We champion transparency, creativity, and community — making commerce accessible for everyone, everywhere.
        </p>
      </section>

      <section className="bg-violet-700 py-16 px-6 text-center text-white">
        <h2 data-aos="fade-up" className="text-3xl font-bold mb-3">Ready to get started?</h2>
        <p data-aos="fade-up" data-aos-delay="100" className="opacity-85 mb-8 max-w-md mx-auto">
          Join thousands of vendors and millions of shoppers already on ShopNest.
        </p>
        <div data-aos="fade-up" data-aos-delay="200" className="flex gap-3 justify-center flex-wrap">
          <a href="/" className="bg-white text-violet-700 font-bold text-sm px-7 py-3 rounded-lg hover:bg-violet-50 transition">
            Start Shopping
          </a>
          <NavLink to={"/SellerRegister"} className="border-2 border-white text-white font-bold text-sm px-7 py-3 rounded-lg hover:bg-white hover:text-violet-700 transition">
            Become a Vendor
          </NavLink>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;