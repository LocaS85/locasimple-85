
/**
 * Service for managing WebSocket connections
 */

interface WebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

interface WebSocketEventHandlers {
  [eventName: string]: Array<(data: any) => void>;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string | null = null;
  private reconnectAttempts: number;
  private reconnectInterval: number;
  private reconnectTimeoutId: number | null = null;
  private currentAttempt: number = 0;
  private eventHandlers: WebSocketEventHandlers = {};
  private onOpenCallback?: () => void;
  private onCloseCallback?: () => void;
  private onErrorCallback?: (error: Event) => void;
  
  constructor() {
    this.reconnectAttempts = 5;
    this.reconnectInterval = 1000;
  }
  
  /**
   * Connect to a WebSocket server
   * @param url WebSocket server URL
   * @param options Connection options
   * @returns Promise that resolves to true if connection successful
   */
  public async connect(url: string, options: WebSocketOptions = {}): Promise<boolean> {
    return new Promise((resolve) => {
      // Store options
      this.url = url;
      this.reconnectAttempts = options.reconnectAttempts || 5;
      this.reconnectInterval = options.reconnectInterval || 1000;
      this.onOpenCallback = options.onOpen;
      this.onCloseCallback = options.onClose;
      this.onErrorCallback = options.onError;
      
      // Clear any existing reconnection attempts
      if (this.reconnectTimeoutId) {
        clearTimeout(this.reconnectTimeoutId);
        this.reconnectTimeoutId = null;
      }
      
      // Close existing connection if any
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
      
      try {
        // Create new WebSocket connection
        this.socket = new WebSocket(url);
        
        // Setup event handlers
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.currentAttempt = 0;
          if (this.onOpenCallback) this.onOpenCallback();
          resolve(true);
        };
        
        this.socket.onclose = (event) => {
          console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
          this.socket = null;
          
          if (this.onCloseCallback) this.onCloseCallback();
          
          // Attempt to reconnect if not closed cleanly and still have attempts
          if (!event.wasClean && this.currentAttempt < this.reconnectAttempts) {
            this.scheduleReconnect();
          }
          
          if (this.currentAttempt === 0) {
            resolve(false);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (this.onErrorCallback) this.onErrorCallback(error);
          
          // Don't resolve here, as onclose will be called after an error
        };
        
        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type && this.eventHandlers[data.type]) {
              this.eventHandlers[data.type].forEach(handler => handler(data.payload));
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        resolve(false);
      }
    });
  }
  
  /**
   * Check if WebSocket is connected
   */
  public get isConnected(): boolean {
    return !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }
  
  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    
    if (this.socket) {
      this.socket.close(1000, 'Client disconnected');
      this.socket = null;
    }
  }
  
  /**
   * Register an event handler
   * @param event Event name
   * @param handler Event handler function
   */
  public on(event: string, handler: (data: any) => void): void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }
  
  /**
   * Remove an event handler
   * @param event Event name
   * @param handler Event handler function
   */
  public off(event: string, handler: (data: any) => void): void {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(h => h !== handler);
    }
  }
  
  /**
   * Send data to the WebSocket server
   * @param type Message type
   * @param payload Message payload
   * @returns Whether the send was successful
   */
  public send(type: string, payload: any): boolean {
    if (!this.isConnected) {
      console.error('Cannot send message: WebSocket not connected');
      return false;
    }
    
    try {
      const message = JSON.stringify({
        type,
        payload
      });
      this.socket!.send(message);
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }
  
  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
    }
    
    this.currentAttempt++;
    const delay = this.reconnectInterval * Math.pow(1.5, this.currentAttempt - 1);
    
    console.log(`Scheduling WebSocket reconnect attempt ${this.currentAttempt} in ${delay}ms`);
    
    this.reconnectTimeoutId = setTimeout(() => {
      if (this.url) {
        console.log(`Attempting to reconnect to WebSocket (attempt ${this.currentAttempt})`);
        this.connect(this.url, {
          reconnectAttempts: this.reconnectAttempts,
          reconnectInterval: this.reconnectInterval,
          onOpen: this.onOpenCallback,
          onClose: this.onCloseCallback,
          onError: this.onErrorCallback
        });
      }
    }, delay) as unknown as number;
  }
}

// Export a singleton instance
export const websocketService = new WebSocketService();
