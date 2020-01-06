import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/python'
import 'brace/theme/chrome'

class Output extends React.Component{
    // constructor(props){
    //     super(props);
    //     updateOut = updateOut.bind(this)
    // }
    render(){
        return(
                <AceEditor 
                mode = 'python' 
                theme= 'chrome' 
                fontSize = '24px'
                height = '85vh'
                width = '50vw'
                readOnly
                />
        );
    }
}

export default Output;


