import React from 'react';
import { Component } from 'react';
import {connect} from 'react-redux';
import {ButtonGroup, Button, ButtonToolbar, Nav, Container, Row, Col, Tab} from 'react-bootstrap';
// maybe add these imports?  TabContent, TabPane, NavItem, NavLink, Card, CardTitle, CardText,
import Terminal from 'react-console-emulator';
import Universalizer from '../reducers/reducerFunctions/universalize'
import Pythonize from '../reducers/reducerFunctions/topython'
import './App.css';
import AceEditor from 'react-ace'
import store from "../store.js"
import 'brace/mode/java'
import 'brace/theme/twilight'
import 'brace/mode/python'
import 'brace/theme/chrome'
import * as constants from '../utils/consts.js'
import tokenize from '../reducers/reducerFunctions/tokenize';
import f from '../reducers/reducerFunctions/flipper';

function onTextChange(newValue){
  store.dispatch({
    type: "UPDATE_SOURCE_CODE",
    payload: newValue
  })
}

// currently loads in the text data from the rightText store 
// going forward it will be used as a debugging tool for testing the intermediary form 
// then it will be a debugging tool for generating the transpiled text and then it will be 
// responsible for placing the real transpiled output i nthe irght editor  
function getTranspiledOutput(){
  return store.getState().python;
}


class App extends React.Component {
  constructor(props){
    super(props);
  
    this.leftDefault = constants.HelloWorld;

    store.dispatch({
      type: "UPDATE_SOURCE_CODE",
      payload: this.leftDefault
    })
    this.tokenizeInput = this.tokenizeInput.bind(this);
    this.transpileInput = this.transpileInput.bind(this);

  }

  transpileInput(){
    let tokens = store.getState().tokens;
    store.dispatch({
        type: "JSON",
        payload: Universalizer(tokens)
      })
    this.refs.output.editor.setValue(JSON.stringify(store.getState().json, null, 2));
    let json = store.getState().json
    while (json === {}){
      let tokens = store.getState().tokens;
      store.dispatch({
        type: "JSON",
        payload: Universalizer(tokens)
      })
      json = store.getState().json
    }
    if (json != null){
      store.dispatch({
        type: "OUTPUT",
        payload: Pythonize(json),
      })
      this.refs.output.editor.setValue(store.getState().python);
    }
    else{
      console.log("yikes!");
    }
    /*store.dispatch({
      type: "OUTPUT",
      payload: Pythonize(json),
    })
    this.refs.output.editor.setValue(store.getState().python);*/
  }

  leftTab1(){
    this.leftDefault = constants.HelloWorld
    store.dispatch({
      type: "UPDATE_SOURCE_CODE",
      payload: this.leftDefault
    })
    this.refs.input.editor.setValue(store.getState().leftText);
  }
  leftTab2(){
    this.leftDefault = constants.FizzBuzz
    store.dispatch({
      type: "UPDATE_SOURCE_CODE",
      payload: this.leftDefault
    })
    this.refs.input.editor.setValue(store.getState().leftText);
  }
  leftTab3(){
    this.leftDefault = constants.GetEven
    store.dispatch({
      type: "UPDATE_SOURCE_CODE",
      payload: this.leftDefault
    })
    this.refs.input.editor.setValue(store.getState().leftText);
  }
  rightTab1(){
    this.refs.output.editor.setValue(store.getState().tokenizedText);
  }
  rightTab2(){
    let tokens = store.getState().tokens;
    store.dispatch({
        type: "JSON",
        payload: Universalizer(tokens)
      })
    this.refs.output.editor.setValue(JSON.stringify(store.getState().json, null, 2));
  }
  //rightTab3(){

  //   this.transpileInput();
  //   // let json = store.getState().json;
  //   // this.refs.output.editor.setValue("working on it"); //(store.getState().rightText);
  // }

  tokenizeInput(){
    let newText = store.getState().leftText
    store.dispatch({
      type: "TOKENIZE",
      payload: newText
    })
    this.refs.output.editor.setValue(store.getState().tokenizedText);
  }

  downloadFile() {
    var text = getTranspiledOutput();
    const blob = new Blob([text], {type: "text/plain"});
    var filename = "demo.py";

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    a.click();

    a.remove();

    document.addEventListener("focus", w=>{window.URL.revokeObjectURL(blob)});
  }

  /*splice() {
    this.leftDefault = constants.GetEven;
    document.addEventListener('change', function() {
      var fr = new FileReader();
      fr.onload = function() {
        this.leftDefault = fr.result;
      };
    fr.readAsText(this.files[0]);
    });
    store.dispatch({
      type: "UPDATE_SOURCE_CODE",
      payload: this.leftDefault
    })
    this.refs.input.editor.setValue(store.getState().leftText);
  } */

