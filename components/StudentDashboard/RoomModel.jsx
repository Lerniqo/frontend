"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";

import * as THREE from "three";

import Clock from "./Clock";
import BookRack from "./BookRack";
import NoticeBoard from "./NoticeBoard";
import TrophyRack from "./TrophyRack";
import Robot from "./Robot";

import TableLamp from "./TableLamp";
import Table from "./Table";
import Radio from "./Radio";
import PlantOnTheTable from "./PlantOnTheTable";
import BookOnTable from "./BookOnTable";

import Floor from "./Floor";

export default function RoomModel({ onReady }) {
  const [ready, setReady] = useState(false);
  const frameCount = useRef(0);

  const { scene, nodes, materials } = useGLTF("/models/room.glb");
  // console.log(nodes.Room.children);

  useEffect(() => {
    // Lamp2 (head/lampshade) - light green for a soft lamp glow
    nodes.Room.children[1].material = new THREE.MeshToonMaterial({
      color: "#91d3cd",
    }); // outline stays black
    nodes.Room.children[0].material = new THREE.MeshToonMaterial({
      color: "#91d3cd",
    }); // light green
  }, [materials]);

  // 🎥 Detect first render frame
  useFrame(() => {
    if (!ready) {
      frameCount.current++;
      if (frameCount.current > 1) {
        setReady(true);
        if (onReady) onReady(); // notify parent
      }
    }
  });

  // console.log("RoomModel nodes:", nodes);

  return (
    <group>
      <NoticeBoard nodes={nodes} />
      <Clock nodes={nodes} />
      <BookRack nodes={nodes} />
      <TrophyRack nodes={nodes} />
      <Robot nodes={nodes} />
      <TableLamp nodes={nodes} />
      <Radio nodes={nodes} />
      <PlantOnTheTable nodes={nodes} />
      <BookOnTable nodes={nodes} />
      <Table nodes={nodes} />
      <Floor nodes={nodes} />
      <primitive object={nodes.Room} />
    </group>
  );
}

useGLTF.preload("/models/room.glb");
