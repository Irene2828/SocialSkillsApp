import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text, Pressable, TextInput } from 'react-native';
import { HomeScreen } from './HomeScreen';
import { NewQuizScreen } from './NewQuizScreen';
import { CreateQuizFromPhotoScreen } from './CreateQuizFromPhotoScreen';
import { MyRewardsScreen } from './MyRewardsScreen';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Comment {
  id: string;
  x: number;
  y: number;
  text: string;
}

export const DesignQABoard = () => {
  const navigation = useNavigation<any>();
  const [commentMode, setCommentMode] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
         <Pressable onPress={() => navigation.navigate('Home')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 8, fontSize: 16 }}>Back to App</Text>
         </Pressable>
         <Text style={styles.title}>Design QA Canvas</Text>
         
         <View style={{ flex: 1 }} />
         
         <Pressable 
            onPress={() => setCommentMode(!commentMode)} 
            style={[styles.headerButton, commentMode && { backgroundColor: '#BEF264' }]}
         >
            <Ionicons name={commentMode ? "chatbubble" : "chatbubble-outline"} size={20} color={commentMode ? "#000" : "#fff"} />
            <Text style={{ color: commentMode ? '#000' : '#fff', marginLeft: 8, fontWeight: 'bold' }}>
              {commentMode ? 'Comment Mode: ON' : 'Comment Mode: OFF'}
            </Text>
         </Pressable>
         
         {comments.length > 0 && (
           <Pressable onPress={() => setComments([])} style={[styles.headerButton, { marginLeft: 12, backgroundColor: 'rgba(255,59,48,0.2)' }]}>
              <Text style={{ color: '#ff3b30', fontWeight: 'bold' }}>Clear All</Text>
           </Pressable>
         )}
      </View>
      
      {/* Canvas Area */}
      <View style={{ flex: 1 }}>
        {commentMode && (
          <View style={styles.commentModeBanner}>
             <Text style={styles.commentModeBannerText}>Click anywhere on the screens to drop a comment pin!</Text>
          </View>
        )}
        <ScrollView horizontal contentContainerStyle={styles.canvas} bounces={false}>
              {/* Home Screen */}
              <View style={styles.deviceFrame} pointerEvents={commentMode ? 'none' : 'auto'}>
                 <Text style={styles.frameTitle}>1. Home Screen</Text>
                 <View style={styles.screenWrapper}>
                    <HomeScreen />
                 </View>
              </View>
              
              {/* Quiz Library */}
              <View style={styles.deviceFrame} pointerEvents={commentMode ? 'none' : 'auto'}>
                 <Text style={styles.frameTitle}>2. Quiz Library</Text>
                 <View style={styles.screenWrapper}>
                    <NewQuizScreen />
                 </View>
              </View>
              
              {/* AI Quiz */}
              <View style={styles.deviceFrame} pointerEvents={commentMode ? 'none' : 'auto'}>
                 <Text style={styles.frameTitle}>3. AI Quiz</Text>
                 <View style={styles.screenWrapper}>
                    <CreateQuizFromPhotoScreen />
                 </View>
              </View>
              
              {/* Rewards */}
              <View style={styles.deviceFrame} pointerEvents={commentMode ? 'none' : 'auto'}>
                 <Text style={styles.frameTitle}>4. My Rewards</Text>
                 <View style={styles.screenWrapper}>
                    <MyRewardsScreen />
                 </View>
              </View>
              
              {/* Comment Overlay - Catches clicks perfectly */}
              {commentMode && (
                 <Pressable 
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                    onPress={(e) => {
                       const nativeEvent = e.nativeEvent as any;
                       // Use offsetX/Y for web precision, fallback to locationX/Y
                       const x = nativeEvent.offsetX ?? nativeEvent.locationX;
                       const y = nativeEvent.offsetY ?? nativeEvent.locationY;
                       setComments(prev => [...prev, {
                          id: Date.now().toString(),
                          x,
                          y,
                          text: ''
                       }]);
                    }}
                 />
              )}
              
              {/* Render Comments */}
              {comments.map(c => (
                 <View key={c.id} pointerEvents="box-none" style={{ position: 'absolute', left: c.x - 8, top: c.y - 8, zIndex: 1000, flexDirection: 'row' }}>
                    <View style={styles.commentPin} />
                    <TextInput 
                       autoFocus
                       defaultValue={c.text}
                       onChangeText={t => { c.text = t; }}
                       style={styles.commentInput}
                       multiline
                       placeholder="Type comment here..."
                       placeholderTextColor="#999"
                    />
                 </View>
              ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E', 
  },
  header: {
    height: 60,
    backgroundColor: '#2C2C2C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#444',
    zIndex: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#444',
  },
  commentModeBanner: {
    backgroundColor: '#BEF264',
    padding: 8,
    alignItems: 'center',
  },
  commentModeBannerText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  canvas: {
    padding: 40,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deviceFrame: {
    marginRight: 40,
    alignItems: 'center',
  },
  frameTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '600',
  },
  screenWrapper: {
    width: 375,
    height: 812, 
    backgroundColor: '#fff',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 8,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  commentPin: {
    width: 16, 
    height: 16, 
    borderRadius: 8, 
    backgroundColor: '#ff3b30', 
    borderWidth: 2, 
    borderColor: '#fff', 
    shadowColor: '#000', 
    shadowOpacity: 0.3, 
    shadowRadius: 4,
    elevation: 5,
  },
  commentInput: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    minWidth: 200,
    maxWidth: 300,
    color: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    fontSize: 14,
  }
});
