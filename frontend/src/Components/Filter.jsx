import React from 'react';

const Filter = () => {
    return (
        <div className="w-full bg-gray-100 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                
                {/* Section Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-green-600 font-Grandstander">
                        Find Your Next Book
                    </h2>
                    <p className="text-gray-500 mt-2">Filter by title, author, or location to find exactly what you need.</p>
                </div>

                {/* Filter Box */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-orange-400">
                    <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        
                        {/* Title Input */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-bold text-green-700 pl-1">Title</label>
                            <input
                                type="text"
                                placeholder="Book Name..."
                                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
                            />
                        </div>

                        {/* Author Input */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-bold text-green-700 pl-1">Author</label>
                            <input
                                type="text"
                                placeholder="Author Name..."
                                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
                            />
                        </div>

                        {/* Genre/Category Input */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-bold text-green-700 pl-1">Genre</label>
                            <select className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition">
                                <option value="">Select Genre</option>
                                <option value="fiction">Fiction</option>
                                <option value="academic">Academic</option>
                                <option value="thriller">Thriller</option>
                                <option value="history">History</option>
                            </select>
                        </div>

                        {/* Location Input */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-bold text-green-700 pl-1">Location</label>
                            <input
                                type="text"
                                placeholder="City/Area..."
                                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
                            />
                        </div>

                        {/* Search Button */}
                        <div className="flex flex-col">
                            <button className="w-full h-[50px] bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center space-x-2">
                                {/* SVG Search Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span>Search</span>
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Filter;