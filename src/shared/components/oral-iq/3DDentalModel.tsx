'use client';
import React from 'react';

import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Box,
  Text,
  Group,
  Badge,
  ActionIcon,
  Tooltip,
  Stack,
  Divider,
  Loader,
  Transition,
  Paper,
} from '@mantine/core';
import {
  IconRefresh,
  IconZoomIn,
  IconRotate,
  IconInfoCircle,
  IconSquareCheck,
  IconSquare,
} from '@tabler/icons-react';
import { useHotkeys, useElementSize } from '@mantine/hooks';

export interface ThreeDDentalModelProps {
  onToothSelect?: (fdi: string) => void;
  onMultiSelect?: (fdis: string[]) => void;
  selectedFdi?: string | null;
  selectedFdis?: string[];
  className?: string;
  showControls?: boolean;
  /** When true, no border, no gradient background, minimal loading – for embedding (e.g. circle hero) */
  minimalContainer?: boolean;
  initialView?: 'occlusal' | 'frontal' | 'lateral';
  disabled?: boolean; // New prop to disable interactions
}

const getFdiFromIndex = (index: number, isUpper: boolean): string => {
  if (isUpper) return index <= 7 ? `2${8 - index}` : `1${index - 7}`;
  return index <= 7 ? `3${8 - index}` : `4${index - 7}`;
};

/**
 * Get detailed dental information from FDI notation
 */
const getToothDetails = (
  fdi: string
): {
  fdi: string;
  quadrant: string;
  quadrantNumber: number;
  position: number;
  toothType: string;
  toothName: string;
  arch: string;
  side: string;
  description: string;
} => {
  const quadrantNumber = parseInt(fdi.charAt(0), 10);
  const position = parseInt(fdi.charAt(1), 10);

  // Determine quadrant
  const quadrantMap: Record<number, string> = {
    1: 'Upper Right',
    2: 'Upper Left',
    3: 'Lower Left',
    4: 'Lower Right',
  };

  // Determine arch
  const arch =
    quadrantNumber === 1 || quadrantNumber === 2 ? 'Upper (Maxillary)' : 'Lower (Mandibular)';

  // Determine side
  const side = quadrantNumber === 1 || quadrantNumber === 4 ? 'Right' : 'Left';

  // Determine tooth type and name
  let toothType = '';
  let toothName = '';
  let description = '';

  if (position === 1 || position === 2) {
    toothType = 'Incisor';
    toothName = position === 1 ? 'Central Incisor' : 'Lateral Incisor';
    description = 'Used for cutting and shearing food';
  } else if (position === 3) {
    toothType = 'Canine';
    toothName = 'Canine (Cuspid)';
    description = 'Used for tearing and grasping food';
  } else if (position === 4 || position === 5) {
    toothType = 'Premolar';
    toothName = position === 4 ? 'First Premolar' : 'Second Premolar';
    description = 'Used for crushing and grinding food';
  } else if (position === 6 || position === 7 || position === 8) {
    toothType = 'Molar';
    if (position === 6) {
      toothName = 'First Molar';
    } else if (position === 7) {
      toothName = 'Second Molar';
    } else {
      toothName = 'Third Molar (Wisdom Tooth)';
    }
    description = 'Used for grinding and chewing food';
  }

  return {
    fdi,
    quadrant: quadrantMap[quadrantNumber] || 'Unknown',
    quadrantNumber,
    position,
    toothType,
    toothName,
    arch,
    side,
    description,
  };
};

