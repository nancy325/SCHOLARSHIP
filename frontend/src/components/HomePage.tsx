import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";

// Import hero image - use same pattern as other files
import heroImage from "@/assets/scholarship-hero.jpg";

const HomePage = () => {
  // Featured scholarships carousel state
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  type FeaturedItem = {
    id: number;
    title: string;
    deadline: string | null;
    tag: string;
    tagColor: string;
  };

  // Map scholarship type to tag styles (keeps UI consistent)
  const typeToTagColor: Record<string, string> = {
    government: "bg-blue-100 text-blue-800",
    private: "bg-green-100 text-green-800",
    university: "bg-purple-100 text-purple-800",
    institute: "bg-orange-100 text-orange-800",
  };

  useEffect(() => {
    let cancelled = false;
    const loadScholarships = async () => {
      try {
        const res = await apiService.getScholarships({ per_page: 10 });
        console.log("HomePage: scholarships API response", res);
        const top = (res as any)?.data;
        const list = Array.isArray(top) ? top : (top?.data ?? []);
        const mapped: FeaturedItem[] = Array.isArray(list)
          ? list.map((s: any) => ({
              id: s.id,
              title: s.title,
              deadline: s.deadline ?? null,
              tag: s.type ? String(s.type).charAt(0).toUpperCase() + String(s.type).slice(1) : "Scholarship",
              tagColor: s.type && typeToTagColor[s.type] ? typeToTagColor[s.type] : "bg-gray-100 text-gray-800",
            }))
          : [];
        if (!cancelled) {
          setFeaturedItems(mapped);
          console.log("HomePage: mapped featured items", mapped);
        }
      } catch (e) {
        console.error("Failed to load scholarships", e);
        if (!cancelled) setFeaturedItems([]);
      }
    };
    loadScholarships();
    return () => {
      cancelled = true;
    };
  }, []);

  const nextFeatured = () => {
    if (!carouselRef.current) return;
    const cardWidth = 320; // Width of each card (w-80 = 320px) + gap (24px)
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  
  const prevFeatured = () => {
    if (!carouselRef.current) return;
    const cardWidth = 320;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: heroImage ? `url(${heroImage})` : 'none' }}
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

      {/* Featured Scholarships Section with Horizontal Carousel */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Scholarships</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Explore our curated list of prestigious scholarship opportunities.</p>
          </div>

          {/* Horizontal Carousel Container */}
          <div className="relative group">
            {/* Left Navigation Arrow */}
            <button 
              onClick={prevFeatured}
              className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous scholarship"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            
            {/* Right Navigation Arrow */}
            <button 
              onClick={nextFeatured}
              className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next scholarship"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>

            {/* Carousel Track */}
            <div 
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {featuredItems.length > 0 ? (
                featuredItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex-shrink-0 w-80 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group/card border border-gray-100"
                  >
                    {/* Card Header */}
                    <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 p-4 flex items-end">
                      <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">🏢</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 text-base mb-3 line-clamp-2 group-hover/card:text-blue-600 transition-colors">
                        {item.title}
                      </h3>

                      {/* Metadata */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Deadline: <span className="font-semibold text-orange-600">{item.deadline || 'N/A'}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.tagColor}`}>
                            {item.tag}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow-md">
                        View Detail
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full flex items-center justify-center py-12">
                  <p className="text-muted-foreground">No featured scholarships available</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/all-scholarships")}
            >
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
    </div>
  );
};

export default HomePage;