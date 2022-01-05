const fs = require('fs');
const esprima = require("esprima");
const escodegen = require("escodegen");

const allFunctionsDict = getAllFunctionsInThisFileExceptThisFunction();
console.log(allFunctionsDict);
console.log( allFunctionsDict["sum"](10,30) ) //prints 40
console.log( allFunctionsDict["difference"](350,250) ) //prints 100
console.log( allFunctionsDict["product"](6,4) ) // prints 24
console.log( Object.keys(allFunctionsDict) ) //prints an array of just the names of all functions
console.log( allFunctionsDict["product"] )

function sum(a, b) {
    return a + b;
}
 
function difference(a, b) {
    return a - b;
}

const product = (a,b) => { 
    return a * b;
}
console.log(product(10,60))

function getAllFunctionsInThisFileExceptThisFunction() {
    const thisFunctionName = arguments.callee.name;
    const rawTextFromThisFile = fs.readFileSync(__filename, "utf8");
    const parsed = esprima.parseScript(rawTextFromThisFile);
    const allDeclaredVariables = parsed.body.filter(e=>e.type === "VariableDeclaration");
    const allDeclaredFunctions = parsed.body.filter(e=>e.type === "FunctionDeclaration");

    let allFunctions = []
    allFunctions.push(...allDeclaredFunctions)
    for (declaredVariable of allDeclaredVariables){ 
        const declarations = declaredVariable.declarations[0];
        if (declarations.init.type === "ArrowFunctionExpression"){ 
            const anonymousFunction = declarations.init;
            let reconstructedFunction = anonymousFunction;
            reconstructedFunction.id = declarations.id;
            allFunctions.push(reconstructedFunction);
        }
    }

    const allFunctionsExceptThisOne = allFunctions.filter(e => e.id.name !== thisFunctionName);
    let functionsDict = {};
    for (parsedFunction of allFunctionsExceptThisOne) {
        const functionString = escodegen.generate(parsedFunction);
        const newFunction = eval(`(${functionString})`)
        functionsDict[parsedFunction.id.name] = newFunction;
    }
    return functionsDict;
}
