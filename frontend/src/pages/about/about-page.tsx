import { Button } from "flowbite-react";
import { Heading3 } from "../../components/common/title"
"use client";

import { motion } from "framer-motion";
import banner from "../../assets/images/banner.png";
const AboutPage = () => {
    return (
        <div className="text-gray-800">
          {/* Hero Section */}
          <div className="relative bg-[url()] bg-cover bg-center h-96 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 p-6 rounded-lg text-white text-center max-w-3xl mx-auto">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Welcome to ShopNest
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                The marketplace where vendors grow and shoppers explore endless possibilities.
              </motion.p>
            </div>
          </div>
    
          {/* Content Section */}
          <section className="max-w-5xl mx-auto px-4 py-16 space-y-16">
            {/* Intro */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h2 className="text-3xl font-bold text-violet-700 mb-4">Who We Are</h2>
              <p className="text-lg">
                ShopNest is a dynamic multi-vendor eCommerce platform designed to empower entrepreneurs and delight shoppers.
                We connect local and global sellers with a vast audience, making online shopping more diverse, accessible, and rewarding.
              </p>
            </motion.div>
    
            {/* Two Columns */}
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-6 border-l-4 border-violet-500 bg-gray-50 rounded-xl shadow"
              >
                <h3 className="text-2xl font-semibold text-violet-600 mb-2">🛒 For Shoppers</h3>
                <p>
                  Explore thousands of products across countless categories. With verified vendors, exclusive deals, and seamless delivery —
                  your shopping experience just got better.
                </p>
              </motion.div>
    
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-6 border-l-4 border-violet-500 bg-gray-50 rounded-xl shadow"
              >
                <h3 className="text-2xl font-semibold text-violet-600 mb-2">📈 For Vendors</h3>
                <p>
                  Launch, manage, and grow your business on ShopNest. Get insights, promotion tools, and a trusted platform that scales with your success.
                </p>
              </motion.div>
            </div>
    
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-violet-600 mb-2">Our Mission</h3>
              <p className="text-lg">
                To foster an inclusive, trusted, and innovative space where buyers and sellers thrive together. We champion transparency, creativity, and community.
              </p>
            </motion.div>
    
            {/* Why ShopNest */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-semibold text-violet-600 mb-4"> Why Choose ShopNest?</h3>
              <ul className="list-disc list-inside space-y-2 text-lg">
                <li>Multi-vendor marketplace with limitless variety</li>
                <li>Verified sellers and secure transactions</li>
                <li>Real-time analytics & business tools for vendors</li>
                <li>Fast, reliable shipping and customer support</li>
                <li>Community-first platform with global reach</li>
              </ul>
            </motion.div>
    
            {/* CTA */}
            <div className="text-center space-y-4">
              <h4 className="text-xl font-semibold">Ready to get started?</h4>
              <div className="flex justify-center gap-4">
                <Button href="/" className="bg-violet-600 hover:bg-violet-700 text-white">
                  Start Shopping
                </Button>
                <Button href="/register" className="bg-violet-600 hover:bg-violet-700 text-white">
                  Become a Vendor
                </Button>
              </div>
            </div>
          </section>
        </div>
      );
}

export default AboutPage;