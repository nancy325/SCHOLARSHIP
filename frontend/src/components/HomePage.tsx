import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, GraduationCap, Trophy, Zap, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { useNavigate } from "react-router-dom";

// Import hero image - use same pattern as other files
import heroImage from "@/assets/scholarship-hero.jpg";
import { useRef } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  type FeaturedItem = {
    id: number;
    title: string;
    deadline: string | null;
    tag: string;
    tagColor: string;
  };

  // Map scholarship type to tag styles and icons
  const typeToTagColor: Record<string, string> = {
    government: "bg-blue-50 text-blue-700 border border-blue-200",
    private: "bg-green-50 text-green-700 border border-green-200",
    university: "bg-purple-50 text-purple-700 border border-purple-200",
    institute: "bg-orange-50 text-orange-700 border border-orange-200",
  };

  const typeToIcon: Record<string, any> = {
    government: <Trophy className="w-6 h-6" />,
    private: <Zap className="w-6 h-6" />,
    university: <GraduationCap className="w-6 h-6" />,
    institute: <Users className="w-6 h-6" />,
  };

  const typeToGradient: Record<string, string> = {
    government: "from-blue-500 to-blue-600",
    private: "from-green-500 to-green-600",
    university: "from-purple-500 to-purple-600",
    institute: "from-orange-500 to-orange-600",
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
    const scrollAmount = 336; // w-80 (320px) + gap-6 (24px) + buffer
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  
  const prevFeatured = () => {
    if (!carouselRef.current) return;
    const scrollAmount = 336; // w-80 (320px) + gap-6 (24px) + buffer
    carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  // Carousel ref for future use (e.g., scroll, focus)
  const carouselRefCheck = useRef<HTMLDivElement>(null);

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

      {/* Featured Scholarships Section with Carousel */}
      <section className="py-20 bg-gradient-to-b from-background to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Featured Scholarships</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover premium scholarship opportunities tailored for your success.</p>
          </div>

          {/* Carousel Container */}
          <div className="relative group">
            {/* Navigation Arrows */}
            <button 
              onClick={prevFeatured}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300 group-hover:scale-110"
              aria-label="Previous scholarship"
            >
              <ChevronLeft className="w-6 h-6 text-blue-600" />
            </button>
            
            <button 
              onClick={nextFeatured}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300 group-hover:scale-110"
              aria-label="Next scholarship"
            >
              <ChevronRight className="w-6 h-6 text-blue-600" />
            </button>

            {/* Carousel Track */}
            <div 
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-12"
            >
              {featuredItems.length > 0 ? (
                featuredItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group/card border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
                  >
                    {/* Premium Card Header with gradient */}
                    <div className={`h-40 bg-gradient-to-br ${typeToGradient[item.tag.toLowerCase()] || 'from-blue-500 to-blue-600'} p-6 flex flex-col justify-between relative overflow-hidden`}>
                      {/* Decorative shapes */}
                      <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/20 rounded-full"></div>
                      <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
                      
                      <div className="relative">
                        <div className="w-14 h-14 bg-white/95 rounded-xl shadow-md flex items-center justify-center text-2xl group-hover/card:scale-110 transition-transform duration-300">
                          {typeToIcon[item.tag.toLowerCase()] ? (
                            <div className={`${item.tag.toLowerCase() === 'government' ? 'text-blue-600' : item.tag.toLowerCase() === 'private' ? 'text-green-600' : item.tag.toLowerCase() === 'university' ? 'text-purple-600' : 'text-orange-600'}`}>
                              {typeToIcon[item.tag.toLowerCase()]}
                            </div>
                          ) : (
                            '🎓'
                          )}
                        </div>
                      </div>

                      {/* Top-right badge */}
                      <div className="flex justify-end">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-white/95 ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Card Content */}
                    <div className="p-6 space-y-4">
                      {/* Title */}
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-blue-600 group-hover/card:to-purple-600 transition-all duration-300">
                        {item.title}
                      </h3>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-gray-200 to-transparent"></div>

                      {/* Deadline Info - Enhanced */}
                      <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg border border-orange-100">
                        <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-600 font-medium">Application Deadline</span>
                          <span className="text-sm font-bold text-orange-700">{item.deadline || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Action Button - Enhanced */}
                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 group/btn hover:from-blue-700 hover:to-purple-700">
                        View Details
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
          
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/all-scholarships")}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold px-8"
            >
              Explore All Scholarships
              <ArrowRight className="w-5 h-5 ml-2" />
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

