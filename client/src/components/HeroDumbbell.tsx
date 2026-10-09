import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei/core/ContactShadows.js'
import { Float } from '@react-three/drei/core/Float.js'
import { useRef } from 'react'
import type { Group } from 'three'

function DumbbellModel() {
  const model = useRef<Group>(null)
  const lastMobileFrame = useRef(0)
  const { pointer } = useThree()
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches

  useFrame((state, delta) => {
    if (!model.current || reducedMotion) return
    if (mobile && state.clock.elapsedTime - lastMobileFrame.current < 1 / 28) return
    lastMobileFrame.current = state.clock.elapsedTime
    model.current.rotation.y += delta * 0.12
    model.current.rotation.x += (pointer.y * 0.13 - model.current.rotation.x) * 0.035
    model.current.rotation.z += (pointer.x * 0.12 - model.current.rotation.z) * 0.035
    model.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.075
  })

  return <group ref={model} rotation={[0.15, 0, -0.2]} scale={0.88}>
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.09, 0.09, 2.65, 32]} />
      <meshStandardMaterial color="#282725" metalness={0.94} roughness={0.22} />
    </mesh>
    {[-1.05, 1.05].map((x) => <group key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.68, 0.68, 0.25, 64]} />
        <meshPhysicalMaterial color="#121212" metalness={0.96} roughness={0.2} clearcoat={0.65} clearcoatRoughness={0.17} />
      </mesh>
      <mesh position={[0, 0.133, 0]} castShadow>
        <cylinderGeometry args={[0.69, 0.69, 0.025, 64]} />
        <meshStandardMaterial color="#f5b83d" metalness={0.82} roughness={0.24} emissive="#a75a08" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, -0.133, 0]} castShadow>
        <cylinderGeometry args={[0.69, 0.69, 0.025, 64]} />
        <meshStandardMaterial color="#f5b83d" metalness={0.82} roughness={0.24} emissive="#a75a08" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.035, 48]} />
        <meshStandardMaterial color="#d99a24" metalness={0.85} roughness={0.2} />
      </mesh>
    </group>)}
    <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.22]}>
      <cylinderGeometry args={[0.102, 0.102, 0.18, 32]} />
      <meshStandardMaterial color="#171716" metalness={0.88} roughness={0.24} />
    </mesh>
  </group>
}

export default function HeroDumbbell() {
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
  return <Canvas camera={{ position: [0, 0.3, 4.8], fov: 37 }} dpr={mobile ? [0.75, 1] : [1, 1.35]} frameloop={reducedMotion ? 'demand' : 'always'} gl={{ alpha: true, antialias: !mobile, powerPreference: 'low-power' }} shadows={mobile ? false : 'basic'}>
    <ambientLight intensity={0.85} />
    <directionalLight position={[3, 4, 5]} intensity={3.2} color="#fff1cf" castShadow />
    <pointLight position={[-3, 1, -1]} intensity={34} distance={7} color="#f5b83d" />
    <pointLight position={[2, -2, 2]} intensity={16} distance={6} color="#d9d4ca" />
    <Float speed={0.55} rotationIntensity={0.035} floatIntensity={0.09} floatingRange={[-0.06, 0.06]}>
      <DumbbellModel />
    </Float>
    {!mobile && <ContactShadows position={[0, -1.05, 0]} opacity={0.28} scale={3.8} blur={2.3} far={3.5} resolution={128} color="#d99a24" />}
  </Canvas>
}