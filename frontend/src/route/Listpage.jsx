import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import Filter from "../components/Filter";
import Footer from "../components/Footer";
import 'aos/dist/aos.css'; 
import AOS from "aos";

const ListPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams(); 
  
  const filters = {
    title: searchParams.get("title") || "",
    author: searchParams.get("author") || "",
    genre: searchParams.get("genre") || "",
    location: searchParams.get("location") || ""
  };

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`http://https://boi-lagbe-com.onrender.com/api/posts?${query}`); 
        const result = await response.json();
        
        if (result.success) {
          setBooks(result.posts);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();

    AOS.init({
      duration: 800, 
      once: true,    
      easing: 'ease-out-back', 
    });

  }, [filters.title, filters.author, filters.genre, filters.location]); 

  return (
    <>
    <div className="min-h-screen bg-gray-50 pb-20">
      
      <div className="bg-white shadow-sm pb-4">

        <Filter filters={filters} />
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">

        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 font-Grandstander">
              Explore Books
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Showing <span className="font-bold text-orange-500">{books.length}</span> results found
            </p>
          </div>
        </div>

        {loading ? (
           <p className="text-center text-gray-500 mt-10">Loading books...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.length > 0 ? (
              books.map((book, index) => (
                <div 
                  key={book._id} 
                  className="flex justify-center"
                  data-aos="zoom-in" 
                  data-aos-delay={index * 100} 
                >
                  <Card book={{ ...book, type: book.transactionType }} />
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">No books found matching your criteria.</p>
            )}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <button className="bg-white border-2 border-orange-400 text-orange-500 font-bold py-2 px-8 rounded-full hover:bg-orange-400 hover:text-white transition duration-300 shadow-sm">
            Load More Books
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ListPage;