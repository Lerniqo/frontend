import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function KeyboardCameraControls() {
  const { camera, gl } = useThree();
  const keys = useRef<{ [k: string]: boolean }>({});
  const yaw = useRef(0);
  const pitch = useRef(0);
  const pointerLocked = useRef(false);

  // Initial orientation
  useEffect(() => {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    yaw.current = Math.atan2(dir.x, -dir.z);
    pitch.current = Math.asin(THREE.MathUtils.clamp(dir.y, -0.99, 0.99));
  }, [camera]);

  useEffect(() => {
    const down = (e: KeyboardEvent) =>
      (keys.current[e.key.toLowerCase()] = true);
    const up = (e: KeyboardEvent) =>
      (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Pointer lock for mouse look (click canvas to toggle)
  useEffect(() => {
    const el = gl.domElement;
    const handleClick = () => {
      if (!pointerLocked.current) el.requestPointerLock();
    };
    const lockChange = () => {
      pointerLocked.current = document.pointerLockElement === gl.domElement;
    };
    const move = (e: MouseEvent) => {
      if (!pointerLocked.current) return;
      const sensitivity = 0.0025;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;
      const limit = Math.PI / 2 - 0.05;
      pitch.current = THREE.MathUtils.clamp(pitch.current, -limit, limit);
    };
    el.addEventListener("click", handleClick);
    document.addEventListener("pointerlockchange", lockChange);
    window.addEventListener("mousemove", move);
    return () => {
      el.removeEventListener("click", handleClick);
      document.removeEventListener("pointerlockchange", lockChange);
      window.removeEventListener("mousemove", move);
    };
  }, [gl]);

  useFrame((_, dt) => {
    // Update camera orientation from yaw/pitch
    const q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(pitch.current, yaw.current, 0, "YXZ")
    );
    camera.quaternion.copy(q);

    const moveDir = new THREE.Vector3();
    if (keys.current["s"]) moveDir.z -= 1;
    if (keys.current["w"]) moveDir.z += 1;
    if (keys.current["a"]) moveDir.x -= 1;
    if (keys.current["d"]) moveDir.x += 1;
    if (keys.current[" "]) moveDir.y += 1; // Space up
    if (keys.current["control"]) moveDir.y -= 1; // Ctrl down

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      // Local axes
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
        camera.quaternion
      );
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(
        camera.quaternion
      );
      const up = new THREE.Vector3(0, 1, 0);
      // Lock horizontal movement to ground plane unless vertical keys used
      const horizForward = new THREE.Vector3(
        forward.x,
        0,
        forward.z
      ).normalize();
      const horizRight = new THREE.Vector3(right.x, 0, right.z).normalize();

      const velocity = new THREE.Vector3();
      velocity.addScaledVector(horizForward, moveDir.z);
      velocity.addScaledVector(horizRight, moveDir.x);
      if (moveDir.y !== 0) velocity.addScaledVector(up, moveDir.y);

      if (velocity.lengthSq() > 0) velocity.normalize();

      const speed = keys.current["shift"] ? 30 : 10; // Shift to sprint
      camera.position.addScaledVector(velocity, speed * dt);
    }
  });

  return null;
}
