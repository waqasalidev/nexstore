import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, PresentationControls, Float } from "@react-three/drei";
import * as THREE from "three";

// 1. T-Shirt Model (Clothing Category)
function TShirtModel({ color = "#d4af37" }) {
  return (
    <group position={[0, -0.4, 0]}>
      {/* Hanger Hook */}
      <mesh position={[0, 1.4, 0]}>
        <torusGeometry args={[0.15, 0.03, 8, 32, Math.PI * 1.5]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Hanger bar */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* T-Shirt Body */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 1.8, 32]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Collar */}
      <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.08, 8, 32]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.5} />
      </mesh>

      {/* Left Sleeve */}
      <mesh position={[-0.7, 0.7, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.22, 0.22, 0.6, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Right Sleeve */}
      <mesh position={[0.7, 0.7, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.22, 0.22, 0.6, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
}

// 2. Sneaker Model (Shoes Category)
function SneakerModel({ color = "#d4af37" }) {
  return (
    <group position={[0, 0, 0]} rotation={[0.15, -0.6, 0]}>
      {/* White Sole */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2.0, 0.25, 0.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Rubber Grip Bottom */}
      <mesh position={[0, -0.63, 0]}>
        <boxGeometry args={[2.02, 0.04, 0.82]} />
        <meshStandardMaterial color="#151515" roughness={0.9} />
      </mesh>
      {/* Shoe Upper Main Body */}
      <mesh position={[-0.1, -0.15, 0]}>
        <boxGeometry args={[1.6, 0.5, 0.78]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Heel Collar */}
      <mesh position={[-0.5, 0.25, 0]}>
        <boxGeometry args={[0.6, 0.5, 0.78]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Ankle Cushion Inset */}
      <mesh position={[-0.5, 0.48, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.68]} />
        <meshStandardMaterial color="#22222a" roughness={0.8} />
      </mesh>
      {/* Toe Cap */}
      <mesh position={[0.8, -0.25, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.4, 0.3, 0.78]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Laces Area (Tongue) */}
      <mesh position={[0.2, 0.15, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.7, 0.15, 0.5]} />
        <meshStandardMaterial color="#22222a" roughness={0.8} />
      </mesh>
      {/* Laces details */}
      <mesh position={[0.2, 0.24, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.5, 0.02, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 3. Watch Model (Watches Category)
function WatchModel({ color = "#e9d27e" }) {
  return (
    <group rotation={[Math.PI / 2.2, 0, 0]} position={[0, 0, 0]}>
      {/* Metallic Strap/Band */}
      <mesh>
        <torusGeometry args={[1.2, 0.08, 16, 80]} />
        <meshStandardMaterial color="#22222a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Watch Case/Dial Base */}
      <mesh position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.2, 32]} />
        <meshStandardMaterial color={color} metalness={1.0} roughness={0.15} />
      </mesh>
      {/* Bezel Ring */}
      <mesh position={[0, 1.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.06, 8, 48]} />
        <meshStandardMaterial color={color} metalness={1.0} roughness={0.1} />
      </mesh>
      {/* Watch Face Screen */}
      <mesh position={[0, 1.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
        <meshStandardMaterial color="#0c0c10" metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Crown Button */}
      <mesh position={[0.68, 1.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial color={color} metalness={1.0} roughness={0.1} />
      </mesh>
      {/* Hour Hand */}
      <mesh position={[-0.12, 1.38, 0.08]} rotation={[Math.PI / 2, 0.5, 0]}>
        <boxGeometry args={[0.04, 0.01, 0.25]} />
        <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.1} />
      </mesh>
      {/* Minute Hand */}
      <mesh position={[0.08, 1.38, -0.15]} rotation={[Math.PI / 2, -1.2, 0]}>
        <boxGeometry args={[0.03, 0.01, 0.38]} />
        <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.1} />
      </mesh>
    </group>
  );
}

// 4. Headphone Model (Accessories Category)
function HeadphoneModel({ color = "#d4af37" }) {
  return (
    <group position={[0, 0.1, 0]}>
      {/* Headband Arch */}
      <mesh>
        <torusGeometry args={[1.1, 0.07, 16, 64, Math.PI]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.5} roughness={0.4} />
      </mesh>
      
      {/* Headband Padding */}
      <mesh position={[0, 0.04, 0]}>
        <torusGeometry args={[1.08, 0.09, 12, 64, Math.PI * 0.8]} />
        <meshStandardMaterial color="#111116" roughness={0.8} />
      </mesh>

      {/* Left Ear Cup Hinge */}
      <mesh position={[-1.1, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Left Ear Cup Shell */}
      <mesh position={[-1.1, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.25, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Left Ear Cushion */}
      <mesh position={[-0.98, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.45, 0.45, 0.12, 32]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.9} />
      </mesh>

      {/* Right Ear Cup Hinge */}
      <mesh position={[1.1, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Right Ear Cup Shell */}
      <mesh position={[1.1, -0.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.25, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Right Ear Cushion */}
      <mesh position={[0.98, -0.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.45, 0.45, 0.12, 32]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.9} />
      </mesh>
    </group>
  );
}

// 5. Laptop Model (Electronics Category)
function LaptopModel({ color = "#c0c0c8", imageUrl }) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!imageUrl) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.error("Failed to load laptop screen texture:", err);
      }
    );
  }, [imageUrl]);

  return (
    <group position={[0, -0.2, 0]} rotation={[0.1, -0.4, 0]}>
      {/* Lower Case (Base) */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2.4, 0.06, 1.6]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Keyboard Area */}
      <mesh position={[0, -0.465, -0.1]}>
        <boxGeometry args={[2.2, 0.01, 0.8]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.8} />
      </mesh>
      {/* Trackpad */}
      <mesh position={[0, -0.465, 0.5]}>
        <boxGeometry args={[0.6, 0.01, 0.35]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Hinge */}
      <mesh position={[0, -0.46, -0.78]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 16]} />
        <meshStandardMaterial color="#111" metalness={0.2} roughness={0.8} />
      </mesh>
      
      {/* Screen Lid Assembly (rotated back) */}
      <group position={[0, -0.46, -0.78]} rotation={[-0.35, 0, 0]}>
        {/* Lid Metal Backing */}
        <mesh position={[0, 0.8, -0.02]}>
          <boxGeometry args={[2.4, 1.6, 0.04]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Bezel */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[2.36, 1.56, 0.01]} />
          <meshStandardMaterial color="#0c0c10" roughness={0.9} />
        </mesh>
        {/* Glass Screen Display */}
        <mesh position={[0, 0.8, 0.01]}>
          <boxGeometry args={[2.24, 1.44, 0.01]} />
          <meshStandardMaterial 
            color={texture ? "#ffffff" : "#1a1a24"}
            map={texture || null}
            emissive={texture ? "#ffffff" : "#000000"}
            emissiveIntensity={texture ? 0.2 : 0}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}

// 6. Graceful 3D Card Fallback Model
function FallbackCardModel({ imageUrl }) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!imageUrl) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.error("Failed to load fallback card image texture:", err);
      }
    );
  }, [imageUrl]);

  return (
    <group position={[0, 0, 0]} rotation={[0, -0.2, 0]}>
      {/* Main image card panel */}
      <mesh>
        <boxGeometry args={[2.0, 2.8, 0.08]} />
        <meshPhysicalMaterial 
          color={texture ? "#ffffff" : "#1a1a24"}
          map={texture || null}
          roughness={0.2}
          metalness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transparent
          opacity={texture ? 1 : 0.8}
        />
      </mesh>
      {/* Glass styling border panel */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[2.08, 2.88, 0.07]} />
        <meshPhysicalMaterial 
          color="#d4af37"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.3}
          transmission={0.6}
          thickness={1.0}
        />
      </mesh>
    </group>
  );
}

