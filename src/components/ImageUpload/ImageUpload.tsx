import React, { useState, useMemo, useCallback, CSSProperties } from "react";
import { useShopContext } from "../../hooks/useShopContext";
import { imageUploadTranslations } from "./ImageUploadTranslations";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImage,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { selectedLanguage } = useShopContext();

  const t =
    imageUploadTranslations[
      selectedLanguage.code as keyof typeof imageUploadTranslations
    ];

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Memoize styles
  const formControlStyle: CSSProperties = useMemo(
    () => ({
      backgroundColor: "transparent",
      color: "white",
    }),
    []
  );

  const currentImageStyle: CSSProperties = useMemo(
    () => ({
      width: "50px",
      height: "50px",
      objectFit: "cover",
      border: "2px solid rgba(255, 255, 255, 0.1)",
    }),
    []
  );

  const labelStyle = useMemo(
    () => (isUploading: boolean) => ({
      outline: "none",
      background: "transparent",
      color: isUploading ? "#ffffffa8" : "white",
    }),
    []
  );

  // Memoize the compressImage function with useCallback
  const compressImage = useCallback(
    (file: File, maxWidth = 800, quality = 0.8): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          ctx!.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Canvas toBlob failed"));
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  // Memoize the convertToBase64 function
  const convertToBase64 = useCallback((file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }, []);

  // Memoize the main upload handler
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(t.selectImageFile);
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t.imageMustBeLessThan5MB);
        return;
      }

      setIsUploading(true);

      try {
        let processedFile: Blob | File = file;

        // Compress image if it's larger than 1MB
        if (file.size > 1 * 1024 * 1024) {
          processedFile = await compressImage(file);
        }

        // Convert to base64
        const base64 = await convertToBase64(processedFile);

        // Upload to backend
        const response = await fetch(`${API_URL}/api/upload/channel-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await response.json();

        if (data.success) {
          onImageUpload(data.image_url);
        } else {
          alert(`${t.uploadFailed}: ${data.message}`);
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert(t.uploadFailedMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [API_URL, compressImage, convertToBase64, onImageUpload, t]
  );

  // Memoize the current image preview
  const CurrentImagePreview = useMemo(() => {
    if (!currentImage) return null;

    return (
      <div className="d-flex align-items-center gap-2 mb-2">
        <div className="current-image-preview">
          <img
            src={currentImage}
            alt="Current"
            className="rounded-5"
            style={currentImageStyle}
          />
        </div>
        <small style={{ color: "#ffffffa8" }}>{t.currentImage}</small>
      </div>
    );
  }, [currentImage, currentImageStyle, t.currentImage]);

  return (
    <div className="image-upload-container">
      <div className="d-flex flex-column gap-2">
        {/* Current Image Preview */}
        {CurrentImagePreview}

        {/* Upload Button */}
        <div
          className="form-control p-2 px-3 border border-1 shadow-sm rounded-4 d-flex align-items-center"
          style={formControlStyle}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="white"
            viewBox="0 0 16 16"
          >
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
          </svg>

          <label
            className="border-0 px-2 flex-grow-1 m-0"
            style={{ cursor: "pointer" }}
          >
            <span style={labelStyle(isUploading)}>
              {isUploading ? t.uploading : t.uploadChannelImage}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Help text */}
        <small style={{ color: "#c0c0c0ff", fontSize: "0.85rem" }}>
          {t.uploadFormats}
        </small>
      </div>
    </div>
  );
};
