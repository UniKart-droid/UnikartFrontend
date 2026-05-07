import React from "react";

const CardDesign = ({
  image,         
  title,         
  description,   
  price,         
  noticeDate,    
  buttonText,    
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
      
      
      {image && (
        <div className="overflow-hidden relative rounded-t-2xl">
          <img
            src={image}
            alt={title}
            className="w-full h-52 object-cover transform group-hover:scale-105 transition duration-500"
          />
          
          <div className="absolute inset-0 linear-gradient(to top, rgba(0,0,0,0.1), transparent) from-black/10 to-transparent transition duration-300"></div>
        </div>
      )}

      {/* Content */}
      <div className={`p-6 flex flex-col justify-between ${!image ? "h-auto" : "h-64"}`}>
        
        {/* Title + Description */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition duration-300">
            {title}
          </h2>

          <p className="text-gray-600 mt-2 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Notice Date (optional) */}
          {noticeDate && (
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <span className="mr-1">📅</span> {noticeDate}
            </p>
          )}

          {/* Price (optional) */}
          {price && (
            <p className="text-orange-500 font-semibold mt-2 text-sm">
              {price}
            </p>
          )}
        </div>

        {/* Button */}
        <div>
          <button className="mt-4 w-full bg-orange-500 text-white font-semibold py-2.5 rounded-full shadow-md hover:bg-orange-600 hover:shadow-lg active:scale-95 transition duration-300 text-sm">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDesign;