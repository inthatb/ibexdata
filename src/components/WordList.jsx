import * as React from 'react'
import { connector } from '../store/connector'

const WordList = props => {

    return(
        <div id='grid'>
            {props.wordlist.map(x => <p className='list-item' key={x}>{x}</p>)}
        </div>
    )
}

export default connector(WordList)