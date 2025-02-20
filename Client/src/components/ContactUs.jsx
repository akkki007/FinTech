import React from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Contact = () => {
    return (
        <>
            <div className="flex flex-col">
                <div className="mt-0">
                    <h3 className="font-manrope text-5xl text-center font-bold text-gray-900 bg-[#e9f2cb]">
                        Contact us
                    </h3>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center p-8 bg-[#e9f2cb]">
                    {/* Left Side - Contact Form */}
                    <div className="w-full md:w-1/2 bg-[#e9f2cb] p-8 shadow-lg shadow-lime-700 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-[#31572c]">Send us a Message</h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Name *"
                                    className="p-3 border rounded-md w-full border-[#4f772d] text-black"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    className="p-3 border rounded-md w-full border-[#4f772d] text-black"
                                />
                            </div>
                            <input
                                type="email"
                                placeholder="Email *"
                                className="p-3 border rounded-md w-full border-[#4f772d] text-black"
                            />
                            <input
                                type="text"
                                placeholder="Subject *"
                                className="p-3 border rounded-md w-full border-[#4f772d] text-black"
                            />
                            <textarea
                                placeholder="Message"
                                className="p-3 border rounded-md w-full h-32 border-[#4f772d] text-black"
                            ></textarea>
                            <button className="bg-[#31572c] text-white p-3 rounded-md w-full hover:bg-[#132a13]">
                                SEND MESSAGE
                            </button>
                        </form>
                    </div>

                    {/* Right Side - Info Cards & Map */}
                    <div className="w-full md:w-1/2 flex flex-col items-center md:ml-8 mt-8 md:mt-0">
                        {/* Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full">
                            {/* Address Card */}
                            <div className="bg-[#90a955] p-6 rounded-lg shadow-md flex items-center space-x-4">
                                <FaMapMarkerAlt className="text-white text-3xl" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Our Address</h3>
                                    <p className="text-white text-sm">132, Tic St, Kingston, NY 12401, USA</p>
                                </div>
                            </div>

                            {/* Opening Hours Card */}
                            <div className="bg-[#4f772d] p-6 rounded-lg shadow-md flex items-center space-x-4">
                                <FaClock className="text-white text-3xl" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Opening Hours</h3>
                                    <p className="text-white text-sm">Sat - Mon: 10 AM - 8 PM</p>
                                </div>
                            </div>
                        </div>

                        {/* Google Map */}
                        <iframe
                            className="w-full h-72 rounded-md shadow-lg border border-[#31572c]"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242118.1410851368!2d-74.25986779260588!3d40.697670063580234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c250b457aabcdf%3A0x7550d153b52d89b1!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1700000000000"
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Contact;