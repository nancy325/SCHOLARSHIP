import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Users, Target, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About Our Mission</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Dedicated to making quality education accessible to every deserving student through 
            comprehensive scholarship programs and institutional partnerships.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  To bridge the gap between talented students and quality education by providing 
                  comprehensive scholarship opportunities, institutional support, and career guidance. 
                  We believe that financial constraints should never be a barrier to achieving 
                  educational excellence.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Provide transparent and merit-based scholarship allocation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Support educational institutions in student development</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Create sustainable pathways for academic and career success</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-glow rounded-full flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  To create an inclusive educational ecosystem where every student, regardless of 
                  their economic background, has access to quality education and the opportunity 
                  to realize their full potential. We envision a future where scholarships are 
                  not just financial aid, but comprehensive support systems.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Establish nationwide network of educational partnerships</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Implement technology-driven scholarship management</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Foster innovation in educational accessibility</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Description */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Transforming Lives Through Education
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
            </div>
            
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
              <p className="text-lg mb-6">
                Our scholarship portal serves as a comprehensive platform connecting deserving students 
                with educational opportunities across India. Founded with the vision of democratizing 
                access to quality education, we have been instrumental in supporting thousands of 
                students in achieving their academic dreams.
              </p>
              
              <p className="text-lg mb-6">
                We work closely with educational institutions, government bodies, and private organizations 
                to create a robust ecosystem of support for students at every level of their educational 
                journey. From school scholarships to professional development programs, our platform 
                ensures that financial constraints never become barriers to learning.
              </p>

              <p className="text-lg mb-8">
                Our commitment extends beyond just financial assistance. We provide mentorship programs, 
                career guidance, and skill development opportunities to ensure that scholarship recipients 
                not only complete their education but also become valuable contributors to society.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mt-12">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">15+</div>
                <div className="text-sm text-muted-foreground">Years of Service</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-glow rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">28</div>
                <div className="text-sm text-muted-foreground">States Covered</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-glow rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                Have questions? We're here to help you on your educational journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Email Us</h3>
                  <p className="text-muted-foreground mb-4">Get in touch via email for detailed inquiries</p>
                  <p className="text-primary font-medium">info@scholarshipportal.in</p>
                  <p className="text-primary font-medium">support@scholarshipportal.in</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Call Us</h3>
                  <p className="text-muted-foreground mb-4">Speak directly with our support team</p>
                  <p className="text-secondary font-medium">+91 1800-123-4567</p>
                  <p className="text-muted-foreground text-sm mt-2">Mon-Fri, 9 AM - 6 PM</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Visit Us</h3>
                  <p className="text-muted-foreground mb-4">Our office location for in-person assistance</p>
                  <p className="text-primary font-medium">Education Tower, 5th Floor</p>
                  <p className="text-primary font-medium">Sector 18, Noida - 201301</p>
                  <p className="text-primary font-medium">Uttar Pradesh, India</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" onClick={() => navigate("/contact")} className="px-8">
                <Mail className="w-5 h-5 mr-2" />
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;