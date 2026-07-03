const fs = require('fs');
const file = '/Users/irynaherz/socialskills/SocialSkillsApp/src/screens/PuzzleScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Animated, PanResponder and useRef
content = content.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect, useRef } from 'react';"
);
content = content.replace(
  "import { View, Text, StyleSheet, Image, Pressable, ScrollView, Modal, useWindowDimensions, Dimensions } from 'react-native';",
  "import { View, Text, StyleSheet, Image, Pressable, ScrollView, Modal, useWindowDimensions, Dimensions, Animated, PanResponder } from 'react-native';"
);

// 2. Add DraggablePiece component before PuzzleScreen component
const draggableComponent = `
const DraggablePiece = ({
  piece,
  index,
  selectedPuzzle,
  boardSize,
  onSwap,
}: {
  piece: any;
  index: number;
  selectedPuzzle: PuzzleConfig;
  boardSize: number;
  onSwap: (fromIndex: number, toIndex: number) => void;
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [zIndex, setZIndex] = useState(1);
  const colWidth = boardSize / selectedPuzzle.cols;
  const rowHeight = boardSize / selectedPuzzle.rows;

  const origCol = piece.correctIndex % selectedPuzzle.cols;
  const origRow = Math.floor(piece.correctIndex / selectedPuzzle.cols);
  const curCol = index % selectedPuzzle.cols;
  const curRow = Math.floor(index / selectedPuzzle.cols);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setZIndex(100);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        setZIndex(1);
        const dropX = curCol * colWidth + gesture.dx + colWidth / 2;
        const dropY = curRow * rowHeight + gesture.dy + rowHeight / 2;
        
        const targetCol = Math.floor(dropX / colWidth);
        const targetRow = Math.floor(dropY / rowHeight);
        
        if (targetCol >= 0 && targetCol < selectedPuzzle.cols && targetRow >= 0 && targetRow < selectedPuzzle.rows) {
          const targetIndex = targetRow * selectedPuzzle.cols + targetCol;
          if (targetIndex !== index) {
            onSwap(index, targetIndex);
          }
        }
        
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
  }, [index, pan]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.pieceContainer,
        {
          width: colWidth,
          height: rowHeight,
          left: curCol * colWidth,
          top: curRow * rowHeight,
          zIndex,
          transform: pan.getTranslateTransform(),
          borderColor: '#E5E7EB',
          borderWidth: 1,
        },
      ]}
    >
      <Image
        source={selectedPuzzle.image}
        style={{
          width: boardSize,
          height: boardSize,
          position: 'absolute',
          left: -origCol * colWidth,
          top: -origRow * rowHeight,
        }}
        resizeMode="cover"
      />
    </Animated.View>
  );
};
`;

content = content.replace("export const PuzzleScreen = () => {", draggableComponent + "\nexport const PuzzleScreen = () => {");

// 3. Remove selectedPieceIndex state
content = content.replace(
  "const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);",
  ""
);

// 4. In startPuzzle, remove setSelectedPieceIndex(null)
content = content.replace(
  "setSelectedPieceIndex(null);\n    setIsSolved(false);",
  "setIsSolved(false);"
);

// 5. Replace handleSelectPiece with handleSwapPieces
const handleSwapPiecesStr = `
  const handleSwapPieces = (fromIndex: number, toIndex: number) => {
    if (isSolved) return;

    const newPieces = [...pieces];
    const pieceA = newPieces[fromIndex];
    const pieceB = newPieces[toIndex];

    newPieces[fromIndex] = { ...pieceB, currentIndex: fromIndex };
    newPieces[toIndex] = { ...pieceA, currentIndex: toIndex };

    setPieces(newPieces);

    const solved = newPieces.every((p) => p.correctIndex === p.currentIndex);
    if (solved) {
      setIsSolved(true);
    }
  };
`;

const handleSelectPieceRegex = /const handleSelectPiece = \(index: number\) => \{[\s\S]*?\n  \};\n/g;
content = content.replace(handleSelectPieceRegex, handleSwapPiecesStr);

// 6. Replace pieces map
const piecesMapRegex = /\{pieces\.map\(\(piece, index\) => \{[\s\S]*?\}\)\}/g;
const newPiecesMapStr = `{pieces.map((piece, index) => (
                    <DraggablePiece
                      key={piece.id}
                      piece={piece}
                      index={index}
                      selectedPuzzle={selectedPuzzle}
                      boardSize={boardSize}
                      onSwap={handleSwapPieces}
                    />
                  ))}`;
content = content.replace(piecesMapRegex, newPiecesMapStr);

// 7. Add Headline text
const gameContentRegex = /\{selectedPuzzle && \(\s*<View\s*style=\{\[\s*styles\.board/g;
const gameContentReplacement = `{selectedPuzzle && (
                <>
                  <Text style={styles.headlineText}>Drag the pieces to solve a puzzle!</Text>
                  <View
                    style={[
                      styles.board`;
content = content.replace(gameContentRegex, gameContentReplacement);

// 8. Close fragment and add headline styles
content = content.replace(/<\/View>\s*\)\}\s*\{isSolved && \(/g, `  </View>\n                </>\n              )}\n\n              {isSolved && (`);

// add styles.headlineText
content = content.replace(/gameContent: \{/g, `headlineText: {
    ...theme.typography.subheading,
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  gameContent: {`);

fs.writeFileSync(file, content);
console.log('Done replacing!');
