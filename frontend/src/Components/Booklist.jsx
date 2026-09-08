import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

const BookSection = ({ title, books = [], type = "", link }) => { 
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  const animationType = type && type.toLowerCase() === 'resell' ? "fade-up" : "fade-left";

  return (
    <section className="py-12 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-end mb-8 border-b-2 border-gray-200 pb-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 font-Grandstander">
            {title}
          </h2>
          <Link 
            to={link || "#"} 
            className="text-orange-400 font-bold text-lg hover:text-orange-500 hover:underline transition"
          >
            See More;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {books && books.length > 0 ? (
            books.slice(0, 4).map((book, index) => ( 
              <div 
                key={book._id} 
                data-aos={animationType}
                data-aos-delay={index * 100} 
                className="w-full flex justify-center"
              >
                <Card book={book} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center">
                <p className="text-gray-500 text-lg">Loading or No books found...</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default BookSection;