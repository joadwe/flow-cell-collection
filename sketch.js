// Global variables
let canvas;
let canvasWidth = 840;
let canvasHeight = 400;

// HTML element references
let cytometerSelect;
let naInput, fcInXInput, fcInYInput, fcOutXInput, fcOutYInput;
let wavelengthInput, sheathRIInput, flowcellRIInput;
let outerFCCheckbox, innerFCCheckbox, lensCheckbox;
let resultsDisplay;

// Drawing variables
let Data = [];

function setup() {
  // Create responsive canvas
  updateCanvasSize();
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('sketchContainer');
  
  // Get references to HTML elements
  cytometerSelect = document.getElementById('cytometer-preset');
  naInput = document.getElementById('na-input');
  fcInXInput = document.getElementById('fc-in-x');
  fcInYInput = document.getElementById('fc-in-y');
  fcOutXInput = document.getElementById('fc-out-x');
  fcOutYInput = document.getElementById('fc-out-y');
  wavelengthInput = document.getElementById('wavelength');
  sheathRIInput = document.getElementById('sheath-ri');
  flowcellRIInput = document.getElementById('flowcell-ri');
  outerFCCheckbox = document.getElementById('outer-fc-checkbox');
  innerFCCheckbox = document.getElementById('inner-fc-checkbox');
  lensCheckbox = document.getElementById('lens-checkbox');
  resultsDisplay = document.getElementById('results-display');
  
  // Add event listeners
  cytometerSelect.addEventListener('change', handlePresetChange);
  naInput.addEventListener('input', redraw);
  fcInXInput.addEventListener('input', redraw);
  fcInYInput.addEventListener('input', redraw);
  fcOutXInput.addEventListener('input', redraw);
  fcOutYInput.addEventListener('input', redraw);
  wavelengthInput.addEventListener('input', redraw);
  outerFCCheckbox.addEventListener('change', redraw);
  innerFCCheckbox.addEventListener('change', redraw);
  lensCheckbox.addEventListener('change', redraw);
  
  // Handle window resize
  window.addEventListener('resize', handleResize);
  
  // Disable continuous drawing - only redraw when needed
  noLoop();
  
  // Initial draw
  redraw();
}

function updateCanvasSize() {
  const container = document.getElementById('sketchContainer');
  if (container) {
    const containerWidth = container.clientWidth - 40; // Account for padding
    const maxWidth = 1000;
    const minWidth = 400;
    
    canvasWidth = Math.min(maxWidth, Math.max(minWidth, containerWidth));
    canvasHeight = Math.max(300, canvasWidth * 0.5); // Maintain aspect ratio
  }
}

function handleResize() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  redraw();
}

function handlePresetChange() {
  const preset = cytometerSelect.value;
  
  if (preset === 'Custom') {
    fcInXInput.value = 250;
    fcInYInput.value = 250;
    fcOutXInput.value = 6000;
    fcOutYInput.value = 6000;
    naInput.value = 1.2;
  } else if (cytometerPresets[preset]) {
    const p = cytometerPresets[preset];
    fcInXInput.value = p.xIn;
    fcInYInput.value = p.yIn;
    fcOutXInput.value = p.xOut;
    fcOutYInput.value = p.yOut;
    naInput.value = p.NumAp;
    
    // Handle OutFCPoss for presets - suggest checkbox state but allow user override
    if (!p.OutFCPoss) {
      outerFCCheckbox.checked = false;
    } else {
      outerFCCheckbox.checked = true;
    }
  }
  
  redraw();
}
const cytometerPresets = {
  'CytoFlex':   { xIn: 420, yIn: 160, xOut: 7000, yOut: 6000, NumAp: 1.3, OutFCPoss: false },
  'Attune NxT': { xIn: 200, yIn: 200, xOut: 6000, yOut: 4000, NumAp: 1.2, OutFCPoss: true  },
  'Calibur':    { xIn: 430, yIn: 180, xOut: 7000, yOut: 6500, NumAp: 1.2, OutFCPoss: true  },
  'Aria':       { xIn: 250, yIn: 160, xOut: 6000, yOut: 4000, NumAp: 1.2, OutFCPoss: false },
  'Canto':      { xIn: 430, yIn: 180, xOut: 7000, yOut: 6500, NumAp: 1.2, OutFCPoss: true  },
  'Canto II':   { xIn: 430, yIn: 180, xOut: 7000, yOut: 6500, NumAp: 1.2, OutFCPoss: true  },
  'Fortessa':   { xIn: 430, yIn: 180, xOut: 7000, yOut: 6500, NumAp: 1.2, OutFCPoss: true  },
  'Gallios':    { xIn: 460, yIn: 150, xOut: 7000, yOut: 6500, NumAp: 1.2, OutFCPoss: false },
  'Navios':     { xIn: 460, yIn: 150, xOut: 7000, yOut: 6500, NumAp: 1.2, OutFCPoss: false }
};

