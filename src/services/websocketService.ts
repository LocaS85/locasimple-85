
import { toast } from 'sonner';

export type MessageHandler = (data: any) => void;

interface WebSocketMessage {
  type: string;
  payload: any;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private url: string = '';
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private pendingMessages: WebSocketMessage[] = [];

  /**
   * Initialise une connexion WebSocket
   * @param url URL du serveur WebSocket
   */
  connect(url: string): Promise<boolean> {
    this.url = url;
    
    return new Promise((resolve) => {
      try {
        this.socket = new WebSocket(url);
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Envoyer les messages en attente
          this.sendPendingMessages();
          
          resolve(true);
        };
        
        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
          this.isConnected = false;
          this.attemptReconnect();
          
          // Si c'est la première fermeture, résoudre avec false
          if (this.reconnectAttempts === 1) {
            resolve(false);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          // Si c'est la première erreur, résoudre avec false
          if (this.reconnectAttempts === 0) {
            this.reconnectAttempts = 1;
            resolve(false);
          }
        };
        
        this.socket.onmessage = (event) => {
          this.handleMessage(event);
        };
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
        resolve(false);
      }
    });
  }

  /**
   * Tente de se reconnecter au serveur WebSocket
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnect attempts reached');
      toast.error('Impossible de se connecter au serveur en temps réel');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(this.url);
    }, delay);
  }

  /**
   * Gère les messages entrants
   */
  private handleMessage(event: MessageEvent) {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;
      
      // Vérifier si des gestionnaires sont enregistrés pour ce type de message
      const handlers = this.messageHandlers.get(message.type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(message.payload);
          } catch (error) {
            console.error(`Error in message handler for ${message.type}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Envoie un message au serveur WebSocket
   */
  send(type: string, payload: any): boolean {
    const message: WebSocketMessage = { type, payload };
    
    if (!this.isConnected || !this.socket) {
      console.log('WebSocket not connected, queuing message');
      this.pendingMessages.push(message);
      return false;
    }
    
    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      this.pendingMessages.push(message);
      return false;
    }
  }

  /**
   * Envoie les messages en attente
   */
  private sendPendingMessages() {
    if (this.pendingMessages.length === 0) return;
    
    console.log(`Sending ${this.pendingMessages.length} pending messages`);
    
    for (const message of this.pendingMessages) {
      try {
        if (this.socket) {
          this.socket.send(JSON.stringify(message));
        }
      } catch (error) {
        console.error('Error sending pending WebSocket message:', error);
      }
    }
    
    this.pendingMessages = [];
  }

  /**
   * S'abonne à un type de message
   */
  on(type: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    
    this.messageHandlers.get(type)?.add(handler);
  }

  /**
   * Se désabonne d'un type de message
   */
  off(type: string, handler: MessageHandler) {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.messageHandlers.delete(type);
      }
    }
  }

  /**
   * Ferme la connexion WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Vérifie si la connexion WebSocket est établie
   */
  isConnected(): boolean {
    return this.isConnected && !!this.socket;
  }
}

// Exporter une instance singleton
export const websocketService = new WebSocketService();
