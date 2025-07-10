
// // PayPal Service for frontend integration
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// // PayPal client configuration
// export const paypalConfig = {
//   currency: "USD",
//   intent: "capture",
//   commit: true
// };

// // Types for PayPal SDK
// export interface PayPalButtonsComponentProps {
//   createOrder: (data: any, actions: any) => Promise<string>;
//   onApprove: (data: any, actions: any) => Promise<void>;
//   onError?: (err: any) => void;
//   onCancel?: (data: any) => void;
//   style?: {
//     layout?: "vertical" | "horizontal";
//     color?: "gold" | "blue" | "silver" | "white" | "black";
//     shape?: "rect" | "pill";
//     label?: "paypal" | "checkout" | "buynow" | "pay";
//     height?: number;
//   };
// }

// // Helper to load PayPal SDK dynamically
// // export const loadPayPalScript = async (callback: () => void) => {
// //   try {
// //     // Get client ID from backend
// //     const response = await axios.get(`${API_URL}/paypal/client-id`);
// //     const { clientId } = response.data;
    
// //     if (!clientId) {
// //       console.error('Failed to get PayPal client ID from server');
// //       return;
// //     }
    
// //     // Check if script is already loaded
// //     if (window.paypal && window.paypal.Buttons) {
// //       callback();
// //       return;
// //     }

// //     // Remove any existing PayPal scripts to avoid conflicts
// //     const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
// //     if (existingScript) {
// //       document.body.removeChild(existingScript);
// //     }

// //     // Create script element
// //     const script = document.createElement('script');
// //     script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${paypalConfig.currency}&components=buttons`;
// //     script.async = true;
    
// //     // Create a promise to handle script loading
// //     return new Promise<void>((resolve, reject) => {
// //       script.onload = () => {
// //         // Add a small delay to ensure the SDK is fully initialized
// //         setTimeout(() => {
// //           if (window.paypal && window.paypal.Buttons) {
// //             console.log('PayPal SDK loaded successfully');
// //             callback();
// //             resolve();
// //           } else {
// //             const error = new Error('PayPal SDK loaded but Buttons component is not available');
// //             console.error(error);
// //             reject(error);
// //           }
// //         }, 100);
// //       };
      
// //       script.onerror = () => {
// //         const error = new Error('Failed to load PayPal SDK');
// //         console.error(error);
// //         reject(error);
// //       };

// //       // Add script to document
// //       document.body.appendChild(script);
// //     });
// //   } catch (error) {
// //     console.error('Error loading PayPal client ID:', error);
// //     throw error;
// //   }
// // };

// export const loadPayPalScript = async (p0: () => void): Promise<boolean> => {
//   document.querySelectorAll('script[src*="paypal.com/sdk/js"]').forEach(el => el.remove());
//   // Check if already loaded
//   // if (window.paypal?.Buttons) return true;
//   if (window.paypal && window.paypal.Buttons) {
//     console.log("PayPal already loaded");
//     return true;
//   }
  

//   try {
//     const { data: { clientId } } = await axios.get(`${API_URL}/paypal/client-id`);
//     // console.log(clientId)
    
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       const scriptUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&
// currency=USD&components=buttons,funding-eligibility&intent=capture&
// debug=true`;  // Add debug mode
//   script.src = scriptUrl;
//   script.setAttribute('data-namespace', 'paypal_sdk'); // Important for some integrations
//       // script.src = `https://www.paypal.com/sdk/js?` +
//       //   `client-id=${clientId}&` +
//       //   `currency=USD&` +
//       //   `components=buttons,marks,messages&` + // Explicitly request components
//       //   `cache=${Date.now()}`; // Cache busting

//       script.onload = () => {
//         // Wait for PayPal to fully initialize
//         const checkInterval = setInterval(() => {
//           if (window.paypal?.Buttons) {
//             clearInterval(checkInterval);
//             resolve(true);
//           }else{
//             console.error('PayPal SDK loaded but Buttons not available');
//           resolve(false);
//           }
//         }, 500);
        
//         // Timeout after 5 seconds
//         setTimeout(() => {
//           if (!window.paypal?.Buttons) {
//             console.error('PayPal SDK loaded but Buttons not available');
//             resolve(false);
//           }
//           clearInterval(checkInterval);
//         }, 5000);
//       };

//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   } catch (error) {
//     console.error('Failed to load PayPal:', error);
//     return false;
//   }
// };

// // Create PayPal order through backend
// export const createPayPalOrder = async (amount: number, description?: string) => {
//   try {
//     const response = await axios.post(`${API_URL}/paypal/create-order`, {
//       amount,
//       description
//     });
//     return response.data.id;
//   } catch (error) {
//     console.error('Error creating PayPal order:', error);
//     throw new Error('Failed to create PayPal order');
//   }
// };

