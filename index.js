const fs = require('fs');
const esprima = require("esprima");
const escodegen = require("escodegen");

const [allFunctionsDict, allFunctionsAsStrings] = getAllFunctionsInThisFileExceptThisFunction();
console.log(allFunctionsAsStrings);
console.log( allFunctionsDict["sum"](10,30) ) //prints 40
console.log( allFunctionsDict["difference"](350,250) ) //prints 100
console.log( allFunctionsDict["product"](6,4) ) // prints 24
console.log( Object.keys(allFunctionsDict) ) //prints ['sum','difference','product']
for (key in allFunctionsDict){ 
    console.log(allFunctionsDict[key](100,30))
}

function sum(a, b) {
    return a + b;
}
 
function difference(a, b) {
    return a - b;
}

const product = (a,b) => { 
    return a * b;
}

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
    let functionsAsStringsDict = {};
    for (parsedFunction of allFunctionsExceptThisOne) {
        const functionString = escodegen.generate(parsedFunction);
        const newFunction = eval(`(${functionString})`);
        functionsDict[parsedFunction.id.name] = newFunction;
        functionsAsStringsDict[parsedFunction.id.name] = functionString;
    }
    return [functionsDict,functionsAsStringsDict];
}
