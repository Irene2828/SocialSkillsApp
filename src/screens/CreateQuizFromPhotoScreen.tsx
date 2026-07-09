import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator, Animated, ScrollView, Modal, TextInput } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { GlobalBackground } from '../components/GlobalBackground';
import { SilverDust } from '../components/SilverDust';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { generateQuizFromImage, generateQuizFromText } from '../utils/aiQuizGenerator';
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
  const [textPrompt, setTextPrompt] = useState('');

  const [loadingText, setLoadingText] = useState('Understanding the concept...');
  const spinAnim = new Animated.Value(0);

  const navigation = useNavigation<any>();
  const { addCustomQuiz, addFolder } = useQuizContext();

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
      setLoadingText(texts[0]);
      const timeout1 = setTimeout(() => setLoadingText(texts[1]), 5000);
      const timeout2 = setTimeout(() => setLoadingText(texts[2]), 10000);
      
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
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
      const responseData = await generateQuizFromImage(dataUri);
      setGeneratedQuiz(responseData);
      
      const targetFolderId = addFolder(responseData.folderName || 'AI Quiz Topic', 'general');

      // Save all 3 generated quizzes to context
      responseData.quizzes.forEach((quiz: any, quizIndex: number) => {
        const newCategoryId = `custom_ai_${Date.now()}_${quizIndex}`;
        const newCategory: QuizCategory = {
          id: newCategoryId,
          title: quiz.concept,
          description: 'AI Generated Quiz',
          icon: 'color-wand', // magical icon for AI generated
          color: '#A78BFA', // Purple styling to stand out
          isCustom: true,
          folderId: targetFolderId
        };
        
        const questionsWithCategory = quiz.questions.map((q: any, index: number) => ({
          id: `${newCategoryId}-q${index}`,
          category: newCategoryId,
          difficulty: selectedDifficulty,
          scenario: q.question,
          options: q.options,
          correctAnswerIndex: q.correctIndex,
          explanation: q.explanation || 'Great job!',
          whyOptions: q.whyOptions,
          correctWhyIndex: q.correctWhyIndex,
          whyConfirmation: q.whyConfirmation,
        }));
        
        addCustomQuiz(newCategory, questionsWithCategory);
      });

      setScreenState('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred while generating the quiz.');
      setScreenState('error');
    }
  };

  const handleGenerateFromText = async () => {
    if (!textPrompt.trim()) return;
    
    setScreenState('generating');
    try {
      const responseData = await generateQuizFromText(textPrompt.trim());
      setGeneratedQuiz(responseData);
      
      // Save all 3 generated quizzes to context
      const targetFolderId = addFolder(responseData.folderName || 'AI Quiz Topic', 'general');

      responseData.quizzes.forEach((quiz: any, quizIndex: number) => {
        const newCategoryId = `custom_ai_${Date.now()}_${quizIndex}`;
        const newCategory: QuizCategory = {
          id: newCategoryId,
          title: quiz.concept,
          description: 'AI Generated Quiz',
          icon: 'color-wand', // magical icon for AI generated
          color: '#A78BFA', // Purple styling to stand out
          isCustom: true,
          folderId: targetFolderId
        };
        
        const questionsWithCategory = quiz.questions.map((q: any, index: number) => ({
          id: `${newCategoryId}-q${index}`,
          category: newCategoryId,
          difficulty: selectedDifficulty,
          scenario: q.question,
          options: q.options,
          correctAnswerIndex: q.correctIndex,
          explanation: q.explanation || 'Great job!',
          whyOptions: q.whyOptions,
          correctWhyIndex: q.correctWhyIndex,
          whyConfirmation: q.whyConfirmation,
        }));
        
        addCustomQuiz(newCategory, questionsWithCategory);
      });

      setTextPrompt('');
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
      <Card style={[styles.uploadCard, { marginBottom: theme.spacing.lg }]}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="text-outline" size={24} color={theme.colors.text} style={{ marginRight: 8 }} />
          <Text style={styles.sectionHeaderTitle}>Type a Topic or Concept</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={textPrompt}
          onChangeText={setTextPrompt}
          placeholder="Create a quiz to test rejection reactions during recess at school"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
        />
        <Button 
          title="Generate from Text" 
          iconName="color-wand-outline"
          iconSize={18} 
          onPress={handleGenerateFromText} 
          disabled={!textPrompt.trim()}
          style={styles.button}
        />
      </Card>

      <Text style={styles.orText}>— OR —</Text>

      <Card style={styles.uploadCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="camera-outline" size={24} color={theme.colors.text} style={{ marginRight: 8 }} />
          <Text style={styles.sectionHeaderTitle}>Upload a Photo</Text>
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
        <Text style={styles.supportedText}>Supported: JPG, PNG, HEIC</Text>
      </Card>
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
        iconName="color-wand-outline"
        iconSize={18} 
        onPress={handleGenerate} 
        style={styles.generateButton}
      />
    </View>
  );

  const renderGenerating = () => (
    <View style={styles.generatingContainer}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Ionicons name="color-wand-outline" size={64} color={theme.colors.primary} />
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
          <View style={styles.titleContainer}>
            <Text style={styles.successTitle}>3 Quizzes Generated!</Text>
            <View style={styles.brushUnderline} />
          </View>
          <Text style={styles.successSubtitle}>
            They have been added to your Custom tab in Quiz Library.
          </Text>
          <Button 
            title="Go to Library" 
            onPress={() => {
               setScreenState('idle');
               navigation.navigate('NewQuiz', { tab: 'ai' });
            }} 
            style={styles.generateButton}
          />
          <Pressable 
            style={{ marginTop: theme.spacing.md }}
            onPress={() => {
               setScreenState('idle');
            }} 
          >
            <Text style={{ ...theme.typography.button, color: theme.colors.secondaryText }}>
              Create Another
            </Text>
          </Pressable>
        </Pressable>
        <Text style={styles.successDismissHint}>Tap outside to close</Text>
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
      <GlobalBackground />
      <ScreenWrapper transparent>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Header 
            title="Create Quiz" 
          />
          {screenState !== 'generating' && screenState !== 'success' && (
            <View style={styles.headerSubtitleContainer}>
              <Text style={styles.headerSubtitle}>
                Type a concept or upload a photo, and AI will create original quiz questions.
              </Text>
            </View>
          )}
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
    width: '100%',
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
    width: '100%',
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
    ...theme.typography.subheading,
    textAlign: 'center',
    color: theme.colors.text,
    marginBottom: 0,
  },
  successSubtitle: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  successCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    alignItems: 'center',
    overflow: 'hidden',
  },
  successDismissHint: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
    opacity: 0.7,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    alignSelf: 'flex-start',
    width: '100%',
  },
  sectionHeaderTitle: {
    ...theme.typography.subheading,
    fontSize: 18,
    color: theme.colors.text,
  },
  textInput: {
    width: '100%',
    minHeight: 80,
    borderWidth: 1.5,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
    marginBottom: theme.spacing.md,
  },
  orText: {
    ...theme.typography.label,
    textAlign: 'center',
    color: theme.colors.secondaryText,
    marginVertical: theme.spacing.md,
    fontWeight: '700',
  },
  titleContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  brushUnderline: {
    position: 'absolute',
    bottom: -4,
    left: '2%',
    right: '2%',
    height: 5.5,
    backgroundColor: '#BEF264',
    borderRadius: 4,
    transform: [{ rotate: '-1.5deg' }],
    zIndex: -1,
  },
});