function getPresetValues(preset, scaler) {
  if (cytometerPresets[preset]) {
    const p = cytometerPresets[preset];
    return {
      xIn: p.xIn * scaler,
      yIn: p.yIn * scaler,
      xOut: p.xOut * scaler,
      yOut: p.yOut * scaler,
      NumAp: p.NumAp,
      OutFCPoss: p.OutFCPoss
    };
  }
  // Custom or fallback
  return {
    xIn: parseFloat(fcInXInput.value) * scaler,
    yIn: parseFloat(fcInYInput.value) * scaler,
    xOut: parseFloat(fcOutXInput.value) * scaler,
    yOut: parseFloat(fcOutYInput.value) * scaler,
    NumAp: parseFloat(naInput.value),
    OutFCPoss: true
  };
}

function draw() {
  clear();
  background(255);

  const scaler = 6 / 100;
  Medium_RI();
  FlowCell_RI();

  const preset = cytometerSelect.value;
  const { xIn, yIn, xOut, yOut, NumAp, OutFCPoss } = getPresetValues(preset, scaler);

  // Calculate canvas center with responsive positioning
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;
  
  // Scale the flow cell dimensions to fit the canvas
  const maxDimension = Math.max(xOut, yOut);
  const availableSpace = Math.min(canvasWidth * 0.8, canvasHeight * 0.8);
  const displayScaler = availableSpace / maxDimension;
  
  const displayXOut = xOut * displayScaler;
  const displayYOut = yOut * displayScaler;
  const displayXIn = xIn * displayScaler;
  const displayYIn = yIn * displayScaler;

  // Draw flow cells
  rectMode(CENTER);
  fill(220, 220, 220);
  rect(canvasCenterX, canvasCenterY, displayXOut, displayYOut);
  fill(255);
  rect(canvasCenterX, canvasCenterY, displayXIn, displayYIn);

  OuterFlowCellLim(displayXIn, displayYIn, displayXOut, displayYOut, canvasCenterX, canvasCenterY);

  if (outerFCCheckbox.checked) {
    fill(255, 255, 190, 255 / 3);
    quad(Data[0], Data[1], Data[2], Data[3], Data[4], Data[5], Data[6], Data[7]);
  }
  
  InnerFlowCellLim(xIn, yIn, xOut, yOut, scaler, OutFCPoss, displayXIn, displayYIn, displayXOut, displayYOut, canvasCenterX, canvasCenterY, displayScaler);
}

function OuterFlowCellLim(xIn, yIn, xOut, yOut, CanvasCenterX, CanvasCenterY) {
  var x1 = CanvasCenterX + xIn / 2;
  var x2 = CanvasCenterX + xOut / 2;
  var x3 = CanvasCenterX - xOut / 2;
  var x4 = CanvasCenterX - xIn / 2;

  var y1 = CanvasCenterY - yIn / 2;
  var y2 = CanvasCenterY - yOut / 2;
  var y3 = CanvasCenterY - yOut / 2;
  var y4 = CanvasCenterY - yIn / 2;

  return Data = [x1, y1, x2, y2, x3, y3, x4, y4];
}

