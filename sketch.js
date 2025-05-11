var checkbox;
var InputX = 10
var ElementX = InputX + 70
var CanvasXSpacer = 390
var CanvasYSpacer = 10
function createLabeledInput(label, defaultValue, y, parent, onInput) {
  const input = createInput(defaultValue);
  input.position(InputX, y);
  input.input(onInput);
  input.size(50);
  input.parent(parent);

  const labelElem = createElement('p1', label);
  labelElem.position(ElementX, y);
  labelElem.parent(parent);

  return input;
}

function setup() {
  const parentId = "sketchContainer";

  var cnv1 = createCanvas(840, 400);
  cnv1.parent(parentId);
  cnv1.style('display', 'block');

  // Cytometer preset selection
  sel = createSelect();
  sel.parent(parentId);
  sel.position(InputX, 5);
  [
    'Attune NxT', 'Aria', 'Calibur', 'Canto', 'Canto II',
    'CytoFlex', 'Fortessa', 'Gallios', 'Navios', 'Custom'
  ].forEach(opt => sel.option(opt));
  sel.changed(myCheckedEvent);

  CytPresettext = createElement('p1', 'Flow Cytometer Presets');
  CytPresettext.position(ElementX + 35, 5);
  CytPresettext.parent(parentId);

  // Inputs and labels
  NAinput = createLabeledInput('Lens Numerical Aperture', '1.2', 30, parentId, draw);
  FCInXinput = createLabeledInput('Inner Flow Cell Width (µm)', '250', 60, parentId, draw);
  FCInYinput = createLabeledInput('Inner Flow Cell Depth (µm)', '250', 90, parentId, draw);
  FCOutXinput = createLabeledInput('Outer Flow Cell Width (µm)', '6000', 120, parentId, draw);
  FCOutYinput = createLabeledInput('Outer Flow Cell Depth (µm)', '6000', 150, parentId, draw);
  Laminput = createLabeledInput('Illumination Wavelength (nm)', '488', 180, parentId, draw);
  SheathRIinput = createLabeledInput('Water Refractive Index', '', 210, parentId, draw);
  FlowCellRIinput = createLabeledInput('Fused Silica Refractive Index', '', 240, parentId, draw);

  // Checkboxes
  OutFCcheckbox = createCheckbox('', true);
  OutFCcheckbox.position(InputX, 280);
  OutFCcheckbox.changed(draw);
  OutFCcheckbox.parent(parentId);

  InFCcheckbox = createCheckbox('', true);
  InFCcheckbox.position(InputX, 300);
  InFCcheckbox.changed(draw);
  InFCcheckbox.parent(parentId);

  Lenscheckbox = createCheckbox('', true);
  Lenscheckbox.position(InputX, 320);
  Lenscheckbox.changed(draw);
  Lenscheckbox.parent(parentId);
}

function myCheckedEvent() {
  if (sel.value() == 'Custom') {
    FCInXinput.value(250)
    FCInYinput.value(250)
    FCOutXinput.value(6000)
    FCOutYinput.value(6000)
    NAinput.value(1.2)

  } else {

  }
  OutFCcheckbox.checked(true)
  draw()

} // end of function
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
  // Custom
  return {
    xIn: FCInXinput.value() * scaler,
    yIn: FCInYinput.value() * scaler,
    xOut: FCOutXinput.value() * scaler,
    yOut: FCOutYinput.value() * scaler,
    NumAp: NAinput.value(),
    OutFCPoss: true
  };
}


function draw() {
  clear();

  const scaler = 6 / 100;
  Medium_RI();
  FlowCell_RI();

  const preset = sel.value();
  const { xIn, yIn, xOut, yOut, NumAp, OutFCPoss } = getPresetValues(preset, scaler);

  // Handle OutFCcheckbox for presets that require it off
  if (cytometerPresets[preset] && !cytometerPresets[preset].OutFCPoss) {
    OutFCcheckbox.checked(false);
  }

  // Sync UI inputs with preset values (except for Custom)
  if (preset !== 'Custom') {
    FCInXinput.value(xIn / scaler);
    FCInYinput.value(yIn / scaler);
    FCOutXinput.value(xOut / scaler);
    FCOutYinput.value(yOut / scaler);
    NAinput.value(NumAp);
  }

  var CanvasCenterX = CanvasXSpacer + xOut / 2;
  var CanvasCenterY = CanvasYSpacer + yOut / 2;

  rectMode(CENTER);
  fill(220, 220, 220);
  rect(CanvasCenterX, CanvasCenterY, xOut, yOut);
  fill(255);
  rect(CanvasCenterX, CanvasCenterY, xIn, yIn);

  OuterFlowCellLim(xIn, yIn, xOut, yOut, CanvasCenterX, CanvasCenterY);

  if (OutFCcheckbox.checked()) {
    fill(255, 255, 190, 255 / 3);
    quad(Data[0], Data[1], Data[2], Data[3], Data[4], Data[5], Data[6], Data[7]);
  }
  InnerFlowCellLim(xIn, yIn, xOut, yOut, scaler, OutFCPoss, CanvasCenterX, CanvasCenterY);
}

