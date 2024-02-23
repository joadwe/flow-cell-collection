var checkbox;
var InputX = 10
var ElementX = InputX + 70
var CanvasXSpacer = 390
var CanvasYSpacer = 10

function setup() {

  var cnv1 = createCanvas(840, 400);
  cnv1.parent("sketchContainer");
  cnv1.style('display', 'block');

  // Cytometer preset selection
  sel = createSelect();
  sel.parent("sketchContainer");

  sel.position(InputX, 5
              );
  sel.option('Attune NxT');
  sel.option('Aria');
  sel.option('Calibur');
  sel.option('Canto');
  sel.option('Canto II');
  sel.option('CytoFlex');
  sel.option('Fortessa');
  sel.option('Gallios');
  sel.option('Navios');
  sel.option('Custom')
  sel.changed(myCheckedEvent);

  CytPresettext = createElement('p1', 'Flow Cytometer Presets');
  CytPresettext.position(ElementX + 35, 5);
  CytPresettext.parent("sketchContainer");

  //   NA aperture input box
  NAinput = createInput('1.2');
  NAinput.position(InputX, 30);
  NAinput.input(draw);
  NAinput.size(50)
  NAinput.parent("sketchContainer");

  NAinputtext = createElement('p1', 'Lens Numerical Aperture');
  NAinputtext.position(ElementX, 30);
  NAinputtext.parent("sketchContainer");

  //   Inner flow cell width input box
  FCInXinput = createInput('250');
  FCInXinput.position(InputX, 60);
  FCInXinput.input(draw);
  FCInXinput.size(50)
  FCInXinput.parent("sketchContainer");

  FCInXinputtext = createElement('p1', 'Inner Flow Cell Width (µm)');
  FCInXinputtext.position(ElementX, 60);
  FCInXinputtext.parent("sketchContainer");

  //   Inner flow cell depth input box
  FCInYinput = createInput('250');
  FCInYinput.position(InputX, 90);
  FCInYinput.input(draw);
  FCInYinput.size(50)
  FCInYinput.parent("sketchContainer");

  FCInYinputtext = createElement('p1', 'Inner Flow Cell Depth (µm)');
  FCInYinputtext.position(ElementX, 90);
  FCInYinputtext.parent("sketchContainer");

  //   Outer flow cell width input box
  FCOutXinput = createInput('6000');
  FCOutXinput.position(InputX, 120);
  FCOutXinput.input(draw);
  FCOutXinput.size(50)
  FCOutXinput.parent("sketchContainer");

  FCOutXinputtext = createElement('p1', 'Outer Flow Cell Width (µm)');
  FCOutXinputtext.position(ElementX, 122);
  FCOutXinputtext.parent("sketchContainer");

  //   Outer flow cell depth input box
  FCOutYinput = createInput('6000');
  FCOutYinput.position(InputX, 150);
  FCOutYinput.input(draw);
  FCOutYinput.size(50)
  FCOutYinput.parent("sketchContainer");

  FCOutYinputtext = createElement('p1', 'Outer Flow Cell Depth (µm)');
  FCOutYinputtext.position(ElementX, 152);
  FCOutYinputtext.parent("sketchContainer");

  //   Wavelength box
  Laminput = createInput('488');
  Laminput.position(InputX, 180);
  Laminput.input(draw);
  Laminput.size(50)
  Laminput.parent("sketchContainer");

  Laminputtext = createElement('p1', 'Illumination Wavelength (nm)');
  Laminputtext.position(ElementX, 182);
  Laminputtext.parent("sketchContainer");

  //   Sheath RI box
  SheathRIinput = createInput('');
  SheathRIinput.position(InputX, 210);
  SheathRIinput.input(draw);
  SheathRIinput.size(50)
  SheathRIinput.parent("sketchContainer");

  SheathRIinputtext = createElement('p1', 'Water Refractive Index');
  SheathRIinputtext.position(ElementX, 212);
  SheathRIinputtext.parent("sketchContainer");

  //   Flow Cell RI box
  FlowCellRIinput = createInput('');
  FlowCellRIinput.position(InputX, 240);
  FlowCellRIinput.input(draw);
  FlowCellRIinput.size(50)
  FlowCellRIinput.parent("sketchContainer");

  FlowCellRIinputtext = createElement('p1', 'Fused Silica Refractive Index');
  FlowCellRIinputtext.position(ElementX, 242);
  FlowCellRIinputtext.parent("sketchContainer");

  OutFCcheckbox = createCheckbox('', true);
  OutFCcheckbox.position(InputX, 280);
  OutFCcheckbox.changed(draw);
  OutFCcheckbox.parent("sketchContainer");

  InFCcheckbox = createCheckbox('', true);
  InFCcheckbox.position(InputX, 300);
  InFCcheckbox.changed(draw);
  InFCcheckbox.parent("sketchContainer");

  Lenscheckbox = createCheckbox('', true);
  Lenscheckbox.position(InputX, 320);
  Lenscheckbox.changed(draw);
    Lenscheckbox.parent("sketchContainer");

} // end of function

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

