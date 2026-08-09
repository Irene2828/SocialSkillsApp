import React, { useRef, useMemo, useEffect, useState, ReactNode } from 'react';
import { View, StyleSheet, LogBox } from 'react-native';

LogBox.ignoreLogs(['THREE.WebGLRenderer: Error creating WebGL context', 'Promise Rejection: THREE.WebGLRenderer: Error creating WebGL context']);
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RenderTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const FRAGMENT_COUNT_X = 60;
const FRAGMENT_COUNT_Y = 25;
const TOTAL_FRAGMENTS = FRAGMENT_COUNT_X * FRAGMENT_COUNT_Y;

const vertexShader = `
uniform float uProgress;
uniform float uTime;
uniform sampler2D uTextMask;

attribute vec2 aInstanceUV;
attribute float aRandomOffset;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vVisibility;
varying float vProgress;

// Hash functions
vec3 hash3(float n) { 
    return fract(sin(vec3(n, n + 1.0, n + 2.0)) * vec3(43758.5453123)); 
}
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main() {
    vUv = uv;
    vProgress = uProgress;

    vec4 maskColor = texture2D(uTextMask, aInstanceUV);
    
    if (maskColor.a < 0.2 || maskColor.r < 0.2) {
        vVisibility = 0.0;
        gl_Position = vec4(0.0);
        return;
    }
    vVisibility = 1.0;

    vec3 randomVec = hash3(aRandomOffset) * 2.0 - 1.0;
    vec3 axis = normalize(hash3(aRandomOffset + 10.0) * 2.0 - 1.0);
    
    float burst = pow(uProgress, 0.4) * 8.0; 
    vec3 velocity = randomVec * burst;
    velocity.z += abs(randomVec.z) * burst * 2.0; 
    
    vec3 drift = vec3(cos(uTime * 2.0 + aRandomOffset) * 0.5, sin(uTime * 2.0 + aRandomOffset) * 0.5, 0.0) * uProgress;
    
    float angle = uProgress * (randomVec.x * 15.0);
    mat4 rot = rotationMatrix(axis, angle);
    
    float decayScale = max(0.0, 1.0 - pow(uProgress, 2.0));
    
    vec4 basePos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vec4 localPos = rot * vec4(position * decayScale, 1.0);
    vec3 finalPos = basePos.xyz + localPos.xyz + velocity + drift;

    vec4 localNormal = rot * vec4(normal, 0.0);
    vNormal = normalize((modelMatrix * localNormal).xyz);
    
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform vec3 uLightDir;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vVisibility;
varying float vProgress;

void main() {
    if (vVisibility < 0.5) discard;

    vec3 baseColor = vec3(0.0, 0.95, 1.0); 
    
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    vec3 lightDir = normalize(uLightDir);
    
    vec3 ambient = baseColor * 0.4;
    
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * baseColor * 1.5;
    
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = vec3(1.0) * spec * 2.0; 
    
    vec3 finalColor = ambient + diffuse + specular;
    
    float alpha = 1.0 - pow(vProgress, 3.0);
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;

const ShatterCrystals = ({ textMask, isShattered, onComplete }: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const progress = useRef(0);

  const { instanceUVs, randomOffsets, dummy } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const instanceUVs = new Float32Array(TOTAL_FRAGMENTS * 2);
    const randomOffsets = new Float32Array(TOTAL_FRAGMENTS);
    return { instanceUVs, randomOffsets, dummy };
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      let i = 0;
      const width = 14; 
      const height = 6; 
      
      for (let y = 0; y < FRAGMENT_COUNT_Y; y++) {
        for (let x = 0; x < FRAGMENT_COUNT_X; x++) {
          const u = x / (FRAGMENT_COUNT_X - 1);
          const v = y / (FRAGMENT_COUNT_Y - 1);
          
          instanceUVs[i * 2] = u;
          instanceUVs[i * 2 + 1] = v;
          randomOffsets[i] = Math.random() * 1000;
          
          dummy.position.set((u - 0.5) * width, (v - 0.5) * height, 0);
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(i, dummy.matrix);
          i++;
        }
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [dummy, instanceUVs, randomOffsets]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      if (isShattered) {
        progress.current = Math.min(1.0, progress.current + delta * 1.5);
        if (progress.current >= 1.0 && onComplete) onComplete();
      } else {
        progress.current = Math.max(0.0, progress.current - delta * 2.0);
      }
      
      materialRef.current.uniforms.uProgress.value = progress.current;
    }
  });

  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uTextMask: { value: textMask },
    uLightDir: { value: new THREE.Vector3(1, 1, 1).normalize() }
  }), [textMask]);

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, TOTAL_FRAGMENTS]}>
      <tetrahedronGeometry args={[0.08, 0]} />
      <instancedBufferAttribute attach="attributes-aInstanceUV" args={[instanceUVs, 2]} />
      <instancedBufferAttribute attach="attributes-aRandomOffset" args={[randomOffsets, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

class ErrorBoundary extends React.Component<{ children: ReactNode, onError?: () => void }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.log("WebGL Canvas Error:", error);
    if (this.props.onError) this.props.onError();
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

const ShatterText3DInner = ({ isShattered, onComplete }: { isShattered: boolean, onComplete?: () => void }) => {
  const [textTexture, setTextTexture] = useState<THREE.Texture | null>(null);

  return (
    <View style={styles.canvasContainer} pointerEvents="none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        
        <RenderTexture attach="background" width={1024} height={512} onUpdate={(tex) => setTextTexture(tex)}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <color attach="background" args={['black']} />
          <Text
            color="white"
            fontSize={2}
            maxWidth={10}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1O4-D_xo.woff"
          >
            Smart{"\n"}Explorer
          </Text>
        </RenderTexture>

        {textTexture && (
          <ShatterCrystals 
            textMask={textTexture} 
            isShattered={isShattered} 
            onComplete={onComplete}
          />
        )}
      </Canvas>
    </View>
  );
};

export const ShatterText3D = ({ isShattered, onComplete, onError }: { isShattered: boolean, onComplete?: () => void, onError?: () => void }) => {
  return (
    <View style={styles.container} pointerEvents="none">
      <ErrorBoundary onError={onError}>
        <ShatterText3DInner isShattered={isShattered} onComplete={onComplete} />
      </ErrorBoundary>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    elevation: 20,
  },
  canvasContainer: {
    width: '100%',
    height: 600, // Large enough for explosion to expand
  }
});
