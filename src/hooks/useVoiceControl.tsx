import { useState, useCallback, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/orders';

interface UseVoiceControlProps {
  orders: Order[];
  onStatusUpdate: (id: number, status: OrderStatus) => void;
}

export const useVoiceControl = ({ orders, onStatusUpdate }: UseVoiceControlProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);

  const speak = useCallback((text: string) => {
    if (!isSpeakingEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
  }, [isSpeakingEnabled]);

  const toggleSpeaking = useCallback(() => {
    setIsSpeakingEnabled(prev => !prev);
  }, []);

  const announceNewOrder = useCallback((order: Order) => {
    if (!isSpeakingEnabled) return;
    const text = `Chegou pedido número ${order.id}. Itens: ${order.itens}`;
    speak(text);
  }, [speak, isSpeakingEnabled]);

  const handleVoiceCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Handle voice toggle commands
    if (lowerCommand.includes('parar de falar') || lowerCommand.includes('parar anúncios')) {
      setIsSpeakingEnabled(false);
      speak('Anúncios de voz desativados');
      return;
    }
    
    if (lowerCommand.includes('voltar a falar') || lowerCommand.includes('retomar anúncios')) {
      setIsSpeakingEnabled(true);
      speak('Anúncios de voz ativados');
      return;
    }

    // Extract order number from voice command
    const numberMatch = command.match(/pedido (\d+)/i) || command.match(/número (\d+)/i);
    const orderId = numberMatch ? parseInt(numberMatch[1]) : null;

    if (!orderId) return;

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      speak(`Pedido ${orderId} não encontrado`);
      return;
    }

    // Handle "repete" command
    if (lowerCommand.includes('repete')) {
      speak(`Pedido número ${orderId}. Itens: ${order.itens}`);
    }
    // Handle "itens" command
    else if (lowerCommand.includes('itens') || lowerCommand.includes('items')) {
      speak(`Itens do pedido ${orderId}: ${order.itens}`);
    }
    // Handle "fazendo" command
    else if (lowerCommand.includes('fazendo')) {
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
    announceNewOrder,
    isSpeakingEnabled,
    toggleSpeaking
  };
};