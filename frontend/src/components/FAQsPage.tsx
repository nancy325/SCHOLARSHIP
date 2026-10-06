import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FAQsPage = () => {
  const navigate = useNavigate();
  const faqCategories = [
    {
      category: "General Information",
      icon: <HelpCircle className="w-5 h-5" />,
      faqs: [
        {
          question: "What is the Scholarship Portal?",
          answer: "Our Scholarship Portal is a comprehensive platform that connects deserving students with various scholarship opportunities across India. We partner with educational institutions, government bodies, and private organizations to provide financial assistance and support for students at all academic levels."
        },
        {
          question: "Who can apply for scholarships?",
          answer: "Students from all backgrounds can apply for scholarships through our portal. Eligibility criteria vary by scholarship type and may include academic merit, financial need, specific course requirements, or demographic criteria. Each scholarship listing includes detailed eligibility requirements."
        },
        {
          question: "Is the platform free to use?",
          answer: "Yes, our scholarship portal is completely free for students to use. There are no registration fees, application fees, or hidden charges. We believe that access to educational opportunities should not come with financial barriers."
        }
      ]
    },
    {
      category: "Application Process",
      icon: <FileText className="w-5 h-5" />,
      faqs: [
        {
          question: "How do I apply for a scholarship?",
          answer: "To apply for a scholarship: 1) Create a free account on our portal, 2) Complete your profile with accurate information, 3) Browse available scholarships and check eligibility criteria, 4) Submit your application with required documents, 5) Track your application status through your dashboard."
        },
        {
          question: "What documents are required for scholarship applications?",
          answer: "Commonly required documents include: Academic transcripts and certificates, Income certificate, Caste certificate (if applicable), Bank account details, Passport-size photographs, Aadhar card, and specific documents mentioned in individual scholarship requirements."
        },
        {
          question: "Can I apply for multiple scholarships?",
          answer: "Yes, you can apply for multiple scholarships as long as you meet the eligibility criteria for each. However, please note that some scholarships may have restrictions on receiving multiple awards simultaneously. Always read the terms and conditions carefully."
        },
        {
          question: "How long does the application process take?",
          answer: "The application processing time varies by scholarship type. Most applications are reviewed within 2-4 weeks after the deadline. You will receive updates on your application status via email and through your portal dashboard."
        }
      ]
    },
    {
      category: "For Institutions",
      icon: <Users className="w-5 h-5" />,
      faqs: [
        {
          question: "How can our institution partner with you?",
          answer: "Educational institutions can partner with us by registering through our 'Register Institute' page. After verification, you can post scholarship opportunities, manage applications, and access our comprehensive database of qualified students."
        },
        {
          question: "What are the benefits of partnering with the portal?",
          answer: "Benefits include: Access to a large pool of qualified candidates, Streamlined application and review process, Comprehensive reporting and analytics, Dedicated support team, and Enhanced visibility for your scholarship programs."
        },
        {
          question: "Is there a fee for institutions to use the platform?",
          answer: "We offer different partnership tiers. Basic partnership is free for educational institutions, while premium features may have associated costs. Contact our institutional partnerships team for detailed pricing information."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: <MessageCircle className="w-5 h-5" />,
      faqs: [
        {
          question: "I'm having trouble accessing my account. What should I do?",
          answer: "If you're experiencing login issues: 1) Try resetting your password using the 'Forgot Password' link, 2) Clear your browser cache and cookies, 3) Ensure you're using the correct email address, 4) Contact our support team if the problem persists."
        },
        {
          question: "How do I update my profile information?",
          answer: "Log into your account and navigate to 'My Profile' section. Click 'Edit Profile' to update your personal information, academic details, and contact information. Remember to save changes and update any relevant documents if needed."
        },
        {
          question: "What should I do if I don't receive email notifications?",
          answer: "Check your spam/junk folder first. Add our email domain to your safe sender list. Verify that your email address in your profile is correct. If you still don't receive emails, contact our technical support team."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our scholarship portal, application process, 
            and how we can help you achieve your educational goals.
          </p>
        </div>
      </section>

      {/* Quick Help Cards */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">General Info</h3>
                <p className="text-sm text-muted-foreground">Learn about our platform</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-glow rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Applications</h3>
                <p className="text-sm text-muted-foreground">How to apply for scholarships</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">For Institutions</h3>
                <p className="text-sm text-muted-foreground">Partnership information</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-glow rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Tech Support</h3>
                <p className="text-sm text-muted-foreground">Technical assistance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mr-4">
                    {category.icon}
                    <span className="text-white"></span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {category.category}
                  </h2>
                </div>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border border-border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't find the answer you're looking for? Our support team is here to help you 
              with any questions or concerns you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/contact")} className="px-8">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/all-scholarships")} className="px-8">
                <FileText className="w-5 h-5 mr-2" />
                Browse Help Center
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Response time: Usually within 24 hours
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQsPage;