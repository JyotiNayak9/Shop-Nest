import { Button } from "flowbite-react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="text-gray-800">

      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-r from-violet-700 to-indigo-600 h-[400px] flex items-center justify-center text-white">
        <div className="text-center max-w-3xl px-4">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome to ShopNest
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Empowering sellers. Inspiring shoppers. One platform, endless possibilities.
          </motion.p>
        </div>
      </div>

      {/* ABOUT */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-16">

        {/* WHO WE ARE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-violet-700 mb-4">
            Who We Are
          </h2>
          <p className="text-lg leading-relaxed">
            ShopNest is a modern multi-vendor eCommerce platform designed to connect
            buyers with a diverse network of sellers. We provide a seamless digital
            marketplace where businesses can grow and customers can discover products
            from across categories—all in one place.
          </p>
        </motion.div>

        {/* STATS (VERY IMPORTANT FOR IMPACT) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Products", value: "10,000+" },
            { label: "Vendors", value: "500+" },
            { label: "Customers", value: "50K+" },
            { label: "Orders Delivered", value: "1L+" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="p-6 bg-gray-50 rounded-xl shadow"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-bold text-violet-600">
                {item.value}
              </h3>
              <p className="text-gray-600">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-8">

          <motion.div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-violet-600 mb-2">
              🛍 Wide Product Range
            </h3>
            <p>
              Discover thousands of products from multiple vendors across categories.
            </p>
          </motion.div>

          <motion.div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-violet-600 mb-2">
              🔒 Secure Shopping
            </h3>
            <p>
              Trusted sellers, safe payments, and reliable transactions every time.
            </p>
          </motion.div>

          <motion.div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-violet-600 mb-2">
              🚀 Vendor Growth
            </h3>
            <p>
              Tools, analytics, and exposure to help vendors scale their business.
            </p>
          </motion.div>

        </div>

        {/* FOR USERS + VENDORS */}
        <div className="grid md:grid-cols-2 gap-10">

          <motion.div className="p-6 bg-gray-50 rounded-xl border-l-4 border-violet-500">
            <h3 className="text-2xl font-semibold text-violet-700 mb-2">
              👥 For Customers
            </h3>
            <p>
              Shop from a wide range of categories, compare products, and enjoy
              a seamless buying experience with fast delivery and support.
            </p>
          </motion.div>

          <motion.div className="p-6 bg-gray-50 rounded-xl border-l-4 border-violet-500">
            <h3 className="text-2xl font-semibold text-violet-700 mb-2">
              🏪 For Vendors
            </h3>
            <p>
              Sell your products, manage inventory, track orders, and grow your
              brand using our powerful multi-vendor platform.
            </p>
          </motion.div>

        </div>

        {/* MISSION */}
        <motion.div>
          <h3 className="text-2xl font-semibold text-violet-700 mb-2">
            Our Mission
          </h3>
          <p className="text-lg">
            To build a trusted digital marketplace that empowers businesses and
            enhances the online shopping experience for everyone.
          </p>
        </motion.div>

        {/* CTA */}
        <div className="text-center space-y-4 pt-10">
          <h4 className="text-2xl font-semibold">
            Ready to explore ShopNest?
          </h4>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button href="/" className="bg-violet-600 hover:bg-violet-700 text-white">
              Start Shopping
            </Button>

            <Button href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Become a Vendor
            </Button>
          </div>
        </div>

      </section>
    </div>
  );
};

export default AboutPage;