// // Capture PayPal order through backend
// export const capturePayPalOrder = async (orderID: string) => {
//   try {
//     const response = await axios.post(`${API_URL}/paypal/capture-order`, {
//       orderID
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error capturing PayPal order:', error);
//     throw new Error('Failed to capture PayPal order');
//   }
// };

// // Declare PayPal on window object for TypeScript
// declare global {
//   interface Window {
//     paypal?: any; 
//   }
// };


// PayPal Service for frontend integration
import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://skilled-kyrstin-rohitdhanjee-56c77082.koyeb.app/api';


// PayPal client configuration
export const paypalConfig = {
  currency: "USD"
};

// Types for PayPal SDK
export interface PayPalButtonsComponentProps {
  createOrder: (data: any, actions: any) => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<void>;
  onError?: (err: any) => void;
  onCancel?: (data: any) => void;
  style?: {
    layout?: "vertical" | "horizontal";
    color?: "gold" | "blue" | "silver" | "white" | "black";
    shape?: "rect" | "pill";
    label?: "paypal" | "checkout" | "buynow" | "pay";
    height?: number;
  };
}

// Declare PayPal on window object for TypeScript
declare global {
  interface Window {
    paypal?: any;
  }
}

// Helper to load PayPal SDK dynamically
export const loadPayPalScript = async (callback: () => void): Promise<void> => {
  try {
    console.log('Starting PayPal script loading process');
    
    // Check if script is already loaded
    if (window.paypal && window.paypal.Buttons) {
      console.log('PayPal SDK already loaded, invoking callback');
      callback();
      return;
    }

    // Get client ID from backend
    const response = await axios.get(`${API_URL}/paypal/client-id`);
    const { clientId } = response.data;
    
    if (!clientId) {
      console.error('Failed to get PayPal client ID from server');
      throw new Error('PayPal client ID not available from server');
    }
    
    console.log('PayPal client ID retrieved successfully');

    // Remove any existing PayPal scripts to avoid conflicts
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      console.log('Removing existing PayPal script');
      document.body.removeChild(existingScript);
    }

    // Create script element with more parameters
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${paypalConfig.currency}&components=buttons&debug=false`;
    script.async = true;
    
    console.log(`Loading PayPal script with URL: ${script.src.substring(0, script.src.indexOf('?'))}`);
    
    // Create a promise to handle script loading
    const scriptPromise = new Promise<void>((resolve, reject) => {
      script.onload = () => {
        console.log('PayPal script loaded, waiting for initialization');
        // Add a longer delay to ensure the SDK is fully initialized
        setTimeout(() => {
          if (window.paypal && window.paypal.Buttons) {
            console.log('PayPal SDK initialized successfully');
            callback();
            resolve();
          } else {
            const error = new Error('PayPal SDK loaded but Buttons component is not available. Check browser console for SDK errors.');
            console.error(error);
            console.error('window.paypal object:', window.paypal);
            reject(error);
          }
        }, 1000); // Increased timeout to 1000ms
      };
      
      script.onerror = (event) => {
        const error = new Error('Failed to load PayPal SDK script');
        console.error('Script load error event:', event);
        reject(error);
      };

      // Add script to document
      document.body.appendChild(script);
      console.log('PayPal script added to DOM');
    });

    return scriptPromise;
  } catch (error) {
    console.error('Error in loadPayPalScript:', error);
    if (error instanceof Error) {
      if (error.message.includes('Network Error')) {
        throw new Error('Network error: Unable to connect to the PayPal server. Please check your internet connection and server status.');
      } else {
        throw error;
      }
    }
    throw new Error('Unknown error loading PayPal SDK');
  }
};

// Create PayPal order through backend
export const createPayPalOrder = async (amount: number, description?: string) => {
  try {
    console.log(`Creating PayPal order for amount: ${amount}`);
    const response = await axios.post(`${API_URL}/paypal/create-order`, {
      amount,
      description
    });
    console.log('PayPal order created successfully:', response.data.id);
    return response.data.id;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Server response:', error.response.data);
      throw new Error(`Failed to create PayPal order: ${error.response.data.message || error.message}`);
    }
    throw new Error('Failed to create PayPal order');
  }
};

// Capture PayPal order through backend
export const capturePayPalOrder = async (orderID: string) => {
  try {
    console.log(`Capturing PayPal order: ${orderID}`);
    const response = await axios.post(`${API_URL}/paypal/capture-order`, {
      orderID
    });
    console.log('PayPal order captured successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Server response:', error.response.data);
      throw new Error(`Failed to capture PayPal order: ${error.response.data.message || error.message}`);
    }
    throw new Error('Failed to capture PayPal order');
  }
};
