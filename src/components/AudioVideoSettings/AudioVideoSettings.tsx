import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
  RefObject,
} from "react";
import { AudioVideoSettingsTranslations } from "./AudioVideoSettingsTranslations";
import { useShopContext } from "../../hooks/useShopContext";

// Memoized DeviceSelect component
interface CustomDeviceSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: MediaDeviceInfo[];
  isOpen: boolean;
  onToggle: () => void;
  dropdownRef: RefObject<HTMLDivElement>;
  icon: React.ReactNode;
  label: string;
  testId: string;
}

const CustomDeviceSelect = memo<CustomDeviceSelectProps>(
  ({
    value,
    onChange,
    options,
    isOpen,
    onToggle,
    dropdownRef,
    icon,
    label,
    testId,
  }) => {
    const selectedDevice = useMemo(
      () => options.find((opt) => opt.deviceId === value),
      [options, value]
    );

    const handleSelect = useCallback(
      (deviceId: string) => {
        onChange(deviceId);
        onToggle();
      },
      [onChange, onToggle]
    );

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>, deviceId: string) => {
        if (deviceId !== value) {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
        }
      },
      [value]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>, deviceId: string) => {
        e.currentTarget.style.backgroundColor =
          deviceId === value ? "rgba(255, 255, 255, 0.1)" : "transparent";
      },
      [value]
    );

    return (
      <div
        ref={dropdownRef}
        className="position-relative mb-4"
        data-testid={testId}
      >
        <label className="form-label d-flex align-items-center gap-2 mb-2">
          <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
          <span style={{ fontSize: "0.95rem" }}>{label}</span>
        </label>

        {/* Selected Option Display */}
        <div
          className="option-dropdownad p-2 px-3 rounded-5 d-flex align-items-center justify-content-between"
          style={{
            cursor: "pointer",
            border: "none !important",
            color: "white",
            minHeight: "50px",
            background: "rgba(255, 255, 255, 0.1)",
          }}
          onClick={onToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onToggle()}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="fw-medium">
              {selectedDevice?.label ||
                `Device ${selectedDevice?.deviceId.slice(0, 5)}` ||
                "Select Device"}
            </span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className={`transition-all ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 16 16"
            style={{
              transition: "transform 0.3s ease",
              color: "rgba(255, 255, 255, 0.8)",
            }}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </div>

        {/* Dropdown Options */}
        {isOpen && (
          <div
            className="position-absolute top-100 start-0 end-0 mt-2 rounded-5 overflow-x-hidden z-3"
            style={{
              cursor: "pointer",
              background: "#1f462efa",
              backdropFilter: "blur(20px)",
              maxHeight: "250px",
              overflowY: "auto",
            }}
          >
            {options.map((option, index) => (
              <div
                key={option.deviceId}
                className="select-dropdownad p-3 d-flex align-items-center gap-2 cursor-pointer transition-all"
                style={{
                  cursor: "pointer",
                  borderBottom:
                    index < options.length - 1
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "none",
                  minHeight: "52px",
                  transition: "all 0.2s ease",
                  backgroundColor:
                    option.deviceId === value
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                }}
                onClick={() => handleSelect(option.deviceId)}
                onMouseEnter={(e) => handleMouseEnter(e, option.deviceId)}
                onMouseLeave={(e) => handleMouseLeave(e, option.deviceId)}
                role="option"
                aria-selected={option.deviceId === value}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSelect(option.deviceId)
                }
              >
                <span
                  style={{
                    color:
                      option.deviceId === value
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.9)",
                    fontWeight: option.deviceId === value ? "600" : "400",
                    fontSize: "0.95rem",
                  }}
                >
                  {option.label || `Device ${option.deviceId.slice(0, 5)}`}
                </span>

                {/* Checkmark for selected option */}
                {option.deviceId === value && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-check-lg ms-auto"
                    viewBox="0 0 16 16"
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                    aria-hidden="true"
                  >
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

CustomDeviceSelect.displayName = "CustomDeviceSelect";

// Memoized AudioLevelIndicator component
interface AudioLevelIndicatorProps {
  audioLevel: number;
  speakMessage: string;
}

const AudioLevelIndicator = memo<AudioLevelIndicatorProps>(
  ({ audioLevel, speakMessage }) => (
    <div className="mt-3">
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
        role="meter"
        aria-valuenow={audioLevel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Audio level"
      >
        <div
          style={{
            width: `${audioLevel}%`,
            height: "100%",
            background:
              audioLevel > 80
                ? "#ef4444"
                : audioLevel > 50
                ? "#f59e0b"
                : "#10b981",
            transition: "width 0.1s ease, background 0.2s ease",
            borderRadius: "4px",
          }}
        />
      </div>
      <small className="text-white-50 mt-1 d-block">{speakMessage}</small>
    </div>
  )
);

AudioLevelIndicator.displayName = "AudioLevelIndicator";

// Memoized VideoPreview component
interface VideoPreviewProps {
  isTesting: boolean;
  videoRef: RefObject<HTMLVideoElement>;
}

const VideoPreview = memo<VideoPreviewProps>(({ isTesting, videoRef }) => {
  if (!isTesting) return null;

  return (
    <div
      className="video-preview mb-4"
      style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#000",
        aspectRatio: "16/9",
        border: "1px solid rgba(255, 255, 255, 0.24)",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
        }}
        aria-label="Camera preview"
      />
    </div>
  );
});

VideoPreview.displayName = "VideoPreview";

export const AudioVideoSettings: React.FC = () => {
  const { selectedLanguage } = useShopContext();

  const t = useMemo(
    () =>
      AudioVideoSettingsTranslations[
        selectedLanguage.code as keyof typeof AudioVideoSettingsTranslations
      ],
    [selectedLanguage.code]
  );

  // State
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [audioOutputDevices, setAudioOutputDevices] = useState<
    MediaDeviceInfo[]
  >([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  const [selectedAudioInput, setSelectedAudioInput] = useState<string>("");
  const [selectedAudioOutput, setSelectedAudioOutput] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<string>("");

  const [testingAudio, setTestingAudio] = useState<boolean>(false);
  const [testingVideo, setTestingVideo] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const [isAudioInputOpen, setIsAudioInputOpen] = useState<boolean>(false);
  const [isAudioOutputOpen, setIsAudioOutputOpen] = useState<boolean>(false);
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);

  // Refs with proper typing
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const audioInputRef = useRef<HTMLDivElement>(null);
  const audioOutputRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  // Memoize savePreference function
  const savePreference = useCallback((type: string, deviceId: string) => {
    localStorage.setItem(type, deviceId);
  }, []);

  // Device enumeration with permissions
  const enumerateDevices = useCallback(async (withPermissions = false) => {
    try {
      if (withPermissions) {
        // Request permissions first to get non-empty labels
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      }

      const devices = await navigator.mediaDevices.enumerateDevices();

      const audioInputs = devices.filter(
        (device) => device.kind === "audioinput"
      );
      const audioOutputs = devices.filter(
        (device) => device.kind === "audiooutput"
      );
      const videoInputs = devices.filter(
        (device) => device.kind === "videoinput"
      );

      setAudioInputDevices(audioInputs);
      setAudioOutputDevices(audioOutputs);
      setVideoDevices(videoInputs);

      // Load saved preferences or use defaults
      const savedAudioInput = localStorage.getItem("preferredAudioInput");
      const savedAudioOutput = localStorage.getItem("preferredAudioOutput");
      const savedVideo = localStorage.getItem("preferredVideoInput");

      setSelectedAudioInput(savedAudioInput || audioInputs[0]?.deviceId || "");
      setSelectedAudioOutput(
        savedAudioOutput || audioOutputs[0]?.deviceId || ""
      );
      setSelectedVideo(savedVideo || videoInputs[0]?.deviceId || "");
    } catch (error) {
      console.error("Error enumerating devices:", error);
    }
  }, []);

  // Initial device enumeration (without permissions)
  useEffect(() => {
    enumerateDevices(false);
  }, [enumerateDevices]);

  // Device change listener
  useEffect(() => {
    const handleDeviceChange = () => {
      enumerateDevices(false);
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
    };
  }, [enumerateDevices]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (audioInputRef.current && !audioInputRef.current.contains(target)) {
        setIsAudioInputOpen(false);
      }
      if (audioOutputRef.current && !audioOutputRef.current.contains(target)) {
        setIsAudioOutputOpen(false);
      }
      if (videoRef.current && !videoRef.current.contains(target)) {
        setIsVideoOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Audio testing logic
  const startAudioTest = useCallback(async () => {
    try {
      setTestingAudio(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedAudioInput
            ? { exact: selectedAudioInput }
            : undefined,
        },
      });

      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateLevel = () => {
        if (!testingAudio || !analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(Math.min(100, (average / 255) * 100 * 2));

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (error) {
      console.error("Error testing audio:", error);
      setTestingAudio(false);
    }
  }, [selectedAudioInput, testingAudio]);

  const stopAudioTest = useCallback(() => {
    setTestingAudio(false);
    setAudioLevel(0);

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  // Video testing logic
  const startVideoTest = useCallback(async () => {
    try {
      setTestingVideo(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedVideo ? { exact: selectedVideo } : undefined,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }

      streamRef.current = stream;
    } catch (error) {
      console.error("Error testing video:", error);
      setTestingVideo(false);
    }
  }, [selectedVideo]);

  const stopVideoTest = useCallback(() => {
    setTestingVideo(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioTest();
      stopVideoTest();
    };
  }, [stopAudioTest, stopVideoTest]);

  // Memoized handlers for device changes
  const handleAudioInputChange = useCallback(
    (deviceId: string) => {
      setSelectedAudioInput(deviceId);
      savePreference("preferredAudioInput", deviceId);
      if (testingAudio) {
        stopAudioTest();
        setTimeout(() => startAudioTest(), 100);
      }
    },
    [savePreference, testingAudio, stopAudioTest, startAudioTest]
  );

  const handleAudioOutputChange = useCallback(
    (deviceId: string) => {
      setSelectedAudioOutput(deviceId);
      savePreference("preferredAudioOutput", deviceId);
    },
    [savePreference]
  );

  const handleVideoChange = useCallback(
    (deviceId: string) => {
      setSelectedVideo(deviceId);
      savePreference("preferredVideoInput", deviceId);
      if (testingVideo) {
        stopVideoTest();
        setTimeout(() => startVideoTest(), 100);
      }
    },
    [savePreference, testingVideo, stopVideoTest, startVideoTest]
  );

  // Memoized icons
  const audioInputIcon = useMemo(
    () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
      </svg>
    ),
    []
  );

  const audioOutputIcon = useMemo(
    () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z" />
        <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z" />
        <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06" />
      </svg>
    ),
    []
  );

  const videoIcon = useMemo(
    () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="18"
        fill="currentColor"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"
        />
      </svg>
    ),
    []
  );

  // Cast refs to non-null types for the component props
  const audioInputRefNonNull = audioInputRef as RefObject<HTMLDivElement>;
  const audioOutputRefNonNull = audioOutputRef as RefObject<HTMLDivElement>;
  const videoRefNonNull = videoRef as RefObject<HTMLDivElement>;
  const videoPreviewRefNonNull = videoPreviewRef as RefObject<HTMLVideoElement>;

  return (
    <div style={{ color: "white", width: "100%" }}>
      <div className="d-inline-flex gap-2 flex-wrap align-items-start mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="white"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
          <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
        </svg>
        <h4 className="mb-0">{t.audioVideoSettings}</h4>
      </div>

      {/* Audio Input */}
      <CustomDeviceSelect
        value={selectedAudioInput}
        onChange={handleAudioInputChange}
        options={audioInputDevices}
        isOpen={isAudioInputOpen}
        onToggle={() => setIsAudioInputOpen(!isAudioInputOpen)}
        dropdownRef={audioInputRefNonNull}
        icon={audioInputIcon}
        label={t.microphone}
        testId="audio-input"
      />

      {selectedAudioInput && (
        <div className="mb-4">
          <button
            className="btn btn-light text-uppercase fw-bold rounded-4 px-3 px-md-4"
            onClick={testingAudio ? stopAudioTest : startAudioTest}
            aria-pressed={testingAudio}
          >
            {testingAudio ? t.stopTest : t.testMicrophone}
          </button>

          {testingAudio && (
            <AudioLevelIndicator
              audioLevel={audioLevel}
              speakMessage={t.speakIntoMicrophone}
            />
          )}
        </div>
      )}

      {/* Audio Output */}
      <CustomDeviceSelect
        value={selectedAudioOutput}
        onChange={handleAudioOutputChange}
        options={audioOutputDevices}
        isOpen={isAudioOutputOpen}
        onToggle={() => setIsAudioOutputOpen(!isAudioOutputOpen)}
        dropdownRef={audioOutputRefNonNull}
        icon={audioOutputIcon}
        label={t.outputDevice}
        testId="audio-output"
      />

      {/* Video Input */}
      <CustomDeviceSelect
        value={selectedVideo}
        onChange={handleVideoChange}
        options={videoDevices}
        isOpen={isVideoOpen}
        onToggle={() => setIsVideoOpen(!isVideoOpen)}
        dropdownRef={videoRefNonNull}
        icon={videoIcon}
        label={t.camera}
        testId="video-input"
      />

      {selectedVideo && (
        <div className="mb-4">
          <button
            className="btn btn-light text-uppercase fw-bold rounded-4 px-3 px-md-4 mb-3"
            onClick={testingVideo ? stopVideoTest : startVideoTest}
            aria-pressed={testingVideo}
          >
            {testingVideo ? t.stopPreview : t.testCamera}
          </button>

          <VideoPreview
            isTesting={testingVideo}
            videoRef={videoPreviewRefNonNull}
          />
        </div>
      )}
    </div>
  );
};
