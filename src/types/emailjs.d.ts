// EmailJS 타입 선언
declare global {
  interface Window {
    emailjs: {
      init: (publicKey: string) => void;
      send: (
        serviceID: string,
        templateID: string,
        templateParams: Record<string, any>,
        publicKey?: string
      ) => Promise<{
        status: number;
        text: string;
      }>;
    };
  }
}

export {}; 