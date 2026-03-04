import { useState, useEffect, useCallback } from 'react';

// Analytics event types
export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  type: 'page_view' | 'user_action';
  data: {
    action: string;
    target: string;
    metadata?: any;
  };
  sessionId: string;
}

// Simple session management
const getSessionId = () => {
  let sessionId = localStorage.getItem('analytics-session');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics-session', sessionId);
  }
  return sessionId;
};

// Analytics storage key
const STORAGE_KEY = 'analytics-events';

// Store event in localStorage
const storeEvent = (event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>) => {
  const events = getStoredEvents();
  const newEvent: AnalyticsEvent = {
    ...event,
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    sessionId: getSessionId()
  };
  
  events.push(newEvent);
  // Keep only last 1000 events
  const recentEvents = events.slice(-1000);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentEvents));
  
  return newEvent;
};

// Get stored events
const getStoredEvents = (): AnalyticsEvent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Clear all events
const clearStoredEvents = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('analytics-session');
};

export const useAnalytics = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  const loadEvents = useCallback(() => {
    setEvents(getStoredEvents());
  }, []);

  useEffect(() => {
    loadEvents();
    // Listen for storage changes to update events in real-time
    const handleStorageChange = () => loadEvents();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadEvents]);

  const track = {
    pageView: (path: string, title: string) => {
      storeEvent({
        type: 'page_view',
        data: {
          action: 'page_view',
          target: 'page',
          metadata: { path, title }
        }
      });
      // Use setTimeout to avoid immediate re-render
      setTimeout(() => loadEvents(), 0);
    },
    userAction: (action: string, target: string, metadata?: any) => {
      storeEvent({
        type: 'user_action',
        data: {
          action,
          target,
          metadata
        }
      });
      setTimeout(() => loadEvents(), 0);
    },
    productClick: (productId: string, index: number) => {
      storeEvent({
        type: 'user_action',
        data: {
          action: 'product_click',
          target: 'product',
          metadata: { productId, index }
        }
      });
      setTimeout(() => loadEvents(), 0);
    },
    modalOpen: (modalType: string) => {
      storeEvent({
        type: 'user_action',
        data: {
          action: 'modal_open',
          target: 'modal',
          metadata: { modalType }
        }
      });
      setTimeout(() => loadEvents(), 0);
    },
    modalClose: (modalType: string) => {
      storeEvent({
        type: 'user_action',
        data: {
          action: 'modal_close',
          target: 'modal',
          metadata: { modalType }
        }
      });
      setTimeout(() => loadEvents(), 0);
    }
  };

  return {
    track,
    events,
    getEvents: () => Promise.resolve(getStoredEvents()),
    clearEvents: () => {
      clearStoredEvents();
      setTimeout(() => loadEvents(), 0);
      return Promise.resolve();
    },
    refreshEvents: loadEvents
  };
};