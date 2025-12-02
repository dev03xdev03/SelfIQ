import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface GuestExpirationModalProps {
  visible: boolean;
  onSignInWithApple: () => void;
  onClose?: () => void;
}

const GuestExpirationModal: React.FC<GuestExpirationModalProps> = ({
  visible,
  onSignInWithApple,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#1a0a0a', '#2a0f0f']}
            style={styles.modalContent}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#ff3131', '#ff914d']}
                style={styles.iconGradient}
              >
                <Ionicons name="time-outline" size={48} color="#fff" />
              </LinearGradient>
            </View>

            {/* Title */}
            <Text style={styles.title}>Gast-Zugang abgelaufen</Text>

            {/* Description */}
            <Text style={styles.description}>
              Deine 72-Stunden-Testphase ist vorbei!{'\n\n'}
              Melde dich mit Apple an, um:{'\n'}• Unbegrenzten Zugriff zu
              erhalten{'\n'}• Deine Fortschritte zu sichern{'\n'}• Alle Tests
              dauerhaft zu nutzen{'\n'}• Deine Ergebnisse zu behalten
            </Text>

            {/* Apple Sign In Button */}
            <TouchableOpacity
              style={styles.appleButton}
              onPress={onSignInWithApple}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#000000', '#1a1a1a']}
                style={styles.appleButtonGradient}
              >
                <Ionicons name="logo-apple" size={24} color="#fff" />
                <Text style={styles.appleButtonText}>Mit Apple anmelden</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Info */}
            <View style={styles.infoBox}>
              <Ionicons name="shield-checkmark" size={16} color="#4ade80" />
              <Text style={styles.infoText}>Sicher, schnell und kostenlos</Text>
            </View>

            {onClose && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}>Später</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  modalContent: {
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.3)',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'neosans',
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  appleButton: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  appleButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appleButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'neosans',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#4ade80',
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },
});

export default GuestExpirationModal;
