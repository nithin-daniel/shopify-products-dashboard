// Simple analytics placeholder for clean UI experience
export const useAnalytics = () => {
  return {
    track: {
      pageView: (path: string, title: string) => {
        console.log(`📊 Page view: ${path} - ${title}`);
      },
      userAction: (action: string, target: string, metadata?: any) => {
        console.log(`🔥 User action: ${action} on ${target}`, metadata);
      },
      productClick: (productId: string, index: number) => {
        console.log(`🛍️ Product click: ${productId} at index ${index}`);
      },
      modalOpen: (modalType: string) => {
        console.log(`📱 Modal opened: ${modalType}`);
      },
      modalClose: (modalType: string) => {
        console.log(`❌ Modal closed: ${modalType}`);
      }
    },
    getEvents: () => Promise.resolve([]),
    clearEvents: () => Promise.resolve()
  };
};