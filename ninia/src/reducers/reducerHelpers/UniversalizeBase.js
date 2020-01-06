// THIS IS GOOD KEEP WORKING ON IT

const Universalize = (tokens, logFlag = true) => {

    /*  variables and flags used to construct the JSON  */

    let logFlag = logFlag;                  // Boolean that controls log statements
    let tokenList = tokens;                 // Holds the token list 
    let JSONOutput = {};                    // Output JSON
    let current;                            // The current token 
    let sB = {"statement": undefined};      // Statement builder
    let statementManager = [];              // Stores every token in the current statement
    let statementStack = [];                // The stack used to build the JSON programatically
    let inClass = false;                    // Flag used to determine if imports are legal at this level

    ////////////////////////// Variables below haven't been used yet //////////////////////////

    let validReturnTypes = [                // List containing all legal, DEFAULT return types
        'void', 'int', 'String', 'double', 'float'
    ]
    let validStatementTypes = ['classDeclaration', 'declaration', 'import'];


    // Iterator that loops over the token list and feeds non-whitespace characters to updateJson()
    function toJSON() {

        for (let i = 0; i < tokenList.length; i++) {
            current = tokenList[i];
            if (current !== undefined && current !== null && current["type"] !== "WS") {
                // console.log(i + 1)
                updateJSON(current);
                // console.log("---------------------------------------")
            }
        }
    }

    // The primary driver function, the majority of subroutines will belong to this function
    function updateJSON(currentToken){
        // Helper variables that can be referenced by any subprogram within updateJSON
        let ct = currentToken;                  // store a reference to the current token as ct, less typing involved
        let tt = currentToken["type"];          // same as above, but for the token type
        let tv = currentToken["value"];         // same as above, but for the token value 

        // implementation of start(), the entry point of the syntactic analyzer  
        function start(){
            if(sB["statement"] === undefined){                  // KWs are the most common, and thus are checked first
                if( tt === "KW"){
                    if(tv === "class"){                         // Assigns the statement type to be a classDeclaration
                        sB["statement"] = "classDeclaration";   
                        appendDefaultStatic();                  // See definition
                    } else if(tv === "static"){
                        sB["accessMod"] = tv
                    } else if (tv === "import"){                // Needs additional validation to make sure imports 
                        sB["statement"] = "import";             // Can only occur at the parent level 
                    }
                } else if(tt === "accessMod"){
                    sB["accessMod"] = tv
                    sB["statement"] = "declaration";            // declaration is the "default" statement type for any kind
                                                                // of declaration. Should be changed to a more specific
                                                                // statement type as more information is acquired
                                                                
                // This should always be the final if in the undefined block 
                } else if(true){                                // the most niche statement types are processed last

                }
            } else {
                constructStatement();                           // build a statement based on the current known statement type
            }

            appendToStatementManager();                         // EVERY token is appended to the manager
        }

        // Stores every token seen in the current statement. It is cleared when a statement is complete  
        function appendToStatementManager(){
            statementManager.push(nt)
        }

        // Implement driver code for handling statements of known types 
        function constructStatement(){

        }

        // For class, var, and method declarations without explicit access mods or static prefixes
        function appendDefaultStatic(){
            if(sB["accessMod"] === undefined && sB["isStatic"] === undefined){
                sB["accessMod"] = "public";
                sB["isStatic"] = false;
            }
        }

        start();
    }





    toJSON();
    return JSONOutput;

}