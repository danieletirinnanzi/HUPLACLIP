/* GRAPH POOL GENERATION: */
// FUNCTION THAT DEFINES THE CLIQUE SIZE FOR THE TRIALS THAT WILL BE PRESENTED
function createArrayOfCliqueSizes(initialCliqueSize, numberOfPresentations) {
    /* INPUT:
    - initial clique size (maximum value of the clique)
    - number of presentations for each block (clique sizes will be half of this number)

    OUTPUT:
    - array where the dimension of the clique for each one of the trials is stored in the order of presentation
    NB: in this version of the task, the clique will have (numberOfPresentations/2) values, and in each block of (numberOfPresentations) trials there will be 2 instances of the same value of K
    */
    let cliqueSizeArray = [];   // will have (numberOfPresentations) values
    let step = initialCliqueSize / (numberOfPresentations / 2);
    for (let i = 0; i < numberOfPresentations / 2; i++) {
        // 100 trials for each value of K:
        for (let j = 0; j < 100; j++) {
            cliqueSizeArray.push(Math.round(initialCliqueSize - (step * i)));
        }
    }
    return cliqueSizeArray;
}


// FUNCTION THAT ASSOCIATES THE NODES THAT WILL BE PART OF THE CLIQUE (adapted from: https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array)
function createClique(nodesArray, singleCliqueSize) {
    /* INPUT:
    - array that contains all the nodes in the graph
    - size of the clique

    OUTPUT:
    - array of nodes that will be part of the clique
    */
    // RIVEDI E CAPISCI UN PO' MEGLIO / RISCRIVI?
    let result = new Array(singleCliqueSize),
        len = nodesArray.length,
        taken = new Array(len);
    while (singleCliqueSize--) {
        let x = Math.floor(Math.random() * len);
        result[singleCliqueSize] = nodesArray[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}


//FUNCTION THAT GENERATES ALL THE COUPLES OF GRAPHS (one with clique, one without) THAT WILL BE DISPLAYED
function generateGraphs() {
    /* INPUT: none ("currentExperiment" can be accessed from inside functions)

    OUTPUT:
    - array of all the couples of triangular matrices that will be displayed in the experiment (NB: triangular matrices are represented as objects)
    STRUCTURE: [  first block: [ [{graph1}{graph2}] [{graph1}{graph2}] [{graph1}{graph2}] ...(numberOfPresentationsPerBlock) ],
                  second block: [ [{graph1}{graph2}] [{graph1}{graph2}] [{graph1}{graph2}] ...(numberOfPresentationsPerBlock), ]
                 ...(numberOfBlocks) ]
    */

    /* Visual representation of a single triangular matrix object (example: N=5. NB: number of nodes start from zero):
    0|    -
    1|   1 -
    2|   0 1 -
    3|   1 0 0 -
    4|   0 0 1 0 -
        ___________
         0 1 2 3 4  

        Corresponding object:
        { 
            1: [1],
            2: [0 1],
            3: [1 0 0],
            4: [0 0 1 0]
        }
    */

    // empty array that will contain the couples of triangular matrices (objects) to be displayed
    let graphsToDisplay = [];

    // number of blocks:
    for (let blockIndex = 0; blockIndex < currentExperiment.numberOfBlocks; blockIndex++) {

        let graphsForCurrentBlock = []

        // couples of graphs for a single block
        for (let presentationIndex = 0; presentationIndex < currentExperiment.numberOfPresentationsPerBlock; presentationIndex++) {

            // 1. Generating graph WITH CLIQUE:
            //empty object (the properties will be the nodes and the values will be the arrays that indicate the existing connections)
            let graphWithClique = {};
            // randomly extracting the nodes that will be part of the clique
            let cliqueArray = [];
            cliqueArray = createClique(currentExperiment.standardOrderOfNodes, currentExperiment.arrayOfCliqueSizes[presentationIndex])
            // defining the values of the triangular adjacency matrix:
            for (let rowIndex = 1; rowIndex < currentExperiment.graphSize; rowIndex++) {
                //defining empty array that will contain the connections for the current row
                let currentRowAssociations = [];
                for (let columnIndex = 0; columnIndex < rowIndex; columnIndex++) {
                    if (cliqueArray.includes(rowIndex) && cliqueArray.includes(columnIndex)) {
                        //if current two nodes are part of the clique, inserting 1 in the matrix:
                        currentRowAssociations.push(1)
                    }
                    //if the current two nodes are not part of the clique, associating them with probability indicated in "currentExperiment.probabilityOfAssociation"
                    else {
                        let randomValue = Math.random(); //MORE CORRECT WAY OF GENERATING? NON-UNIFORM DISTRIBUTION?
                        if (randomValue < currentExperiment.probabilityOfAssociation) {
                            currentRowAssociations.push(1);
                        } else {
                            currentRowAssociations.push(0);
                        }
                    }
                }
                //adding to the matrix information about the clique: size and array of nodes that are part of it
                graphWithClique[currentExperiment.graphSize] = { 'clique_size': cliqueArray.length, 'clique_array': cliqueArray }
                //adding to the object the property (the connections of the current node in the triangular matrix)
                graphWithClique[rowIndex] = currentRowAssociations;
            }

            // 2. Generating graph WITHOUT CLIQUE:
            //empty object (the properties will be the nodes and the values will be the arrays that indicate the existing connections)
            let graphWithoutClique = {};
            // increasing the value of p so that the two graphs will have the same average degree (pCorr = p + (K*(K-1)/N*(N-1)) * (1-p) )
            let correctedProbabilityForCurrentGraph = currentExperiment.probabilityOfAssociation + (((currentExperiment.arrayOfCliqueSizes[presentationIndex] * (currentExperiment.arrayOfCliqueSizes[presentationIndex] - 1)) / (currentExperiment.graphSize * (currentExperiment.graphSize - 1))) * (1 - currentExperiment.probabilityOfAssociation))

            // defining the values of the triangular adjacency matrix:
            for (let rowIndex = 1; rowIndex < currentExperiment.graphSize; rowIndex++) {
                //defining empty array that will contain the connections for the current row
                let currentRowAssociations = [];
                for (let columnIndex = 0; columnIndex < rowIndex; columnIndex++) {
                    let randomValue = Math.random(); //MORE CORRECT WAY OF GENERATING? NON-UNIFORM DISTRIBUTION?
                    if (randomValue < correctedProbabilityForCurrentGraph) {
                        currentRowAssociations.push(1);
                    } else {
                        currentRowAssociations.push(0);
                    }
                }
                // adding to the matrix an indication about the absence of the clique:
                graphWithoutClique[currentExperiment.graphSize] = "clique is absent"
                //adding to the object the property (the connections of the current node in the triangular matrix)
                graphWithoutClique[rowIndex] = currentRowAssociations;
            }

            // Adding the two graphs to the array for the current trial (random choice of which one is the first in the couple) and pushing this array into the array relative to the current block
            if (Math.round(Math.random())) {
                graphsForCurrentBlock.push([graphWithClique, graphWithoutClique])
            } else {
                graphsForCurrentBlock.push([graphWithoutClique, graphWithClique])
            }
        }

        // adding array of graphs for current block to array of all graphs
        graphsToDisplay.push(graphsForCurrentBlock)

    }

    return graphsToDisplay

}