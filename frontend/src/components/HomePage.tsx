import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, GraduationCap, Trophy, Zap, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { useNavigate } from "react-router-dom";

// Import hero image - use same pattern as other files
import heroImage from "@/assets/scholarship-hero.jpg";
import { useRef } from "react";

const HomePage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [statistics, setStatistics] = useState<{ scholarships: number | null; active: number | null }>({ scholarships: null, active: null });
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
    government: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    private: "bg-amber-50 text-amber-900 border border-amber-200",
    university: "bg-sky-50 text-sky-800 border border-sky-200",
    institute: "bg-rose-50 text-rose-800 border border-rose-200",
  };

  const typeToIcon: Record<string, any> = {
    government: <Trophy className="w-6 h-6" />,
    private: <Zap className="w-6 h-6" />,
    university: <GraduationCap className="w-6 h-6" />,
    institute: <Users className="w-6 h-6" />,
  };

  const typeToGradient: Record<string, string> = {
    government: "from-emerald-700 to-emerald-900",
    private: "from-amber-400 to-orange-500",
    university: "from-sky-700 to-teal-800",
    institute: "from-rose-600 to-orange-700",
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

  useEffect(() => {
    let cancelled = false;
    apiService.getStats()
      .then((response) => {
        if (cancelled || !response.success || !response.data) return;
        const data = response.data as any;
        setStatistics({
          scholarships: Number(data.total_scholarships ?? 0),
          active: Number(data.active_scholarships ?? 0),
        });
      })
      .catch(() => {
        if (!cancelled) setStatistics({ scholarships: null, active: null });
      });
    return () => { cancelled = true; };
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: heroImage ? `url(${heroImage})` : 'none' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-primary/75 to-primary/40"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Empowering Education Through
              <span className="block bg-gradient-to-r from-secondary to-secondary-glow bg-clip-text text-transparent">
                Scholarships
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Connect deserving students with life-changing scholarship opportunities. 
              Building bridges to brighter futures, one scholarship at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/all-scholarships")} className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3">
                <GraduationCap className="w-5 h-5 mr-2" />
                Explore Scholarships
              </Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate("about")} className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3">
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
              className="absolute left-0 top-1/2 z-10 -translate-x-6 -translate-y-1/2 rounded-md border border-border bg-card p-3 text-primary shadow-sm transition-colors hover:bg-muted"
              aria-label="Previous scholarship"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={nextFeatured}
              className="absolute right-0 top-1/2 z-10 translate-x-6 -translate-y-1/2 rounded-md border border-border bg-card p-3 text-primary shadow-sm transition-colors hover:bg-muted"
              aria-label="Next scholarship"
            >
              <ChevronRight className="w-6 h-6" />
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
                    className="group/card w-80 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    {/* Premium Card Header with gradient */}
                    <div className={`relative flex h-40 flex-col justify-between overflow-hidden bg-gradient-to-br p-6 ${typeToGradient[item.tag.toLowerCase()] || 'from-emerald-700 to-emerald-900'}`}>
                      <div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-white/95 text-2xl shadow-sm transition-transform duration-300 group-hover/card:scale-105">
                          {typeToIcon[item.tag.toLowerCase()] ? (
                            <div className={`${item.tag.toLowerCase() === 'government' ? 'text-emerald-800' : item.tag.toLowerCase() === 'private' ? 'text-amber-800' : item.tag.toLowerCase() === 'university' ? 'text-sky-800' : 'text-rose-800'}`}>
                              {typeToIcon[item.tag.toLowerCase()]}
                            </div>
                          ) : (
                            <GraduationCap className="h-6 w-6 text-primary" />
                          )}
                        </div>
                      </div>

                      {/* Top-right badge */}
                      <div className="flex justify-end">
                        <span className={`rounded-md bg-white/95 px-3 py-1.5 text-xs font-semibold ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Card Content */}
                    <div className="p-6 space-y-4">
                      {/* Title */}
                      <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover/card:text-primary">
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
                      <button
                        onClick={() => navigate(`/all-scholarships?search=${encodeURIComponent(item.title)}`)}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm flex items-center justify-center gap-2 group/btn"
                      >
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
              className="border-primary text-primary hover:bg-primary/5 font-semibold px-8"
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
          <div className="grid gap-8 text-center sm:grid-cols-2">
            <div>
              <div className="mb-2 text-4xl font-semibold text-primary md:text-5xl">{statistics.scholarships?.toLocaleString() ?? "—"}</div>
              <div className="text-lg text-muted-foreground">Scholarships listed</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-semibold text-secondary-foreground md:text-5xl">{statistics.active?.toLocaleString() ?? "—"}</div>
              <div className="text-lg text-muted-foreground">Currently active</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

