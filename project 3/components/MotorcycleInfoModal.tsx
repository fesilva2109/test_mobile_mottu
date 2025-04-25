import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { X, MapPin, Clock, Tag, CreditCard as Edit } from 'lucide-react-native';

type MotorcycleInfoModalProps = {
  motorcycle: any;
  visible: boolean;
  onClose: () => void;
};

export default function MotorcycleInfoModal({ motorcycle, visible, onClose }: MotorcycleInfoModalProps) {
  if (!motorcycle) {
    return null;
  }

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getStatusText = (status: any) => {
    switch (status) {
      case 'disponível':
        return 'Disponível';
      case 'manutenção':
        return 'Em Manutenção';
      case 'reservada':
        return 'Reservada';
      default:
        return status;
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'disponível':
        return Colors.success;
      case 'manutenção':
        return Colors.warning;
      case 'reservada':
        return Colors.error;
      default:
        return Colors.gray;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes da Moto</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.plateContainer}>
              <Text style={styles.plateText}>{motorcycle.placa}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(motorcycle.status) }]}>
                <Text style={styles.statusText}>{getStatusText(motorcycle.status)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Modelo:</Text>
              <Text style={styles.infoValue}>{motorcycle.modelo}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cor:</Text>
              <Text style={styles.infoValue}>{motorcycle.cor || 'Não informada'}</Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={[styles.infoValue, { marginLeft: 8 }]}>
                Localização: Setor {String.fromCharCode(65 + motorcycle.position.y)}{motorcycle.position.x + 1}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Clock size={16} color={Colors.primary} />
              <Text style={[styles.infoValue, { marginLeft: 8 }]}>
                Registrado em: {formatDate(motorcycle.timestamp)}
              </Text>
            </View>

            {motorcycle.observacoes && (
              <View style={styles.observacoesContainer}>
                <Text style={styles.observacoesLabel}>Observações:</Text>
                <Text style={styles.observacoesText}>{motorcycle.observacoes}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.footerButton} onPress={onClose}>
              <Text style={styles.footerButtonText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.footerButton, styles.primaryButton]}>
              <Edit size={18} color={Colors.white} />
              <Text style={[styles.footerButtonText, styles.primaryButtonText]}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  plateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  plateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.darkGray,
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  observacoesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: Colors.lightBackground,
    borderRadius: 8,
  },
  observacoesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  observacoesText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.lightBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  primaryButtonText: {
    color: Colors.white,
    marginLeft: 6,
  },
});