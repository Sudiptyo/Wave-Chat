"use client";

import { useRef } from "react";

const useMediaPermissions = () => {
  // File inputs
  const documentInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      console.log(stream);
    } catch (err) {
      console.error("Camera Permission denied", err);
    }
  };

  const openMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      console.log(stream);
    } catch (err) {
      console.error("Microphone Permission denied", err);
    }
  };
  const openCameraAndMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      console.log(stream);
    } catch (err) {
      console.error("Microphone Permission denied", err);
    }
  };

  // Document picker
  const openDocumentPicker = () => {
    try {
      if (!documentInputRef.current) {
        throw new Error("Document input ref is not defined");
      }

      documentInputRef.current.click();
    } catch (err) {
      console.error("Document picker error", err);
    }
  };

  // Photos & Videos picker
  const openMediaPicker = () => {
    try {
      if (!mediaInputRef.current) {
        throw new Error("Media input ref is not defined");
      }

      mediaInputRef.current.click();
    } catch (err) {
      console.error("Media picker error", err);
    }
  };

  // Get user's location
  const getLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Location:", {
          latitude,
          longitude,
        });
      },
      (error) => {
        console.log("Location permission denied:", error);
      },
    );
  };

  return {
    openCamera,
    openMicrophone,
    openCameraAndMicrophone,
    documentInputRef,
    mediaInputRef,
    openDocumentPicker,
    openMediaPicker,
    getLocation,
  };
};

export default useMediaPermissions;