function InnerFlowCellLim(xIn, yIn, xOut, yOut, Scaler, OutFCPoss, displayXIn, displayYIn, displayXOut, displayYOut, CanvasCenterX, CanvasCenterY, displayScaler) {
  let x = xIn / Scaler / 2;
  let y = yIn / Scaler / 2;
  let x2 = (xOut / Scaler / 2) - x;
  let y2 = (yOut / Scaler / 2) - y;

  let InAng = (180 / Math.PI * Math.atan(x / y));
  let OutAng = 180 / Math.PI * (Math.asin((parseFloat(sheathRIInput.value) * Math.sin(Math.atan(x / y))) / parseFloat(flowcellRIInput.value)));

  if (x2 < y2) {
    var InAng2 = 90 - (180 / Math.PI * Math.atan(x2 / y2));
  } else {
    var InAng2 = (180 / Math.PI * Math.atan(x2 / y2));
  }

  let OutAng2 = Math.asin((parseFloat(flowcellRIInput.value) * Math.sin(InAng2 * Math.PI / 180)) / parseFloat(sheathRIInput.value)) * 180 / PI;

  // Lens collection angles
  let LensOutAng = Math.asin(parseFloat(naInput.value) / parseFloat(flowcellRIInput.value)) * 180 / Math.PI;
  let LensInAng = Math.asin((parseFloat(flowcellRIInput.value) * Math.sin(LensOutAng * Math.PI / 180)) / parseFloat(sheathRIInput.value)) * 180 / PI;

  // Calculate system limited angles
  let MinAng1 = Math.min(OutAng2, LensInAng, InAng);
  let MinAng2 = Math.min(OutAng, LensOutAng, InAng2);

  // Calculate light collection percentage
  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
  function calculateLightCollection(angleInDegrees, totalLight) {
    const angleInRadians = degreesToRadians(angleInDegrees);
    const solidAngle = 2 * Math.PI * (1 - Math.cos(angleInRadians));
    const fraction = solidAngle / (4 * Math.PI);
    return totalLight * fraction;
  }
  
  const halfAngleInDegrees = MinAng1;
  const totalLightOutput = 50;
  const lightCollected = calculateLightCollection(halfAngleInDegrees * 2, totalLightOutput);

  // Update results display
  updateResultsDisplay(InAng, OutAng, OutAng2, InAng2, LensInAng, LensOutAng, MinAng1, MinAng2, lightCollected, OutFCPoss);

  // Draw collection angles on canvas
  if (innerFCCheckbox.checked) {
    drawInnerFlowCellAngle(xIn, yIn, xOut, yOut, Scaler, OutAng, InAng2, CanvasCenterX, CanvasCenterY, displayScaler);
  }

  if (lensCheckbox.checked) {
    drawLensAngle(xIn, yIn, xOut, yOut, Scaler, LensOutAng, InAng2, CanvasCenterX, CanvasCenterY, displayScaler);
  }
}

