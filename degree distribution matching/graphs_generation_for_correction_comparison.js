/* GRAPHS GENERATION: */
    // FUNCTION THAT DEFINES THE CLIQUE SIZE FOR ALL THE TRIALS THAT WILL BE PRESENTED (implementation of "linspace", but stored in reverse order)
    function createArrayOfKvalues(maximumCliqueSize, numberOfValues) {
        /* INPUT:
        - initial clique size (maximum value of the clique, the next values will be lower)
        - number of trials for the experiment

        OUTPUT:
        - array where the dimension of the clique for each one of the trials is stored in the order of presentation
        */            
        let cliqueSizeArray = [];
        let step = maximumCliqueSize / numberOfValues;
        for (let i = 0; i < numberOfValues; i++) {
            cliqueSizeArray.push(Math.round((step * i)));
        }
        return cliqueSizeArray;
    }


    //FUNCTION THAT GENERATES THE CLIQUELESS GRAPHS WITH UNCORRECTED/CORRECTED NUMBER OF EDGES;
    function generateGraphsForComparison() {            
        /* INPUT: none ("currentComparison" is global and can be accessed from inside functions)

        OUTPUT:
        - array of a series of two triangular matrices, each corresponding to a value of K. For each value of K:
            -in one matrix the number of edges is corrected;
            -in another one the number of edges is not corrected.
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

        // empty array that will contain the couples of triangular matrices (objects) to be evaluated:
        let arrayOfGraphs = []; //one couple (corrected/uncorrected) for each level of K
        
        for (let index = 0; index < currentComparison.numberOfKValues; index++) {

            // 1. Generating cliqueless graph with UNCORRECTED number of nodes:
            //empty object (the properties will be the nodes and the values will be the arrays that indicate the existing connections)
            let uncorrectedGraph = {};
            //defining variable that will store the total number of edges as they are generated
            let totalNumberOfEdgesUncorrected = 0
               
            // defining the values of the triangular adjacency matrix:
            for (let rowIndex = 1; rowIndex < currentComparison.numberOfNodes; rowIndex++) {
                //defining empty array that will contain the connections for the current row
                let currentRowAssociations = [];
                for (let columnIndex = 0; columnIndex < rowIndex; columnIndex++) {  
                    let randomValue = Math.random();
                    if(randomValue < currentComparison.probabilityOfAssociation){
                        currentRowAssociations.push(1);
                    } else {
                        currentRowAssociations.push(0);
                    }
                }            
                //calculating the number of edges in the current row:
                totalNumberOfEdgesUncorrected += currentRowAssociations.reduce((a, b) => a + b, 0)
                //adding the current row to the graph:
                uncorrectedGraph[rowIndex] = currentRowAssociations;
            }
            //once the graph has been created, storing average degree in the last row of the object:
            uncorrectedGraph[currentComparison.numberOfNodes] = totalNumberOfEdgesUncorrected/currentComparison.numberOfNodes


            // 2. Generating cliqueless graph with CORRECTED number of nodes:
            //empty object (the properties will be the nodes and the values will be the arrays that indicate the existing connections)
            let correctedGraph = {};
            // increasing the value of p so that the two graphs will have the same average degree (pCorr = p + (K*(K-1)/N*(N-1)) * (1-p) )
            let correctedProbability = currentComparison.probabilityOfAssociation + ( ( ( currentComparison.arrayOfCliqueSizes[index] * ( currentComparison.arrayOfCliqueSizes[index] - 1 )) / ( currentComparison.numberOfNodes * ( currentComparison.numberOfNodes - 1 ))) * ( 1 - currentComparison.probabilityOfAssociation ) )
            //defining variable that will store the total number of edges as they are generated
            let totalNumberOfEdgesCorrected = 0
                 
            // defining the values of the triangular adjacency matrix:
            for (let rowIndex = 1; rowIndex < currentComparison.numberOfNodes; rowIndex++) {
                //defining empty array that will contain the connections for the current row
                let currentRowAssociations = [];
                for (let columnIndex = 0; columnIndex < rowIndex; columnIndex++) {  
                    let randomValue = Math.random();
                    if(randomValue < correctedProbability){
                        currentRowAssociations.push(1);
                    } else {
                        currentRowAssociations.push(0);
                    }
                }
                //calculating the number of edges in the current row:
                totalNumberOfEdgesCorrected += currentRowAssociations.reduce((a, b) => a + b, 0)
                //adding the current row to the graph:
                correctedGraph[rowIndex] = currentRowAssociations;            
            }
            //once the graph has been created, storing average degree in the last row of the object:
            correctedGraph[currentComparison.numberOfNodes] = totalNumberOfEdgesCorrected/currentComparison.numberOfNodes

            // Adding the two graphs (uncorrected/corrected) to the array:
            arrayOfGraphs.push( [ uncorrectedGraph, correctedGraph ] )

        }              

    return arrayOfGraphs

    }
