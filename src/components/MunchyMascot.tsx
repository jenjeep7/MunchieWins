import React from 'react';
import { View } from 'react-native';
import Svg, { 
  Defs, 
  RadialGradient, 
  Stop, 
  G, 
  Path, 
  Circle, 
  Ellipse 
} from 'react-native-svg';

interface MascotProps {
  mood?: 'happy' | 'excited' | 'waiting' | 'proud' | 'celebrate' | 'sulk';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MunchyMascot = ({ 
  mood = 'happy', 
  size = 'md', 
  className = '' 
}: MascotProps) => {
  const sizeMap: Record<'sm' | 'md' | 'lg', { width: number; height: number }> = {
    sm: { width: 64, height: 64 },
    md: { width: 128, height: 128 },
    lg: { width: 192, height: 192 }
  };

  const dimensions = sizeMap[size];

  return (
    <View style={[dimensions, { position: 'relative' }]}>
      <View style={{ width: '100%', height: '100%' }}>
        <Svg viewBox="0 0 200 220" width="100%" height="100%">
          <Defs>
            {/* Detailed Broccoli Gradients */}
            <RadialGradient id="floretGrad" cx="30%" cy="30%" r="70%">
              <Stop offset="0%" stopColor="#66BB6A" />
              <Stop offset="100%" stopColor="#2E7D32" />
            </RadialGradient>
            <RadialGradient id="stalkGrad" cx="50%" cy="50%" r="80%">
              <Stop offset="0%" stopColor="#A5D6A7" />
              <Stop offset="40%" stopColor="#81C784" />
              <Stop offset="100%" stopColor="#66BB6A" />
            </RadialGradient>
          </Defs>

          <G>
            {/* Stalk / Body */}
            <Path 
              d="M80 200 Q 75 160 70 140 Q 65 110 50 100 L 150 100 Q 135 110 130 140 Q 125 160 120 200 Z" 
              fill="url(#stalkGrad)" 
              stroke="#4CAF50"
              strokeWidth="2"
            />

            {/* Little Arms (Leaves) */}
            {mood === 'celebrate' ? (
              <>
                <Path d="M65 140 Q 30 110 20 80" stroke="#4CAF50" strokeWidth="12" strokeLinecap="round" />
                <Path d="M135 140 Q 170 110 180 80" stroke="#4CAF50" strokeWidth="12" strokeLinecap="round" />
              </>
            ) : mood === 'proud' ? (
              <>
                <Path d="M65 140 Q 40 140 45 160" stroke="#4CAF50" strokeWidth="10" strokeLinecap="round" />
                <Path d="M135 140 Q 160 140 155 160" stroke="#4CAF50" strokeWidth="10" strokeLinecap="round" />
              </>
            ) : (
              <>
                <Path d="M65 140 Q 40 160 50 180" stroke="#4CAF50" strokeWidth="10" strokeLinecap="round" />
                <Path d="M135 140 Q 160 160 150 180" stroke="#4CAF50" strokeWidth="10" strokeLinecap="round" />
              </>
            )}

            {/* The "Head" - A clump of florets */}
            <G transform="translate(0, 10)">
              {/* Base layer of florets */}
              <Circle cx="60" cy="90" r="35" fill="url(#floretGrad)" />
              <Circle cx="140" cy="90" r="35" fill="url(#floretGrad)" />
              <Circle cx="100" cy="70" r="45" fill="url(#floretGrad)" />
              
              {/* Top layer */}
              <Circle cx="40" cy="70" r="30" fill="url(#floretGrad)" />
              <Circle cx="160" cy="70" r="30" fill="url(#floretGrad)" />
              <Circle cx="70" cy="45" r="35" fill="url(#floretGrad)" />
              <Circle cx="130" cy="45" r="35" fill="url(#floretGrad)" />
              <Circle cx="100" cy="30" r="35" fill="url(#floretGrad)" />
              
              {/* Detail bumps for texture */}
              <Circle cx="85" cy="55" r="10" fill="#43A047" opacity="0.3" />
              <Circle cx="115" cy="55" r="12" fill="#43A047" opacity="0.3" />
              <Circle cx="100" cy="85" r="8" fill="#43A047" opacity="0.3" />
              <Circle cx="55" cy="75" r="8" fill="#43A047" opacity="0.3" />
            </G>

            {/* Face Container (On the stalk/lower head) */}
            <G transform={`translate(0, ${mood === 'sulk' ? 42 : 40})`}>
              {/* Eyes */}
              <Ellipse cx="80" cy="90" rx="8" ry="10" fill="white" stroke="#1B5E20" strokeWidth="1" />
              <Ellipse cx="120" cy="90" rx="8" ry="10" fill="white" stroke="#1B5E20" strokeWidth="1" />
              
              {/* Pupils */}
              <Circle cx="80" cy="90" r="4" fill="#1B5E20" />
              <Circle cx="120" cy="90" r="4" fill="#1B5E20" />

              {/* Eyebrows */}
              {mood === 'proud' || mood === 'celebrate' ? (
                <>
                  <Path d="M72 78 Q 80 75 88 78" stroke="#1B5E20" strokeWidth="2" fill="none" />
                  <Path d="M112 78 Q 120 75 128 78" stroke="#1B5E20" strokeWidth="2" fill="none" />
                </>
              ) : mood === 'sulk' ? (
                <>
                  <Path d="M72 75 L 88 80" stroke="#1B5E20" strokeWidth="2" fill="none" />
                  <Path d="M128 75 L 112 80" stroke="#1B5E20" strokeWidth="2" fill="none" />
                </>
              ) : null}

              {/* Mouth */}
              {mood === 'happy' && (
                <Path d="M90 110 Q 100 118 110 110" stroke="#1B5E20" strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
              {(mood === 'excited' || mood === 'celebrate') && (
                <Path d="M85 110 Q 100 125 115 110 Z" fill="#2E7D32" />
              )}
              {mood === 'proud' && (
                <Path d="M90 112 Q 100 112 110 112" stroke="#1B5E20" strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
              {mood === 'waiting' && <Circle cx="100" cy="112" r="3" fill="#1B5E20" />}
              {mood === 'sulk' && (
                <Path d="M90 118 Q 100 110 110 118" stroke="#1B5E20" strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
              
              {/* Blush */}
              <Ellipse cx="70" cy="105" rx="6" ry="4" fill="#E57373" opacity="0.5" />
              <Ellipse cx="130" cy="105" rx="6" ry="4" fill="#E57373" opacity="0.5" />
            </G>
          </G>
        </Svg>
      </View>
    </View>
  );
};
