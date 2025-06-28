"use client";

import dynamic from "next/dynamic";
import React from "react";
// import VideoPlayer from "../components/VideoPlayer";
const VideoPlayerBackup = dynamic(() => import("../../components/VideoPlayerBackup"), { ssr: false });

export default function PlayerBackup() {
  return <VideoPlayerBackup />;
}