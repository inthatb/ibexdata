import * as React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { connector } from './store/connector'
import DotGrid from './components/DotGrid'
import WordList from './components/WordList'

const RESULT_SERVER_ADDRESS = 'http://ibex-data.herokuapp.com'

const testing = false

const App = (props) => {
  const {baseline, type, phase} = props

  const timeRef = React.useRef(null)  
  // const [count, setCount] = useState(0)
  
  const waitAndNext = () => {
    timeRef.current = setTimeout(()=>{
      props.nextPhase()
    }, props.waitTime)
  }

  
  const sendResults = () => {
    let test_type;
    if(props.type == 1) test_type = 'Dot Grid'
    if(props.type == 2) test_type = 'Word List'
    if(props.type == 3) test_type = 'No Interference'

    fetch(RESULT_SERVER_ADDRESS, {
      method: 'POST',
      mode: 'cors',
      body: {
        user_id: props.user_id,
        type: test_type,
        question_set: props.question_set,
        baseline: props.baseline,
        responses: props.responses
      }
    })
  }



  React.useEffect(()=>{
    props.init()
  },[])    

  React.useEffect(()=>{
    if(props.finished) sendResults()
  }, [props.finished])


  React.useEffect(()=>{
    console.log('type:', props.type)
    if(props.started){

      if(props.baselineTest){
        if(phase != 4) waitAndNext()


      }  
      else if(props.type == 1 || props.type == 2){
        if((props.questionIndex > 1 && phase == 1 ) || phase == 2) waitAndNext()
      }  

      else if(props.type == 3){
        if(phase !== 3) {
          timeRef.current = setTimeout(()=>{
            props.nextPhase()
          }, props.waitTime / 3)  
        }  
      }  
    }  


      return () => clearTimeout(timeRef.current)
  }, [phase, props.started, props.type])    
  


  return (
    <div className="App">
      <header className="App-header">

      {testing && 
        <div id='stats' >
          TEST: {props.baselineTest ? 'baseline' : props.type}
          {` | `}PHASE: {props.phase}
          {` | `}MATCH: {props.isMatch.toString()}
        </div>
      }

      <div id='container'>

        {props.finished 
        ? <div id='grid'>
          <h2>Test Finished</h2>
          <p>Message for participant</p>
          <p>Thanks!</p>
        </div>
        : <>
          
          



          {/* /////////////////////////////////////////////////////////////////////////////////////////////
            If the test has not started yet, show the initial instructions
          */}

          {!props.started && props.type != 3 && 

          <div id='grid'>
            {/* <h2>Initial Instructions for type 1 / 2 <br/>Hidden for type 3</h2> */}
            <p> You will see a pattern for brief amount of time. Then, you will see 
              a blank screen. After, you will see another pattern and get asked to
              judge whether it matches the first pattern. </p>
            <button id='start-button' onClick={props.start}>START</button>
          </div>}



          {/* /////////////////////////////////////////////////////////////////////////////////////////////
            If test has started and question index === 1, show secondary instructions and wait for 'start'
          */}

          {((phase == 1 && props.questionIndex <=1 && !props.baselineTest && props.type !== 3) 
          || (!props.started && props.type == 3)) &&

            <div id='grid'>
              {/* <h2>Secondary Instructions for type 1 / 2<br />Primary instructions for type 3</h2> */}
              <p>Assert that the statements are true or false</p>
              <button id='start-button' onClick={props.type == 3 ? props.start : props.nextPhase}>START</button>
            </div>
          }



          {/* /////////////////////////////////////////////////////////////////////////////////////////////
            If phase 1 / type 3, show wait or progress
          */}

          {phase == 1 && !props.baselineTest && props.questionIndex > 1
          && <p id='wait'>{props.progress ? props.progress : '...'}</p>}



          {/* /////////////////////////////////////////////////////////////////////////////////////////////
            If no more questions, show final message
          */}

          {/* {props.finished && 
          <div>
            <p>DONE!</p>
            <button onClick={sendResults}>Submit Results</button>
            </div>
            } */}





          {(props.type === 1 && (props.phase === 2 || props.phase === 4)) && 
            <DotGrid />
          }



          {(props.type === 2 && (props.phase === 2 || props.phase === 4)) && 
            <WordList />
          }

          {(props.phase === 3 && props.baselineTest) && <p id='wait'>...</p>}
          {(props.phase === 3 && !props.baselineTest) && <p id='question'>{props.question[0]}</p>}

          {(props.phase === 3 && !props.baselineTest) && <div>
            <button onClick={() => props.checkAnswer(true)}>TRUE</button>
            <button onClick={() => props.checkAnswer(false)}>FALSE</button>
          </div>}

          {(props.type == 1 || props.type == 2) && props.phase === 4 && <div>
            <button onClick={() => props.checkMatch(true)}>MATCH</button>
            <button onClick={() => props.checkMatch(false)}>NO MATCH</button>
          </div>}


          </>}
        </div>




        {testing && 
          <pre>{JSON.stringify(props, null, 2)}</pre>
        }


      </header>
    </div>
  )
}

export default connector(App)
