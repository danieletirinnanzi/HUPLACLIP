/* EXPERIMENT PARAMETERS: */
// defining canvas dimensions (sizes of canvas = sizes of whole window):
let canvasHeight = window.innerHeight  //height is the dimension that regulates the size of the stimuli (on which the "step" is calculated)
let canvasWidth = window.innerWidth

// CREATING OBJECT FOR CURRENT EXPERIMENT:
let currentExperiment = {
    // parameters for experiment:
    numberOfPresentations: 20, // number of presentations for each experiment (single presentation = single couple of triangular matrices, presented once and reordered through space bar presses)
    maximumNumberOfRandomizations: 30, // maximum number of randomizations allowed for a single couple of matrices 
    canvasDimensions: [canvasHeight, canvasWidth], // [height,width]
    // parameters for graphs:
    numberOfNodes: 300,
    initialCliqueSize: 200,  // this is the maximum dimension of the clique, it will decrease throughout the experiment, increasing the difficulty of the task                       
    probabilityOfAssociation: 0.5
}



// ADDING PROPERTIES TO THE currentExperiment OBJECT:

//- ARRAY OF NODES IN STANDARD ORDER
let standardOrderOfNodes = new Array();
for (let index = 0; index < currentExperiment.numberOfNodes; index++) {
    standardOrderOfNodes.push(index)
}
// adding this array as a property to the "currentExperiment" object
currentExperiment.standardOrderOfNodes = standardOrderOfNodes

// - ARRAY OF CLIQUE SIZES
currentExperiment.arrayOfCliqueSizes = createArrayOfCliqueSizes(currentExperiment.initialCliqueSize, currentExperiment.numberOfPresentations)

// - GRAPHS TO DISPLAY
currentExperiment.graphsToDisplay = generateGraphs()

// - COORDINATES OF LEFT AND RIGHT TRIANGLES
// calculating drawing parameters:
// single step size (single displacement on x or y axes. Each square spans two steps)
let singleStepSize = ((9 / 10) * (currentExperiment.canvasDimensions[0])) / (((currentExperiment.numberOfNodes) * 2))
// starting points (for right and left stimulus) on x axis (considering the space to be left in the middle):
let xStartingPointLeft = (currentExperiment.canvasDimensions[1] / 2) - currentExperiment.canvasDimensions[1] / 20
let xStartingPointRight = (currentExperiment.canvasDimensions[1] / 2) + currentExperiment.canvasDimensions[1] / 20
// calculating starting points on y axis:
let yStartingPoint = (1 / 20) * (currentExperiment.canvasDimensions[0])  //NB: starting to draw not from top of window, but leaving (1/20*c.height) above (and consequently below). For this reason, singleStepSize is calculated dividing not (c.height) but (9/10*canvas.height)

// left triangle COORDINATES:
let leftTriangleCoordinatesArray = []
for (let firstIndex = 0; firstIndex < (currentExperiment.numberOfNodes - 1); firstIndex++) {
    let maxSecondIndex = firstIndex + 1
    for (let secondIndex = 0; secondIndex < maxSecondIndex; secondIndex++) {
        // calculating coordinates:
        let topAngleStart = [xStartingPointLeft - singleStepSize * (firstIndex - secondIndex + 1), yStartingPoint + singleStepSize * (firstIndex + secondIndex)]; //starting point (top angle)
        let rightAngle = [xStartingPointLeft - singleStepSize * (firstIndex - secondIndex), yStartingPoint + singleStepSize * (firstIndex + secondIndex + 1)]; //going left-right (right angle)
        let bottomAngle = [xStartingPointLeft - singleStepSize * (firstIndex - secondIndex + 1), yStartingPoint + singleStepSize * (firstIndex + secondIndex + 2)]; //going down-left (bottom angle)
        let leftAngle = [xStartingPointLeft - singleStepSize * (firstIndex - secondIndex + 2), yStartingPoint + singleStepSize * (firstIndex + secondIndex + 1)]; //going up-left (left angle)
        let topAngleFinish = [xStartingPointLeft - singleStepSize * (firstIndex - secondIndex + 1), yStartingPoint + singleStepSize * (firstIndex + secondIndex)]; //closing square (top angle) (same coordinates of starting point)        
        // pushing coordinates into array:
        leftTriangleCoordinatesArray.push([topAngleStart, rightAngle, bottomAngle, leftAngle, topAngleFinish]);
    }
}

// right triangle COORDINATES:
let rightTriangleCoordinatesArray = []
for (let firstIndex = 0; firstIndex < (currentExperiment.numberOfNodes - 1); firstIndex++) {
    let maxSecondIndex = firstIndex + 1
    for (let secondIndex = 0; secondIndex < maxSecondIndex; secondIndex++) {
        // calculating coordinates:
        let topAngleStart = [xStartingPointRight + singleStepSize * (firstIndex - secondIndex + 1), yStartingPoint + singleStepSize * (firstIndex + secondIndex)]; //starting point (top angle)
        let rightAngle = [xStartingPointRight + singleStepSize * (firstIndex - secondIndex), yStartingPoint + singleStepSize * (firstIndex + secondIndex + 1)]; //going left-right (right angle)
        let bottomAngle = [xStartingPointRight + singleStepSize * (firstIndex - secondIndex + 1), yStartingPoint + singleStepSize * (firstIndex + secondIndex + 2)]; //going down-left (bottom angle)
        let leftAngle = [xStartingPointRight + singleStepSize * (firstIndex - secondIndex + 2), yStartingPoint + singleStepSize * (firstIndex + secondIndex + 1)] //going up-left (left angle)
        let topAngleFinish = [xStartingPointRight + singleStepSize * (firstIndex - secondIndex + 1), yStartingPoint + singleStepSize * (firstIndex + secondIndex)]; //closing square (top angle) (same coordinates of starting point)        
        // pushing coordinates into array:
        rightTriangleCoordinatesArray.push([topAngleStart, rightAngle, bottomAngle, leftAngle, topAngleFinish]);
    }
}
// adding coordinates to currentExperiment object
currentExperiment.stimuliCoordinates = {};
currentExperiment.stimuliCoordinates.leftTriangle = leftTriangleCoordinatesArray
currentExperiment.stimuliCoordinates.rightTriangle = rightTriangleCoordinatesArray

console.log(currentExperiment)