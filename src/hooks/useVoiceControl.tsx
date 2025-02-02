import { useState, useCallback, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/orders';

interface UseVoiceControlProps {
  orders: Order[];
  onStatusUpdate: (id: number, status: OrderStatus) => void;
}

export const useVoiceControl = ({ orders, onStatusUpdate }: UseVoiceControlProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
  }, []);

  const announceNewOrder = useCallback((order: Order) => {
    const text = `Chegou pedido número ${order.id}. Itens: ${order.itens}`;
    speak(text);
  }, [speak]);

  const handleVoiceCommand = useCallback((command: string) => {
    // Extract order number from voice command
    const numberMatch = command.match(/pedido (\d+)/i);
    const orderId = numberMatch ? parseInt(numberMatch[1]) : null;

    if (!orderId) return;

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      speak(`Pedido ${orderId} não encontrado`);
      return;
    }

    if (command.includes('itens') || command.includes('items')) {
      speak(`Itens do pedido ${orderId}: ${order.itens}`);
    } else if (command.toLowerCase().includes('fazendo')) {
      onStatusUpdate(orderId, 'Fazendo');
      speak(`Status do pedido ${orderId} atualizado para Fazendo`);
    }
  }, [orders, speak, onStatusUpdate]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'pt-BR';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      handleVoiceCommand(transcript);
    };

    recognition.start();
  }, [handleVoiceCommand]);

  return {
    isListening,
    transcript,
    speak,
    startListening,
    announceNewOrder
  };
};