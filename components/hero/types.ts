import type { Vector3Tuple } from 'three';

/** Per-chapter camera + geometry transform targets for TF-01 teardown animation. */
export interface ChapterTransform {
  /** Camera world position [x, y, z]. */
  cameraPos: Vector3Tuple;
  /** Front shell Z offset (positive = towards viewer). */
  frontShellZ: number;
  /** Back shell Z offset (negative = away from viewer). */
  backShellZ: number;
  /** PCB group position offset [x, y, z]. */
  pcbOffset: Vector3Tuple;
  /** PCB rotation around Y axis in radians. */
  pcbRotY: number;
  /** Shell opacity (0 = invisible, 1 = fully visible). */
  shellOpacity: number;
  /** How far individual components lift off the board in Y (world units). */
  componentLiftY: number;
  /** Whether the glacier-teal signal trace shader is actively animating. */
  signalActive: boolean;
  /** Whether the camera is zoomed into MCU die level. */
  mcuZoom: boolean;
}

/** Descriptor for a named electronic component on the PCB. */
export interface ComponentDescriptor {
  id: string;
  /** Short engineering label shown in annotation callout. */
  label: string;
  /** Technical sublabel (function / spec). */
  sublabel: string;
  /** World-space anchor point for the annotation lead-line. */
  anchorPos: Vector3Tuple;
  /** Additional Y lift applied to this component during chapter 03. */
  liftOffset: number;
}

/** Map chapter index → transform. */
export const CHAPTER_TRANSFORMS: ChapterTransform[] = [
  /* 00 — The Machine: complete assembled device */
  {
    cameraPos: [0, 0, 7.5],
    frontShellZ: 0,
    backShellZ: 0,
    pcbOffset: [0, 0, 0],
    pcbRotY: 0,
    shellOpacity: 1,
    componentLiftY: 0,
    signalActive: false,
    mcuZoom: false,
  },
  /* 01 — The Shell: enclosure separates along Z */
  {
    cameraPos: [0, 0, 7.0],
    frontShellZ: 1.4,
    backShellZ: -1.4,
    pcbOffset: [0, 0, 0],
    pcbRotY: 0,
    shellOpacity: 0.85,
    componentLiftY: 0,
    signalActive: false,
    mcuZoom: false,
  },
  /* 02 — The Board: PCB slides forward, camera dollies in */
  {
    cameraPos: [0.5, 0, 5.2],
    frontShellZ: 3.2,
    backShellZ: -3.2,
    pcbOffset: [0, 0, 0.4],
    pcbRotY: 0.26, // ~15°
    shellOpacity: 0.0,
    componentLiftY: 0,
    signalActive: false,
    mcuZoom: false,
  },
  /* 03 — The Components: chips lift off the board */
  {
    cameraPos: [0.2, 0, 4.5],
    frontShellZ: 3.2,
    backShellZ: -3.2,
    pcbOffset: [0, 0, 0],
    pcbRotY: 0,
    shellOpacity: 0.0,
    componentLiftY: 0.5,
    signalActive: false,
    mcuZoom: false,
  },
  /* 04 — The Signal: active sensor → AFE → ADC → MCU pulse */
  {
    cameraPos: [0, -0.2, 4.2],
    frontShellZ: 3.2,
    backShellZ: -3.2,
    pcbOffset: [0, 0, 0],
    pcbRotY: 0,
    shellOpacity: 0.0,
    componentLiftY: 0,
    signalActive: true,
    mcuZoom: false,
  },
  /* 05 — Intelligence: macro zoom into MCU die */
  {
    cameraPos: [0.3, 0.4, 2.4],
    frontShellZ: 3.2,
    backShellZ: -3.2,
    pcbOffset: [0, 0, 0],
    pcbRotY: 0,
    shellOpacity: 0.0,
    componentLiftY: 0,
    signalActive: true,
    mcuZoom: true,
  },
  /* 06 — Reconstruct: reverse to sealed device */
  {
    cameraPos: [0, 0, 7.5],
    frontShellZ: 0,
    backShellZ: 0,
    pcbOffset: [0, 0, 0],
    pcbRotY: 0,
    shellOpacity: 1,
    componentLiftY: 0,
    signalActive: false,
    mcuZoom: false,
  },
];

/** Component descriptors for PCB annotation labels. */
export const COMPONENT_DESCRIPTORS: ComponentDescriptor[] = [
  {
    id: 'mcu',
    label: 'ESP32-S3',
    sublabel: 'DUAL-CORE / 240 MHz',
    anchorPos: [0.1, 0.3, 0.025],
    liftOffset: 0.7,
  },
  {
    id: 'afe',
    label: 'ANALOG FRONT-END',
    sublabel: '16-BIT ADC / DIFF INPUT',
    anchorPos: [-0.55, 0.0, 0.025],
    liftOffset: 0.5,
  },
  {
    id: 'pmic',
    label: 'POWER MGMT',
    sublabel: 'LDO REG / 3V3 + 1V8',
    anchorPos: [0.5, -0.6, 0.025],
    liftOffset: 0.4,
  },
  {
    id: 'xtal',
    label: 'CRYSTAL OSC',
    sublabel: '40 MHz / TCXO',
    anchorPos: [-0.2, -0.5, 0.025],
    liftOffset: 0.35,
  },
  {
    id: 'usb',
    label: 'USB-C INTERFACE',
    sublabel: 'CH340 / USB 2.0 FS',
    anchorPos: [0.6, -1.1, 0.025],
    liftOffset: 0.3,
  },
  {
    id: 'sensor',
    label: 'SENSOR I/O',
    sublabel: 'GPIO / ANALOG IN',
    anchorPos: [-0.7, 0.9, 0.025],
    liftOffset: 0.45,
  },
];