// Automatic picker logic
function chooseModel(name, catSlug) {
  const n = (name || "").toLowerCase();
  const c = (catSlug || "").toLowerCase();

  if (n.includes("t-shirt") || n.includes("shirt") || n.includes("tee") || c.includes("clothing")) {
    return "tshirt";
  }
  if (n.includes("sneaker") || n.includes("shoe") || c.includes("shoes") || c.includes("sports")) {
    return "sneaker";
  }
  if (n.includes("watch") || c.includes("watches") || c.includes("luxury")) {
    return "watch";
  }
  if (n.includes("headphone") || n.includes("earphone") || (c.includes("accessories") && n.includes("headphone"))) {
    return "headphones";
  }
  if (n.includes("laptop") || n.includes("macbook") || n.includes("computer") || (c.includes("electronics") && n.includes("laptop"))) {
    return "laptop";
  }

  return "card";
}

export function Product3DViewer({ product, category, color }) {
  const name = product?.name || "";
  const catSlug = product?.categories?.slug || category || "";
  const imageUrl = product?.images?.[0] || "";
  const overrideModel = product?.model_3d || "";

  const resolvedModelType = overrideModel || chooseModel(name, catSlug);

  return (
    <div className="w-full h-full bg-gradient-to-br from-card to-secondary rounded-3xl overflow-hidden relative border border-white/5">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
          <pointLight position={[-4, -2, 3]} intensity={2.0} color="#d4af37" />
          <pointLight position={[4, 2, -3]} intensity={1.5} color="#5ecbff" />
          
          <PresentationControls global polar={[-0.4, 0.4]} azimuth={[-1, 1]}>
            <Float floatIntensity={0.6} rotationIntensity={0.4} speed={1.8}>
              {resolvedModelType === "tshirt" && <TShirtModel color={color} />}
              {resolvedModelType === "sneaker" && <SneakerModel color={color} />}
              {resolvedModelType === "watch" && <WatchModel color={color} />}
              {resolvedModelType === "headphones" && <HeadphoneModel color={color} />}
              {resolvedModelType === "laptop" && <LaptopModel color={color} imageUrl={imageUrl} />}
              {resolvedModelType === "card" && <FallbackCardModel imageUrl={imageUrl} />}
            </Float>
          </PresentationControls>
          
          <Environment preset="studio" />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minDistance={2.5} 
            maxDistance={8} 
            autoRotate={true} 
            autoRotateSpeed={1.2} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}