function OuterFlowCellLim(xIn, yIn, xOut, yOut, CanvasCenterX, CanvasCenterY) {

  var x1 = CanvasCenterX + xIn / 2
  var x2 = CanvasCenterX + xOut / 2
  var x3 = CanvasCenterX - xOut / 2
  var x4 = CanvasCenterX - xIn / 2

  var y1 = CanvasCenterY - yIn / 2
  var y2 = CanvasCenterY - yOut / 2
  var y3 = CanvasCenterY - yOut / 2
  var y4 = CanvasCenterY - yIn / 2

  return Data = [x1, y1, x2, y2, x3, y3, x4, y4]

} // end of function

function InnerFlowCellLim(xIn, yIn, xOut, yOut, Scaler, OutFCPoss, CanvasCenterX, CanvasCenterY) {

  let x = xIn / Scaler / 2
  let y = yIn / Scaler / 2
  let x2 = (xOut / Scaler / 2) - x
  let y2 = (yOut / Scaler / 2) - y

  let InAng = (180 / Math.PI * Math.atan(x / y))
  let OutAng = 180 / Math.PI * (Math.asin((SheathRIinput.value() * Math.sin(Math.atan(x / y))) / FlowCellRIinput.value()))

  if (x2 < y2) {
    var InAng2 = 90 - (180 / Math.PI * Math.atan(x2 / y2))
  } else {
    var InAng2 = (180 / Math.PI * Math.atan(x2 / y2))
  }

  let OutAng2 = Math.asin((FlowCellRIinput.value() * Math.sin(InAng2 * Math.PI / 180)) / SheathRIinput.value()) * 180 / PI

  // Inner flow cell collection angles
  var StartStr = 'Inner Flow Cell Half-Angle = '
  fill(255, 150, 150, 255 / 1.5)
  rect(InputX + 30, 311, 15, 15)
  fill(0)
  textStyle(NORMAL)
  text(StartStr.concat('Sheath - ', InAng.toFixed(1), 'º | Silica - ', str(OutAng.toFixed(1)), 'º'), InputX + 45, 315)

  // Lens collection angles
  let LensOutAng = Math.asin(NAinput.value() / FlowCellRIinput.value()) * 180 / Math.PI
  let LensInAng = Math.asin((FlowCellRIinput.value() * Math.sin(LensOutAng * Math.PI / 180)) / SheathRIinput.value()) * 180 / PI

  fill(150, 100, 150, 255 / 1.5)
  rect(InputX + 30, 330, 15, 15)
  fill(0)
  var LensStr = 'Lens Limited Half-Angle = '
  textStyle(NORMAL)
  text(LensStr.concat('Sheath - ', LensInAng.toFixed(1), 'º | Silica - ', LensOutAng.toFixed(1), 'º'), InputX + 45, 334)


  //outer flow cell collection angles
  fill(255, 255, 190, 255 / 1.5)
  rect(InputX + 30, 292, 15, 15)
  fill(0)
  if (OutFCPoss == true) {
    var OuterFCStr = 'Outer Flow Cell Half-Angle = '
    textStyle(NORMAL)
    text(OuterFCStr.concat('Sheath - ', OutAng2.toFixed(1), 'º | Silica - ', InAng2.toFixed(1), 'º'), InputX + 45, 295)
  } else {
    textStyle(BOLD)
    text('Outer Flow Cell Dimensions Unknown', InputX + 45, 295)

  }

  var SystemAngStr = 'System Limited Half-Angle = '
  let MinAng1 = Math.min(OutAng2, LensInAng, InAng)
  let MinAng2 = Math.min(OutAng, LensOutAng, InAng2)
  textStyle(BOLD)
  text(SystemAngStr.concat('Sheath - ', MinAng1.toFixed(1), 'º | Silica - ', MinAng2.toFixed(1), 'º'), InputX, 370)

  var CollectionPercent = 'Fluorescence collection = ';

  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
  function calculateLightCollection(angleInDegrees, totalLight) {
      const angleInRadians = degreesToRadians(angleInDegrees);
      const solidAngle = 2 * Math.PI * (1 - Math.cos(angleInRadians));
      const fraction = solidAngle / (4 * Math.PI);
      return totalLight * fraction;
  }
  
  const halfAngleInDegrees = MinAng1.toFixed(1);
  const totalLightOutput = 50; // Example value, replace with the actual light output
  
  const lightCollected = calculateLightCollection(halfAngleInDegrees*2, totalLightOutput);
  text(CollectionPercent.concat(lightCollected.toFixed(1), '%'), InputX, 400)
  
  if (InFCcheckbox.checked()) {

    // plot inner flow cell collection angle to cuvette    
    if (OutAng * Math.PI / 180 <= InAng2 * Math.PI / 180) {

      var OutEdge = ((yOut / Scaler / 2) - y) * Math.tan(OutAng * Math.PI / 180)

      let x1 = CanvasCenterX + xIn / 2
      let x2 = CanvasCenterX + (OutEdge * Scaler)
      let x3 = CanvasCenterX - (OutEdge * Scaler)
      let x4 = CanvasCenterX - xIn / 2
      let y1 = CanvasCenterY - yIn / 2
      let y2 = CanvasCenterY - yOut / 2
      let y3 = CanvasCenterY - yOut / 2
      let y4 = CanvasCenterY - yIn / 2

      fill(255, 150, 150, 255 / 3)
      quad(x1, y1, x2, y2, x3, y3, x4, y4)

    } else {

      var OutEdge = ((yOut / Scaler / 2) - y) * Math.tan((90 - OutAng) * Math.PI / 180)

      var vx1 = CanvasCenterX + xIn / 2
      var vx2 = CanvasCenterX + xOut / 2
      var vx3 = CanvasCenterX + xOut / 2
      var vx4 = CanvasCenterX - xOut / 2
      var vx5 = CanvasCenterX - xOut / 2
      var vx6 = CanvasCenterX - xIn / 2

      var vy1 = CanvasCenterY - yIn / 2
      var vy2 = CanvasCenterY - (OutEdge * Scaler)
      var vy3 = CanvasCenterY - yOut / 2
      var vy4 = CanvasCenterY - yOut / 2
      var vy5 = CanvasCenterY - (OutEdge * Scaler)
      var vy6 = CanvasCenterY - yIn / 2

      fill(255, 150, 150, 255 / 3)
      beginShape();
      vertex(vx1, vy1);
      vertex(vx2, vy2);
      vertex(vx3, vy3);
      vertex(vx4, vy4);
      vertex(vx5, vy5);
      vertex(vx6, vy6);
      endShape(CLOSE);
    }

  } else { }

  if (Lenscheckbox.checked()) {

    // plot lens collection angle to cuvette    
    if (InAng2 > LensOutAng) {

      var OutEdge = ((yOut / Scaler / 2) - y) * Math.tan(LensOutAng * Math.PI / 180)

      let x1 = CanvasCenterX + xIn / 2
      let x2 = CanvasCenterX + OutEdge * Scaler
      let x3 = CanvasCenterX - OutEdge * Scaler
      let x4 = CanvasCenterX - xIn / 2
      let y1 = CanvasCenterY - yIn / 2
      let y2 = CanvasCenterY - yOut / 2
      let y3 = CanvasCenterY - yOut / 2
      let y4 = CanvasCenterY - yIn / 2

      fill(150, 100, 150, 255 / 3)
      quad(x1, y1, x2, y2, x3, y3, x4, y4)

    } else {

      var OutEdge = ((yOut / Scaler / 2) - y) * Math.tan((90 - LensOutAng) * Math.PI / 180)

      var vx1 = CanvasCenterX + xIn / 2
      var vx2 = CanvasCenterX + xOut / 2
      var vx3 = CanvasCenterX + xOut / 2
      var vx4 = CanvasCenterX - xOut / 2
      var vx5 = CanvasCenterX - xOut / 2
      var vx6 = CanvasCenterX - xIn / 2

      var vy1 = CanvasCenterY - yIn / 2
      var vy2 = CanvasCenterY - OutEdge * Scaler
      var vy3 = CanvasCenterY - yOut / 2
      var vy4 = CanvasCenterY - yOut / 2
      var vy5 = CanvasCenterY - OutEdge * Scaler
      var vy6 = CanvasCenterY - yIn / 2

      fill(150, 100, 150, 255 / 3)
      beginShape();
      vertex(vx1, vy1);
      vertex(vx2, vy2);
      vertex(vx3, vy3);
      vertex(vx4, vy4);
      vertex(vx5, vy5);
      vertex(vx6, vy6);
      endShape(CLOSE);
    }

  } else { }

} // end of function

