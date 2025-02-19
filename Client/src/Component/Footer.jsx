import React from "react";
import { FaPhone, FaGlobe, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" w-full bg-gray-900 text-white p-6 md:p-10">
      <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left Side */}
        <div>
          <h2 className="text-2xl font-semibold uppercase">Mitchel <span className="font-bold">Smith</span></h2>
          <p className="text-sm text-gray-400">Graphic Designer</p>
          <p className="text-gray-400 mt-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-green-500"><FaFacebookF /></a>
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-green-500"><FaTwitter /></a>
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-green-500"><FaLinkedinIn /></a>
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-green-500"><FaInstagram /></a>
          </div>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 mt-6 md:mt-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaPhone className="text-green-500" />
              <p>000 1234 5678</p>
            </div>
            <div className="flex items-center space-x-3">
              <FaGlobe className="text-green-500" />
              <p>your website goes here</p>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-green-500" />
              <p>your email goes here</p>
            </div>
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-green-500" />
              <p>your street address, Singapore 56789</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Green Gradient Effect */}
      {/* <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-r from-green-500 to-green-700 clip-path-triangle"></div> */}
    </footer>
  );
};

export default Footer;
