import { useGLTF } from "@react-three/drei";

export default function ModelRenderer() {
  const { scene } = useGLTF("/models/studentDashboard.glb");
  return <primitive object={scene} />;
}