function Medium_RI() {

  let lam = Laminput.value()
  let lams2 = Math.pow(lam / 1000, 2); // wavelength square in µm

  // Dispersion formula
  let a = ((5.684027565 / 10) * lams2) / (lams2 - (5.101829712 / 1000));
  let b = ((1.726177391 / 10) * lams2) / (lams2 - (1.821153936 / 100));
  let c = ((2.086189578 / 100) * lams2) / (lams2 - (2.620722293 / 100));
  let d = ((1.130748688 / 10) * lams2) / (lams2 - (1.069792721 * 10));

  let sums = 1 + a + b + c + d
  let RIwat = Math.sqrt(sums);

  SheathRIinput.value(str(RIwat.toFixed(4)))
} // end of function

function FlowCell_RI() {

  let lam = Laminput.value()
  let lams2 = Math.pow(lam / 1000, 2); // wavelength square in µm

  // Dispersion formula 
  let a = ((0.6961663) * lams2) / (lams2 - Math.pow(0.0684043, 2));
  let b = ((0.4079426) * lams2) / (lams2 - Math.pow(0.1162414, 2));
  let c = ((0.8974794) * lams2) / (lams2 - Math.pow(9.896161, 2));

  let sums = 1 + a + b + c
  let RIflowcell = Math.sqrt(sums);

  FlowCellRIinput.value(str(RIflowcell.toFixed(4)))
} // end of function
