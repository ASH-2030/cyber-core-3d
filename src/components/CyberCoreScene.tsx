import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'

export type Palette = {
  accent: string
  secondary: string
  glow: string
  edge: string
  body: string
}

type CyberCoreSceneProps = {
  preset: Palette
  wireframe: boolean
  paused: boolean
  reducedMotion: boolean
}

function EnergyCore({ preset, wireframe, paused, reducedMotion }: CyberCoreSceneProps) {
  const shellRef = useRef<Group>(null)
  const ringRefs = useRef<Array<Group | null>>([])
  const nodeRefs = useRef<Array<Group | null>>([])

  const ringData = useMemo(
    () => [
      { radius: 1.35, tube: 0.039, rotation: [1.4, 0.8, 0.2], speed: 0.5, color: preset.accent, arc: Math.PI * 1.8 },
      { radius: 1.88, tube: 0.045, rotation: [0.45, 1.4, 1.1], speed: 0.38, color: preset.secondary, arc: Math.PI * 1.9 },
      { radius: 2.38, tube: 0.051, rotation: [1.7, 0.45, 0.8], speed: 0.28, color: preset.accent, arc: Math.PI * 1.7 },
      { radius: 2.9, tube: 0.042, rotation: [0.8, 1.15, 1.7], speed: 0.18, color: preset.glow, arc: Math.PI * 1.85 },
    ],
    [preset],
  )

  const nodeData = useMemo(
    () => [
      { radius: 1.08, y: 0.9, localAngle: 0.1, orbitSpeed: 0.72 },
      { radius: 1.38, y: -0.7, localAngle: 0.82, orbitSpeed: 0.84 },
      { radius: 1.72, y: 0.56, localAngle: 1.48, orbitSpeed: 0.68 },
      { radius: 2.1, y: -0.42, localAngle: 2.08, orbitSpeed: 0.9 },
      { radius: 2.42, y: 0.76, localAngle: 2.76, orbitSpeed: 0.78 },
      { radius: 2.78, y: -0.26, localAngle: 3.32, orbitSpeed: 0.88 },
      { radius: 1.24, y: -0.92, localAngle: 4.12, orbitSpeed: 0.8 },
      { radius: 1.64, y: 0.24, localAngle: 4.9, orbitSpeed: 0.74 },
      { radius: 2.18, y: -0.74, localAngle: 5.6, orbitSpeed: 0.96 },
      { radius: 2.54, y: 0.32, localAngle: 6.18, orbitSpeed: 0.7 },
      { radius: 1.92, y: 0.96, localAngle: 6.82, orbitSpeed: 0.82 },
      { radius: 2.88, y: -0.62, localAngle: 7.46, orbitSpeed: 0.86 },
      { radius: 1.5, y: 0.5, localAngle: 8.12, orbitSpeed: 0.76 },
      { radius: 2.34, y: -0.18, localAngle: 8.88, orbitSpeed: 0.92 },
    ],
    [],
  )

  useFrame((state, delta) => {
    if (paused || reducedMotion) {
      return
    }

    const t = state.clock.getElapsedTime()

    if (shellRef.current) {
      shellRef.current.rotation.y += delta * 0.42
      shellRef.current.rotation.x = Math.sin(t * 0.72) * 0.38
      shellRef.current.rotation.z = Math.cos(t * 0.8) * 0.18
    }

    ringRefs.current.forEach((ring, index) => {
      if (!ring) {
        return
      }

      ring.rotation.x += delta * (0.28 + index * 0.1) * (1 + index * 0.12)
      ring.rotation.y += delta * (0.18 + index * 0.08)
      ring.rotation.z += delta * (0.22 + index * 0.11)
    })

    nodeRefs.current.forEach((node, index) => {
      if (!node) {
        return
      }

      const current = nodeData[index]
      const drift = t * current.orbitSpeed
      const radius = current.radius
      const offsetY = current.y
      const angle = drift + current.localAngle
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.35) * 0.72 + offsetY,
        Math.sin(angle) * radius,
      )

      const outwardAngle = Math.atan2(node.position.z, node.position.x) + Math.PI / 2
      node.rotation.y = outwardAngle
      node.rotation.x = Math.sin(t + index) * 0.45
      node.rotation.z = Math.cos(t * 1.4 + index) * 0.25
    })
  })

  return (
    <group ref={shellRef}>
      <group position={[0, 0.15, 0]}>
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[0.82, 2]} />
          <meshPhysicalMaterial
            color={preset.glow}
            emissive={preset.glow}
            emissiveIntensity={wireframe ? 0.7 : 1.8}
            metalness={0.82}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.22}
            reflectivity={0.9}
            wireframe={wireframe}
            transparent={!wireframe}
            opacity={wireframe ? 1 : 0.96}
          />
        </mesh>

        <mesh scale={[1.22, 1.22, 1.22]}>
          <octahedronGeometry args={[0.66, 1]} />
          <meshPhysicalMaterial
            color={preset.accent}
            emissive={preset.accent}
            emissiveIntensity={wireframe ? 0.4 : 1.15}
            metalness={0.74}
            roughness={0.2}
            transparent={!wireframe}
            opacity={wireframe ? 1 : 0.82}
            wireframe={wireframe}
          />
        </mesh>

        <mesh scale={[1.55, 1.55, 1.55]}>
          <sphereGeometry args={[0.36, 26, 26]} />
          <meshPhysicalMaterial
            color={preset.edge}
            emissive={preset.glow}
            emissiveIntensity={wireframe ? 0.25 : 0.7}
            metalness={0.9}
            roughness={0.12}
            transparent={!wireframe}
            opacity={wireframe ? 1 : 0.7}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      <group>
        {ringData.map((ring, index) => (
          <group
            key={`${ring.radius}-${index}`}
            ref={(element) => {
              ringRefs.current[index] = element
            }}
            rotation={ring.rotation as [number, number, number]}
          >
            <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[ring.radius, ring.tube, 18, 220, ring.arc]} />
              <meshPhysicalMaterial
                color={ring.color}
                emissive={ring.color}
                emissiveIntensity={wireframe ? 0.2 : 0.75}
                metalness={0.95}
                roughness={0.18}
                clearcoat={1}
                clearcoatRoughness={0.22}
                wireframe={wireframe}
              />
            </mesh>

            {Array.from({ length: 8 }, (_, segIndex) => {
              const angle = (segIndex / 8) * Math.PI * 2
              const segmentRadius = ring.radius + ring.tube * 1.2

              return (
                <mesh
                  key={`segment-${index}-${segIndex}`}
                  position={[
                    Math.cos(angle) * segmentRadius,
                    Math.sin(angle * 1.7) * 0.18,
                    Math.sin(angle) * segmentRadius,
                  ]}
                  rotation={[0, angle, 1.2]}
                >
                  <boxGeometry args={[0.14, 0.14, 0.34]} />
                  <meshStandardMaterial
                    color={segIndex % 2 === 0 ? preset.edge : preset.secondary}
                    emissive={segIndex % 2 === 0 ? preset.accent : preset.secondary}
                    emissiveIntensity={wireframe ? 0.2 : 0.65}
                    metalness={0.9}
                    roughness={0.2}
                  />
                </mesh>
              )
            })}
          </group>
        ))}
      </group>

      <group>
        {nodeData.map((_, index) => (
          <group
            key={`node-${index}`}
            ref={(element) => {
              nodeRefs.current[index] = element
            }}
            position={[0, 0, 0]}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.06, 18, 18]} />
              <meshStandardMaterial
                color={index % 3 === 0 ? preset.glow : index % 3 === 1 ? '#7dd3fc' : preset.secondary}
                emissive={index % 3 === 0 ? preset.glow : index % 3 === 1 ? '#7dd3fc' : preset.secondary}
                emissiveIntensity={wireframe ? 0.3 : 1.2}
                metalness={0.75}
                roughness={0.24}
              />
            </mesh>
          </group>
        ))}
      </group>

      <Sparkles
        count={16}
        scale={[4.2, 4.2, 4.2]}
        size={2.1}
        speed={0.3}
        color={preset.accent}
        opacity={0.68}
      />
    </group>
  )
}

