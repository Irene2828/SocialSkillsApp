import re

def update_file(filepath, is_web=False):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if ScrollView is imported
    if 'ScrollView' not in content:
        content = content.replace('Pressable, Text', 'Pressable, Text, ScrollView')
        content = content.replace('Pressable, Text, Dimensions', 'Pressable, Text, Dimensions, ScrollView')

    # Replace the render function's return statement block
    start_tag = '<View style={styles.container}>'
    if '<GestureHandlerRootView style={styles.container}>' in content:
        start_tag = '<GestureHandlerRootView style={styles.container}>'
    
    end_tag_regex = r'(</View>|</GestureHandlerRootView>)\s*\);\s*};\s*const styles = StyleSheet\.create'
    
    match = re.search(end_tag_regex, content)
    if not match:
        print(f"Could not find end of render in {filepath}")
        return

    # Extract the portion from start_tag to before styles
    start_idx = content.find(start_tag)
    end_idx = match.start(1) + len(match.group(1))

    canvas_inner = ""
    if is_web:
        canvas_inner = """<View 
          collapsable={false} 
          style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent', touchAction: 'none' as any }]}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouchStart}
          onResponderMove={handleTouchMove}
          onResponderRelease={handleTouchEnd}
          onResponderTerminate={handleTouchEnd}
        >
          {/* @ts-ignore */}
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            {paths.map((stroke, index) => (
              // @ts-ignore
              <path
                key={index}
                d={stroke.path}
                stroke={stroke.color}
                strokeWidth={stroke.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
            {currentPath ? (
              // @ts-ignore
              <path
                d={currentPath}
                stroke={activeColor}
                strokeWidth={activeStrokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ) : null}
          {/* @ts-ignore */}
          </svg>
        </View>"""
    else:
        canvas_inner = """<View 
          collapsable={false} 
          style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouchStart}
          onResponderMove={handleTouchMove}
          onResponderRelease={handleTouchEnd}
          onResponderTerminate={handleTouchEnd}
        >
          <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
            {paths.map((stroke, index) => (
              <Path
                key={index}
                path={stroke.path}
                color={stroke.color}
                style="stroke"
                strokeWidth={stroke.strokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
            {currentPath ? (
              <Path
                path={currentPath}
                color={activeColor}
                style="stroke"
                strokeWidth={activeStrokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            ) : null}
          </Canvas>
        </View>"""

    wrapper_open = "<View style={styles.container}>"
    wrapper_close = "</View>"
    if not is_web:
        wrapper_open = "<GestureHandlerRootView style={styles.container}>"
        wrapper_close = "</GestureHandlerRootView>"

    new_render = f"""{wrapper_open}
      <View style={[styles.canvasContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF' }]}>
        {canvas_inner}

        <Pressable 
          style={[styles.absoluteBackButton, { top: insets.top + 16 }, isDark && {{ backgroundColor: 'rgba(255,255,255,0.1)' }}]} 
          onPress={{() => navigation.goBack()}}
        >
          <Ionicons name="arrow-back" size={{24}} color={{isDark ? '#FFFFFF' : theme.colors.text}} />
        </Pressable>
      </View>

      <View style={[styles.rightToolbar, {{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16, backgroundColor: isDark ? moodColors.bg : '#FFFFFF' }}]}>
        <ScrollView contentContainerStyle={{styles.toolbarContent}} showsVerticalScrollIndicator={{false}}>
          <Pressable style={{styles.toolBtn}} onPress={{undo}} disabled={{paths.length === 0}}>
            <Ionicons name="arrow-undo-outline" size={{26}} color={{paths.length === 0 ? theme.colors.neutralGrey : (isDark ? '#FFFFFF' : theme.colors.text)}} />
          </Pressable>
          
          <Pressable style={{styles.toolBtn}} onPress={{clearCanvas}}>
            <Ionicons name="trash-outline" size={{26}} color={{isDark ? '#FFFFFF' : theme.colors.text}} />
          </Pressable>

          <View style={{styles.dividerHorizontal}} />

          {{STROKE_WIDTHS.map((sw) => (
            <Pressable
              key={{sw.id}}
              style={[
                styles.strokeBtn,
                activeStrokeWidth === sw.value && styles.activeStrokeBtn,
                isDark && activeStrokeWidth === sw.value && {{ borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.1)' }}
              ]}
              onPress={{() => setActiveStrokeWidth(sw.value)}}
            >
              <Ionicons name={{sw.icon}} size={{sw.size}} color={{isDark ? '#FFFFFF' : theme.colors.text}} />
            </Pressable>
          ))}}

          <View style={{styles.dividerHorizontal}} />

          {{COLORS.map((color) => (
            <Pressable
              key={{color}}
              style={[
                styles.colorBtn,
                {{ backgroundColor: color }},
                activeColor === color && styles.activeColorBtn,
                activeColor === color && color === '#111827' && isDark && {{ borderColor: 'rgba(255,255,255,0.5)' }}
              ]}
              onPress={{() => setActiveColor(color)}}
            />
          ))}}
        </ScrollView>
      </View>
    {wrapper_close}"""

    content = content[:start_idx] + new_render + content[end_idx:]

    # Replace styles
    styles_idx = content.find('const styles = StyleSheet.create({')
    if styles_idx == -1:
        print(f"Could not find styles in {filepath}")
        return

    new_styles = """const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  absoluteBackButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    ...theme.shadows.soft,
    zIndex: 100,
  },
  rightToolbar: {
    width: 76,
    alignItems: 'center',
    ...theme.shadows.glow,
    borderLeftWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  toolbarContent: {
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: 8,
  },
  dividerHorizontal: {
    width: 32,
    height: 2,
    backgroundColor: theme.colors.neutralGrey,
    opacity: 0.3,
    marginVertical: 4,
    borderRadius: 1,
  },
  toolBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  strokeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeStrokeBtn: {
    backgroundColor: theme.colors.neutralGrey,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  colorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  activeColorBtn: {
    borderColor: 'rgba(0,0,0,0.2)',
    transform: [{ scale: 1.15 }],
  }
});"""
    
    # We replace from styles_idx to the line before export default
    export_idx = content.find('export default', styles_idx)
    content = content[:styles_idx] + new_styles + '\n\n' + content[export_idx:]
    
    with open(filepath, 'w') as f:
        f.write(content)

update_file('src/screens/DrawingBoardScreenContent.tsx', False)
update_file('src/screens/DrawingBoardScreenWeb.tsx', True)
print("Files updated successfully!")
