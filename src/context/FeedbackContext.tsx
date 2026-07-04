import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type ModalType = 'error' | 'success' | 'confirm' | 'info';

interface ModalOptions {
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  onConfirm?: () => void;
}

interface ToastOptions {
  message: string;
}

interface FeedbackContextValue {
  showModal: (options: ModalOptions) => void;
  showToast: (options: ToastOptions) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | undefined>(undefined);

export const useFeedback = () => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
};

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showModal = (options: ModalOptions) => {
    setModalOptions(options);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setModalOptions(null), 300);
  };

  const showToast = (options: ToastOptions) => {
    setToastMessage(options.message);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setToastVisible(true);
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setToastVisible(false);
    }, 3000);
  };

  const renderModal = () => {
    if (!modalOptions) return null;
    const isConfirm = modalOptions.type === 'confirm';
    const isError = modalOptions.type === 'error';
    const confirmButtonColor = isError || isConfirm ? theme.colors.danger : theme.colors.primary;

    return (
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Pressable style={styles.modalContainer} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
            <Text style={styles.modalTitle}>{modalOptions.title}</Text>
            <Text style={styles.modalMessage}>{modalOptions.message}</Text>
            <Pressable 
              style={[styles.actionButton, { backgroundColor: confirmButtonColor }]}
              onPress={() => {
                if (modalOptions.onConfirm) modalOptions.onConfirm();
                closeModal();
              }}
            >
              <Text style={styles.actionButtonText}>
                {modalOptions.confirmText || 'OK'}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  const renderToast = () => {
    if (!toastVisible) return null;
    return (
      <View style={[styles.toastWrapper, { top: insets.top + 60 }]}>
        <View style={styles.toastChip}>
          <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.success} style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      </View>
    );
  };

  return (
    <FeedbackContext.Provider value={{ showModal, showToast }}>
      {children}
      {renderModal()}
      {renderToast()}
    </FeedbackContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: theme.colors.white,
    ...theme.shadows.glow,
  },

  modalTitle: {
    ...theme.typography.body,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    color: theme.colors.text,
  },
  modalMessage: {
    ...theme.typography.body,
    fontStyle: 'italic',
    fontSize: 19,
    textAlign: 'center',
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    ...theme.typography.button,
  },
  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  toastChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.soft,
  },
  toastText: {
    ...theme.typography.button,
  },
});
