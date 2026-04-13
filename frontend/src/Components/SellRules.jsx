import React from 'react';

const SellRules = () => {
  const steps = [
    {
      id: "1",
      title: "Create Account",
      desc: "Register for free using your email or social media and set up your profile to join the BoiLagbe community.",
    },
    {
      id: "2",
      title: "Add Sell Post",
      desc: "Upload clear photos of your book, set a price, add a description, and list it for others to see.",
    },
    {
      id: "3",
      title: "Resale Your Book",
      desc: "Receive messages from interested buyers, finalize the deal, and give your old book a new home.",
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-600 font-Grandstander">
            Start selling with three easy steps
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            Turn your bookshelf into cash in just a few minutes.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center border border-gray-100"
            >
              {/* Number Circle */}
              <div className="w-20 h-20 rounded-full bg-orange-400 flex items-center justify-center shadow-md mb-6">
                <span className="text-3xl font-bold text-white font-Grandstander">
                  {step.id}
                </span>
              </div>

              {/* Orange Separator Line */}
              <div className="w-12 h-1 bg-green-600 rounded-full mb-6"></div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SellRules;