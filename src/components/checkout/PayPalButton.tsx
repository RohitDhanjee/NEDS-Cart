
// // import React, { useEffect, useRef, useState } from 'react';
// // import { 
// // //   PayPalButtonsComponentProps,
// //   loadPayPalScript, 
// //   createPayPalOrder,
// //   capturePayPalOrder
// // } from '@/services/paypal';
// // import { Button } from '@/components/ui/button';
// // import { toast } from 'sonner';
// // import axios from 'axios';

// // interface PayPalCheckoutButtonProps {
// //   amount: number;
// //   onSuccess: (details: any) => void;
// //   onError?: (err: any) => void;
// // }

// // const PayPalButton: React.FC<PayPalCheckoutButtonProps> = ({
// //   amount,
// //   onSuccess,
// //   onError
// // }) => {
// //   const [isScriptLoaded, setIsScriptLoaded] = useState(false);
// //   const [isScriptLoading, setIsScriptLoading] = useState(false);
// //   const [scriptError, setScriptError] = useState<string | null>(null);
// //   const paypalContainerRef = useRef<HTMLDivElement>(null);

// //   // Check server status
// //   const checkServerStatus = async () => {
// //     try {
// //       await axios.get('http://localhost:5000/api/health');
// //       return true;
// //     } catch (error) {
// //       console.error('Server health check failed:', error);
// //       return false;
// //     }
// //   };

// //   // Load PayPal script
// //   const loadScript = async () => {
// //     if (isScriptLoading) return;
    
// //     setIsScriptLoading(true);
// //     setScriptError(null);

// //     try {
// //       // Check if server is running first
// //       const serverRunning = await checkServerStatus();
// //       if (!serverRunning) {
// //         throw new Error('Server not running or unreachable. Please start the server with "npm run dev" in the server directory.');
// //       }
      
// //       await loadPayPalScript(() => {
// //         console.log('PayPal script loaded callback executed');
// //         setIsScriptLoaded(true);
// //       });
// //     } catch (error) {
// //       console.error('Error loading PayPal script:', error);
// //       setScriptError(error instanceof Error ? error.message : 'Failed to load PayPal components');
// //     } finally {
// //       setIsScriptLoading(false);
// //     }
// //   };

// //   // Initial load
// //   useEffect(() => {
// //     loadScript();
    
// //     // Clean up
// //     return () => {
// //       if (paypalContainerRef.current) {
// //         paypalContainerRef.current.innerHTML = '';
// //       }
// //     };
// //   }, []);

// //   // Render PayPal buttons once script is loaded
// //   useEffect(() => {
// //     if (!isScriptLoaded || !paypalContainerRef.current || typeof window.paypal?.Buttons !== 'function') {
// //         console.warn('PayPal Buttons not available yet, retrying...');
// //         return;
// //       }
      
    
// //     // Clear container first
// //     paypalContainerRef.current.innerHTML = '';
    
// //     try {
// //       console.log('Rendering PayPal buttons');
// //       const PayPalButtons = window.paypal.Buttons;
      
// //       if (!window.paypal || !window.paypal.Buttons) {
// //         console.error('PayPal Buttons component is not available');
// //         setScriptError('PayPal Buttons component is not available');
// //         return;
// //       }
      
// //       // Check if buttons can be rendered
// //       if (!PayPalButtons.isEligible()) {
// //         console.error('PayPal Buttons are not eligible for rendering in this environment');
// //         setScriptError('PayPal is not available in your region or browser');
// //         return;
// //       }
      
// //       const buttonsInstance = PayPalButtons({
// //         // Configure environment
// //         createOrder: async () => {
// //           try {
// //             // Create order via backend
// //             return await createPayPalOrder(amount, 'Cloud App Purchase');
// //           } catch (err) {
// //             console.error('Error creating order:', err);
// //             toast.error('Failed to create payment. Please try again.');
// //             if (onError) onError(err);
// //             throw err;
// //           }
// //         },
        
