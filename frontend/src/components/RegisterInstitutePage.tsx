import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Phone, MapPin, CheckCircle } from "lucide-react";

const RegisterInstitutePage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    instituteName: "",
    email: "",
    contactNumber: "",
    address: "",
    district: "",
    state: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const requiredFields = ['instituteName', 'email', 'contactNumber', 'address', 'district', 'state'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate phone number (basic 10-digit validation)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber.replace(/[^\d]/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Details validated, not submitted",
      description: "Institute registration is not connected to the backend yet. Your entries are still in this form.",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Register Your Institute
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join our network of educational institutions and help us provide scholarship 
            opportunities to deserving students across India.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center border-0 shadow-md">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Wide Reach</h3>
                <p className="text-sm text-muted-foreground">Connect with thousands of qualified students nationwide</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-md">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Streamlined Process</h3>
                <p className="text-sm text-muted-foreground">Efficient application management and review system</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-md">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Dedicated Support</h3>
                <p className="text-sm text-muted-foreground">24/7 technical and administrative assistance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border border-border shadow-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Institute Registration Form
                </CardTitle>
                <p className="text-muted-foreground">
                  Review your institution details. Submission is not available until registration is connected to the service.
                </p>
              </CardHeader>
              
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Institute Name */}
                  <div className="space-y-2">
                    <Label htmlFor="instituteName" className="text-foreground font-medium">
                      Institute Name *
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="instituteName"
                        type="text"
                        placeholder="Enter your institute name"
                        value={formData.instituteName}
                        onChange={(e) => handleInputChange('instituteName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="institute@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="text-foreground font-medium">
                      Contact Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="contactNumber"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground font-medium">
                      Complete Address *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Textarea
                        id="address"
                        placeholder="Enter complete address with pincode"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="pl-10 min-h-[100px] resize-none"
                        required
                      />
                    </div>
                  </div>

                  {/* District and State */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district" className="text-foreground font-medium">
                        District *
                      </Label>
                      <Input
                        id="district"
                        type="text"
                        placeholder="Enter district name"
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-foreground font-medium">
                        State *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('state', value)} value={formData.state}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      By submitting this form, you agree to our Terms and Conditions and 
                      acknowledge that the information provided is accurate and complete. 
                      We will verify the details before activating your account.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Registering...
                      </>
                    ) : (
                      <>
                        <Building2 className="w-5 h-5 mr-2" />
                        Register Institute
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="mt-8 border border-border bg-muted/40 shadow-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Registration status</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Details entered here are validated in your browser only and have not been sent or saved.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterInstitutePage;