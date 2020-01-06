import React from 'react';

const SubmitButton = (props) => {
    return(
        <button 
            className = "s-btn"
            height = "50px"
            width = "40px"
            onClick = {props.handleClick}
            >
            Submit
        </button>
    );
}


export default SubmitButton;