// //         // Finalize the transaction
// //         onApprove: async (data: any) => {
// //           try {
// //             // Capture the order via backend
// //             const details = await capturePayPalOrder(data.orderID);
            
// //             console.log('Transaction completed by ' + details.payer.name.given_name);
// //             console.log('Transaction ID: ' + details.id);
            
// //             toast.success(`Payment completed! Transaction ID: ${details.id}`);
// //             onSuccess(details);
// //           } catch (err) {
// //             console.error('Error capturing PayPal order:', err);
// //             toast.error('Payment failed. Please try again.');
// //             if (onError) onError(err);
// //           }
// //         },
        
// //         onError: (err: any) => {
// //           console.error('PayPal Error:', err);
// //           toast.error('PayPal encountered an error. Please try again.');
// //           if (onError) onError(err);
// //         },
        
// //         style: {
// //           color: 'blue',
// //           shape: 'rect',
// //           label: 'pay',
// //           height: 40,
// //         },
// //       });
      
// //       if (buttonsInstance.render) {
// //         buttonsInstance.render(paypalContainerRef.current);
// //       } else {
// //         console.error('PayPal buttons instance is missing render method');
// //         setScriptError('PayPal buttons failed to initialize properly');
// //       }
// //     } catch (error) {
// //       console.error('Error rendering PayPal buttons:', error);
// //       setScriptError(error instanceof Error ? error.message : 'Failed to render PayPal buttons');
// //     }
// //   }, [isScriptLoaded, amount, onSuccess, onError]);

// //   // Handle retry
// //   const handleRetry = () => {
// //     if (paypalContainerRef.current) {
// //       paypalContainerRef.current.innerHTML = '';
// //     }
// //     setIsScriptLoaded(false);
// //     setScriptError(null);
// //     loadScript();
// //   };

// //   // Display error instructions or troubleshooting info
// //   const renderErrorHelp = () => {
// //     if (!scriptError) return null;
    
// //     return (
// //       <div className="mt-4 p-4 border rounded-md bg-red-50 text-sm">
// //         <p className="font-medium mb-2">Troubleshooting steps:</p>
// //         <ol className="list-decimal pl-4 space-y-1">
// //           <li>Make sure your PayPal server is running at localhost:5000</li>
// //           <li>Check that your PayPal Client ID is correct in server/.env</li>
// //           <li>Verify your internet connection</li>
// //           <li>Try using a different browser</li>
// //           <li>Disable any ad-blockers or browser extensions</li>
// //         </ol>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="w-full">
// //       {isScriptLoading && (
// //         <div className="flex justify-center py-4">
// //           <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
// //         </div>
// //       )}
      
// //       <div 
// //         ref={paypalContainerRef} 
// //         className={`paypal-button-container min-h-[50px] ${isScriptLoaded && !scriptError ? '' : 'hidden'}`} 
// //       ></div>
      
// //       {scriptError && (
// //         <div className="text-center py-4">
// //           <p className="text-red-500 mb-2">{scriptError}</p>
// //           {renderErrorHelp()}
// //           <Button 
// //             variant="outline"
// //             onClick={handleRetry}
// //             className="mt-4"
// //           >
// //             Try Again
// //           </Button>
// //         </div>
// //       )}
      
// //       {!isScriptLoaded && !isScriptLoading && !scriptError && (
// //         <Button 
// //           variant="outline"
// //           className="w-full"
// //           onClick={loadScript}
// //         >
// //           Load PayPal
// //         </Button>
// //       )}
// //     </div>
// //   );
// // };

// // export default PayPalButton;

// import React, { useEffect, useRef, useState } from "react";
// import { loadScript } from "@paypal/paypal-js";
// import axios from "axios";

// interface PayPalButtonProps {
//   amount: number;
//   onSuccess: (details: any) => void;
//   onError?: (err: any) => void;
// }

