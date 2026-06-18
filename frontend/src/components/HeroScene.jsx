import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, MeshTransmissionMaterial, OrbitControls, Torus } from "@react-three/drei";import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";


function FloatingSneaker(props) {
  const ref = useRef(null);
  useFrame((s) => {
    ref.current.rotation.y = s.clock.elapsedTime * 0.4;
  });
  return (/*#__PURE__*/
    _jsx(Float, { floatIntensity: 1.5, rotationIntensity: 0.4, speed: 1.6, children: /*#__PURE__*/
      _jsxs("group", { ref: ref, ...props, scale: 0.9, children: [/*#__PURE__*/

        _jsxs("mesh", { position: [0, 0, 0], castShadow: true, children: [/*#__PURE__*/
          _jsx("capsuleGeometry", { args: [0.55, 1.4, 8, 16] }), /*#__PURE__*/
          _jsx("meshStandardMaterial", { color: "#1a1a1f", metalness: 0.5, roughness: 0.3 })] }
        ), /*#__PURE__*/
        _jsxs("mesh", { position: [0.7, -0.3, 0], rotation: [0, 0, -0.3], children: [/*#__PURE__*/
          _jsx("boxGeometry", { args: [0.6, 0.35, 1] }), /*#__PURE__*/
          _jsx("meshStandardMaterial", { color: "#d4af37", metalness: 0.9, roughness: 0.2 })] }
        ), /*#__PURE__*/
        _jsxs("mesh", { position: [-0.4, 0.3, 0], rotation: [0, 0, 0.2], children: [/*#__PURE__*/
          _jsx("sphereGeometry", { args: [0.35, 16, 16] }), /*#__PURE__*/
          _jsx("meshStandardMaterial", { color: "#9b59ff", emissive: "#5a2bff", emissiveIntensity: 0.3, metalness: 0.4, roughness: 0.4 })] }
        )] }
      ) }
    ));

}

function GlassWatch(props) {
  return (/*#__PURE__*/
    _jsx(Float, { floatIntensity: 1.2, rotationIntensity: 0.5, speed: 1.2, children: /*#__PURE__*/
      _jsxs("group", { ...props, children: [/*#__PURE__*/
        _jsx(Torus, { args: [0.7, 0.18, 24, 64], rotation: [Math.PI / 2.2, 0, 0], children: /*#__PURE__*/
          _jsx("meshStandardMaterial", { color: "#e9d27e", metalness: 1, roughness: 0.15 }) }
        ), /*#__PURE__*/
        _jsxs("mesh", { rotation: [Math.PI / 2.2, 0, 0], children: [/*#__PURE__*/
          _jsx("cylinderGeometry", { args: [0.55, 0.55, 0.15, 64] }), /*#__PURE__*/
          _jsx(MeshTransmissionMaterial, { thickness: 0.4, transmission: 1, roughness: 0.05, ior: 1.4, backside: true })] }
        )] }
      ) }
    ));

}

function NeonOrb(props) {
  return (/*#__PURE__*/
    _jsx(Float, { floatIntensity: 2, speed: 1.8, children: /*#__PURE__*/
      _jsxs("mesh", { ...props, children: [/*#__PURE__*/
        _jsx("icosahedronGeometry", { args: [0.7, 1] }), /*#__PURE__*/
        _jsx(MeshDistortMaterial, { color: props.color, distort: 0.4, speed: 1.5, metalness: 0.6, roughness: 0.2 })] }
      ) }
    ));

}

function Headphones(props) {
  return (/*#__PURE__*/
    _jsx(Float, { floatIntensity: 1, rotationIntensity: 0.3, speed: 1, children: /*#__PURE__*/
      _jsxs("group", { ...props, scale: 0.85, children: [/*#__PURE__*/
        _jsx(Torus, { args: [0.7, 0.08, 16, 64, Math.PI], rotation: [0, 0, 0], children: /*#__PURE__*/
          _jsx("meshStandardMaterial", { color: "#1f1f24", metalness: 0.7, roughness: 0.3 }) }
        ), /*#__PURE__*/
        _jsxs("mesh", { position: [-0.7, 0, 0], children: [/*#__PURE__*/
          _jsx("sphereGeometry", { args: [0.3, 32, 32] }), /*#__PURE__*/
          _jsx("meshStandardMaterial", { color: "#d4af37", metalness: 0.9, roughness: 0.15 })] }
        ), /*#__PURE__*/
        _jsxs("mesh", { position: [0.7, 0, 0], children: [/*#__PURE__*/
          _jsx("sphereGeometry", { args: [0.3, 32, 32] }), /*#__PURE__*/
          _jsx("meshStandardMaterial", { color: "#d4af37", metalness: 0.9, roughness: 0.15 })] }
        )] }
      ) }
    ));

}

export function HeroScene() {
  return (/*#__PURE__*/
    _jsx(Canvas, {
      camera: { position: [0, 0, 6], fov: 50 },
      dpr: [1, 2],
      gl: { antialias: true, alpha: true }, children: /*#__PURE__*/

      _jsxs(Suspense, { fallback: null, children: [/*#__PURE__*/
        _jsx("ambientLight", { intensity: 0.4 }), /*#__PURE__*/
        _jsx("directionalLight", { position: [5, 5, 5], intensity: 1.2, color: "#fff5e0" }), /*#__PURE__*/
        _jsx("pointLight", { position: [-4, -2, 3], intensity: 2, color: "#9b59ff" }), /*#__PURE__*/
        _jsx("pointLight", { position: [4, 2, -3], intensity: 1.5, color: "#5ecbff" }), /*#__PURE__*/

        _jsx(FloatingSneaker, { position: [-2.4, 0.6, 0] }), /*#__PURE__*/
        _jsx(GlassWatch, { position: [2.3, 0.2, 0.5] }), /*#__PURE__*/
        _jsx(Headphones, { position: [0, -1.5, 0] }), /*#__PURE__*/
        _jsx(NeonOrb, { position: [-1.6, -1.4, -1], color: "#9b59ff" }), /*#__PURE__*/
        _jsx(NeonOrb, { position: [2, 1.6, -1], color: "#d4af37" }), /*#__PURE__*/

        _jsx(Environment, { preset: "city" }), /*#__PURE__*/
        _jsx(OrbitControls, { enableZoom: false, enablePan: false, autoRotate: true, autoRotateSpeed: 0.6 })] }
      ) }
    ));

}