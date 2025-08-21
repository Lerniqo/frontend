import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function PlantOnTheTable(props) {
  const [hovered, setHovered] = useState(null);

  const book_on_tableRef = useRef();
  const originalScaleOfbook_on_tableRef = useRef([1, 1, 1]);

  // Save original scale after mount
  useEffect(() => {
    if (book_on_tableRef.current) {
      originalScaleOfbook_on_tableRef.current =
        book_on_tableRef.current.scale.toArray();
    }
  }, []);

  // Assign materials
  useEffect(() => {
    const { book_on_table } = props.nodes;
    book_on_table.children[0].material = new THREE.MeshToonMaterial({
      color: "#FFFFFF",
    });
    book_on_table.children[1].material = new THREE.MeshToonMaterial({
      color: "#A04134",
    });
    book_on_table.children[2].material = new THREE.MeshToonMaterial({
      color: "#000000",
    });
  }, [props.nodes]);

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        gsap.to(book_on_tableRef.current.scale, {
          x: originalScaleOfbook_on_tableRef.current[0] * 1.04,
          y: originalScaleOfbook_on_tableRef.current[1] * 1.04,
          z: originalScaleOfbook_on_tableRef.current[2] * 1.04,
          duration: 0.3,
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(null);
        gsap.to(book_on_tableRef.current.scale, {
          x: originalScaleOfbook_on_tableRef.current[0],
          y: originalScaleOfbook_on_tableRef.current[1],
          z: originalScaleOfbook_on_tableRef.current[2],
          duration: 0.3,
        });
      }}
    >
      <primitive ref={book_on_tableRef} object={props.nodes.book_on_table} />
    </group>
  );
}
