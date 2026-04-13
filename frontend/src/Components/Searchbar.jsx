import React, { useState } from 'react';

const Searchbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="w-full max-w-md mt-6">
      <form 
        onSubmit={handleSearch}
        className="flex items-center bg-white border-2 border-orange-400 rounded-full overflow-hidden shadow-sm"
      >
        <input
          type="text"
          placeholder="Search by title"
          className="flex-grow px-6 py-2.5 text-gray-700 outline-none placeholder:text-gray-400 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 font-semibold transition-colors duration-200 cursor-pointer"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Searchbar;