export default function CyberCoreScene(props: CyberCoreSceneProps) {
  const { preset, wireframe, paused, reducedMotion } = props

  return (
    <Canvas
      camera={{ position: [0, 0.15, 5.8], fov: 36 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      shadows
    >
      <color attach="background" args={['#050a12']} />
      <fog attach="fog" args={['#050a12', 7, 14]} />

      <ambientLight intensity={0.7} />
      <directionalLight
        position={[4, 5, 5]}
        intensity={1.3}
        color={preset.accent}
        castShadow
      />
      <directionalLight position={[-4, 1.5, -2]} intensity={0.85} color={preset.secondary} />
      <pointLight position={[-3, -2, 3]} intensity={16} distance={10} color={preset.secondary} />
      <pointLight position={[0, 0, 0]} intensity={22} distance={7} color={preset.glow} />
      <pointLight position={[2.8, 2.2, 3.5]} intensity={10} distance={10} color="#bfdcff" />

      <group rotation={[0.5, 0.8, 0]}>
        <EnergyCore
          preset={preset}
          wireframe={wireframe}
          paused={paused}
          reducedMotion={reducedMotion}
        />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]} receiveShadow>
        <circleGeometry args={[4.6, 90]} />
        <meshStandardMaterial color="#0d1620" metalness={0.86} roughness={0.55} />
      </mesh>

      <gridHelper args={[12, 24, preset.accent, '#1d2d3d']} position={[0, -1.69, 0]} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.25}
        maxPolarAngle={Math.PI / 1.75}
        enableDamping
        dampingFactor={0.08}
        target={[0, 0.2, 0]}
        autoRotate={!paused && !reducedMotion}
        autoRotateSpeed={0.7}
      />
    </Canvas>
  )
}
