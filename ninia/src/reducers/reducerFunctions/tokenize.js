// function called to read string input and create token array  
// import store from '../../store.js'
// import Universalizer from './universalize'
// import universalize from './universalize'

const tokenize = (stringT) =>{
    try{
    lexer.reset(stringT)

    let tokens = Array.from(lexer)
    let tokenList = []
    for(var i = 0; i<tokens.length; i++){
        tokenList.push(tokens[i])
    }
    return tokenList;
}
catch (err){
    alert("Invalid character");
}
}



// import moo, the package used for tokenizing input 
const moo = require("moo");
// subroutine responsible for classifying token groups 
let lexer = moo.compile({
    printLine: 'System.out.println',
    importHashMap: /java.util.HashMap/,
    mapGet: /\.get\(.+\)/,
    mapPut: /\.put\(.+ , .+\)/, // this almost definitely doesnt work, fix it   
    WS: /[ \t]+/,
    accessMod: ['public', 'private', 'protected'],
    arithmeticOperation: ['+', '-', '++', '--', '+=', '-=', '*', '/', '%'],
    logicalOperation: ["&&"],
    relationalOperator: ['<', '>', '==', '>=', '<='],
    assignment: /=/,
    toString: /String\.valueOf\([a-zA-Z]+\)/,
    length: /.[a-zA-Z]+\.length/,
    type: ['int[]', 'String[]', 'int', 'double', 'String', 'void'],
    IDEN: {
        match: /[a-zA-Z]+/,
        type: moo.keywords({
            KW: ['while', 'if', 'else', 'for', 'class', 'static', 'System', 'new', 'return', 'import'],
        })
    },
    comment: /\/\/.*?$/,
    float: /-?\d+\.\d+/,
    controls: ['.', ',', ';'],
    int: /0|[1-9][0-9]*/,
    intArray: /\{(?:\d\s*?,?\s*?)+\}/,
    floatArray: /\{(?:-?\d+\.\d+\s*?,?\s*?)+\}/,
    stringArray: /\{(?:".*?"s*,?\s*?)+\}/,
    emptyArray: '[]',
    specifiedLengthArray: /\[\d+\]/,
    lparen: '(',
    rparen: ')',
    lbrace: '{',
    rbrace: '}',
    NL: {
        match: /\n/,
        lineBreaks: true
    },
    HashMap: /HashMap<.+>/,
    string: /".*?"/,
    })

    export default tokenize;