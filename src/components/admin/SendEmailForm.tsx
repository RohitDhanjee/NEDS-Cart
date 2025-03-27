
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';

interface SendEmailFormProps {
  customerEmail: string;
  customerName?: string;
  onClose: () => void;
}

export const SendEmailForm = ({ 
  customerEmail, 
  customerName, 
  onClose 
}: SendEmailFormProps) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending email - in a real app, you would call an API or edge function
    setTimeout(() => {
      toast.success(`Email sent to ${customerEmail}`);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Send Email to {customerName || 'Customer'}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="recipient">Recipient</Label>
          <Input id="recipient" value={customerEmail} disabled />
        </div>
        
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input 
            id="subject" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            placeholder="Enter email subject" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea 
            id="message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Write your message here..." 
            rows={6} 
            required 
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : 'Send Email'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
