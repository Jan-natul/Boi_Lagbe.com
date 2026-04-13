import React from "react";

const Card = ({ book }) => {
  // book প্রপ থেকে ডাটাগুলো বের করে (Destructure) নেওয়া হচ্ছে
  const { title, author, type, price, location, image } = book;

  return (
    <div className="bg-[#FEFCE8] rounded-2xl border-4 border-orange-400 shadow-md p-3 w-60 mx-auto transition hover:shadow-xl flex flex-col h-full">
      
      <div className="h-40 w-full overflow-hidden rounded-lg bg-white mb-2">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>

      <h2 className="text-center text-lg font-bold mt-1 line-clamp-1 text-gray-800">
        {title}
      </h2>

      <p className="text-center text-sm text-gray-600 mt-1 mb-2">
        {author}
      </p>

      {/* Price Section */}
      <div className="mt-auto">
        <p className="text-center text-green-700 font-bold bg-green-50 py-1 rounded-md mx-4">
          {type} {price ? `| ${price} Tk.` : ""}
        </p>

        <p className="text-center text-gray-500 text-xs mt-2 flex items-center justify-center gap-1">
          📍 {location}
        </p>
      </div>
    </div>
  );
};

export default Card;