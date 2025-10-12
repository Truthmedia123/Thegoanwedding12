import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About TheGoanWedding.com
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Connecting couples with Goa's finest wedding vendors to create unforgettable celebrations
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                TheGoanWedding.com was born from a passion to showcase the rich cultural heritage 
                of Goan weddings while connecting couples with the most talented and reliable wedding 
                vendors across Goa.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We believe every wedding should be a perfect blend of tradition and modernity, 
                reflecting the unique cultural heritage that makes Goan celebrations so special.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our platform serves as a bridge between couples planning their dream wedding and 
                the exceptional professionals who can bring those dreams to life.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Beautiful Goan wedding ceremony"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl" 
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-red-500 to-teal-500 rounded-2xl opacity-20"></div>
            </div>
          </div>
        </section>


        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-heart text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Authenticity</h3>
                <p className="text-gray-600 leading-relaxed">
                  We celebrate genuine Goan traditions and ensure every vendor represents 
                  the authentic spirit of Goan hospitality and craftsmanship.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-award text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  We maintain the highest standards by carefully curating our vendor network 
                  and ensuring exceptional service quality for every wedding.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-users text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Community</h3>
                <p className="text-gray-600 leading-relaxed">
                  We foster a supportive community of couples, vendors, and wedding professionals 
                  who share our passion for creating magical celebrations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Wedding planning and vendor coordination"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl" 
              />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-teal-500 to-yellow-500 rounded-2xl opacity-20"></div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                What We Offer
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-search text-white text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Comprehensive Vendor Directory</h3>
                    <p className="text-gray-600">
                      Access to hundreds of carefully curated wedding vendors across all categories, 
                      from photographers to caterers, venues to decorators.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-teal-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-star text-white text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Authentic Reviews & Ratings</h3>
                    <p className="text-gray-600">
                      Honest feedback from real couples to help you make informed decisions 
                      about your wedding vendors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-yellow-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-phone text-white text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Direct Communication</h3>
                    <p className="text-gray-600">
                      Connect directly with vendors through email or contact forms 
                      for seamless coordination and planning.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-blog text-white text-sm"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Wedding Inspiration & Tips</h3>
                    <p className="text-gray-600">
                      Expert advice, latest trends, and cultural insights to help you plan 
                      the perfect Goan wedding celebration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-red-500 to-teal-500 text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Our Impact
                </h2>
                <p className="text-xl opacity-90">
                  Trusted by couples and vendors across Goa
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                  <p className="opacity-90">Trusted Vendors</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
                  <p className="opacity-90">Happy Couples</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">2500+</div>
                  <p className="opacity-90">Successful Events</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
                  <p className="opacity-90">Vendor Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <Card className="bg-white shadow-xl">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Ready to Start Planning?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Let us help you find the perfect vendors for your dream Goan wedding. 
                Get in touch with our team today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact"
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg inline-block"
                >
                  <i className="fas fa-envelope mr-2"></i>Get in Touch
                </a>
                <a 
                  href="mailto:info@thegoanwedding.com?subject=Inquiry from TheGoanWedding.com"
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg inline-block"
                >
                  <i className="fas fa-envelope mr-2"></i>Email Us
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
