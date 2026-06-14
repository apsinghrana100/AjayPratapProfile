import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

function QuantumCore({ isFocused }) {
    const groupRef = useRef();
    const innerRef = useRef();
    const outerRef = useRef();
    const particlesRef = useRef();
    const { viewport } = useThree();
    
    // Mouse coords tracker
    const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Create orbiting particle coordinates
    const pCount = 60;
    const [pPositions, pVelocities] = useMemo(() => {
        const positions = new Float32Array(pCount * 3);
        const velocities = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount; i++) {
            // Spherical coordinate distribution
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 2.0 + Math.random() * 1.5; // Orbit radius

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Orbit speed factors
            velocities[i * 3] = (Math.random() - 0.5) * 0.015;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
        }
        return [positions, velocities];
    }, []);

    useFrame((state) => {
        // Smoothly interpolate mouse coords for lag-free physics
        mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
        mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            // Position the 3D group behind the right panel deck with slight mouse drift
            const shiftX = viewport.width * 0.16;
            groupRef.current.position.x = shiftX + mouse.current.x * 0.3;
            groupRef.current.position.y = mouse.current.y * 0.3;

            // Pulse scale when panel is focused
            const targetScale = isFocused ? 1.25 : 1.0;
            groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 0.1;
            groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 0.1;
            groupRef.current.scale.z += (targetScale - groupRef.current.scale.z) * 0.1;
        }

        // Inner core: standard rotation + mouse gravity pull tilt
        if (innerRef.current) {
            innerRef.current.rotation.y = time * 0.12;
            innerRef.current.rotation.x = time * 0.06;
        }

        // Outer core: opposite faster spin
        if (outerRef.current) {
            outerRef.current.rotation.y = -time * 0.18;
            outerRef.current.rotation.z = time * 0.08;
        }

        // Orbiting particles rotation drift
        if (particlesRef.current) {
            particlesRef.current.rotation.y = time * 0.05;
            
            // Fluctuating bounds
            const posAttr = particlesRef.current.geometry.attributes.position;
            const posArray = posAttr.array;
            for (let i = 0; i < pCount; i++) {
                const idx = i * 3;
                posArray[idx] += Math.sin(time + i) * 0.002;
                posArray[idx + 1] += Math.cos(time + i) * 0.002;
            }
            posAttr.needsUpdate = true;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Inner Core: Cyan Grid Sphere */}
            <mesh ref={innerRef}>
                <sphereGeometry args={[1.5, 18, 18]} />
                <meshBasicMaterial 
                    color="#00f2fe" 
                    wireframe 
                    transparent 
                    opacity={0.16} 
                />
            </mesh>

            {/* Outer Core: Lime Icosahedron Grid */}
            <mesh ref={outerRef}>
                <icosahedronGeometry args={[2.1, 1]} />
                <meshBasicMaterial 
                    color="#c7ff3d" 
                    wireframe 
                    transparent 
                    opacity={0.08} 
                />
            </mesh>

            {/* Glowing core center point light source (simulated halo) */}
            <mesh>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshBasicMaterial color="#00f2fe" transparent opacity={0.6} />
            </mesh>

            {/* Orbiting particles */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={pCount}
                        array={pPositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color="#c7ff3d"
                    size={0.06}
                    sizeAttenuation={true}
                    transparent
                    opacity={0.5}
                />
            </points>
        </group>
    );
}

export default function HeroCanvas({ isFocused }) {
    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <QuantumCore isFocused={isFocused} />
            </Canvas>
        </div>
    );
}
