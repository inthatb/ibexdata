import questions from '../lib/questions';
// import QUESTIONS from '../lib/questions'
import WORDLIST from '../lib/wordlist'

import q1 from '../lib/new_q1.js'
import q2 from '../lib/new_q2.js'
import q3 from '../lib/new_q3.js'
import q4 from '../lib/new_q4.js'
import q5 from '../lib/new_q5.js'


let questionList = []


export const defaultState = {
  waitTime: 10,
  user_id: '1234',
  started: false,
  finished: false,
  questionSet: 0,
  baseline: 1,
  baselineTest: true,
  isMatch: true,
  questionIndex: 0,
  question: 'What is?',
  progress: null,
  response_type: null,
  response_question: null,
  response_answer: null,
  response_match: null,
  type: 1,
  phase: 1,
  responses: [],
  wordlist: [],
  grid: [],
};


////////////////////////////////////////////////////////////////////////////////////////
const rand = (depth) => {
  return Math.floor(Math.random() * depth)
}

////////////////////////////////////////////////////////////////////////////////////////
const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array
}

////////////////////////////////////////////////////////////////////////////////////////
const generateDotGrid = (baseline) => {  
  let grid = new Array(25).fill(0)
  let currentNumDots = 0

  while(currentNumDots < baseline){
      let rand = Math.ceil(Math.random() * 25)
      if(grid[rand] === 0){
        grid[rand] = 1
          currentNumDots++
      }
  }
  return grid
}

////////////////////////////////////////////////////////////////////////////////////////
const changeOneDot = (grid) => {
  // console.log('changeOneDot()')
    let changed = false

    while(changed == false){
        let rand = Math.ceil(Math.random() * 25)
        if(grid[rand] === 0 && grid[rand + 1] === 1){
          grid[rand] = 1
          grid[rand + 1] = 0
          changed = true
        }
        else if(grid[rand] === 0 && grid[rand - 1] === 1){
          grid[rand] = 1
          grid[rand - 1] = 0
          changed = true
        }
     
    }
    return grid
}

////////////////////////////////////////////////////////////////////////////////////////
const generateWordList = (baseline) => {
  let list = []
  while(list.length < baseline){
    list.push(WORDLIST[rand(WORDLIST.length)].toLowerCase())
  }

  return list
}

////////////////////////////////////////////////////////////////////////////////////////
const chageOneWord = (list) => { 

  list[rand(list.length)] = WORDLIST[rand(WORDLIST.length)].toLowerCase()
  
  return list 
}



//- ////////////////////////////////////////////////////////////////////// D I R E C T
//- //////////////////////////////////////////////////////////////////////////////////
//-   Any function that can directly return the new state object 
//-   without a delay or any async actions




//-----------------------------------------------------------------------------
const initializeApp = (state) => {
  let questionSet;

  let rand1 = Math.random()

  if(rand1 <= .2){
    questionSet = q1
    state.questionSet = 1
  }else if(rand1 > .2 && rand1 <= .4){
    questionSet = q2
    state.questionSet = 2
  }else if(rand1 > .4 && rand1 <= .6){
    questionSet = q3
    state.questionSet = 3
  }else if(rand1 > .6 && rand1 <= .8){
    questionSet = q4
    state.questionSet = 4
  }else{
    questionSet = q5
    state.questionSet = 5
  }


  questionList = shuffleArray(questionSet)

  let type;
  let rand = Math.random()
  let grid = generateDotGrid(state.baseline)
  let wordlist = generateWordList(state.baseline)

  // state.questionIndex++
  let question = questionList[state.questionIndex]

  if(rand <= .33){
    type = 1;
  }else if(rand > .33 && rand <= .66){
    type = 2;
  }else{
    type = 3;
  }



  return{
    ...state,
    type,
    grid,
    wordlist,
    question,
  }
}

//-----------------------------------------------------------------------------
const startTesting = (state) => {
  console.log("START")
  let baselineTest = state.baselineTest

  let question = state.question

  state.progress = `${state.questionIndex - 1} / ${questionList.length}`
  question = questionList[state.questionIndex]
  state.response_question = question[0]
  state.response_type = question[1]

  if(state.type == 3){
    baselineTest = false
  }

  return{
    ...state,
    started: true,
    baselineTest,
  }
}

//-----------------------------------------------------------------------------
const nextPhase = (state) => {
  let phase = state.phase
  let wordlist = state.wordlist

  if(state.phase < 4){
    phase++
  }else{
    phase = 1
  }

  let isMatch = state.isMatch
  let question = state.question
  let responses = [...state.responses]

  if(phase == 1){

    if(!state.baselineTest){

      // console.log('--- GENERATE QUESTION')
      
      state.questionIndex++
      state.progress = `${state.questionIndex} / ${questionList.length}`
      question = questionList[state.questionIndex]
      
      //~ HERE IS WHERE TO SEND DATA TO HEROKU SERVER
      
      if(!question){


      
        return {
          ...state,
          questionIndex: questions.length,
          finished: true
        }
      }
      
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      state.response_question = question[0]
      state.response_type = question[1]

    }
    

    state.grid = generateDotGrid(state.baseline)
    wordlist = generateWordList(state.baseline)
    isMatch = true

  }


  if(phase == 3){
    if(Math.random() >= .5){
      state.grid = changeOneDot(state.grid)
      wordlist = chageOneWord(wordlist)
      isMatch = false
    }    
  }


  return{
    ...state,
    phase,
    wordlist,
    isMatch,
    question,
    responses,
  }
}

//-----------------------------------------------------------------------------
const checkAnswer = (state, b) => {
  // console.log('answer:', b ? 'true' : 'false')

  state.response_answer = b

  if(state.type === 3){
    state.response_match = b
    state.responses.push({
      type: state.response_type,
      question: state.response_question,
      answer: state.response_answer,
      match: null
    })
  }

  return nextPhase(state)
}

//-----------------------------------------------------------------------------
const checkMatch = (state, b) => {
  // console.log('check match for response', state.responses.length)

  if(state.baselineTest){
    if(b === state.isMatch){
      // console.log('next baseline---')

      state.baseline++
      return nextPhase(state)
    }else{
      // console.log('test ---')

      state.baselineTest = false
      state.responses = []
      return nextPhase(state)
    }
  }else{

    
    // console.log('match:', b === state.isMatch ? 'correct' : 'incorrect')
    
    state.response_match = b
    state.responses.push({
      type: state.response_type,
      question: state.response_question,
      answer: state.response_answer,
      match: state.response_match
    })
    
    return nextPhase(state)
  }
}












//+ ///////////////////////////////////////////////////////////////////  R E D U C E R
//+ ///////////////////////////////////////////////////////////////////////////////////
//+   Any functions that directly affect the state without complex 
//+   computations should call dispatch directly and logic handled 
//+   within the reducer

export const globalReducer = (state = defaultState, action) => {
  switch (action.type) {

    case 'init': return initializeApp(state)
    case 'start': return startTesting(state)
    case 'next-phase': return nextPhase(state)
    case 'check-answer': return checkAnswer(state, action.payload)
    case 'check-match': return checkMatch(state, action.payload)






    

    default: return state;
  }
};
