import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-10 bg-muted/30 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground">ScholarSnap</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {currentYear} ScholarSnap. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm">
            <Link to="/contact" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link to="/all-scholarships" className="text-muted-foreground hover:text-foreground">
              Scholarships
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

