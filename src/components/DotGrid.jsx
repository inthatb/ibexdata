import * as React from 'react'
import { connector } from '../store/connector'

const Dot = ({x}) => <div className={x == 0 ? 'dot-light' : 'dot-dark'} />

const DotGrid = props => {
    
    return(
        <div id='grid'>
            <div>
                <Dot x={props.grid[0]} />
                <Dot x={props.grid[1]} />
                <Dot x={props.grid[2]} />
                <Dot x={props.grid[3]} />
                <Dot x={props.grid[4]} />
            </div>
            <div>
                <Dot x={props.grid[5]} />
                <Dot x={props.grid[6]} />
                <Dot x={props.grid[7]} />
                <Dot x={props.grid[8]} />
                <Dot x={props.grid[9]} />
            </div>
            <div>
                <Dot x={props.grid[10]} />
                <Dot x={props.grid[11]} />
                <Dot x={props.grid[12]} />
                <Dot x={props.grid[13]} />
                <Dot x={props.grid[14]} />
            </div>
            <div>
                <Dot x={props.grid[15]} />
                <Dot x={props.grid[16]} />
                <Dot x={props.grid[17]} />
                <Dot x={props.grid[18]} />
                <Dot x={props.grid[19]} />
            </div>
            <div>
                <Dot x={props.grid[20]} />
                <Dot x={props.grid[21]} />
                <Dot x={props.grid[22]} />
                <Dot x={props.grid[23]} />
                <Dot x={props.grid[24]} />
            </div>
            {/* <div>{props.grid.slice(0,5).map((x,i) => <Dot x={x} />)}</div>
            <div>{props.grid.slice(5,10).map(x => <Dot x={x} />)}</div>
            <div>{props.grid.slice(10,15).map(x => <Dot x={x} />)}</div>
            <div>{props.grid.slice(15,20).map(x => <Dot x={x} />)}</div>
            <div>{props.grid.slice(20,25).map(x => <Dot x={x} />)}</div> */}
        </div>
    )
}

export default connector(DotGrid)