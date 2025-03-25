
import React from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Mail, 
  MapPin, 
  Phone,
  MessageSquare,
  Send
} from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to a server
    toast.success('Message sent successfully!', {
      description: 'We\'ll get back to you as soon as possible.',
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32">
        {/* Hero Section */}
        <section className="bg-secondary/50 py-20 mb-16">
          <div className="container-tight">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
              <p className="text-xl text-muted-foreground">
                Have questions about our cloud applications? We're here to help.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section className="container-tight mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <MessageSquare size={24} className="mr-3" />
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email address" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is this regarding?" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Type your message here..." 
                      className="min-h-[150px] resize-none"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full py-6" size="lg">
                    <Send size={16} className="mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-10">
                We'd love to hear from you. Reach out to us through any of the channels below, 
                or use the contact form to send us a message directly.
              </p>
              
              <div className="space-y-10">
                <div className="flex">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Mail size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Email Us</h3>
                    <p className="text-muted-foreground mb-2">For general inquiries:</p>
                    <a href="mailto:info@cloudapp.com" className="text-primary font-medium hover:underline">
                      info@cloudapp.com
                    </a>
                    <p className="text-muted-foreground mt-3 mb-2">For customer support:</p>
                    <a href="mailto:support@cloudapp.com" className="text-primary font-medium hover:underline">
                      support@cloudapp.com
                    </a>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Phone size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Call Us</h3>
                    <p className="text-muted-foreground mb-2">Customer Service:</p>
                    <a href="tel:+1234567890" className="text-primary font-medium hover:underline">
                      +1 (234) 567-890
                    </a>
                    <p className="text-muted-foreground mt-3 mb-2">Technical Support:</p>
                    <a href="tel:+1234567890" className="text-primary font-medium hover:underline">
                      +1 (234) 567-891
                    </a>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <MapPin size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Visit Us</h3>
                    <p className="text-muted-foreground mb-2">Headquarters:</p>
                    <address className="not-italic">
                      123 Cloud Lane<br />
                      San Francisco, CA 94105<br />
                      United States
                    </address>
                    <p className="text-muted-foreground mt-4">
                      <span className="font-medium">Hours:</span> Monday-Friday, 9am-5pm PST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="bg-white py-20 mb-20">
          <div className="container-tight">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">
                Find quick answers to common questions about our cloud applications
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-secondary/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">How do cloud applications work?</h3>
                <p className="text-muted-foreground">
                  Cloud applications run on our servers instead of your local device. You access them through your web browser, which means you don't need to install software or have high-end hardware to use advanced features.
                </p>
              </div>
              
              <div className="bg-secondary/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">Do I need an internet connection?</h3>
                <p className="text-muted-foreground">
                  Yes, you need an internet connection to use our cloud applications. However, some apps offer limited offline functionality with synchronization when you reconnect.
                </p>
              </div>
              
              <div className="bg-secondary/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">How is my data secured?</h3>
                <p className="text-muted-foreground">
                  We use industry-standard encryption protocols to secure your data both in transit and at rest. Our infrastructure is hosted in secure data centers with multiple redundancies.
                </p>
              </div>
              
              <div className="bg-secondary/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">Can I upgrade or downgrade my plan?</h3>
                <p className="text-muted-foreground">
                  Yes, you can change your subscription plan at any time. When upgrading, you'll have immediate access to new features. Downgrades take effect at the end of your current billing cycle.
                </p>
              </div>
              
              <div className="bg-secondary/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards and PayPal. For enterprise customers, we also offer invoice-based payment options.
                </p>
              </div>
              
              <div className="bg-secondary/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">Is there a free trial available?</h3>
                <p className="text-muted-foreground">
                  Yes, most of our applications come with a 14-day free trial with full functionality. No credit card is required to start your trial.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
