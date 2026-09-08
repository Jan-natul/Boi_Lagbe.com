import React, { useEffect, useState } from "react";
import SearchBar from "../Components/Searchbar";
import About from "../Components/About";
import SellRules from "../Components/SellRules";
import Footer from "../Components/Footer";
import BookSection from "../Components/Booklist"; 
import Filter from "../Components/Filter";

const Home = () => {
  const [resellBooks, setResellBooks] = useState([]);
  const [exchangeBooks, setExchangeBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {

        const response = await fetch("https://boi-lagbe-com.onrender.com/api/posts");
        const result = await response.json();

        if (result.success) {
          const resell = result.posts.filter(
            (book) => book.transactionType && book.transactionType.toLowerCase() === "resell"
          );
          
          const exchange = result.posts.filter(
            (book) => book.transactionType && book.transactionType.toLowerCase() === "exchange"
          );

          setResellBooks(resell);
          setExchangeBooks(exchange);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-xl font-bold text-gray-500">Loading books...</p>
        </div>
      );
  }

  return (
    <>
      <div className="min-h-[600px] md:h-[700px] bg-gray-100 flex flex-col md:flex-row items-center justify-center md:justify-between px-6 sm:px-8 md:px-10 py-12 md:py-0 gap-10 md:gap-6">
        <div className="max-w-xl font-Grandstander md:pl-20 pb-0 md:pb-30 text-center md:text-left">
          <h1 className="homepage-heading text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-green-600">
            Give your old books a new home!
          </h1>
          <p className="homepage-heading text-lg sm:text-xl md:text-2xl mb-6 font-medium text-green-600">
            A platform where you can easily buy, sell, and exchange books with
            other readers.
          </p>
          <div className="flex justify-center md:justify-start">
            <SearchBar onSearch={(term) => console.log(term)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:pr-30 pb-0 md:pb-30 w-full max-w-[340px] sm:max-w-[420px] md:max-w-none md:w-auto">
          <img
            src="bg.jpg"
            alt="pic1"
            className="w-full h-32 sm:h-40 md:w-[250px] md:h-[180px] object-cover rounded-xl shadow-md"
          />
          <img
            src="2nd.JPG"
            alt="pic2"
            className="w-full h-32 sm:h-40 md:w-[250px] md:h-[180px] object-cover rounded-xl shadow-md"
          />
          <img
            src="3rd.jpg"
            alt="pic3"
            className="w-full h-32 sm:h-40 md:w-[250px] md:h-[180px] object-cover rounded-xl shadow-md"
          />
          <img
            src="4th.jpg"
            alt="pic4"
            className="w-full h-32 sm:h-40 md:w-[250px] md:h-[180px] object-cover rounded-xl shadow-md"
          />
        </div>
      </div>

      <About animate={true} />

      <div className="w-full bg-gray-100 py-12 pb-2 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            
            <Filter />
          </div>
        </div>
      </div>

      <SellRules />

      <BookSection
        title="Recently Added for Resale"
        books={resellBooks}
        type="resell"
        link="/list?type=resell" 
      />

      <BookSection
        title="Books Available for Exchange"
        books={exchangeBooks}
        type="exchange"
        link="/list?type=exchange"
      />

      <Footer />
    </>
  );
};

export default Home;