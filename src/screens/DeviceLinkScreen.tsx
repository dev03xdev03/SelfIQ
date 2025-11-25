import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { linkDeviceToAccount } from '../services/deviceSyncService';

interface DeviceLinkScreenProps {
  onLinkSuccess: () => void;
  onSkip: () => void;
}

/**
 * Screen für Geräte-Verknüpfung
 * Ermöglicht es Nutzern, ihren Progress von einem anderen Gerät zu übertragen
 */
const DeviceLinkScreen: React.FC<DeviceLinkScreenProps> = ({
  onLinkSuccess,
  onSkip,
}) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLink = async () => {
    if (!username.trim()) {
      Alert.alert('Fehler', 'Bitte gib deinen Benutzernamen ein');
      return;
    }

    setLoading(true);
    const { success, error } = await linkDeviceToAccount(username.trim());
    setLoading(false);

    if (success) {
      Alert.alert(
        'Erfolgreich! 🎉',
        'Dein Fortschritt wurde auf dieses Gerät übertragen.',
        [{ text: 'Weiter', onPress: onLinkSuccess }],
      );
    } else {
      Alert.alert(
        'Fehler',
        error?.message || 'Account konnte nicht verknüpft werden',
      );
    }
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Fortschritt übertragen</Text>
        <Text style={styles.subtitle}>
          Hast du Dreamz bereits auf einem anderen Gerät verwendet?
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Dein Benutzername:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="z.B. Ani"
            placeholderTextColor="#666"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleLink}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Fortschritt übertragen</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onSkip}
          >
            <Text style={styles.secondaryButtonText}>Neu starten</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          💡 Tipp: Gib den gleichen Benutzernamen ein, den du auf deinem anderen
          Gerät verwendet hast.
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 16,
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#8b5cf6',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DeviceLinkScreen;