function updateResultsDisplay(InAng, OutAng, OutAng2, InAng2, LensInAng, LensOutAng, MinAng1, MinAng2, lightCollected, OutFCPoss) {
  let html = '';
  
  html += `<div class="result-line">
    <div class="color-indicator" style="background-color: rgba(255, 255, 190, 0.7);"></div>
    <span>${OutFCPoss ? `Outer Flow Cell Half-Angle = Sheath - ${OutAng2.toFixed(1)}° | Silica - ${InAng2.toFixed(1)}°` : '<strong>Outer Flow Cell Dimensions Unknown</strong>'}</span>
  </div>`;
  
  html += `<div class="result-line">
    <div class="color-indicator" style="background-color: rgba(255, 150, 150, 0.7);"></div>
    <span>Inner Flow Cell Half-Angle = Sheath - ${InAng.toFixed(1)}° | Silica - ${OutAng.toFixed(1)}°</span>
  </div>`;
  
  html += `<div class="result-line">
    <div class="color-indicator" style="background-color: rgba(150, 100, 150, 0.7);"></div>
    <span>Lens Limited Half-Angle = Sheath - ${LensInAng.toFixed(1)}° | Silica - ${LensOutAng.toFixed(1)}°</span>
  </div>`;
  
  html += `<div class="result-line bold">
    <div class="color-indicator" style="background-color: #3498db;"></div>
    <span>System Limited Half-Angle = Sheath - ${MinAng1.toFixed(1)}° | Silica - ${MinAng2.toFixed(1)}°</span>
  </div>`;
  
  html += `<div class="result-line bold">
    <div class="color-indicator" style="background-color: #2ecc71;"></div>
    <span>Fluorescence collection = ${lightCollected.toFixed(1)}%</span>
  </div>`;
  
  resultsDisplay.innerHTML = html;
}

function drawInnerFlowCellAngle(xIn, yIn, xOut, yOut, Scaler, OutAng, InAng2, CanvasCenterX, CanvasCenterY, displayScaler) {
  let y = yIn / Scaler / 2;
  
  if (OutAng * Math.PI / 180 <= InAng2 * Math.PI / 180) {
    var OutEdge = ((yOut / Scaler / 2) - y) * Math.tan(OutAng * Math.PI / 180);

    let x1 = CanvasCenterX + (xIn / 2) * displayScaler;
    let x2 = CanvasCenterX + (OutEdge * Scaler) * displayScaler;
    let x3 = CanvasCenterX - (OutEdge * Scaler) * displayScaler;
    let x4 = CanvasCenterX - (xIn / 2) * displayScaler;
    let y1 = CanvasCenterY - (yIn / 2) * displayScaler;
    let y2 = CanvasCenterY - (yOut / 2) * displayScaler;
    let y3 = CanvasCenterY - (yOut / 2) * displayScaler;
    let y4 = CanvasCenterY - (yIn / 2) * displayScaler;

    fill(255, 150, 150, 255 / 3);
    quad(x1, y1, x2, y2, x3, y3, x4, y4);
  } else {
    var OutEdge = ((yOut / Scaler / 2) - y) * Math.tan((90 - OutAng) * Math.PI / 180);

    var vx1 = CanvasCenterX + (xIn / 2) * displayScaler;
    var vx2 = CanvasCenterX + (xOut / 2) * displayScaler;
    var vx3 = CanvasCenterX + (xOut / 2) * displayScaler;
    var vx4 = CanvasCenterX - (xOut / 2) * displayScaler;
    var vx5 = CanvasCenterX - (xOut / 2) * displayScaler;
    var vx6 = CanvasCenterX - (xIn / 2) * displayScaler;

    var vy1 = CanvasCenterY - (yIn / 2) * displayScaler;
    var vy2 = CanvasCenterY - (OutEdge * Scaler) * displayScaler;
    var vy3 = CanvasCenterY - (yOut / 2) * displayScaler;
    var vy4 = CanvasCenterY - (yOut / 2) * displayScaler;
    var vy5 = CanvasCenterY - (OutEdge * Scaler) * displayScaler;
    var vy6 = CanvasCenterY - (yIn / 2) * displayScaler;

    fill(255, 150, 150, 255 / 3);
    beginShape();
    vertex(vx1, vy1);
    vertex(vx2, vy2);
    vertex(vx3, vy3);
    vertex(vx4, vy4);
    vertex(vx5, vy5);
    vertex(vx6, vy6);
    endShape(CLOSE);
  }
}

