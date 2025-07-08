
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  GeneralSettings, 
  PaymentSettings,
  EmailSettings,
  SecuritySettings 
} from '@/types/appSettings';

interface SettingsContextType {
  generalSettings: GeneralSettings | null;
  paymentSettings: PaymentSettings | null;
  emailSettings: EmailSettings | null;
  securitySettings: SecuritySettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultGeneralSettings: GeneralSettings = {
  storeName: 'Cloud App Store',
  storeEmail: 'contact@cloudappstore.com',
  storeDescription: 'We sell the best cloud solutions for your business needs.',
  enableCustomerAccounts: true,
  enableReviews: true,
};

const SettingsContext = createContext<SettingsContextType>({
  generalSettings: defaultGeneralSettings,
  paymentSettings: null,
  emailSettings: null,
  securitySettings: null,
  loading: true,
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(defaultGeneralSettings);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [emailSettings, setEmailSettings] = useState<EmailSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch general settings
      const { data: generalData, error: generalError } = await supabase.rpc(
        'get_settings' as any, 
        { setting_type: 'general' }
      );
        
      if (generalData && !generalError) {
        setGeneralSettings(generalData as any);
      } else if (generalError) {
        console.error("Error fetching general settings:", generalError);
      }
      
      // Fetch payment settings
      const { data: paymentData, error: paymentError } = await supabase.rpc(
        'get_settings' as any, 
        { setting_type: 'payment' }
      );
        
      if (paymentData && !paymentError) {
        setPaymentSettings(paymentData as any);
      }
      
      // Fetch email settings
      const { data: emailData, error: emailError } = await supabase.rpc(
        'get_settings' as any, 
        { setting_type: 'email' }
      );
        
      if (emailData && !emailError) {
        setEmailSettings(emailData as any);
      }
      
      // Fetch security settings
      const { data: securityData, error: securityError } = await supabase.rpc(
        'get_settings' as any, 
        { setting_type: 'security' }
      );
        
      if (securityData && !securityError) {
        setSecuritySettings(securityData as any);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load application settings');
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider 
      value={{ 
        generalSettings, 
        paymentSettings, 
        emailSettings, 
        securitySettings, 
        loading,
        refreshSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);