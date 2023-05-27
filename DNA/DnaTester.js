//create a class to test the DNA class
class DnaTester {
    constructor() {
        this.testResults = [];
        this.numberOfTests = 1;
        for (let i = 0; i < this.numberOfTests; i++) {
            console.log('Test ' + i);
            this.createTwoRandomDnaThenCreateAChild();
        }
    }

    //Create two random DNA objects then create a child DNA object from them
    createTwoRandomDnaThenCreateAChild() {
        let dnaParent1 = getRandomDNA();
        let dnaParent2 = getRandomDNA();
        let childDna = getDNAFromParents(dnaParent1, dnaParent2);
        
        this.test(dnaParent1);
        this.test(dnaParent2);
        this.test(childDna);
    }

    //This method will be used to test the DNA class
    test(dna) {
        this.testResults.push(dna.toString());
        console.log(dna.toString());    
    }

    update() {

    }

    draw(ctx) {
        //draw all the test results in testResults
        // for (let i = 0; i < this.testResults.length; i++) {
        //     ctx.font = "18px " + params.FONT
        //     ctx.fillText(this.testResults[i], 10, 100 + (i * 20));
        // }
    }
}