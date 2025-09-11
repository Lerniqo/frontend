import { useGLTF } from "@react-three/drei";

export default function ModelRenderer() {
  const { scene } = useGLTF("/models/studentDashboard.glb");
  return <primitive object={scene} />;
}

// Preload the model for better performance
useGLTF.preload("/models/studentDashboard.glb");
