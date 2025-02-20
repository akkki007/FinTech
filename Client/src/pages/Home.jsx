import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactUs from "../components/ContactUs"
import Pricing from "../components/Pricing";
import Services from "../components/Services";
const cardData = [
  {
    title: "On Time Service",
    description: "It refers to the ability of a business to deliver products, services, or solutions within the promised timeframe. Timely service builds trust",
    linkText: "Read More",
    icon: (
      <img src="/images/card1.png" className="h-15 w-15 object-cover" alt="Home" />
    ),
  },
  {
    title: "Team of Professionals",
    description: "Effective communication, mutual respect, and shared objectives are essential for fostering a cohesive and productive team environment.",
    linkText: "Read More",
    icon: (
      <img src="/images/card2.png" className="h-15 w-15 object-cover" alt="Home" />
    ),
  },
  {
    title: "Analyze Your Business",
    description: "A thorough business analysis enables you to set realistic goals, allocate resources effectively, and mitigate risks. It fosters innovation and adaptability",
    linkText: "Read More",
    icon: (
      <img src="/images/card3.png" className="h-15 w-15 object-cover" alt="Home" />
    ),
  },
];

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Image Section */}
      <div className="relative h-screen w-full">
        <img src="/images/home2.jpg" className="h-full w-full object-cover" alt="Home" />
        <div className="absolute inset-0 bg-green-900 opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="mb-4 text-7xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Financial Expertise you can trust and secure.
          </h1>
          <p className="mb-6 text-2xl font-normal lg:text-xl px-4 md:px-16">
            Simplifies financial health with automated budgeting, expense tracking, and real-time insights.
          </p>
          <a href="#" className="px-5 py-3 bg-[#ECF39E] text-black rounded-lg hover:bg-[#ECF39E]">
            Get started
          </a>
        </div>
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-3 gap-20 p-30 bg-amber-50 ">
        {cardData.map((card, index) => (
          <div key={index} className="max-w-sm p-6 bg-white border rounded-lg shadow-sm dark:bg-[#cfed8b]">
            <div className="flex items-center gap-3">
              {card.icon}
              <h5 className="text-xl font-semibold text-gray-900 dark:text-black">{card.title}</h5>
            </div>

            <p className="ml-5 mt-6 mb-3 text-black dark:text-black">{card.description}</p>
            <a href="#" className="ml-5 text-black hover:underline hover:text-blue-600 flex items-center">
              {card.linkText}
              <svg className="w-3 h-3 ms-2.5" viewBox="0 0 18 18">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778" />
              </svg>
            </a>
          </div>
        ))}
      </div>
      {/* stats */}
      <section className="py-20 bg-[#e9f2cb]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-col flex-1 gap-10 lg:gap-0 lg:flex-row lg:justify-between">
            <div className="w-full lg:w-1/4 border-b pb-10 lg:border-b-0 lg:pb-0 lg:border-r border-gray-600">
              <div
                className="font-manrope font-bold text-5xl text-gray-900 mb-5 text-center ">
                260+
              </div>
              <span className="text-xl text-gray-500 text-center block ">Expert Consultants
              </span>
            </div>
            <div className="w-full lg:w-1/4 border-b pb-10 lg:border-b-0 lg:pb-0 lg:border-r border-gray-600">
              <div
                className="font-manrope font-bold text-5xl text-gray-900 mb-5 text-center ">
                975+
              </div>
              <span className="text-xl text-gray-500 text-center block ">Active Clients
              </span>
            </div>
            <div className="w-full lg:w-1/4 border-b pb-10 lg:border-b-0 lg:pb-0 lg:border-r border-gray-600">
              <div
                className="font-manrope font-bold text-5xl text-gray-900 mb-5 text-center ">
                724+
              </div>
              <span className="text-xl text-gray-500 text-center block ">Projects Delivered
              </span>
            </div>
            <div className="w-full lg:w-1/4  ">
              <div
                className="font-manrope font-bold text-5xl text-gray-900 mb-5 text-center ">
                89+
              </div>
              <span className="text-xl text-gray-500 text-center block ">Orders in Queue
              </span>
            </div>
          </div>
        </div>
    </section>
    <section className="py-24 relative xl:mr-0 lg:mr-5 mr-0 bg-amber-50">
        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto ">
          <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
            <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
              <div className="w-full flex-col justify-center items-start gap-8 flex">
                <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                  <h6 className="text-[#132a13] text-base font-normal leading-relaxed">About Us</h6>
                  <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                    <h2 className="text-[#132a13] text-4xl font-bold leading-normal lg:text-start text-center">
                      The Tale of Our Achievement Story
                    </h2>
                    <p className="text-[#4F772D] text-base font-normal leading-relaxed lg:text-start text-center">
                      Our achievement story is a testament to teamwork and perseverance. Together, we've overcome challenges, 
                      celebrated victories, and created a narrative of progress and success.
                    </p>
                  </div>
                </div>
                <div className="w-full flex-col justify-center items-start gap-6 flex">
                  <div className="w-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                    <div className="w-full h-full p-3.5 rounded-xl border border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                      <h4 className="text-[#132A13] text-2xl font-bold leading-9">33+ Years</h4>
                      <p className="text-[#31572C] text-base font-normal leading-relaxed">Influencing Digital Landscapes Together</p>
                    </div>
                    <div className="w-full h-full p-3.5 rounded-xl border border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                      <h4 className="text-[#132A13] text-2xl font-bold leading-9">125+ Projects</h4>
                      <p className="text-[#31572C] text-base font-normal leading-relaxed">Excellence Achieved Through Success</p>
                    </div>
                  </div>
                  <div className="w-full h-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                    <div className="w-full p-3.5 rounded-xl border border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                      <h4 className="text-[#132A13] text-2xl font-bold leading-9">26+ Awards</h4>
                      <p className="text-[#31572C] text-base font-normal leading-relaxed">Our Dedication to Innovation Wins Understanding</p>
                    </div>
                    <div className="w-full h-full p-3.5 rounded-xl border border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                      <h4 className="text-[#132A13] text-2xl font-bold leading-9">99% Happy Clients</h4>
                      <p className="text-[#31572C] text-base font-normal leading-relaxed">Mirrors our Focus on Client Satisfaction.</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="sm:w-fit w-full group px-3.5 py-2 bg-[#ECF39E] hover:bg-[#90A955] rounded-lg shadow-md transition-all duration-700 ease-in-out justify-center items-center flex">
                <span className="px-1.5 text-black text-sm font-medium leading-6 group-hover:-translate-x-0.5 transition-all duration-700 ease-in-out">
                  Read More
                </span>
                <svg className="group-hover:translate-x-0.5 transition-all duration-700 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996" stroke="#4F772D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="w-full lg:justify-start justify-center items-start flex">
              <div className="sm:w-[564px] w-full sm:h-[646px] h-full bg-[#90a955] rounded-3xl border border-[#90a955] relative shadow-2xl">
                <img className="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover" src="https://pagedone.io/asset/uploads/1717742431.png" alt="about Us image" />
              </div>
            </div>
          </div>
        </div>
      </section>
        <div>
          <Services/>
          </div>                               
      <div>
        <Pricing/>
      </div>
        <div>
          <ContactUs/>
        </div>
      <Footer />
    </>
  );
};

export default Home;
