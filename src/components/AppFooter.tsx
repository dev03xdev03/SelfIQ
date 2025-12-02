import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AGBBildschirm from '../bildschirme/AGBBildschirm';
import DatenschutzBildschirm from '../bildschirme/DatenschutzBildschirm';

const AppFooter: React.FC = () => {
  const [showAGB, setShowAGB] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);

  return (
    <>
      <View style={styles.footerContainer}>
        <Text style={styles.copyrightText}>
          © 2025 Andre Andorfer. Alle Rechte vorbehalten.
        </Text>
        <View style={styles.legalLinks}>
          <TouchableOpacity onPress={() => setShowAGB(true)}>
            <Text style={styles.legalLinkText}>AGB</Text>
          </TouchableOpacity>
          <Text style={styles.legalSeparator}> • </Text>
          <TouchableOpacity onPress={() => setShowDatenschutz(true)}>
            <Text style={styles.legalLinkText}>Datenschutz</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* AGB Modal */}
      <Modal
        visible={showAGB}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AGBBildschirm onClose={() => setShowAGB(false)} />
      </Modal>

      {/* Datenschutz Modal */}
      <Modal
        visible={showDatenschutz}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <DatenschutzBildschirm onClose={() => setShowDatenschutz(false)} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  copyrightText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 8,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legalLinkText: {
    fontSize: 11,
    color: '#ff914d',
    textAlign: 'center',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 11,
    color: '#ff914d',
  },
});

export default AppFooter;
