import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Photographers/Videographers",
    slug: "photographers",
    icon: "/assets/Photographers and Videographers.png",
    customIcon: true,
    color: "from-red-500 to-red-600",
    count: "120+"
  },
  {
    name: "Venues",
    slug: "venues",
    icon: "/assets/Venues.png",
    customIcon: true,
    color: "from-teal-500 to-teal-600",
    count: "85+"
  },
  {
    name: "Caterers",
    slug: "caterers",
    icon: "/assets/Caterers.png",
    customIcon: true,
    color: "from-yellow-500 to-yellow-600",
    count: "95+"
  },
  {
    name: "Bands",
    slug: "bands",
    icon: "/assets/Bands.png",
    customIcon: true,
    color: "from-purple-500 to-purple-600",
    count: "25+"
  },
  {
    name: "DJs",
    slug: "djs",
    icon: "/assets/DJs.png",
    customIcon: true,
    color: "from-indigo-500 to-indigo-600",
    count: "20+"
  },
  {
    name: "Makeup Artists",
    slug: "makeup-artists",
    icon: "/assets/Makeup Artists.png",
    customIcon: true,
    color: "from-pink-500 to-rose-500",
    count: "60+"
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 shell-pattern opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 md:mb-20">
          <p className="wedding-script text-xl md:text-2xl text-red-500 mb-3 md:mb-4">
            Our Services
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-slate-800 mb-4 md:mb-6 section-title-mobile px-4 sm:px-0">
            Wedding Categories
          </h2>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-red-500 to-teal-500 mx-auto mb-4 md:mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed section-subtitle-mobile px-4 sm:px-0">
            Discover our handpicked collection of Goa's most talented wedding professionals.
            Each category features trusted vendors who specialize in creating magical moments.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 md:gap-12 lg:gap-16 max-w-6xl mx-auto">
          {categories.map((category) => (
            <Link key={category.slug} href={`/vendors/${category.slug}`}>
              <div className="group cursor-pointer transition-all duration-500 transform hover:-translate-y-3">
                {/* Icon container - Only the icon, no text */}
                <div className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden mx-auto group-hover:scale-110 transition-all duration-500 shadow-lg bg-transparent">
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <Link href="/vendors/all">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
              <span>Explore All Vendors</span>
              <i className="fas fa-chevron-right"></i>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
