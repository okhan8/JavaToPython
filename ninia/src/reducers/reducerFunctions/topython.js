let test = {
    "outerClass": {
        "accessMod": "none",
        "name": "HelloWorld",
        "body": [
            [{
                "isStatic": true,
                "accessMod": "public",
                "isMain": true,
                "name": "main",
                "returnType": "void",
                "arguments": {
                    "args": "String[]"
                },
                "statements": {
                    "0": {
                        "print": [
                            "\"Hello World!\""
                        ]
                    }
                }
            }]
        ]
    }
}

const Pythonize = (inputJSON) => {

    let fileName;
    let mainBody;
    let output;
    let defs = [];

    let logBody = [];
    let logging = true;
    let indent = "";

    function logAll() {
        if (logging) {
            for (let l in logBody) {
                console.log(l);
            }
            logBody = [];
        }
    }

    function log(line) {
        logBody.push(line)
    }

    function incIndent() {
        indent = indent.concat("    ");
    }

    function decIndent() {
        indent = indent.substring(0, indent.length - 4);
    }

    function mainToString() {
        let mainStr = '';
        if (mainBody != undefined){
            for (let i = 0; i < mainBody.length; i++) {
                let s = mainBody[i];
                mainStr = mainStr.concat(s + "\n");
            }
        }
        else {
        }
        return mainStr;
    }

    function handleAssign(statement) {
        let str;
        let operation;
        str = indent.concat(statement["name"]);
        if(statement["args"]["operation"] !== undefined){
            operation = statement["args"]["operation"];
        }
        let argList = statement["args"]["args"];
        if (Object.keys(argList).length === 1) {
            if (RegExp((/\{.+\}/)).test(argList[0]) === true) {
                str = str.concat(' = ', argList[0].replace('{', '[').replace('}', ']'));
            } else{
                str = str.concat(' = ', argList[0]);
            }
        } else {
            str = str.concat(' = ', argList[0], ' ', operation, ' ', argList[1], "\n");
        }
        return str;
    }

    function handleFor(s) {
        let body = s["body"];
        let statementList = [];
        let stop;
        if (RegExp(/.[a-zA-Z]+\.length/).test(s["stop"])) {
            stop = `len(${s["stop"].split(".")[0]})`;
        } else {
            stop = s["stop"];
        }

        let str = `${indent}for ${s["index"]} in range(${s["start"]}, ${stop}`;
        if (body["increment"] === "--") {
            str = str.concat(",-1):\n");
            incIndent();
        } else {
            str = str.concat("):\n");
            incIndent();
        }

        for (let i = 0; i < Object.keys(body).length; i++) {
            statementList.push(parseStatement(body[i]));
        }

        for (let i = 0; i < statementList.length; i++) {
            str = str.concat(statementList[i]);
        }
        decIndent();
        return str;
        // for (let i = 0; i < Object.keys(body).length; i++) {
        // }
    }

    function parseStatement(d) {
        let pythonStatement = '';
        if (d["print"] !== undefined) {

            let str = d["print"][0].replace("\\\"", "");
            if (RegExp(/String\.valueOf\([a-zA-Z]+\)/).test(d["print"][0])) {
                str = str.replace("(", "").replace(")", "").replace("String.valueOf", "")
            }
            pythonStatement = `print(${str})`
            // log(`statement: ${pythonStatement}`)
        } else if (d["assign"] !== undefined) {
            let statement = d["assign"]
            pythonStatement = handleAssign(statement);
        } else if (d["forLoop"] !== undefined) {
            let statement = d["forLoop"];
            pythonStatement = handleFor(statement);
        } else if (d["ifBlock"] !== undefined) {
            let statement = d["ifBlock"];
            for (let i = 0; i < Object.keys(statement).length; i++) {
                if (statement[i]["condition"] === "else") {
                    pythonStatement = pythonStatement.concat(indent, "else:", "\n");
                    incIndent();
                    for (let j = 0; j < statement[i]["routine"].length; j++) {
                        pythonStatement = pythonStatement.concat(indent, parseStatement(statement[i]["routine"][j]), "\n")
                    }
                    decIndent();
                } else {
                    if (i === 0) {
                        let conds = '';
                        for (let j = 0; j < statement[i]["condition"].length; j++) {
                            conds = conds.concat(statement[i]["condition"][j], " ");
                        }
                        pythonStatement = pythonStatement.concat(indent, "if ", conds, ":\n");
                        incIndent();
                        for (let j = 0; j < statement[i]["routine"].length; j++) {
                            pythonStatement = pythonStatement.concat(indent, parseStatement(statement[i]["routine"][j]), "\n")
                        }
                        decIndent();
                    } else {
                        let conds = '';
                        for (let j = 0; j < statement[i]["condition"].length; j++) {
                            conds = conds.concat(statement[i]["condition"][j], " ");
                        }
                        pythonStatement = pythonStatement.concat(indent, "elif ", conds, ":\n");
                        incIndent();
                        for (let j = 0; j < statement[i]["routine"].length; j++) {
                            pythonStatement = pythonStatement.concat(indent, parseStatement(statement[i]["routine"][j]), "\n")
                        }
                        decIndent();
                    }
                }
            }
        } else if(d["functionCall"] !== undefined){
            let args = '';
            for(let i = 0; i < d["functionCall"]["args"].length; i++){
                args = args.concat(d["functionCall"]["args"][i], ", ")
            }
            pythonStatement = `${d["functionCall"]["name"]}(${args.substring(0, args.length-2)})`;
        }
        return pythonStatement;

    }



    function constructProp(statements) {
        // log("constructing props");
        let statementList = [];
        let statementCount = Object.keys(statements).length;
        // log(`found ${statementCount} statements`)
        for (let i = 0; i < statementCount; i++) {
            // log(`parsing statement ${i}`);
            statementList.push(parseStatement(statements[i]));
        }
        return statementList;
    }

    function parseBody(codeBody) {
        // log("parsing body");
        for (let collection in codeBody) { // each collection is an inner list
            let innerList = codeBody[collection]
            for (let prop in innerList) {
                let func = innerList[prop];
                if (func["isMain"] !== undefined) {
                    if (func["isMain"] === true) {
                        let mainFunc = func["statements"];
                        mainBody = constructProp(mainFunc);
                    } else {
                        let funcName = func["name"];
                        let funcArgs = '';
                        for (var key in func["arguments"]) {
                            if (func["arguments"].hasOwnProperty(key)) {
                                funcArgs = funcArgs.concat(key, ", ");
                            }
                        }
                        let funcSig = `def ${funcName}(${funcArgs.substring(0, funcArgs.length-2)}):\n`
                        incIndent();
                        let funcBody = constructProp(func["statements"])
                        decIndent();
                        let fn = funcSig;
                        for(let str in funcBody){
                            fn = fn.concat(funcBody[str]);
                        }
                        fn = fn.concat("\n", "\n");
                        defs.push(fn);
                        console.log("stop")

                    }


                }
            }


            // if (codeBody[collection]["isMain"] !== undefined) {
            //     if (codeBody[collection]["isMain"] === true) {
            //         mainBody = constructProp(codeBody[collection]["statements"]);
            //     }
            // }
        }
    }

    function constructClass(classKey) {
        if (classKey === "outerClass") {
            fileName = inputJSON[classKey]["name"];

        } else {
            fileName = "CoffeeSnake";
        }

        log(`fileName : ${fileName}`);

        if (inputJSON[classKey]["body"] !== undefined) {
            parseBody(inputJSON[classKey]["body"])
        }
    }

    function constructOutput() {
        let src = '';
        let main = mainToString();
        for(let i = 0; i < defs.length; i++){
            src = src.concat(defs[i]);
        }

        src = src.concat(main);
        return src;
    }

    function start(someJSON) {
        for (var key in someJSON) {
            if (someJSON.hasOwnProperty(key)) {
                // log(`key : ${key}`);
            }
            constructClass(key);
        }
        output = constructOutput();
    }




    start(inputJSON);
    return output;
}



// toPython(bigJson)

export default Pythonize
