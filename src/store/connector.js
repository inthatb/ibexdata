import React, { Dispatch } from 'react';
import { connect } from 'react-redux';

const mapState = (state) => state;

const mapDispatch = (dispatch) => ({
    init:            () => dispatch({type: 'init'}),
    start:            () => dispatch({type: 'start'}),
    nextPhase:       () => dispatch({type: 'next-phase'}),
    checkAnswer:       (b) => dispatch({type: 'check-answer', payload: b}),
    checkMatch:       (b) => dispatch({type: 'check-match', payload: b}),
});

export const connector = (Component) => connect(mapState, mapDispatch)(Component)
