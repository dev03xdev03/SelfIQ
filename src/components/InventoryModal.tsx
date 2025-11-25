import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface InventoryModalProps {
  visible: boolean;
  items: InventoryItem[];
  onClose: () => void;
  onUseItem?: (itemId: string) => void;
}

/**
 * Inventar-Modal zur Anzeige gesammelter Items
 */
const InventoryModal: React.FC<InventoryModalProps> = ({
  visible,
  items,
  onClose,
  onUseItem,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>📦 Inventar</Text>

          {items.length === 0 ? (
            <Text style={styles.emptyText}>Dein Inventar ist leer</Text>
          ) : (
            <View style={styles.itemsContainer}>
              {items.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => onUseItem?.(item.id)}
                >
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(30, 20, 50, 0.95)',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: 'rgba(150, 120, 200, 0.5)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 30,
  },
  itemsContainer: {
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: 'rgba(100, 70, 150, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(150, 120, 200, 0.4)',
  },
  itemIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  itemName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  itemDescription: {
    color: '#ddd',
    fontSize: 14,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(100, 70, 150, 0.8)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InventoryModal;
