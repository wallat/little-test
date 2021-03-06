import React from 'react'
import { render } from 'react-dom'
import './index.css'
import '../semantic/dist/semantic.min.css';

import Exame from './Exame.js'
import Result from './Result.js'
import { Route, HashRouter } from 'react-router-dom'

let TO_ANSWER_GROUPS = require('.//GROUP_DEFINITION.json')

render(
	<HashRouter>
		<div>
			<Route exact path="/" component={() => <Exame groups={TO_ANSWER_GROUPS}></Exame>}/>
			<Route path="/result" component={Result}/>
		</div>
	</HashRouter>,
	document.getElementById('root')
)