function drawLensAngle(xIn, yIn, xOut, yOut, Scaler, LensOutAng, InAng2, CanvasCenterX, CanvasCenterY, displayScaler) {
  let y = yIn / Scaler / 2;
  
  if (InAng2 > LensOutAng) {
    var OutEdge = ((yOut / Scaler / 2) - y) * Math.tan(LensOutAng * Math.PI / 180);

    let x1 = CanvasCenterX + (xIn / 2) * displayScaler;
    let x2 = CanvasCenterX + (OutEdge * Scaler) * displayScaler;
    let x3 = CanvasCenterX - (OutEdge * Scaler) * displayScaler;
    let x4 = CanvasCenterX - (xIn / 2) * displayScaler;
    let y1 = CanvasCenterY - (yIn / 2) * displayScaler;
    let y2 = CanvasCenterY - (yOut / 2) * displayScaler;
    let y3 = CanvasCenterY - (yOut / 2) * displayScaler;
    let y4 = CanvasCenterY - (yIn / 2) * displayScaler;

    fill(150, 100, 150, 255 / 3);
    quad(x1, y1, x2, y2, x3, y3, x4, y4);
  } else {
    var OutEdge = ((yOut / Scaler / 2) - y) * Math.tan((90 - LensOutAng) * Math.PI / 180);

    var vx1 = CanvasCenterX + (xIn / 2) * displayScaler;
    var vx2 = CanvasCenterX + (xOut / 2) * displayScaler;
    var vx3 = CanvasCenterX + (xOut / 2) * displayScaler;
    var vx4 = CanvasCenterX - (xOut / 2) * displayScaler;
    var vx5 = CanvasCenterX - (xOut / 2) * displayScaler;
    var vx6 = CanvasCenterX - (xIn / 2) * displayScaler;

    var vy1 = CanvasCenterY - (yIn / 2) * displayScaler;
    var vy2 = CanvasCenterY - (OutEdge * Scaler) * displayScaler;
    var vy3 = CanvasCenterY - (yOut / 2) * displayScaler;
    var vy4 = CanvasCenterY - (yOut / 2) * displayScaler;
    var vy5 = CanvasCenterY - (OutEdge * Scaler) * displayScaler;
    var vy6 = CanvasCenterY - (yIn / 2) * displayScaler;

    fill(150, 100, 150, 255 / 3);
    beginShape();
    vertex(vx1, vy1);
    vertex(vx2, vy2);
    vertex(vx3, vy3);
    vertex(vx4, vy4);
    vertex(vx5, vy5);
    vertex(vx6, vy6);
    endShape(CLOSE);
  }
}

function Medium_RI() {
  let lam = parseFloat(wavelengthInput.value);
  let lams2 = Math.pow(lam / 1000, 2); // wavelength square in µm

  // Dispersion formula
  let a = ((5.684027565 / 10) * lams2) / (lams2 - (5.101829712 / 1000));
  let b = ((1.726177391 / 10) * lams2) / (lams2 - (1.821153936 / 100));
  let c = ((2.086189578 / 100) * lams2) / (lams2 - (2.620722293 / 100));
  let d = ((1.130748688 / 10) * lams2) / (lams2 - (1.069792721 * 10));

  let sums = 1 + a + b + c + d;
  let RIwat = Math.sqrt(sums);

  sheathRIInput.value = RIwat.toFixed(4);
}

function FlowCell_RI() {
  let lam = parseFloat(wavelengthInput.value);
  let lams2 = Math.pow(lam / 1000, 2); // wavelength square in µm

  // Dispersion formula 
  let a = ((0.6961663) * lams2) / (lams2 - Math.pow(0.0684043, 2));
  let b = ((0.4079426) * lams2) / (lams2 - Math.pow(0.1162414, 2));
  let c = ((0.8974794) * lams2) / (lams2 - Math.pow(9.896161, 2));

  let sums = 1 + a + b + c;
  let RIflowcell = Math.sqrt(sums);

  flowcellRIInput.value = RIflowcell.toFixed(4);
}
