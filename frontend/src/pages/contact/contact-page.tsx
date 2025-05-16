export default function ContactUs() {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-gray-800">
        <h1 className="text-4xl font-bold text-violet-700 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-10">
          Have questions or need assistance? We're here to help.
        </p>
  
        <div className="space-y-6 text-md">
          <div>
            <h2 className="text-xl font-semibold text-violet-600 mb-1">📍 Address</h2>
            <p>ShopNest <br />Balkumari, Lalitpur<br />Nepal</p>
          </div>
   
          <div>
            <h2 className="text-xl font-semibold text-violet-600 mb-1">📞 Phone</h2>
            <p>9813829957</p>
            <p>9742310883</p>

          </div>
  
          <div>
            <h2 className="text-xl font-semibold text-violet-600 mb-1">✉️ Email</h2>
            <p>prerana@gmail.com</p>
            <p>nayakjyoti789@gmail.com</p>
          </div>
  
          {/* <div>
            <h2 className="text-xl font-semibold text-violet-600 mb-1">🕒 Business Hours</h2>
            <p>Monday - Friday: 9:00 AM – 6:00 PM (EST)</p>
            <p>Saturday - Sunday: Closed</p>
          </div> */}
        </div>
  
        <p className="mt-12 text-center text-gray-500">
          Thank you for being part of the ShopNest community 💜
        </p>
      </div>
    );
  }
  