  APICall() {
    var request = require('request');
    var program = {
        script : store.getState().leftText,
        language: "java",
        versionIndex: "0",
        clientId: "209cef41ccb90e7de7d6443bb8f5a5c",
        clientSecret:"83ed2418d762cf0642bd0be03b485299559aa4383084f952dbb8ee02ac16c7b9"
    };
    request({
        url: 'https://cors-anywhere.herokuapp.com/https://api.jdoodle.com/v1/execute',
        method: "POST",
        json: program
    },
    function (error, response, body) {
      if (error) {
        console.log('error:', error);
      }
      else {
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body.output);
      }
      let newText = body.output;
      store.dispatch({
        type: "COMPILE",
        payload: newText
      })
    });
  }

  render() {
    return (
        <div className="App">
          <div className = "App-top">
            <header className="App-header">
                <p>
                  CoffeeSnake
                </p>
            </header>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Container>
              <Row>
              <Col style = {{right: '7%'}}>
                <Nav
                  variant = "pills"
                  defaultActiveKey = "ltab-1"
                >
                  <Nav.Item>
                    <Nav.Link eventKey= "ltab-1" onSelect = {this.leftTab1.bind(this)}>Hello World</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey= "ltab-2" onSelect = {this.leftTab2.bind(this)}>FizzBuzz</Nav.Link>
                  </Nav.Item> 
                  <Nav.Item>
                    <Nav.Link eventKey= "ltab-3" onSelect = {this.leftTab3.bind(this)}>Get Even</Nav.Link>
                  </Nav.Item>  
                </Nav>
                
              </Col>
             
              <Col style = {{right: '2%'}}>
                <Nav
                  variant = "pills"
                  defaultActiveKey = "rtab-1"
                >
                  <Nav.Item>
                    <Nav.Link eventKey= "rtab-1" onSelect = {this.rightTab1.bind(this)}>Tokenized Text</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey= "rtab-2" onSelect = {this.rightTab2.bind(this)}>Json Text</Nav.Link>
                  </Nav.Item> 
                  <Nav.Item>
                    <Nav.Link eventKey= "rtab-3" onSelect = {this.transpileInput}>Python Text</Nav.Link>
                  </Nav.Item>  
                </Nav>
              </Col>
              </Row>
              </Container>
            </Tab.Container>
          </div>
          <div className = "Editors">
            <AceEditor 
            //TODO: this needs to be in it's own file
              mode = 'java' 
              theme= 'twilight' 
              fontSize = '18px'
              height = '55vh'
              width = '50vw'
              ref = 'input'
              onChange = {onTextChange}
              defaultValue = {this.leftDefault}
              // gets rid of annoying log message
              editorProps={{
                $blockScrolling: Infinity
              }}
            />
            <AceEditor 
            //TODO: this needs to be in it's own file
              mode = 'python' 
              theme= 'chrome' 
              fontSize = '18px'
              height = '55vh'
              width = '50vw'
              ref = 'output'
              // readOnly
              value = {getTranspiledOutput()}
              // gets rid of annoying log messagej
              editorProps={{
                $blockScrolling: Infinity
              }}
            />  
          </div>
          <div className = "buttons-div" style={{
            backgroundColor: "#282c34",
            height: '6.5vh'
          }}>
          <ButtonToolbar aria-label="Toolbar with button groups">
              <ButtonGroup className ="mr-2" aria-label="Left Editor" style = {{left: '20%'}}>
              <Button onClick={()=> {  
                this.tokenizeInput();
                this.transpileInput();
                this.APICall();
              }}>
              Compile</Button>
              </ButtonGroup>

              <ButtonGroup className ="mr-2" aria-label="Right Editor" style = {{left: '60%'}}>
               <Button onClick = {this.downloadFile}>Download</Button>
              </ButtonGroup>

          </ButtonToolbar>
          </div>
          <div className = "Terminals">
          {/* This is the Left Terminal */} {/*This is just one terminal now */}
            <Terminal
            style = {{
              height: "30vh",
              width: "100vw"
            }} 
            welcomeMessage = {`Hello!`} 
            welcomeMessage = {false}
            commands = {commands}
         
            />
            {/* This is the Right Terminal */}
          </div>
        </div>
    );
  }
}

const commands = {
  compile: {
    fn: function () {
      //this.tokenizeInput();
      return `${store.getState().compiledJava}`
      //return `${store.getState().tokenizedText}`
    }
  }
}

const mapStateToProps = state =>{
  return {
      primary: state.getState,
  };
};

const mapDispatchToProps = dispatch => {
  return{
      updateSourceCode: (newCode) => {
        dispatch(onTextChange(newCode));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);