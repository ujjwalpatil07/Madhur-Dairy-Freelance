import ProductProcess from "../components/ProductProcess";
import dairyImage from "../assets/dairyImage.png";
import AboutCard from "../components/AboutComponents/AboutCard";
import aboutData from "../data/about.json";
import { useEffect, useState } from "react";
import MadhurLoader from "../components/MadhurLoader";

export default function AboutPage() {

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Wait until browser has fully loaded (including images, fonts, etc.)
    const handleWindowLoad = () => {
      setPageLoading(false);
    };

    // If already loaded (e.g., fast refresh), skip
    if (document.readyState === "complete") {
      handleWindowLoad();
    } else {
      window.addEventListener("load", handleWindowLoad);
    }

    return () => {
      window.removeEventListener("load", handleWindowLoad);
    };
  }, []);

    if (pageLoading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black">
                <MadhurLoader />
            </div>
        );
    }

  return (
    <>
      <section
        className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px] overflow-hidden"
      >
        <img
          src={dairyImage}
          alt="About Us"
          className="w-full h-full object-cover"
        />
      </section>

      <section className="py-16 px-3 md:px-20 space-y-10">
        <div
          className="text-center flex flex-col mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-wide">
            WHO WE ARE?
          </h2>

          <div className="flex items-center gap-3 mt-2 mx-auto">
            <div className="w-10 h-[4px] rounded-sm dark:bg-white bg-black"></div>
            <div className="w-4 h-4 dark:bg-white rotate-45 bg-black rounded-sm"></div>
            <div className="w-10 h-[4px] rounded-sm dark:bg-white bg-black"></div>
          </div>
        </div>

        {aboutData.map((card, index) => (
          <AboutCard key={index * 0.8} {...card} reverse={index % 2 === 0} />
        ))}
      </section>

      <ProductProcess />
    </>
  );
}
