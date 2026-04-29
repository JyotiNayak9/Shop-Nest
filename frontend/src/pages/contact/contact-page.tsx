import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";

export default function ContactUs() {
  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <div className="bg-white text-gray-800">

      <section className="bg-violet-700 py-16 px-6 text-center text-white">
        <h1 data-aos="fade-down" className="text-4xl md:text-5xl font-extrabold mb-3">
          Contact Us
        </h1>
        <p data-aos="fade-up" data-aos-delay="100" className="text-lg opacity-90 max-w-md mx-auto">
          Have questions or need assistance? We're here to help.
        </p>
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">

          <div
            data-aos="fade-up"
            data-aos-delay="0"
            className="bg-violet-50 border border-violet-100 rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-4"><HiLocationMarker/></div>
            <h2 className="text-lg font-bold text-violet-700 mb-2">Address</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              ShopNest<br />
              Balkumari, Lalitpur<br />
              Nepal
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="bg-violet-50 border border-violet-100 rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-4"><HiPhone /></div>
            <h2 className="text-lg font-bold text-violet-700 mb-2">Phone</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              <a href="tel:9813829957" className="hover:text-violet-700 transition">9813829957</a><br />
              <a href="tel:9742310883" className="hover:text-violet-700 transition">9742310883</a>
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-violet-50 border border-violet-100 rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-4"><HiMail/></div>
            <h2 className="text-lg font-bold text-violet-700 mb-2">Email</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              <a href="mailto:prerana@gmail.com" className="hover:text-violet-700 transition">prerana@gmail.com</a><br />
              <a href="mailto:nayakjyoti789@gmail.com" className="hover:text-violet-700 transition">nayakjyoti789@gmail.com</a>
            </p>
          </div>

        </div>
      </section>

      <p data-aos="fade-up" className="pb-16 text-center text-sm">
        Thank you for being part of the ShopNest community. We look forward to connecting with you!
      </p>

    </div>
  );
}