// const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess, onError }) => {
//   const paypalRef = useRef<HTMLDivElement>(null);
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     const loadPayPalSDK = async () => {
//       try {
//         await loadScript({ "clientId": "AbsxsXpbKWNRZLzuhjyuiHBto_Wsf6XuNbvavP87f9lumL54kJ4KUlAWwBC0WwBhE6SmnqImKa_iW6f2" });
//         setIsLoaded(true);
//       } catch (error) {
//         console.error("Error loading PayPal SDK:", error);
//       }
//     };

//     loadPayPalSDK();
//   }, []);

//   useEffect(() => {
//     if (!isLoaded || !paypalRef.current) return;

//     if (window.paypal && window.paypal.Buttons) {
//       window.paypal.Buttons({
//         createOrder: async () => {
//           try {
//             const response = await axios.post("http://localhost:5000/api/paypal/create-order", {
//               amount,
//               description: "Cloud App Purchase",
//             });
//             return response.data.orderID;
//           } catch (err) {
//             console.error("Error creating order:", err);
//             if (onError) onError(err);
//           }
//         },
//         onApprove: async (data: any) => {
//           try {
//             const response = await axios.post("http://localhost:5000/api/paypal/capture-order", {
//               orderID: data.orderID,
//             });
//             onSuccess(response.data);
//           } catch (err) {
//             console.error("Error capturing payment:", err);
//             if (onError) onError(err);
//           }
//         },
//         onError: (err: any) => {
//           console.error("PayPal Error:", err);
//           if (onError) onError(err);
//         },
//       }).render(paypalRef.current);
//     } else {
//       console.error("PayPal SDK not loaded.");
//     }
//   }, [isLoaded, amount]);

//   return <div ref={paypalRef} />;
// };

// export default PayPalButton;



import React, { useEffect, useRef, useState } from 'react';
import { 
  PayPalButtonsComponentProps,
  loadPayPalScript, 
  createPayPalOrder,
  capturePayPalOrder
} from '@/services/paypal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

interface PayPalCheckoutButtonProps {
  amount: number;
  onSuccess: (details: any) => void;
  onError?: (err: any) => void;
}

const PayPalButton: React.FC<PayPalCheckoutButtonProps> = ({
  amount,
  onSuccess,
  onError
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  // Check server status
  const checkServerStatus = async () => {
    try {
      console.log('Checking server status...');
      // const response = await axios.get('http://localhost:5000/api/health');
      const response = await axios.get('https://skilled-kyrstin-rohitdhanjee-56c77082.koyeb.app/api/health');
      console.log('Server status:', response.data);
      return true;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  };

  // Load PayPal script
  const loadScript = async () => {
    if (isScriptLoading) {
      console.log('Script is already loading, skipping');
      return;
    }
    
    setIsScriptLoading(true);
    setScriptError(null);

    try {
      // Check if server is running first
      const serverRunning = await checkServerStatus();
      if (!serverRunning) {
        throw new Error('Server not running or unreachable. Please start the server with "npm run dev" in the server directory.');
      }
      
      console.log('Server is running, loading PayPal script');
      await loadPayPalScript(() => {
        console.log('PayPal script loaded callback executed');
        setIsScriptLoaded(true);
      });
    } catch (error) {
      console.error('Error loading PayPal script:', error);
      setScriptError(error instanceof Error ? error.message : 'Failed to load PayPal components');
    } finally {
      setIsScriptLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    console.log('PayPal button component mounted');
    loadScript();
    
    // Clean up
    return () => {
      console.log('PayPal button component unmounting');
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  // Render PayPal buttons once script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !paypalContainerRef.current) {
      console.log('Script not loaded or container not ready');
      return;
    }

    if (!window.paypal || !window.paypal.Buttons) {
      console.error('PayPal SDK not properly loaded', window.paypal);
      setScriptError('PayPal SDK not properly loaded. Please try refreshing the page.');
      return;
    }
    
    // Clear container first
    paypalContainerRef.current.innerHTML = '';
    
    try {
      console.log('Rendering PayPal buttons');
      const PayPalButtons = window.paypal.Buttons;
      
      // Check if buttons can be rendered
      // if (!PayPalButtons.isEligible()) {
      //   console.error('PayPal Buttons are not eligible for rendering in this environment');
      //   setScriptError('PayPal is not available in your region or browser');
      //   return;
      // }
      
      const buttonsConfig: PayPalButtonsComponentProps = {
        // Configure environment
        createOrder: async () => {
          try {
            console.log('Creating order for amount:', amount);
            // Create order via backend
            return await createPayPalOrder(amount, 'Cloud App Purchase');
          } catch (err) {
            console.error('Error creating order:', err);
            toast.error('Failed to create payment. Please try again.');
            if (onError) onError(err);
            throw err;
          }
        },
        
        // Finalize the transaction
        onApprove: async (data: any, actions: any) => {
          try {
            console.log('Payment approved, capturing order:', data.orderID);
            // Capture the order via backend
            const details = await capturePayPalOrder(data.orderID);
            
            console.log('Transaction completed by ' + details.payer.name.given_name);
            console.log('Transaction ID: ' + details.id);
            
            toast.success(`Payment completed! Transaction ID: ${details.id}`);
            onSuccess(details);
          } catch (err) {
            console.error('Error capturing PayPal order:', err);
            toast.error('Payment failed. Please try again.');
            if (onError) onError(err);
          }
        },
        
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          toast.error('PayPal encountered an error. Please try again.');
          if (onError) onError(err);
        },
        
        style: {
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          height: 40,
        },
      };
      
      const buttonsInstance = PayPalButtons(buttonsConfig);
      
      if (buttonsInstance.render) {
        console.log('Rendering PayPal buttons to container');
        buttonsInstance.render(paypalContainerRef.current);
      } else {
        console.error('PayPal buttons instance is missing render method');
        setScriptError('PayPal buttons failed to initialize properly');
      }
    } catch (error) {
      console.error('Error rendering PayPal buttons:', error);
      setScriptError(error instanceof Error ? error.message : 'Failed to render PayPal buttons');
    }
  }, [isScriptLoaded, amount, onSuccess, onError]);

  // Handle retry
  const handleRetry = () => {
    console.log('Retrying PayPal script load');
    if (paypalContainerRef.current) {
      paypalContainerRef.current.innerHTML = '';
    }
    setIsScriptLoaded(false);
    setScriptError(null);
    loadScript();
  };

  // Display error instructions or troubleshooting info
  const renderErrorHelp = () => {
    if (!scriptError) return null;
    
    return (
      <div className="mt-4 p-4 border rounded-md bg-red-50 text-sm">
        <p className="font-medium mb-2">Troubleshooting steps:</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Make sure your PayPal server is running at localhost:5000</li>
          <li>Check that your PayPal Client ID is correct in server/.env</li>
          <li>Verify your internet connection</li>
          <li>Try using a different browser</li>
          <li>Disable any ad-blockers or browser extensions</li>
          <li>Check browser console for additional errors</li>
        </ol>
      </div>
    );
  };

  return (
    <div className="w-full">
      {isScriptLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      
      <div 
        ref={paypalContainerRef} 
        className={`paypal-button-container min-h-[50px] ${isScriptLoaded && !scriptError ? '' : 'hidden'}`} 
      ></div>
      
      {scriptError && (
        <div className="text-center py-4">
          <p className="text-red-500 mb-2">{scriptError}</p>
          {renderErrorHelp()}
          <Button 
            variant="outline"
            onClick={handleRetry}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      )}
      
      {!isScriptLoaded && !isScriptLoading && !scriptError && (
        <Button 
          variant="outline"
          className="w-full"
          onClick={loadScript}
        >
          Load PayPal
        </Button>
      )}
    </div>
  );
};

export default PayPalButton;
