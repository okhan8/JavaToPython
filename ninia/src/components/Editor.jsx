import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/java'
import 'brace/theme/twilight'
// import ReactAce from 'react-ace/lib/ace';

const CodeEditor = (props) => {
    return(
        <div>
            <AceEditor 
                mode = 'java' 
                theme= 'twilight' 
                fontSize = '24px'
                height = '85vh'
                width = '50vw'
            />
        </div>
    );
}



export default CodeEditor;

