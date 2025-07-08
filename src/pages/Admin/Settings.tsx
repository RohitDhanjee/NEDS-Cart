
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Save, RefreshCw, Shield, CreditCard, Globe, Bell, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings } from '@/contexts/Settingscontext';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { 
  GeneralSettings,
  PaymentSettings,
  EmailSettings,
  SecuritySettings
} from '@/types/appSettings';

const AdminSettings = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const { refreshSettings } = useSettings();
  const navigate = useNavigate();
  
  // State for settings forms
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    storeName: 'Cloud App Store',
    storeEmail: 'contact@cloudappstore.com',
    storeDescription: 'We sell the best cloud solutions for your business needs.',
    enableCustomerAccounts: true,
    enableReviews: true,
  });
  
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripeEnabled: false,
    stripeApiKey: '',
    paypalEnabled: false,
    paypalClientId: '',
    currencyCode: 'USD',
    taxRate: '8.5',
  });
  
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    sendOrderConfirmation: true,
    sendShippingUpdates: true,
    sendPromotionalEmails: false,
    emailFooterText: 'Thanks for shopping with us!',
  });
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    enableTwoFactorAuth: false,
    requireStrongPasswords: true,
    autoLogoutAfterMinutes: '30',
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin/login');
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error || !data) {
        toast.error('Unauthorized access');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      
      await loadSettings();
      
      setIsLoading(false);
    };

    const loadSettings = async () => {
      try {
        // Using any type explicitly to bypass the TypeScript error for now
        // Fetch general settings
        const { data: generalData, error: generalError } = await supabase.rpc(
          'get_settings' as any, 
          { setting_type: 'general' }
        );
          
        if (generalData && !generalError) {
          setGeneralSettings(generalData as any);
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
        toast.error('Failed to load settings');
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSaveSettings = async (settingType: string) => {
    setIsSaving(settingType);
    
    try {
      let settingsData;
      let typeKey = '';
      
      switch (settingType) {
        case 'General':
          settingsData = generalSettings;
          typeKey = 'general';
          break;
        case 'Payment':
          settingsData = paymentSettings;
          typeKey = 'payment';
          break;
        case 'Email':
          settingsData = emailSettings;
          typeKey = 'email';
          break;
        case 'Security':
          settingsData = securitySettings;
          typeKey = 'security';
          break;
        default:
          throw new Error('Invalid settings type');
      }
      
      // Use RPC to save settings with type assertion to bypass TypeScript error
      const { data, error } = await supabase.rpc(
        'save_settings' as any, 
        { 
          setting_type: typeKey, 
          setting_data: settingsData 
        }
      );
      
      if (error) {
        console.error('Error saving settings:', error);
        throw error;
      }
      
      // Refresh the global settings context to update all components
      await refreshSettings();
      
      toast.success(`${settingType} settings saved successfully`);
    } catch (error) {
      console.error(`Error saving ${settingType} settings:`, error);
      toast.error(`Failed to save ${settingType} settings`);
    } finally {
      setIsSaving(null);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center px-2">
              <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <a href="/admin/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Products">
                  <a href="/admin/products">
                    <Package className="h-4 w-4" />
                    <span>Products</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Orders">
                  <a href="/admin/orders">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Orders</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Customers">
                  <a href="/admin/customers">
                    <Users className="h-4 w-4" />
                    <span>Customers</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={true} tooltip="Settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
          
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full max-w-3xl">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payment</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure the basic information for your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="storeName" className="text-sm font-medium">Store Name</label>
                    <Input 
                      id="storeName" 
                      value={generalSettings.storeName}
                      onChange={(e) => setGeneralSettings({...generalSettings, storeName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="storeEmail" className="text-sm font-medium">Store Email</label>
                    <Input 
                      id="storeEmail" 
                      type="email"
                      value={generalSettings.storeEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, storeEmail: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="storeDescription" className="text-sm font-medium">Store Description</label>
                    <Textarea 
                      id="storeDescription" 
                      rows={3}
                      value={generalSettings.storeDescription}
                      onChange={(e) => setGeneralSettings({...generalSettings, storeDescription: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Enable Customer Accounts</h4>
                      <p className="text-sm text-muted-foreground">Allow customers to create accounts on your store</p>
                    </div>
                    <Switch 
                      checked={generalSettings.enableCustomerAccounts}
                      onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableCustomerAccounts: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Enable Product Reviews</h4>
                      <p className="text-sm text-muted-foreground">Allow customers to leave reviews on products</p>
                    </div>
                    <Switch 
                      checked={generalSettings.enableReviews}
                      onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableReviews: checked})}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings('General')} disabled={isSaving === 'General'}>
                    {isSaving === 'General' ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>
                    Configure payment methods and options for your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Enable Stripe</h4>
                      <p className="text-sm text-muted-foreground">Accept credit card payments via Stripe</p>
                    </div>
                    <Switch 
                      checked={paymentSettings.stripeEnabled}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, stripeEnabled: checked})}
                    />
                  </div>
                  
                  {paymentSettings.stripeEnabled && (
                    <div className="space-y-2">
                      <label htmlFor="stripeApiKey" className="text-sm font-medium">Stripe API Key</label>
                      <Input 
                        id="stripeApiKey" 
                        value={paymentSettings.stripeApiKey}
                        onChange={(e) => setPaymentSettings({...paymentSettings, stripeApiKey: e.target.value})}
                        type="password"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Enable PayPal</h4>
                      <p className="text-sm text-muted-foreground">Accept payments via PayPal</p>
                    </div>
                    <Switch 
                      checked={paymentSettings.paypalEnabled}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, paypalEnabled: checked})}
                    />
                  </div>
                  
                  {paymentSettings.paypalEnabled && (
                    <div className="space-y-2">
                      <label htmlFor="paypalClientId" className="text-sm font-medium">PayPal Client ID</label>
                      <Input 
                        id="paypalClientId" 
                        value={paymentSettings.paypalClientId}
                        onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientId: e.target.value})}
                        type="password"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="currencyCode" className="text-sm font-medium">Currency Code</label>
                    <Input 
                      id="currencyCode" 
                      value={paymentSettings.currencyCode}
                      onChange={(e) => setPaymentSettings({...paymentSettings, currencyCode: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="taxRate" className="text-sm font-medium">Tax Rate (%)</label>
                    <Input 
                      id="taxRate" 
                      type="number"
                      min="0"
                      step="0.1"
                      value={paymentSettings.taxRate}
                      onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings('Payment')} disabled={isSaving === 'Payment'}>
                    {isSaving === 'Payment' ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>
                    Configure email notifications for your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Send Order Confirmations</h4>
                      <p className="text-sm text-muted-foreground">Email customers when an order is placed</p>
                    </div>
                    <Switch 
                      checked={emailSettings.sendOrderConfirmation}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendOrderConfirmation: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Send Shipping Updates</h4>
                      <p className="text-sm text-muted-foreground">Email customers when order status changes</p>
                    </div>
                    <Switch 
                      checked={emailSettings.sendShippingUpdates}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendShippingUpdates: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Send Promotional Emails</h4>
                      <p className="text-sm text-muted-foreground">Send marketing emails to customers (opt-in)</p>
                    </div>
                    <Switch 
                      checked={emailSettings.sendPromotionalEmails}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendPromotionalEmails: checked})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="emailFooterText" className="text-sm font-medium">Email Footer Text</label>
                    <Textarea 
                      id="emailFooterText" 
                      rows={2}
                      value={emailSettings.emailFooterText}
                      onChange={(e) => setEmailSettings({...emailSettings, emailFooterText: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings('Email')} disabled={isSaving === 'Email'}>
                    {isSaving === 'Email' ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure security options for your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <Switch 
                      checked={securitySettings.enableTwoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableTwoFactorAuth: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Require Strong Passwords</h4>
                      <p className="text-sm text-muted-foreground">Enforce password complexity requirements</p>
                    </div>
                    <Switch 
                      checked={securitySettings.requireStrongPasswords}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireStrongPasswords: checked})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="autoLogoutAfterMinutes" className="text-sm font-medium">Auto Logout After (minutes)</label>
                    <Input 
                      id="autoLogoutAfterMinutes" 
                      type="number"
                      min="0"
                      value={securitySettings.autoLogoutAfterMinutes}
                      onChange={(e) => setSecuritySettings({...securitySettings, autoLogoutAfterMinutes: e.target.value})}
                    />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => toast.info('Password reset functionality will be implemented in the future')}>
                      <Lock className="h-4 w-4" />
                      Reset Admin Passwords
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings('Security')} disabled={isSaving === 'Security'}>
                    {isSaving === 'Security' ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminSettings;
