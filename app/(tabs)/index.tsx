import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Define the shape of our messages
interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // --- HACKATHON CONFIG ---
  // Replace this with your actual Localtunnel URL or your Computer's IP
  // Example: "https://slimy-frog-42.loca.lt" or "http://192.168.1.5:8000"
  const BACKEND_URL ="https://little-yaks-wear.loca.lt"; 

  const askBackend = async () => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: query };
    setResponses(prev => [...prev, userMsg]);
    const currentQuery = query;
    setQuery('');
    setLoading(true);

    console.log("--- DIAGNOSTIC START ---");
    console.log("Attempting to reach:", `${BACKEND_URL}/ask`);

    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // CRITICAL: This bypasses the Localtunnel "Reminder" page that causes JSON errors
          'Bypass-Tunnel-Reminder': 'true', 
        },
        body: JSON.stringify({ question: currentQuery })
      });

      console.log("Server Status Code:", res.status);

      // Capture raw response to see if it's HTML (error) or JSON (success)
      const rawText = await res.text();
      console.log("Raw Server Output:", rawText);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${rawText.slice(0, 50)}`);
      }

      const data = JSON.parse(rawText);
      setResponses(prev => [...prev, { role: 'ai', text: data.answer }]);

    } catch (err: any) {
      console.error("--- CONNECTION FAILED ---");
      console.error("Error Message:", err.message);
      
      setResponses(prev => [...prev, { 
        role: 'ai', 
        text: `Error: ${err.message}. Check your Python terminal for a crash log.` 
      }]);
    } finally {
      setLoading(false);
      console.log("--- DIAGNOSTIC END ---");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BharatVoice AI</Text>
        <Text style={styles.headerSubtitle}>Citizen Assistance Portal</Text>
      </View>

      <ScrollView style={styles.chatWindow} contentContainerStyle={{ paddingBottom: 20 }}>
        {responses.map((msg, index) => (
          <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={msg.role === 'user' ? styles.userText : styles.aiText}>
              {msg.text}
            </Text>
          </View>
        ))}
        {loading && <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 10 }} />}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Ask about PM-Kisan..."
          value={query}
          onChangeText={setQuery}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={askBackend} disabled={loading}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 50, backgroundColor: '#007AFF', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#D1E4FF', fontSize: 14 },
  chatWindow: { flex: 1, padding: 15 },
  bubble: { padding: 12, borderRadius: 18, marginVertical: 5, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E1E4E8' },
  userText: { color: '#FFF' },
  aiText: { color: '#333' },
  inputArea: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE' },
  input: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, maxHeight: 100 },
  sendButton: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#007AFF', borderRadius: 20, paddingHorizontal: 20 },
  sendButtonText: { color: '#FFF', fontWeight: 'bold' }
});