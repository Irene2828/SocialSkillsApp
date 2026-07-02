import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator, Animated, ScrollView, Modal } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { AnimatedCubesBackground } from '../components/AnimatedCubesBackground';
import { SilverDust } from '../components/SilverDust';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { generateQuizFromImage } from '../utils/aiQuizGenerator';
import { useNavigation } from '@react-navigation/native';
import { useRewards } from '../context/RewardsContext';
import { useProgress } from '../context/ProgressContext';
import { useQuizContext } from '../context/QuizContext';

type ScreenState = 'idle' | 'imageSelected' | 'generating' | 'success' | 'error';

export const CreateQuizFromPhotoScreen = () => {
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [selectedAge, setSelectedAge] = useState('7-8');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');

  const [loadingText, setLoadingText] = useState('Understanding the concept...');
  const spinAnim = new Animated.Value(0);

  const navigation = useNavigation<any>();
  const { addCustomQuiz } = useQuizContext();

  useEffect(() => {
    if (screenState === 'generating') {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();

      const texts = [
        'Understanding the concept...',
        'Creating original questions...',
        'Building your quiz...'
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [screenState]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || null);
      setScreenState('imageSelected');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || null);
      setScreenState('imageSelected');
    }
  };

  const handleGenerate = async () => {
    if (!imageBase64) return;
    
    setScreenState('generating');
    try {
      // OpenAI requires the data URI prefix for base64 images
      const dataUri = `data:image/jpeg;base64,${imageBase64}`;
      const quiz = await generateQuizFromImage(dataUri);
      setGeneratedQuiz(quiz);
      
      // Save it to context
      const newCategoryId = `custom_ai_${Date.now()}`;
      const newCategory = {
        id: newCategoryId,
        title: quiz.concept,
        description: 'AI Generated Quiz',
        icon: 'sparkles', // magical icon for AI generated
        color: '#A78BFA', // Purple styling to stand out
        isCustom: true
      };
      
      const questionsWithCategory = quiz.questions.map((q: any, index: number) => ({
        id: `${newCategoryId}-q${index}`,
        category: newCategoryId,
        difficulty: selectedDifficulty,
        scenario: q.question,
        options: q.options,
        correctAnswerIndex: q.correctIndex,
        explanation: q.explanation || 'Great job!'
      }));
      
      addCustomQuiz(newCategory, questionsWithCategory);
      setScreenState('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred while generating the quiz.');
      setScreenState('error');
    }
  };

  const handleStartQuiz = () => {
    navigation.navigate('NewQuiz', { playCategory: generatedQuiz.concept });
    setScreenState('idle'); // reset for next time
  };

  const renderIdle = () => (
    <View style={styles.idleContainer}>
      <Card style={styles.uploadCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="camera-outline" size={64} color={theme.colors.primary} />
        </View>
        
        <Button 
          title="Take Photo" 
          onPress={takePhoto} 
          style={styles.button}
        />
        
        <Button 
          title="Upload from Gallery" 
          onPress={pickImage} 
          variant="secondary"
          style={styles.button}
        />
      </Card>
      <Text style={styles.supportedText}>Supported: JPG, PNG, HEIC</Text>
    </View>
  );

  const renderImageSelected = () => (
    <View style={styles.idleContainer}>
      <Card style={styles.previewCard}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
      </Card>
      
      <View style={styles.rowButtons}>
        <Button 
          title="Replace" 
          onPress={pickImage} 
          variant="secondary"
          style={styles.halfButton}
        />
        <Button 
          title="Remove" 
          onPress={() => {
            setImageUri(null);
            setImageBase64(null);
            setScreenState('idle');
          }} 
          variant="outline"
          style={styles.halfButton}
        />
      </View>
      
      <Button 
        title="Generate Quiz" 
        onPress={handleGenerate} 
        style={styles.generateButton}
      />
    </View>
  );

  const renderGenerating = () => (
    <View style={styles.generatingContainer}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Ionicons name="sparkles-outline" size={64} color={theme.colors.primary} />
      </Animated.View>
      <Text style={styles.loadingText}>{loadingText}</Text>
      <View style={styles.progressContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    </View>
  );

  const renderSuccess = () => (
    <Modal
      visible={screenState === 'success'}
      transparent
      animationType="fade"
      onRequestClose={() => setScreenState('idle')}
    >
      <Pressable
        style={styles.successOverlay}
        onPress={() => setScreenState('idle')}
      >
        <SilverDust />
        <Pressable onPress={(e) => { if (e && e.stopPropagation) e.stopPropagation(); }} style={styles.successCard}>
          <Text style={styles.successTitle}>Success!</Text>
          <Text style={styles.successSubtitle}>
            Your new quiz is added to your quiz library.
          </Text>
          <Button 
            title="Start Quiz" 
            onPress={() => {
               setScreenState('idle');
               navigation.navigate('NewQuiz', { tab: 'ai' });
            }} 
            style={styles.generateButton}
          />
          <Pressable 
            style={{ marginTop: 16 }}
            onPress={() => {
               setScreenState('idle');
               navigation.navigate('NewQuiz', { tab: 'ai' });
            }} 
          >
            <Text style={{ ...theme.typography.button, color: theme.colors.secondaryText, textDecorationLine: 'underline' }}>
              Go to Quiz Library
            </Text>
          </Pressable>
        </Pressable>
        <Text style={styles.successDismissHint}>Tap outside to create another quiz</Text>
      </Pressable>
    </Modal>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Button 
        title="Try Again" 
        onPress={() => setScreenState('idle')} 
        style={styles.button}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <AnimatedCubesBackground />
      <ScreenWrapper transparent>
        <Header 
          title="Create Quiz" 
        />
      {screenState !== 'generating' && screenState !== 'success' && (
        <View style={styles.headerSubtitleContainer}>
          <Text style={styles.headerSubtitle}>
            Upload a page and AI will create original quiz questions based on the underlying concept.
          </Text>
        </View>
      )}

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {screenState === 'idle' && renderIdle()}
        {screenState === 'imageSelected' && renderImageSelected()}
        {screenState === 'generating' && renderGenerating()}
        {screenState === 'error' && renderError()}
      </ScrollView>
      </ScreenWrapper>
      {renderSuccess()}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  headerSubtitleContainer: {
    marginBottom: theme.spacing.lg,
  },
  headerSubtitle: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
  },
  idleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  uploadCard: {
    width: '100%',
    padding: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.neutralGrey,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.soft,
  },
  button: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  supportedText: {
    ...theme.typography.caption,
    marginTop: theme.spacing.lg,
  },
  previewCard: {
    width: '100%',
    height: 300,
    padding: 0,
    overflow: 'hidden',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  halfButton: {
    width: '48%',
  },
  generateButton: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  generatingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.subheading,
    color: theme.colors.text,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: theme.spacing.lg,
  },
  successContainer: {
    flex: 1,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  successIconWrapper: {
    backgroundColor: theme.colors.successGreenSoft,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
  },
  successTitle: {
    ...theme.typography.body,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    color: theme.colors.text,
  },
  successSubtitle: {
    ...theme.typography.body,
    fontStyle: 'italic',
    textAlign: 'center',
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.xl,
  },
  conceptText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  settingsCard: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
  },
  sectionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectorItem: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.stroke,
  },
  selectorItemActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  selectorText: {
    ...theme.typography.button,
    color: theme.colors.secondaryText,
  },
  selectorTextActive: {
    color: theme.colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    ...theme.typography.heading,
    fontSize: 24,
    color: theme.colors.error,
    marginTop: theme.spacing.lg,
  },
  errorMessage: {
    ...theme.typography.body,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    color: theme.colors.secondaryText,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Standardized white overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  successCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    paddingTop: 48,
    alignItems: 'center',
    overflow: 'hidden',
    ...theme.shadows.glow,
  },
  successDismissHint: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
    marginTop: 24,
    textAlign: 'center',
    opacity: 0.7,
  },

});