function draw() {

  clear()

  var Scaler = 6 / 100

  Medium_RI()
  FlowCell_RI()

  if (sel.value() == 'CytoFlex') {
    var xIn = 420 * Scaler
    var yIn = 160 * Scaler
    var xOut = 7000 * Scaler
    var yOut = 6000 * Scaler
    var NumAp = 1.3
    var OutFCPoss = false

    OutFCcheckbox.checked(false)

  } else if (sel.value() == 'Attune NxT') {
    var xIn = 200 * Scaler
    var yIn = 200 * Scaler
    var xOut = 6000 * Scaler
    var yOut = 4000 * Scaler
    var NumAp = 1.2
    var OutFCPoss = true

  } else if (sel.value() == 'Calibur') {
    var xIn = 430 * Scaler
    var yIn = 180 * Scaler
    var xOut = 7000 * Scaler
    var yOut = 6500 * Scaler
    var NumAp = 1.2
    var OutFCPoss = true

  } else if (sel.value() == 'Aria') {
    var xIn = 160 * Scaler
    var yIn = 250 * Scaler
    var xOut = 6000 * Scaler
    var yOut = 4000 * Scaler
    var NumAp = 1.2
    var OutFCPoss = false

    OutFCcheckbox.checked(false)

  } else if (sel.value() == 'Canto') {
    var xIn = 430 * Scaler
    var yIn = 180 * Scaler
    var xOut = 7000 * Scaler
    var yOut = 6500 * Scaler
    var NumAp = 1.2
    var OutFCPoss = true

  } else if (sel.value() == 'Canto II') {
    var xIn = 430 * Scaler
    var yIn = 180 * Scaler
    var xOut = 7000 * Scaler
    var yOut = 6500 * Scaler
    var NumAp = 1.2
    var OutFCPoss = true

  } else if (sel.value() == 'Fortessa') {
    var xIn = 430 * Scaler
    var yIn = 180 * Scaler
    var xOut = 7000 * Scaler
    var yOut = 6500 * Scaler
    var NumAp = 1.2
    var OutFCPoss = true

  } else if (sel.value() == 'Gallios') {
    var xIn = 460 * Scaler
    var yIn = 150 * Scaler
    var xOut = 7000 * Scaler
    var yOut = 6500 * Scaler
    var NumAp = 1.2
    var OutFCPoss = false

    OutFCcheckbox.checked(false)

  } else if (sel.value() == 'Navios') {
    var xIn = 460 * Scaler
    var yIn = 150 * Scaler
    var xOut = 7000 * Scaler
    var yOut = 6500 * Scaler
    var NumAp = 1.2
    var OutFCPoss = false

    OutFCcheckbox.checked(false)

  } else if (sel.value() == 'Custom') {
    var xIn = FCInXinput.value() * Scaler
    var yIn = FCInYinput.value() * Scaler
    var xOut = FCOutXinput.value() * Scaler
    var yOut = FCOutYinput.value() * Scaler
    var NumAp = NAinput.value()
    var OutFCPoss = true
  }

  if (sel.value() == 'Custom') {

  } else {
    FCInXinput.value(xIn / Scaler)
    FCInYinput.value(yIn / Scaler)
    FCOutXinput.value(xOut / Scaler)
    FCOutYinput.value(yOut / Scaler)
    NAinput.value(NumAp)
  }

  var CanvasCenterX = CanvasXSpacer + xOut / 2;
  var CanvasCenterY = CanvasYSpacer + yOut / 2;

  rectMode(CENTER);
  fill(220, 220, 220)
  rect(CanvasCenterX, CanvasCenterY, xOut, yOut)
  fill(255)
  rect(CanvasCenterX, CanvasCenterY, xIn, yIn)

  OuterFlowCellLim(xIn, yIn, xOut, yOut, CanvasCenterX, CanvasCenterY)

  if (OutFCcheckbox.checked()) {

    fill(255, 255, 190, 255 / 3)
    quad(Data[0], Data[1], Data[2], Data[3], Data[4], Data[5], Data[6], Data[7])
  } else { }
  InnerFlowCellLim(xIn, yIn, xOut, yOut, Scaler, OutFCPoss, CanvasCenterX, CanvasCenterY)

} // end of function

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
