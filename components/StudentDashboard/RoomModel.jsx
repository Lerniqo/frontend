"use client";

import { useGLTF } from "@react-three/drei";
import { useState, useEffect } from "react";

import * as THREE from "three";

import Clock from "./Clock";
import BookRack from "./BookRack";
import NoticeBoard from "./NoticeBoard";
import TrophyRack from "./TrophyRack";

import TableLamp from "./TableLamp";
import Table from "./Table";
import Radio from "./Radio";
import PlantOnTheTable from "./PlantOnTheTable";
import BookOnTable from "./BookOnTable";

export default function RoomModel() {
  const { scene, nodes, materials } = useGLTF("/models/room.glb");
  console.log(nodes.Room.children);

  useEffect(() => {
    // Lamp2 (head/lampshade) - light green for a soft lamp glow
    nodes.Room.children[1].material = new THREE.MeshToonMaterial({
      color: "#9EFFF6",
    }); // outline stays black
    nodes.Room.children[0].material = new THREE.MeshToonMaterial({
      color: "#9EFFF6",
    }); // light green
  }, [materials]);

  // console.log("RoomModel nodes:", nodes);

  return (
    <group>
      <NoticeBoard nodes={nodes} />

      <Clock nodes={nodes} />

      <BookRack nodes={nodes} />

      <TrophyRack nodes={nodes} />

      <TableLamp nodes={nodes} />
      <Radio nodes={nodes} />
      <PlantOnTheTable nodes={nodes} />
      <BookOnTable nodes={nodes} />
      <Table nodes={nodes} />

      <primitive object={nodes.Room} />
    </group>
  );
}

useGLTF.preload("/models/room.glb");
