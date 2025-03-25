
import React from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { 
  Users, 
  Code, 
  Rocket, 
  Heart, 
  CheckCircle2
} from 'lucide-react';

const AboutFeature = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32">
        {/* Hero Section */}
        <section className="bg-secondary/50 py-20 mb-16">
          <div className="container-tight">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About CloudApp</h1>
              <p className="text-xl text-muted-foreground">
                We're on a mission to make premium cloud applications accessible to everyone, 
                without the complexity or hardware limitations.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="container-tight mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-6">
                CloudApp began with a simple idea: powerful software shouldn't require powerful hardware. 
                Founded in 2023, we set out to create a platform where anyone could access professional-grade 
                applications through the cloud, paying only for what they need.
              </p>
              <p className="text-muted-foreground mb-6">
                Our team of cloud computing experts and software developers work tirelessly to optimize 
                each application for performance, security, and user experience. We've partnered with industry 
                leaders to ensure our offerings meet the highest standards.
              </p>
              <p className="text-muted-foreground">
                Today, CloudApp serves thousands of customers across the globe, from individual creators 
                to enterprise teams, all benefiting from the flexibility and power of cloud computing.
              </p>
            </div>
            
            <div className="relative">
              <div className="w-full aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-bold mb-4">2023</h3>
                    <p className="text-muted-foreground mb-6">Year Founded</p>
                    
                    <h3 className="text-2xl font-bold mb-4">4</h3>
                    <p className="text-muted-foreground mb-6">Cloud Application Categories</p>
                    
                    <h3 className="text-2xl font-bold mb-4">2,000+</h3>
                    <p className="text-muted-foreground">Satisfied Customers</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl blur-xl -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/5 rounded-2xl blur-xl -z-10"></div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="bg-white py-20 mb-20">
          <div className="container-tight">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="section-title">Our Values</h2>
              <p className="section-subtitle">
                These core principles guide everything we do at CloudApp
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AboutFeature 
                icon={<Users size={28} />}
                title="Customer First"
                description="We prioritize our customers' needs in every decision we make, ensuring our platform delivers exceptional value."
              />
              
              <AboutFeature 
                icon={<Code size={28} />}
                title="Technical Excellence"
                description="We're committed to building robust, high-performance cloud applications with intuitive interfaces."
              />
              
              <AboutFeature 
                icon={<Rocket size={28} />}
                title="Continuous Innovation"
                description="We constantly explore new technologies and approaches to improve our offerings and user experience."
              />
              
              <AboutFeature 
                icon={<Heart size={28} />}
                title="Accessibility"
                description="We believe everyone should have access to professional tools, regardless of their hardware or technical expertise."
              />
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="container-tight mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">No Hardware Limitations</h3>
                    <p className="text-muted-foreground">
                      Run demanding applications on any device without worrying about hardware requirements. Our cloud infrastructure handles the heavy lifting.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Pay Only For What You Need</h3>
                    <p className="text-muted-foreground">
                      Our flexible pricing model lets you select only the features you need, with the option to upgrade as your requirements grow.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Security First Approach</h3>
                    <p className="text-muted-foreground">
                      We implement enterprise-grade security measures to ensure your data and work are protected at all times.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Exceptional Support</h3>
                    <p className="text-muted-foreground">
                      Our dedicated support team is available to help you with any questions or issues you might encounter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">Why Choose CloudApp</h2>
              <p className="text-muted-foreground mb-8">
                We're not just another software provider. CloudApp delivers a transformative experience 
                that removes traditional barriers to professional tools, enabling you to focus on what matters most: your work.
              </p>
              <div className="relative rounded-xl overflow-hidden aspect-video">
                <img 
                  src="/placeholder.svg" 
                  alt="Why Choose CloudApp" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-8 text-white">
                    <p className="font-medium">Cloud computing that feels local</p>
                    <h3 className="text-2xl font-bold">Experience the difference</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