const VIEW_PRESETS = {
  occlusal: {
    position: [0, 10, 0] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
  frontal: {
    position: [0, 0, 12] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
  lateral: {
    position: [12, 0, 0] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
  isometric: {
    position: [8, 6, 8] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
};

export const ThreeDDentalModel: React.FC<ThreeDDentalModelProps> = ({
  onToothSelect,
  onMultiSelect,
  selectedFdi,
  selectedFdis,
  className = '',
  showControls = true,
  minimalContainer = false,
  initialView = 'frontal',
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { ref: sizeRef, width, height } = useElementSize<HTMLDivElement>();

  const [isLoading, setIsLoading] = useState(true);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<keyof typeof VIEW_PRESETS>(initialView);
  const [interactionMode, setInteractionMode] = useState<'rotate' | 'zoom'>('rotate');
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    color: string;
    toothDetails?: ReturnType<typeof getToothDetails>;
  } | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const teethRef = useRef<THREE.Mesh[]>([]);
  const gumRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number>(0);
  const selectedFdiRef = useRef<string | null | undefined>(selectedFdi);
  const selectedFdisRef = useRef<string[]>(selectedFdis || []);
  const onToothSelectRef = useRef(onToothSelect);
  const onMultiSelectRef = useRef(onMultiSelect);
  const isMultiSelectModeRef = useRef<boolean>(false);
  const disabledRef = useRef(disabled);

  // Keyboard shortcuts
  useHotkeys([
    ['r', () => setInteractionMode('rotate')],
    ['z', () => setInteractionMode('zoom')],
    [
      'escape',
      () => {
        onToothSelect?.('');
        if (onMultiSelect && selectedFdisRef.current.length > 0) {
          selectedFdisRef.current = [];
          onMultiSelect([]);
        }
      },
    ],
    ['1', () => setView('occlusal')],
    ['2', () => setView('frontal')],
    ['3', () => setView('lateral')],
    ['4', () => setView('isometric')],
  ]);

  // Get metadata for all selected teeth
  // Derived metadata was previously computed but not used.

  const createToothGeometry = useCallback((fdi: string) => {
    const type = parseInt(fdi.charAt(1));
    const isMolar = type >= 6;
    const isPremolar = type === 4 || type === 5;
    const points: THREE.Vector2[] = [];
    const width = isMolar ? 0.26 : isPremolar ? 0.18 : 0.13;

    // Create anatomical shape
    for (let i = 0; i < 20; i++) {
      const angle = (i / 19) * Math.PI;
      const x = Math.sin(angle) * width * (0.8 + 0.2 * Math.sin(angle * 2));
      const y = (i - 9.5) * 0.07;
      points.push(new THREE.Vector2(x, y));
    }

    const geometry = new THREE.LatheGeometry(points, 32);

    // Add custom attributes for selection highlighting
    const positionAttribute = geometry.attributes.position;
    if (positionAttribute) {
      const vertexCount = positionAttribute.count;
      const originalPositions = new Float32Array(vertexCount * 3);
      originalPositions.set(positionAttribute.array);
      geometry.userData.originalPositions = originalPositions;
    }

    return geometry;
  }, []);

  const setView = useCallback((view: keyof typeof VIEW_PRESETS) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const preset = VIEW_PRESETS[view];
    cameraRef.current.position.set(...preset.position);
    controlsRef.current.target.set(...preset.target);
    controlsRef.current.update();
    setActiveView(view);

    // Show notification within the model area
    setNotification({
      title: 'View Changed',
      message: `Switched to ${view} view`,
      color: 'blue',
    });

    // Don't auto-hide - let user dismiss manually
  }, []);

  // Update refs when callbacks change
  useEffect(() => {
    onToothSelectRef.current = onToothSelect;
    onMultiSelectRef.current = onMultiSelect;
  }, [onToothSelect, onMultiSelect]);

  // Update refs when selections change
  useEffect(() => {
    selectedFdiRef.current = selectedFdi;
  }, [selectedFdi]);

  useEffect(() => {
    selectedFdisRef.current = selectedFdis || [];
  }, [selectedFdis]);

  useEffect(() => {
    isMultiSelectModeRef.current = isMultiSelectMode;
  }, [isMultiSelectMode]);

  useEffect(() => {
    disabledRef.current = disabled;
    if (controlsRef.current) {
      controlsRef.current.enabled = !disabled;
    }
  }, [disabled]);

  // Show notification when a tooth is selected (including on initial mount)
  useEffect(() => {
    if (selectedFdi && selectedFdi !== '') {
      const toothDetails = getToothDetails(selectedFdi);
      setNotification({
        title: toothDetails.toothName,
        message: `FDI: ${selectedFdi} • ${toothDetails.quadrant}`,
        color: 'green',
        toothDetails,
      });
    } else {
      // Clear notification when no tooth is selected
      setNotification(null);
    }
  }, [selectedFdi]);

  const handleToothClick = useCallback((event: MouseEvent | TouchEvent) => {
    if (!containerRef.current || !cameraRef.current || !controlsRef.current) return;

    // Don't handle clicks if component is disabled
    if (disabledRef.current) {
      return;
    }

    // Don't handle clicks if controls are disabled
    if (!controlsRef.current.enabled) {
      return;
    }

    // Get coordinates from mouse or touch event
    let clientX: number, clientY: number;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      // Touch event
      const touch =
        event.touches.length > 0
          ? event.touches[0]
          : event.changedTouches.length > 0
            ? event.changedTouches[0]
            : null;
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    }

    // Check if modifier key is pressed (Ctrl on Windows/Linux, Cmd on Mac) - only for mouse events
    const isMultiSelect = event instanceof MouseEvent && (event.ctrlKey || event.metaKey);

    // Use a delay to ensure OrbitControls has finished processing
    setTimeout(() => {
      if (!containerRef.current || !cameraRef.current || !controlsRef.current) return;

      // Double-check that controls are still enabled
      if (!controlsRef.current.enabled) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(teethRef.current);

      // Only process if we actually hit a tooth - this is critical!
      // If we didn't hit a tooth, don't do anything - let OrbitControls handle it
      if (intersects.length === 0 || !intersects[0]) {
        return;
      }

      const clickedTooth = intersects[0].object;
      const fdi = clickedTooth.userData?.fdi as string | undefined;

      if (!fdi) return;

      // Process multi-select if:
      // 1. Modifier key is pressed (desktop), OR
      // 2. Multi-select mode is enabled via checkbox
      const shouldMultiSelect =
        (isMultiSelect || isMultiSelectModeRef.current) && onMultiSelectRef.current;

      if (shouldMultiSelect) {
        // Multi-selection mode
        const currentSelections = [...selectedFdisRef.current];
        const index = currentSelections.indexOf(fdi);

        if (index > -1) {
          // Deselect if already selected
          currentSelections.splice(index, 1);
        } else {
          // Add to selection
          currentSelections.push(fdi);
        }

        selectedFdisRef.current = currentSelections;
        if (onMultiSelectRef.current) {
          onMultiSelectRef.current(currentSelections);
        }

        // Show notification
        if (currentSelections.length > 0) {
          setNotification({
            title: 'Multi-Selection',
            message: `${currentSelections.length} tooth${currentSelections.length > 1 ? 'teeth' : ''} selected`,
            color: 'blue',
          });
        } else {
          setNotification({
            title: 'Selection Cleared',
            message: 'All selections cleared',
            color: 'gray',
          });
        }

        // Don't auto-hide - let user dismiss manually
      } else if (onToothSelectRef.current) {
        // Single selection mode (only if not in multi-select mode)
        onToothSelectRef.current(fdi);

        // Clear multi-selection when doing single select
        if (selectedFdisRef.current.length > 0 && onMultiSelectRef.current) {
          selectedFdisRef.current = [];
          onMultiSelectRef.current([]);
        }

        // Get detailed tooth information
        const toothDetails = getToothDetails(fdi);

        // Show notification within the model area with detailed information
        setNotification({
          title: toothDetails.toothName,
          message: `FDI: ${fdi} • ${toothDetails.quadrant}`,
          color: 'green',
          toothDetails,
        });

        // Don't auto-hide - let user dismiss manually
      }
    }, 200); // Longer delay to ensure OrbitControls finishes
  }, []);

  const resetView = useCallback(() => {
    setView(initialView);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [setView, initialView]);

  // Initialize Three.js scene
  useEffect(() => {
    // Avoid initializing Three.js with zero-size canvas (causes WebGL framebuffer errors)
    if (!containerRef.current || width === 0 || height === 0) return;
    // Prevent re-initialization on resize (we handle resize in a separate effect)
    if (rendererRef.current) return;

    const scene = new THREE.Scene();
    if (!minimalContainer) {
      scene.background = new THREE.Color(0xf8fafc);
    }
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(...VIEW_PRESETS[initialView].position);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        precision: 'highp',
      });
    } catch (error) {
      // WebGL initialization failed
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('WebGL initialization failed:', errorMessage);
      setWebglError(
        'Your browser or device does not support WebGL, which is required for the 3D dental model. Please try enabling hardware acceleration in your browser settings or use a different browser.'
      );
      setIsLoading(false);
      return;
    }

    if (minimalContainer) {
      renderer.setClearColor(0x000000, 0);
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, -5, -10);
    scene.add(rimLight);

    // Create teeth
    const teeth: THREE.Mesh[] = [];
    const buildArch = (isUpper: boolean) => {
      for (let i = 0; i < 16; i++) {
        const fdi = getFdiFromIndex(i, isUpper);
        const geometry = createToothGeometry(fdi);

        const material = new THREE.MeshPhysicalMaterial({
          color: 0xfffaf0,
          roughness: 0.12,
          metalness: 0.05,
          transmission: 0.15,
          thickness: 0.8,
          ior: 1.65,
          specularIntensity: 0.8,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
          emissive: 0x000000,
          emissiveIntensity: 0,
          side: THREE.DoubleSide,
        });

        const tooth = new THREE.Mesh(geometry, material);
        const t = (i - 7.5) * 0.5;
        const y = isUpper ? 1.0 : -1.0;
        const z = Math.pow(t, 2) * 0.25;

        tooth.position.set(t, y, z);
        tooth.lookAt(0, y, -5);
        if (isUpper) tooth.rotateX(Math.PI);

        tooth.userData = {
          fdi,
          originalScale: 1,
          materialProps: { ...material },
        };

        tooth.castShadow = true;
        tooth.receiveShadow = true;
        scene.add(tooth);
        teeth.push(tooth);
      }
    };

    buildArch(true);
    buildArch(false);
    teethRef.current = teeth;

    // Create gums with anatomical detail
    const gumGroup = new THREE.Group();
    [true, false].forEach((isUpper, archIndex) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 30; i++) {
        const t = (i - 15) * 0.3;
        const y = isUpper ? 1.2 : -1.2;
        const z = Math.pow(t, 2) * 0.2 + Math.sin(t * 2) * 0.05;
        pts.push(new THREE.Vector3(t, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const gumGeometry = new THREE.TubeGeometry(curve, 64, 0.5, 16, false);

      const gumMaterial = new THREE.MeshPhysicalMaterial({
        color: archIndex === 0 ? 0xe6a8a8 : 0xd88a8a,
        roughness: 0.7,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        transmission: 0.05,
        thickness: 0.3,
        transparent: true,
        opacity: 1,
      });

      const gumMesh = new THREE.Mesh(gumGeometry, gumMaterial);
      gumMesh.receiveShadow = true;
      gumGroup.add(gumMesh);
    });
    scene.add(gumGroup);
    gumRef.current = gumGroup;

    // Setup OrbitControls with enhanced settings
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.2;
    controls.minDistance = 3;
    controls.maxDistance = 40;
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0;
    controls.enablePan = false;
    controls.enableRotate = !disabledRef.current;
    controls.enableZoom = !disabledRef.current;
    controls.enabled = !disabledRef.current;
    controls.screenSpacePanning = true;
    controlsRef.current = controls;

    // Add click event listener with proper drag detection
    const canvas = renderer.domElement;
    let mouseDownTime = 0;
    let mouseDownPos = { x: 0, y: 0 };
    let isDragging = false;

    const handleMouseDown = (event: MouseEvent) => {
      mouseDownTime = Date.now();
      mouseDownPos = { x: event.clientX, y: event.clientY };
      isDragging = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      // If mouse moves more than a few pixels, it's a drag, not a click
      if (mouseDownTime > 0) {
        const dx = Math.abs(event.clientX - mouseDownPos.x);
        const dy = Math.abs(event.clientY - mouseDownPos.y);
        // Only mark as dragging if moved more than 3 pixels
        if (dx > 3 || dy > 3) {
          isDragging = true;
        }
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      const timeSinceMouseDown = Date.now() - mouseDownTime;
      const dx = Math.abs(event.clientX - mouseDownPos.x);
      const dy = Math.abs(event.clientY - mouseDownPos.y);

      // Only treat as click if:
      // 1. It was quick (< 200ms) - shorter time to be more strict
      // 2. Mouse didn't move much (< 3 pixels) - stricter movement threshold
      // 3. Not a drag
      // 4. We have a valid mouse down time
      const isQuickClick =
        mouseDownTime > 0 && timeSinceMouseDown < 200 && dx < 3 && dy < 3 && !isDragging;

      // Reset tracking variables
      mouseDownTime = 0;
      isDragging = false;

      // Only process click if it was a true click (not a drag)
      if (isQuickClick) {
        setTimeout(() => {
          // Double-check we're not dragging and controls are still enabled
          if (controlsRef.current?.enabled) {
            handleToothClick(event);
          }
        }, 150);
      }
    };

    // Touch event handler for mobile - simpler approach using checkbox state
    let touchStartTime = 0;
    let touchStartPos = { x: 0, y: 0 };
    let isTouchDragging = false;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0 && event.touches[0]) {
        touchStartTime = Date.now();
        touchStartPos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        isTouchDragging = false;
      }
    };

    const handleTouchMove = () => {
      if (touchStartTime > 0) {
        isTouchDragging = true;
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (event.touches.length > 0) return; // Still touching

      const touch = event.changedTouches[0];
      if (!touch) return;

      const timeSinceTouchStart = Date.now() - touchStartTime;
      const dx = Math.abs(touch.clientX - touchStartPos.x);
      const dy = Math.abs(touch.clientY - touchStartPos.y);

      // Only treat as tap if:
      // 1. It was quick (< 200ms)
      // 2. Mouse didn't move much (< 5 pixels)
      // 3. Not a drag
      const isQuickTap =
        touchStartTime > 0 && timeSinceTouchStart < 200 && dx < 5 && dy < 5 && !isTouchDragging;

      // Reset tracking
      touchStartTime = 0;
      isTouchDragging = false;

      if (isQuickTap) {
        // Use a delay to let OrbitControls finish
        setTimeout(() => {
          if (controlsRef.current?.enabled) {
            // Create a synthetic mouse event from touch event
            const syntheticEvent = new MouseEvent('click', {
              clientX: touch.clientX,
              clientY: touch.clientY,
              bubbles: true,
              cancelable: true,
              ctrlKey: false,
              metaKey: false,
            });
            handleToothClick(syntheticEvent);
          }
        }, 200);
      }
    };

    // Add event listeners - use capture phase to get events early, but don't prevent default
    canvas.addEventListener('mousedown', handleMouseDown, { passive: true });
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseup', handleMouseUp, { passive: true });
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Animation loop
    const animate = (time: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Update tooth highlighting - use refs to get latest values
      // Always get fresh values from refs to ensure we have the latest state
      const currentSelectedFdi = selectedFdiRef.current;
      const currentSelectedFdis = [...selectedFdisRef.current]; // Create a copy to ensure we're checking the latest array

      teeth.forEach((tooth) => {
        const fdi = tooth.userData.fdi as string;
        // Check if tooth is selected (either single or multi)
        // For single selection, only highlight if there's no multi-selection
        const isSingleSelected =
          currentSelectedFdi && currentSelectedFdi === fdi && currentSelectedFdis.length === 0;
        const isMultiSelected = currentSelectedFdis.includes(fdi);
        const isSelected = isSingleSelected || isMultiSelected;
        const material = tooth.material as THREE.MeshPhysicalMaterial;

        if (isSelected) {
          const pulseIntensity = 0.7 + Math.sin(time * 0.005) * 0.3;
          material.emissive.setHex(0xff3333);
          material.emissiveIntensity = pulseIntensity;

          const scale = 1.15 + Math.sin(time * 0.003) * 0.05;
          tooth.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);

          // Add subtle rotation for visual interest
          tooth.rotation.y = Math.sin(time * 0.001) * 0.05;
        } else {
          // Smoothly fade out the glow
          material.emissiveIntensity = Math.max(0, material.emissiveIntensity - 0.15);
          tooth.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
          tooth.rotation.y = THREE.MathUtils.lerp(tooth.rotation.y, 0, 0.15);
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate(performance.now());
    setIsLoading(false);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      controls.dispose();
      renderer.dispose();
      // Clear refs so remounts can safely re-init
      rendererRef.current = null;
      controlsRef.current = null;
      cameraRef.current = null;
      sceneRef.current = null;

      teeth.forEach((tooth) => {
        tooth.geometry.dispose();
        (tooth.material as THREE.Material).dispose();
      });

      if (gumRef.current) {
        gumRef.current.children.forEach((child) => {
          const mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        });
      }
    };
  }, [width, height, createToothGeometry, handleToothClick, initialView, minimalContainer]);

  // Update refs when state changes (without recreating scene)
  useEffect(() => {
    selectedFdiRef.current = selectedFdi;
  }, [selectedFdi]);

  // Update renderer size when container dimensions change
  useEffect(() => {
    if (!rendererRef.current || !cameraRef.current || width === 0 || height === 0) return;

    const renderer = rendererRef.current;
    const camera = cameraRef.current;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }, [width, height]);

  // Update controls based on interaction mode
  useEffect(() => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;

    switch (interactionMode) {
      case 'rotate':
        controls.mouseButtons = {
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        };
        break;
      case 'zoom':
        controls.mouseButtons = {
          LEFT: THREE.MOUSE.DOLLY,
          MIDDLE: THREE.MOUSE.ROTATE,
          RIGHT: THREE.MOUSE.ROTATE,
        };
        break;
    }
  }, [interactionMode]);

  return (
    <Box
      className={`relative overflow-hidden ${minimalContainer ? '' : 'rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white'} ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: minimalContainer ? 360 : 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(minimalContainer ? { border: 'none', background: 'transparent' } : {}),
      }}
    >
      <div
        ref={(node) => {
          // Store ref for Three.js container
          containerRef.current = node;
          // Handle Mantine hooks - they return ref objects, assign to .current
          if (node) {
            try {
              const sizeRefObj = sizeRef as any;
              if (sizeRefObj && typeof sizeRefObj === 'object' && 'current' in sizeRefObj) {
                sizeRefObj.current = node;
              } else if (typeof sizeRefObj === 'function') {
                sizeRefObj(node);
              }
            } catch (_e) {
              // Ignore errors
            }
          }
        }}
        className="h-full w-full"
      />

      {/* Loading overlay */}
      <Transition mounted={isLoading} transition="fade" duration={400}>
        {(styles) => (
          <div
            style={styles}
            className={`absolute inset-0 z-50 flex items-center justify-center ${minimalContainer ? 'bg-transparent' : 'bg-white/90 backdrop-blur-sm'}`}
          >
            <Stack align="center" gap={minimalContainer ? 'xs' : 'md'}>
              <Loader size={minimalContainer ? 'md' : 'xl'} variant="bars" />
              {!minimalContainer && (
                <Text size="sm" color="dimmed" fw={600}>
                  Initializing 3D Dental Model...
                </Text>
              )}
            </Stack>
          </div>
        )}
      </Transition>

      {/* WebGL Error Fallback */}
      {webglError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 p-6 backdrop-blur-sm">
          <Stack align="center" gap="lg" style={{ maxWidth: 500 }}>
            <div className="rounded-full bg-red-100 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>

            <Stack align="center" gap="sm">
              <Text size="xl" fw={700} c="dark" ta="center">
                3D Model Unavailable
              </Text>
              <Text size="md" c="dimmed" ta="center" style={{ lineHeight: 1.6 }}>
                {webglError}
              </Text>
            </Stack>

            <Stack gap="xs" style={{ width: '100%' }}>
              <Text size="sm" fw={600} c="dark">
                Troubleshooting steps:
              </Text>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>
                  <Text size="sm" c="dimmed">
                    Enable hardware acceleration in your browser settings
                  </Text>
                </li>
                <li>
                  <Text size="sm" c="dimmed">
                    Update your graphics drivers
                  </Text>
                </li>
                <li>
                  <Text size="sm" c="dimmed">
                    Try a different browser (Chrome, Firefox, or Edge)
                  </Text>
                </li>
                <li>
                  <Text size="sm" c="dimmed">
                    Ensure your device supports WebGL
                  </Text>
                </li>
              </ul>
            </Stack>

            <Text size="xs" c="dimmed" ta="center" style={{ marginTop: 8 }}>
              For more information, visit{' '}
              <a
                href="https://get.webgl.org/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3B82F6', textDecoration: 'underline' }}
              >
                get.webgl.org
              </a>
            </Text>
          </Stack>
        </div>
      )}

      {/* Controls Panel - compact and anchored to top-left without crowding the model */}
      {showControls && (
        <Paper
          className="absolute left-3 top-3 z-40 rounded-lg border border-gray-100 bg-white/90 px-2.5 py-2 shadow-md backdrop-blur-md"
          withBorder
        >
          <Stack gap="xs">
            <Group gap="xs">
              <Tooltip label="Rotate (R)" withArrow>
                <ActionIcon
                  variant={interactionMode === 'rotate' ? 'filled' : 'light'}
                  color="blue"
                  onClick={() => setInteractionMode('rotate')}
                  size="lg"
                >
                  <IconRotate size={18} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Zoom (Z)" withArrow>
                <ActionIcon
                  variant={interactionMode === 'zoom' ? 'filled' : 'light'}
                  color="blue"
                  onClick={() => setInteractionMode('zoom')}
                  size="lg"
                >
                  <IconZoomIn size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>

            <Divider />

            <Group gap="xs">
              <Tooltip
                label={isMultiSelectMode ? 'Disable Multi-Select' : 'Enable Multi-Select'}
                withArrow
              >
                <ActionIcon
                  variant={isMultiSelectMode ? 'filled' : 'light'}
                  color={isMultiSelectMode ? 'blue' : 'gray'}
                  onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}
                  size="lg"
                >
                  {isMultiSelectMode ? <IconSquareCheck size={18} /> : <IconSquare size={18} />}
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Reset View" withArrow>
                <ActionIcon variant="light" color="gray" onClick={resetView} size="lg">
                  <IconRefresh size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Stack>
        </Paper>
      )}

      {/* View Presets - compact and anchored to top-right */}
      {showControls && (
        <Paper
          className="absolute right-3 top-3 z-40 rounded-lg border border-gray-100 bg-white/90 px-2.5 py-2 shadow-md backdrop-blur-md"
          withBorder
        >
          <Stack gap="xs">
            <Text size="xs" fw={600} color="dimmed">
              VIEWS
            </Text>
            <Group gap={4}>
              {Object.keys(VIEW_PRESETS).map((view) => (
                <Tooltip
                  key={view}
                  label={`${view.charAt(0).toUpperCase() + view.slice(1)} view`}
                  withArrow
                >
                  <Badge
                    size="sm"
                    variant={activeView === view ? 'filled' : 'light'}
                    color="blue"
                    onClick={() => setView(view as keyof typeof VIEW_PRESETS)}
                    style={{ cursor: 'pointer', textTransform: 'capitalize' }}
                  >
                    {view}
                  </Badge>
                </Tooltip>
              ))}
            </Group>
          </Stack>
        </Paper>
      )}

      {/* Custom Notification within Model Area */}
      {notification && (
        <Transition mounted={!!notification} transition="slide-up" duration={300}>
          {(styles) => {
            const getBackgroundColor = () => {
              switch (notification.color) {
                case 'blue':
                  return '#3B82F6';
                case 'green':
                  return '#10B981';
                case 'gray':
                  return '#6B7280';
                default:
                  return '#3B82F6';
              }
            };

            const hasToothDetails = notification.toothDetails;

            return (
              <Paper
                style={{
                  ...styles,
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 50,
                  backgroundColor: getBackgroundColor(),
                  color: 'white',
                  padding: hasToothDetails ? '20px 28px' : '16px 24px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                  minWidth: hasToothDetails
                    ? 'min(380px, calc(100vw - 80px))'
                    : 'min(300px, calc(100vw - 80px))',
                  maxWidth: hasToothDetails
                    ? 'min(500px, calc(100vw - 40px))'
                    : 'min(450px, calc(100vw - 40px))',
                }}
                withBorder
              >
                <Stack gap={hasToothDetails ? 12 : 8}>
                  {/* Header with dismiss button */}
                  <Group gap="sm" align="flex-start" wrap="nowrap" style={{ width: '100%' }}>
                    <Group gap="sm" align="center" wrap="nowrap" style={{ flex: 1 }}>
                      <IconInfoCircle size={24} style={{ flexShrink: 0 }} />
                      <Text
                        fw={700}
                        c="white"
                        style={{
                          fontSize: '1.25rem', // 20px - increased for better visibility
                          lineHeight: 1.3,
                        }}
                      >
                        {notification.title}
                      </Text>
                    </Group>

                    {/* Dismiss button */}
                    <ActionIcon
                      variant="subtle"
                      color="white"
                      size="sm"
                      onClick={() => setNotification(null)}
                      style={{
                        color: 'white',
                        flexShrink: 0,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </ActionIcon>
                  </Group>

                  <Text
                    c="white"
                    style={{
                      opacity: 0.95,
                      fontSize: '1rem', // 16px
                      lineHeight: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    {notification.message}
                  </Text>

                  {/* Detailed Tooth Information */}
                  {hasToothDetails && (
                    <>
                      <Divider color="rgba(255, 255, 255, 0.3)" />

                      <Stack gap={8}>
                        {/* Tooth Type */}
                        <Group gap="xs" wrap="nowrap">
                          <Text
                            c="white"
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              opacity: 0.9,
                              minWidth: '80px',
                            }}
                          >
                            Type:
                          </Text>
                          <Text
                            c="white"
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              opacity: 0.95,
                            }}
                          >
                            {notification.toothDetails?.toothType}
                          </Text>
                        </Group>

                        {/* Arch */}
                        <Group gap="xs" wrap="nowrap">
                          <Text
                            c="white"
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              opacity: 0.9,
                              minWidth: '80px',
                            }}
                          >
                            Arch:
                          </Text>
                          <Text
                            c="white"
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              opacity: 0.95,
                            }}
                          >
                            {notification.toothDetails?.arch}
                          </Text>
                        </Group>

                        {/* Side */}
                        <Group gap="xs" wrap="nowrap">
                          <Text
                            c="white"
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              opacity: 0.9,
                              minWidth: '80px',
                            }}
                          >
                            Side:
                          </Text>
                          <Text
                            c="white"
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              opacity: 0.95,
                            }}
                          >
                            {notification.toothDetails?.side}
                          </Text>
                        </Group>

                        {/* Position */}
                        <Group gap="xs" wrap="nowrap">
                          <Text
                            c="white"
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              opacity: 0.9,
                              minWidth: '80px',
                            }}
                          >
                            Position:
                          </Text>
                          <Text
                            c="white"
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              opacity: 0.95,
                            }}
                          >
                            #{notification.toothDetails?.position} in quadrant
                          </Text>
                        </Group>
                      </Stack>
                    </>
                  )}
                </Stack>
              </Paper>
            );
          }}
        </Transition>
      )}
    </Box>
  );
};
