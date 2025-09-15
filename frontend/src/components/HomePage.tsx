import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/scholarship-hero.jpg";
import { useState } from "react";

const HomePage = () => {
  // Featured scholarships slider state
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const featuredItems = [
    { 
      id: 1,
      title: "SCHAFFTER INDIA SOCIAL INNOVATOR FELLOWSHIP PROGRAM 2025", 
      deadline: "September 15, 2025", 
      tag: "Security",
      tagColor: "bg-blue-100 text-blue-800"
    },
    { 
      id: 2,
      title: "DXC PROGRESSING MINDS SCHOLARSHIP 2025-28", 
      deadline: "September 30, 2025", 
      tag: "FCC",
      tagColor: "bg-green-100 text-green-800"
    },
    { 
      id: 3,
      title: "OAKNORTH STEM SCHOLARSHIP PROGRAMME 2025-28", 
      deadline: "October 10, 2025", 
      tag: "STEM Focus",
      tagColor: "bg-purple-100 text-purple-800"
    },
    { 
      id: 4,
      title: "BUDDYASTUDY 'EMPOWERING - SCHOLARSHIPS' TRAINING (BEST) PROGRAM", 
      deadline: "September 15, 2025", 
      tag: "Training Program",
      tagColor: "bg-orange-100 text-orange-800"
    },
  ];

  const nextFeatured = () => setCurrentFeatured((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
  const prevFeatured = () => setCurrentFeatured((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-900"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Empowering Education Through
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Scholarships
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Connect deserving students with life-changing scholarship opportunities. 
              Building bridges to brighter futures, one scholarship at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3">
                <GraduationCap className="w-5 h-5 mr-2" />
                Explore Scholarships
              </Button>
              <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scholarships Section with Carousel */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Scholarships</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Explore our curated list of prestigious scholarship opportunities.</p>
          </div>

          {/* Carousel Container */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Navigation Arrows */}
              <button 
                onClick={prevFeatured}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
                aria-label="Previous scholarship"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              
              <button 
                onClick={nextFeatured}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
                aria-label="Next scholarship"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>

              {/* Scholarship Card */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {featuredItems[currentFeatured].title}
                </h3>
                <div className="flex items-center text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Deadline: {featuredItems[currentFeatured].deadline}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${featuredItems[currentFeatured].tagColor}`}>
                    {featuredItems[currentFeatured].tag}
                  </span>
                  <a href="#" className="text-primary font-medium hover:underline flex items-center">
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {featuredItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeatured(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentFeatured ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to scholarship ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button variant="outline" size="lg">
              View All Scholarships
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-lg text-muted-foreground">Students Benefited</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">500+</div>
              <div className="text-lg text-muted-foreground">Partner Institutes</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">₹50Cr+</div>
              <div className="text-lg text-muted-foreground">Scholarships Awarded</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-foreground">ScholarSnap</span>
            </div>
            <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} ScholarSnap. All rights reserved.</div>
            <div className="flex gap-4 text-sm">
              <a className="text-muted-foreground hover:text-foreground" href="#">Privacy</a>
              <a className="text-muted-foreground hover:text-foreground" href="#">Terms</a>
              <a className="text-muted-foreground hover:text-foreground" href="#">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;