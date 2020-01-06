import React from 'react';

const DownloadButton = (props) => {
    return(
        <button 
            className = "d-btn"
            height = "50px"
            width = "40px"
            onClick = {props.handleClick}
            >
            Download
        </button>
    );
}


export default DownloadButton;