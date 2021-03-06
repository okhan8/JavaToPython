// Logic to transform token list into universal JSON

// Factory function that will return a JSON
// Factory function that will return a JSON
const Universalizer = (tokens) => {
    const tokenList = tokens;

    let logging = true; // flag that logs all activity 
    let current; // current token object being parsed 
    let inOuterClass = false; // flag to check if the current set of statements and function definitions are within a class 
    let nestLevel = 0 // monitors nest level 
    let previous = {}; // contains the previous word for reference 
    let attribute; // attribute contains each attribute of the JSON output. For Java each attribute is a Class and it's methods/variables 
    let inParenthesis = false; // checks to see if the current statement exisst within parenthesis 
    let args = {}; // contains arguments 
    let argbuilder = ''; // All arguments taken by a function as a string 
    let functionLevel = 0; // checks depth of current function definition. If not inside of a definition, the level is 0 
    let inString = false; // checks for string concatenation
    let stringbuilder = []; // Used to handle string concatenation 
    let callOrder = 0; // counter that keeps track of the order of assignment and function calls 
    let inStatement = false; // checks to see if the word is in a statement 
    let startofLine = true; // flag to create new statementbuilders 

    let statementBuilder = {};
    let statementType; // "functionCall", "unknown", "functionDeclaration", "declaration", "print", "assignment", "newAssignment"
    let unknownStatement = [];

    let inDefinitionArgs = false;
    let functionBuilder = [];
    let currentFunction; // the current function that this logic belongs to. currentFunction can belong to another function 

    // 10/17 
    let functionCallArguments = [];
    let forRange = {};
    let forLevel = 0;
    let forOrder = 0;
    let inIf = false;
    //let ifBuilder = {};
    //let ifOrder = 0;
    let expectingIfCondition = false;
    let ifBlock = [];
    let expectingIfDeclaration = false;
    let foundIf = false;

    let assignmentBuilder = {};
    let assignmentIndex = 0;
    let muteableTypes = ["IDEN", "String", "int", "double", "intArray", "floatArray", "stringArray"]
    //let functionCalls = ["printLine", "functionCall"];
    let ifCondition = [];
    let expectingIfRoutine = false;
    //let ifRoutine = [];
    let ifIndex = 0;


    // function that takes the token stream and assembles our JSON
    function toJSON() {

        for (let i = 0; i < tokenList.length; i++) {
            current = tokenList[i];
            if (current !== undefined && current !== null && current["type"] !== "WS") {
                // console.log(i + 1)
                updateAttribute(current);
                // console.log("---------------------------------------")

            }
        }
    }


    // The primary factory function that handles interpretation
    function updateAttribute(token) {

        // responsible for logging the changes of each token as it runs through updateAttribute
        // 'logging' is a boolean flag that can be set to false to clean up the console logs 
        function log() {
            if (logging) {
                for (let i = 0; i < logBody.length; i++)
                    console.log(logBody[i])
            }
        }

        let logBody = [];
        let tokenType = token["type"]
        let tokenValue = token["value"];

        logBody.push(tokenType);
        logBody.push(tokenValue);


        // handler for outerclasses, currently only support the outermost class within a file
        function createOuterClass() {
            logBody.push("createOuterClass");

            if (startofLine) {
                setClassaccessMod();
            } else {
                (tokenType === "IDEN") ? setClassName(): startClassBody()
                // this is lazy, setClassName is called when tokenType == "IDEN"
                // startClassBody is called when tokenType == "lbrace"
                // FIXME: if something goes wrong 
            }
        }

        // responsible for assigning the "name" of a class
        function setClassName() {
            logBody.push("setClassName");
            if (inOuterClass === false) {
                attribute["outerClass"]["name"] = tokenValue;

                logBody.push(`attribute["outerClass"]["name"] -> ${attribute["outerClass"]["name"]}`)
            }
            //TODO: Add else to account for inner classes 
        }

        // function responsible for creating the body of classes
        function startClassBody() {
            logBody.push("startClassBody");
            if (inOuterClass === false) {
                if (tokenType === "lbrace") {
                    inOuterClass = true;
                    nestLevel += 1;
                    attribute["outerClass"]["body"] = [];


                    logBody.push(`attribute["outerClass"]["body"] -> ${attribute["outerClass"]["body"]}`)
                    logBody.push(`inOuterClass -> ${inOuterClass}`);
                    logBody.push(`nestLevel -> ${nestLevel}`);
                }
            }
            //TODO: Add else to account for inner classes 

        }

        // Sets the accessMod attribute of CLASSES
        // Will only be called at the start of lines and not inside a class
        // May need to be changed to enable nested classes
        function setClassaccessMod() {
            // logBody.push("setClassaccessMod");
            if (inOuterClass === false) {
                attribute = {
                    "outerClass": {
                        "accessMod": "none"
                    }
                };
                attribute["outerClass"]["accessMod"] = (tokenType === "accessMod") ? tokenValue : "none";
                startofLine = false;

                logBody.push(`attribute["outerClass"]["accessMod"] -> ${attribute["outerClass"]["accessMod"]}`)
                logBody.push(`startofLine -> ${startofLine}`)
            }
            // TODO: add else here to accommodate inner classes
        }

        // set startofLine to be true again
        function newLine() {
            startofLine = true;

            logBody.push("newLine")
            logBody.push(`startofLine -> ${startofLine}`)
        }

        // Primary subroutine for creating statements. In this application, a statement is any
        // single action that occurs in a single line. 
        // TODO: Expand the definition of statement to account for multi line subroutines such as for loops
        function constructStatement() {
            logBody.push("constructStatement")

            if (inStatement === false) {
                inStatement = true;
                logBody.push(`inStatement -> ${inStatement}`)
                if (statementType === undefined) {
                    handleUndefinedStatement();
                }
            }
            // if(functionLevel > 0){ // checks to see if we're inside a function

            // }

            if (statementType === "declaration") {
                handleDeclaration();
            } else if (statementType === "functionDeclaration") {
                if (tokenType === "lparen") {
                    initializeParenthesis();
                } else if (tokenType === "rparen") {
                    statementBuilder["arguments"] = args;
                    inParenthesis = false;
                    inDefinitionArgs = false;

                    logBody.push(`inParenthesis -> ${inParenthesis}`);
                    logBody.push(`inDefinitionArgs -> ${inDefinitionArgs}`)
                    logBody.push(`statementBuilder["arguments"] -> ${statementBuilder["arguments"]}`)
                } else if (tokenType === "lbrace") {
                    nestLevel += 1;
                    inStatement = false;
                    functionBuilder[functionLevel] = statementBuilder;
                    functionLevel += 1; // we use functionLevel > 0 to determine if we are inside a function 

                    logBody.push(`nestLevel -> ${nestLevel}`);
                    logBody.push(`functionLevel -> ${functionLevel}`);
                    logBody.push(`inStatement -> ${inStatement}`);
                    clearArgs();
                    clearStatementBuilder();
                } else {
                    handleFunctionArgumentDefinition();
                }
            } else if (statementType === "print") {
                if (tokenType === "lparen") {
                    initializeParenthesis();
                } else if (tokenType === "rparen") {
                    stringbuilder.push(argbuilder);
                    statementBuilder["print"] = stringbuilder;
                    inParenthesis = false;
                    inString = false;
                    argbuilder = ""; // testing 
                    inDefinitionArgs = false; // testing 

                    logBody.push(`inParenthesis -> ${inParenthesis}`);
                    logBody.push(`inString -> ${inString}`);
                    logBody.push(`statementBuilder["print"] -> ${statementBuilder["print"]}`);
                    logBody.push(`argbuilder -> ${argbuilder}`);
                    logBody.push(`inDefinitionArgs -> ${inDefinitionArgs}`);
                } else if (tokenType === "controls") {
                    if (tokenValue === ";") {
                        appendStatement();
                        clearStatementBuilder();
                        inStatement = false;
                        logBody.push(`inStatement -> ${inStatement}`);
                    }
                } else if (tokenType !== "printLine") {
                    argbuilder = tokenValue;

                    logBody.push(`argbuilder -> ${argbuilder}`);
                    // will need to add logic here for indexing and concatenation
                }
                // } else if (statementType === "newAssignment") {
                //     commitVarDeclaration();
            } else if (statementType === "return") {
                if (tokenType === "IDEN") {
                    statementBuilder["return"] = tokenValue;
                } else if (tokenType === "controls") {
                    if (tokenValue === ";") {
                        appendStatement();
                        clearStatementBuilder();

                        inStatement = false;
                        logBody.push(`inStatement -> ${inStatement}`);
                    }
                }
            } else if (statementType === "functionCall") {
                if (tokenType === "IDEN") {
                    if (functionCallArguments.length === 0) {
                        functionCallArguments = [tokenValue]
                    } else {
                        functionCallArguments.push(tokenValue);
                    }
                } else if (tokenType === "rparen") {
                    inParenthesis = false;
                    inString = false;
                    clearArgBuilder();
                    statementBuilder["functionCall"]["args"] = functionCallArguments;
                    functionCallArguments = []
                } else if (tokenValue === ";") {
                    appendStatement();
                    clearStatementBuilder();

                    unknownStatement = [];
                    inStatement = false;
                    logBody.push(`inStatement -> ${inStatement}`);
                    logBody.push(`unknownStatement -> ${unknownStatement}`);
                }
            } else if (statementType === "forLoop") {
                if (statementBuilder["range"] === undefined) {
                    handleForDefinition();
                }
            } else if (statementType === "ifStatement") {
                if (tokenValue === "if") {
                    expectingIfDeclaration = false;
                    foundIf = true;
                    expectingIfCondition = true;
                }
                if (foundIf) { // if foundIf, the current statement is NOT else by itself
                    if (inParenthesis === true) {
                        if (tokenType === "rparen") {

                            // this currently doesn't support function calls within if conditions
                            inParenthesis = false;
                        } else {
                            ifCondition.push(tokenValue);
                        }
                    } else if (tokenType === "lparen") {
                        inParenthesis = true;
                    } else if (tokenType === "lbrace") {
                        // VOLUME
                        logBody.push(`ifBlock updated, ifCondition reset,
                         statementType set to unknown, statementBuilder reset,
                          inStatement set to false, nestLevel++`);

                        ifBlock.push({
                            "condition": ifCondition
                        });
                        // INCREMENT ifIndex when the body is submitted
                        nestLevel++;
                        ifCondition = [];
                        expectingIfRoutine = true;
                        statementType = undefined;
                        statementBuilder = {};
                        inStatement = false;
                        logBody.push(ifBlock);
                    }
                    // foundIf == false 
                } else {
                    if (tokenValue !== "else") {
                        // foundIf = false;
                        statementType = undefined //"unknown"
                        expectingIfRoutine = true;
                        inStatement = false;
                        expectingIfCondition = false;
                        ifBlock.push({
                            "condition": "else"
                        });
                        clearStatementBuilder();
                    }
                }
                
            } else if (statementType === "newAssignment") {
                
                if (muteableTypes.includes(tokenType)) {
                    if (assignmentBuilder["args"] === undefined) {
                        assignmentBuilder["args"] = [tokenValue];
                    } else {
                        assignmentBuilder["args"].push(tokenValue);
                        assignmentIndex++;
                    }
                } else if (tokenType === "arithmeticOperation") {
                    assignmentBuilder["operation"] = tokenValue;
                } else if (tokenValue === ";") {
                    statementBuilder["assign"]["args"] = assignmentBuilder;

                    assignmentBuilder = {};
                    assignmentIndex = 0;
                    appendStatement();
                    clearStatementBuilder();
                    inStatement = false;
                    logBody.push(`inStatement -> ${inStatement}`);
                }
            } else if (statementType === "unknown") {
                // TODO: Make this a function
                if (tokenValue === "=") {
                    constructAssignment();
                } else if (tokenType === "lparen") {
                    callFunction();
                } else if (previous["type"] === "type" || previous["type"] === "IDEN") {
                    unknownStatement.push(tokenValue);
                    logBody.push(`unknownStatement pushed ${tokenValue}`);
                } 
            }
        }

        function handleForDefinition() {
            logBody.push(`handleForDefinition`);

            if (tokenType === "lparen") {
                initializeParenthesis();
            } else if(forRange["index"] === undefined){
                if(tokenType === "IDEN"){
                    forRange["index"] = tokenValue;
                }
            } else if (forRange["start"] === undefined) {
                if (tokenType === "int" || tokenType === "IDEN") {
                    if (previous["value"] === "=") {
                        forRange["start"] = tokenValue
                    }
                }
            } else if (forRange["stop"] === undefined) {
                if (tokenType === "int" || tokenType === "IDEN" || tokenType === "length") {
                    if (previous["value"] === "<" || previous["value"] === ">") {
                        forRange["stop"] = tokenValue;
                    }
                }
            } else if (forRange["increment"] === undefined) {
                if (tokenType === "arithmeticOperation") {
                    if (previous["type"] === "IDEN") {
                        forRange["increment"] = tokenValue;
                    }
                }
            } else if (tokenType === "rparen") {
                inParenthesis = false;
                statementBuilder["forLoop"] = forRange;
            } else if (tokenType === "lbrace") {
                statementBuilder["forLoop"]["body"] = {};

                appendStatement();
                clearStatementBuilder();
                unknownStatement = [];
                inStatement = false;
                nestLevel += 1;
                forLevel += 1;
            }
        }

        function constructAssignment() {
            logBody.push("constructAssignment")
            statementType = "newAssignment";
            statementBuilder = {
                "assign": {
                    "type": unknownStatement[0],
                    "name": unknownStatement[1]
                }
            };

            unknownStatement = [];

            logBody.push(statementBuilder)
            logBody.push(`statementBuilder ->`)
            logBody.push(`statementType -> ${statementType}`)
        }

        function callFunction() {
            logBody.push("callFunction");
            statementType = "functionCall"
            statementBuilder = {
                "functionCall": {
                    "name": previous["value"]
                }
            };
            inParenthesis = true;
            logBody.push("inparenthesis is true")
        }


        function handleUndefinedStatement() {
            logBody.push("handleUndefinedStatement")
            if (tokenType === "accessMod") {

                statementType = "declaration";
                statementBuilder = {
                    accessMod: tokenValue
                }

                logBody.push(`statementType -> ${statementType}`)
                logBody.push(`statementBuilder -> ${statementBuilder}`)
            }
            // construct the following logic as new cases come up
            // ie a function call or incrementing a variable 
            else if (tokenType === "IDEN" || tokenType === "type") {
                statementType = "unknown";
                unknownStatement.push(tokenValue)

                logBody.push(`statementType -> ${statementType}`)
                logBody.push(`unknownStatement -> ${unknownStatement}`)
            } else if (tokenType === "printLine") {
                if (functionLevel > 0) {
                    statementBuilder = {
                        "print": null
                    };
                    inString = true;
                    statementType = "print";

                    logBody.push(`statementBuilder -> ${statementBuilder}`);
                    logBody.push(`inString -> ${inString}`);
                    logBody.push(`statementType -> ${statementType}`);
                }
            } else if (tokenType === "KW") {
                if (tokenValue === 'return') {
                    statementType = "return"
                    statementBuilder["return"] = null
                } else if (tokenValue === "for") {
                    statementType = "forLoop"
                    statementBuilder = {
                        "forLoop": null
                    }
                    logBody.push(`statementType -> ${statementType}`);
                } else if (tokenValue === "if") {
                    // The first time an If is found it will route through here 
                    if (previous["value"] === "else") {
                        expectingIfDeclaration = false;
                    }
                    statementType = "ifStatement"
                    if (statementBuilder["ifBlock"] === undefined) {
                        statementBuilder = {
                            "ifBlock": []
                        }
                    }
                    inIf = true;
                    foundIf = true;
                    logBody.push(`statementType -> ${statementType}`);
                } else if (tokenValue === "else") {
                    expectingIfDeclaration = true;
                    statementType = "ifStatement"
                    // REMOVE
                    if (statementBuilder["ifBlock"] === undefined) {
                        statementBuilder = {
                            "ifBlock": []
                        }
                    }
                    inIf = true;
                    foundIf = false;
                    logBody.push(`statementType -> ${statementType}`);
                } else if (tokenValue === "static") {
                    handleStatic();
                }
            } else if (tokenValue === "=") {
                statementType = "assignment";
                statementBuilder = {
                    "assignment": {
                        "type": unknownStatement[0],
                        "iden": unknownStatement[1]
                    }
                };
                logBody.push(`statementType -> ${statementType}`);
                unknownStatement = [];
            }
        }

        function handleStatic() {
            if (statementBuilder["isStatic"] === undefined) {
                statementBuilder["isStatic"] = true;
                statementType = "declaration";
                unknownStatement = [] // reset unknown statement 

                logBody.push(`handleStatic`)
                logBody.push(`statementBuilder["isStatic"] -> ${statementBuilder["isStatic"]}`)
                logBody.push(`statementType -> ${statementType}`)
                logBody.push(`unknownStatement -> ${unknownStatement}`)
            }
            if (statementBuilder["accessMod"] === undefined) {
                statementBuilder["accessMod"] = "public"
            }
        }

        function handleMain() {
            logBody.push("handleMain")
            if (tokenValue.toLowerCase() === "main") {
                statementBuilder["isMain"] = true;
            } else {
                statementBuilder["isMain"] = false;
            }
            logBody.push(`statementBuilder["isMain"] -> ${statementBuilder["isMain"]}`)

            statementBuilder["name"] = tokenValue;
            statementBuilder["returnType"] = unknownStatement[0];
            statementType = "functionDeclaration"
            unknownStatement = []
            // statementBuilder["statementType"] = "functionDeclaration";  

            logBody.push(`statementBuilder["name"] -> ${statementBuilder["name"]}`);
            logBody.push(`statementBuilder["returnType"] -> ${statementBuilder["returnType"]}`);
            logBody.push(`statementType -> ${statementType}`);
            logBody.push(`unknownStatement -> ${unknownStatement}`)
            // logBody.push(`statementBuilder["statementType"] -> ${statementBuilder["statementType"]}`)            
        }

        function handleDeclaration() {
            logBody.push("handleDeclaration");

            if (tokenValue === "static") {
                handleStatic();
            } else if (tokenType === "type") {
                unknownStatement.push(tokenValue);
                logBody.push(`unknownStatement -> ${unknownStatement}`)
            } else if (tokenType === "IDEN") {
                if (unknownStatement[0] !== undefined) {
                    handleMain();
                }
            }
        }

        function buildArgs() {
            logBody.push("buildArgs");
            if (argbuilder === "") {
                argbuilder += tokenValue;

                logBody.push(`argbuilder -> ${argbuilder}`)
            } else {
                args[tokenValue] = argbuilder;

                logBody.push(`args[tokenValue] -> ${args[tokenValue]}`)
            }
        }

        function handleFunctionArgumentDefinition() {
            logBody.push("handleFunctionArgumentDefinition");

            if (tokenType === "type") {
                argbuilder += tokenValue;

                logBody.push(`argbuilder -> ${argbuilder}`);
            } else if (tokenType === "emptyArray") {
                argbuilder += tokenValue;

                logBody.push(`argbuilder -> ${argbuilder}`);
            } else if (tokenType === "IDEN") {
                buildArgs();
            } else if (tokenType === "controls") {
                if (tokenValue === ",") {
                    // args[tokenValue] = argbuilder;
                    // logBody.push(`args[tokenValue] -> ${args[tokenValue]}`)
                    clearArgBuilder();
                } else {
                    clearArgs();
                }
            }
        }

        function initializeParenthesis() {
            logBody.push("initializeParenthesis")
            inParenthesis = true;
            inDefinitionArgs = true;

            logBody.push(`inParenthesis -> ${inParenthesis}`);
            logBody.push(`inDefinitionArgs -> ${inDefinitionArgs}`)
        }

        // this function needs logic 
        // const closeParenthesis = () => {
        //     logBody.push("closeParenthesis")

        //     inParenthesis = false;
        //     inString = false;

        // }

        function clearArgBuilder() {
            logBody.push("clearArgBuilder")

            // args = {};                  
            argbuilder = '';

            //logBody.push(`args -> ${args}`);
            logBody.push(`argbuilder -> ${argbuilder}`);
        }

        function clearArgs() {
            logBody.push(clearArgs)

            args = {};
            logBody.push(`args -> ${args}`);
            clearArgBuilder();
        }

        function clearStatementBuilder() {
            logBody.push("clearStatementBuilder")

            statementBuilder = {};
            statementType = undefined;

            logBody.push(`statementBuilder -> ${statementBuilder}`);
            logBody.push(`statementType -> ${statementType}`);
        }

        function appendStatement() {
            logBody.push("appendStatement");
            if (inIf) {
                if (ifBlock[ifIndex]["routine"] === undefined) {
                    ifBlock[ifIndex]["routine"] = [statementBuilder];
                } else {
                    ifBlock[ifIndex]["routine"].push(statementBuilder);
                }
            } else if (currentFunction["statements"] === undefined) {
                currentFunction["statements"] = {}
                currentFunction["statements"][callOrder] = statementBuilder
                callOrder += 1;
            } else if (forLevel > 0) {
                if (currentFunction["statements"][callOrder - 1]["forLoop"]["body"][forOrder] === undefined) {
                    currentFunction["statements"][callOrder - 1]["forLoop"]["body"][forOrder] = statementBuilder;
                }
                // currentFunction["statements"][callOrder]["forLoop"]["body"] = statementBuilder;
                forOrder += 1;
            } else {
                currentFunction["statements"][callOrder] = statementBuilder;
                callOrder += 1;
            }
            stringbuilder = [];
            logBody.push(`callOrder -> ${callOrder}`);
            logBody.push(`currentFunction["statements"] -> ${currentFunction["statements"]}`);
            logBody.push(`stringbuilder -> ${stringbuilder}`);
        }

        function debugBreak() {
            if (tokenType === "toString") {
                logBody.push("BREAK")
            }
        }

        function start() {

            debugBreak()
            if (inOuterClass === false) {
                createOuterClass()
            } else {
                if (functionBuilder.length > 0)
                    currentFunction = functionBuilder[functionLevel - 1]
                if (tokenType === "NL") {
                    if (expectingIfDeclaration) {
                        foundIf = false;
                    }
                    newLine()
                } else if (tokenType !== 'rbrace') {
                    if (inIf) {
                        if (expectingIfRoutine === false && expectingIfCondition === false) {
                            if (tokenValue !== "if" && tokenValue !== "else" && tokenValue !== "{") {
                                inIf = false;
                                // this is the section of the code that closes if blocks
                            }
                        }
                    }
                    constructStatement()
                } else {
                    if (inIf) {
                        if (foundIf) {
                            expectingIfRoutine = false;
                            expectingIfCondition = false;
                            expectingIfDeclaration = false;
                            ifIndex++;
                        } else {
                            expectingIfRoutine = false;
                            expectingIfCondition = false;
                            expectingIfDeclaration = false;
                            inIf = false;
                            ifIndex = 0;
                            statementBuilder = {
                                "ifBlock": ifBlock
                            };
                            ifBlock = [];
                            appendStatement();
                        }
                    } else if (functionLevel > 0) {
                        if (forLevel > 0) {
                            forLevel -= 1;
                            forOrder = 0;
                        } else {
                            functionLevel -= 1;
                        }
                        if (functionLevel === 0) {
                            attribute["outerClass"]["body"].push(functionBuilder)
                            logBody.push(`attribute["outerClass"]["body"] pushed functionBuilder`)
                            logBody.push(functionBuilder)
                            logBody.push("THIS IS FUNCTION BUILDER")
                            functionBuilder = [];
                            callOrder = 0;
                        }
                        // probably can add some logic here to signify that there are no more functions because functionLevel stayed at 0
                        logBody.push(`functionLevel -> ${functionLevel}`);
                    }
                    if (nestLevel > 0) {
                        nestLevel -= 1;
                        logBody.push(`nestLevel -> ${nestLevel}`);
                        if (nestLevel === 0) {
                            if (inOuterClass) {
                                // attribute["outerClass"]["body"].push(functionBuilder)
                                inOuterClass = false;
                            }
                        }
                        // this will always happen 
                        startofLine = false;

                        logBody.push(`functionLevel -> ${functionLevel}`);
                        logBody.push(`nestLevel -> ${nestLevel}`);
                        logBody.push(`startofLine -> ${startofLine}`);
                    }
                }
                // else{
                //     constructStatement()
                // }
            }

            previous = token;
            log();
        }
        start();
    }


    toJSON()

    // When everything is done this should return a JSON of the psuedocode that will be translated to Python 
    // console.log(JSON.stringify(attribute, null, 2))
    // console.log(attribute)
    // console.log(statementBuilder);
    // for (let i = 0; i < functionBuilder.length; i++) {
    //     console.log(functionBuilder[i]);
    // }
    return attribute;
};

export default Universalizer
