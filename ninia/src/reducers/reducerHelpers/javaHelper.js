// const javaTokens = {
//     printLine: 'System.out.println',
//     accessMod: ['public', 'private', 'protected'],
//     arithmeticOperation: ['+', '-', '++', '--', '+=', '-=', '*', '/'],
//     relationalOperator: ['<', '>', '==', '>=', '<='],
//     type: ['int', 'double', 'String', 'void'],
//     KW: ['while', 'if', 'else', 'for', 'class', 'static', 'System', 'void', 'new'],
//     controls: ['.', ',', ';'],
// }

const log = () => {
    if (logging){
        for(let i = 0; i < logBody.length; i++)
            console.log(logBody[i])
    }
}

let logBody = [];
let tokenType = token["type"];
let tokenValue = token["value"];

logBody.push(tokenType);
logBody.push(tokenValue);

const setClassaccessMod = () =>{
    attribute = (tokenType === "accessMod") ? {class: {accessMod: tokenValue}} : {class: {accessMod: "none"}}
    inClass = true;
    startofLine = false;

    logBody.push("setaccessMod")
    logBody.push("inClass set to true")
    logBody.push("set to: " + attribute["class"]["accessMod"])
}

const emptyTempFunction = () =>{
    if(Object.keys(tempFunction).length === 0){
        return true;
    }
    return false
}

// use snippet nfn

const setFunctionaccessMod = () =>{
    tempFunction["function"] = (tokenType === "accessMod") ? {"access": tokenValue} : {"access": "none"}
}


// Everything above will be replaced with t and v 


// If nest level is greater than one that means we are in the body of a class 
if (nestLevel > 0){
    if(emptyTempFunction()){
        if(tokenType === "accessMod")
            tempFunction["function"]= {"access": tokenValue}
    }
    else if(tokenValue === "static"){
        tempFunction["function"]['static'] = true                    
    }
    else if (tokenType === "type"){
        if(previous === "KW"){
            tempFunction["function"]['returntype'] = tokenValue
        }
        else if(inParenthesis){
            argbuilder = tokenValue;
        }
    }
    else if(tokenType === "IDEN"){
        if(!inParenthesis){
            if(tokenValue.toLowerCase() === "main"){
                tempFunction["function"]['name'] = tokenValue
                tempFunction["function"]['ismain'] = true
            }
            else{
                tempFunction["function"]['name'] = tokenValue
                tempFunction["function"]['ismain'] = false
            }
        }
        else{
            if(previous === "type" || previous === "emptyArray"){
                console.log(argbuilder)
                if(argbuilder !== ''){
                    if(!(argbuilder in args)){
                        args[argbuilder] = [tokenValue]
                        argbuilder = ''
                    }
                    else{
                        args[argbuilder].push(tokenValue)
                        argbuilder = ''
                    }
                    console.log(args)
                }
            }
        } 
    }
    else if(tokenType === "lparen"){
        if(previous === "IDEN" || previous === "printLine"){
            inParenthesis = true;
        }
    }
    else if(tokenType === "rparen"){
        // NOTE: This bit will need some major overhauling as development progresses 
        if(stringbuilder.length === 0){
            tempFunction["function"]["arguments"] = args;
            args = {};
            tempFunction["function"]["statements"] = {};
            inParenthesis = false;
            functionLevel += 1;
        }
        else{
            console.log("String builder is not empty")
            tempFunction["function"]["statements"][callOrder]["arguments"] = stringbuilder
            callOrder += 1;
            inParenthesis = false;
        }
    }
    else if(tokenType === "emptyArray"){
        if(inParenthesis){
            if(previous === "type" && argbuilder !== '' && tokenType !== "WS")
                argbuilder += tokenValue;
        }
    }
    else if(tokenType === "printLine"){
        inStatement = true;
        let order = callOrder.toString();
        tempFunction["function"]["statements"] = {}
        tempFunction["function"]["statements"][order] = {"function": "print"} 
    }
    else if(tokenType === "string"){
        if(inParenthesis){
            stringbuilder.push(tokenValue);
            console.log(stringbuilder);
        }
    }
    else if(tokenType === "controls"){
        if(tokenValue === ";"){
            // LEFT OFF HERE
            // Need to add a flag to check if statements are being made so we can make multiple function calls in 
            // a single line
            if (inStatement){
                inStatement = false;
                console.log(nestLevel)
            }

            console.log(attribute)
            // Afterwords we have to add some more logic to rbrace to adjust nest levels
        }
    }
}
else if (tokenType === "IDEN"){
    attribute["class"]["name"] = tokenValue
}
else if (tokenType === "lbrace"){
    if(functionLevel > 0){
        nestLevel += 1
    }
    nestLevel+=1
    attribute["class"]["body"] = [] //changed from {}
}
else if(tokenType === "rbrace"){
    if (functionLevel > 0)
        functionLevel -= 1;
    if (nestLevel >0)
        nestLevel -=1;
    console.log(attribute);
    console.log(tempFunction);
    attribute["class"]["body"].push(tempFunction)
    console.log('hm');
    console.log('hm');
    tempFunction = {};
}









// export {
//     javaTokens,
//     inClassCheck,
// }