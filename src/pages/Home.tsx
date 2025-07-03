import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const images = ['/slides/1.png', '/slides/2.png', '/slides/3.png'];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Slideshow */}
      <section className="relative h-screen w-full overflow-hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 text-white">
          <h1 className="text-5xl font-extrabold mb-4 font-newsreader">Capture Your Moments</h1>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Welcome to Peeking Visuals — A boutique photography studio for portraits, events, branding, and family memories.
          </p>
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link
              to="/book"
              className="inline-block bg-[#102866] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1b2f70] transition"
            >
              Book a Session
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Past Projects */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-10">Past Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
          {[{ name: 'Timeless Grace', folder: 'kissah-labels-timeless-grace', img: '/gallery/kissah-labels-timeless-grace/preview.png' }].map((proj) => (
            <Link
              key={proj.folder}
              to={`/gallery/${proj.folder}`}
              className="rounded-xl overflow-hidden shadow-lg group"
            >
              <img src={proj.img} alt={proj.name} className="w-full h-60 object-cover group-hover:scale-105 transition" />
              <div className="p-4 font-semibold">{proj.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-[#102866] text-center">
        <h2 className="text-3xl font-bold text-white mb-10">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 max-w-6xl mx-auto">
            {[
                { title: 'Portrait Sessions', desc: 'Personal, couple, or professional portraits with a creative twist.' },
                { title: 'Event Coverage', desc: 'Capturing moments from weddings, birthdays, and corporate events.' },
                { title: 'Branding Shoots', desc: 'Tailored visual storytelling for your business or product.' },
                { title: 'Studio Rental', desc: 'We offer a place where photographers and creatives can expand their imagination.' },
                ].map((svc) => (
                <motion.div
                    key={svc.title}
                    className="bg-white p-6 rounded-lg shadow text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                >
                    <h3 className="text-xl font-bold text-[#102866] text-center mb-2">{svc.title}</h3>
                    <p className="text-gray-700">{svc.desc}</p>
                </motion.div>
                ))}
        </div>
        </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
        <p className="mb-4 text-gray-700">We’d love to hear from you! Reach out with questions, bookings, or ideas.</p>
        <div className="space-y-2 text-gray-700">
          <p>Email: <a href="mailto:pkvisuals01@gmail.com" className="text-blue-700 hover:underline">pkvisuals01@gmail.com</a></p>
          <p>Phone: +60 1139-3980-5631</p>
          <p>Location: No 1-09, Jalan Teratai PJU 6A, Mukim, Pekan Kayu Ara, 47400 Petaling Jaya, Selangor</p>
        </div>
        <motion.div
          className="mt-6"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link
            to="/book"
            className="inline-block bg-[#102866] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1b2f70] transition"
          >
            Make a Booking
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
