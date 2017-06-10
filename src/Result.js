import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classnames from 'classnames'

import { Loader, Container, Divider } from 'semantic-ui-react'
import './Result.css'

const TO_ANSWER_GROUPS = require('.//GROUP_DEFINITION.json')
const END_POINT = 'https://gwvxd5rut2.execute-api.ap-northeast-1.amazonaws.com/prod/PinShunLittleTest'

class AnswerRow extends React.Component {
	static propTypes = {
		deviceId: PropTypes.string.isRequired,
		createdAt: PropTypes.string.isRequired,
		groups: PropTypes.array.isRequired,
		defs: PropTypes.array.isRequired
	}

	renderTokens (tokens, answers, tokenGroup) {
		// mark all the items at group 2
		return tokens.map((token, idx) => {
			return <span key={idx} className={classnames('an-token', {
				'is-non-standard': tokenGroup.NONE_STANDARD.indexOf(token)>-1,
				'matched-answer': answers.indexOf(token)>-1,
			})}>
				{token}
			</span>
		})
	}

	renderAnswers (tokens, answers, tokenGroup) {
		// mark all the items at group 2
		return answers.map((answer, idx) => {
			return <span
				key={idx}
				className={classnames('an-token', {
					'is-non-standard': tokenGroup.NONE_STANDARD.indexOf(answer)>-1,
					'matched-answer': tokens.indexOf(answer)>-1,
					'dismatched-answer': tokens.indexOf(answer)<0,
				}
			)}>
				{answer}
			</span>
		})
	}

	renderStatistic (tokens, answers, tokenGroup) {
		let numCorrectStandard = 0,
			numCorrectNonStandard = 0,
			numWrong = 0,
			wrongAnswerTokens = []

		answers.forEach(answer => {
			let isTokenFound = false
			if (tokenGroup.STANDARD.indexOf(answer)>-1) {
				numCorrectStandard += 1
				isTokenFound = true
			}
			if (tokenGroup.NONE_STANDARD.indexOf(answer)>-1) {
				numCorrectNonStandard += 1
				isTokenFound = true
			}
			if ( !isTokenFound) {
				numWrong += 1
				wrongAnswerTokens.push(answer)
			}
		})

		return <ul>
			<li>答對數：{numCorrectStandard} / {numCorrectNonStandard}</li>
			<li>答錯數：{numWrong}</li>
			<li>錯誤答案串：{wrongAnswerTokens.length ? wrongAnswerTokens.join(', ') : '-'}</li>
		</ul>
	}

	render () {
		const props = this.props

		return (<div>
			<ul>
				<li>createdAt: {moment.utc(props.createdAt).local().format('YYYY-MM-DD HH:mm:ss')}</li>

				{props.groups.map((group, groupIdx) => {
					let tokenGroup = props.defs[groupIdx].tokenGroups[group.choosenTokenGroup]
					return (
				        <li key={groupIdx}>
							<dl>
								<dt>題目</dt>
								<dd>{this.renderTokens(group.tokens, group.answers, tokenGroup)}</dd>

								<dt>回答</dt>
								<dd>{this.renderAnswers(group.tokens, group.answers, tokenGroup)}</dd>

								<dt>統計</dt>
								<dd>{this.renderStatistic(group.tokens, group.answers, tokenGroup)}</dd>
							</dl>
						</li>
					)
				})}
			</ul>
		</div>)
	}
}

export default class Result extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			fetchState: 'FETCHING',
			result: null
		}
	}

	componentDidMount () {
		this.fetchAll()
	}

	fetchAll () {
		this.setState({fetchState: 'FETCHING'})

		fetch(END_POINT, {
			method: 'GET'
		})
		.then((res) => { return res.json()})
		.then((res) => {
			// make Items in order
			res.Items = res.Items.sort((a, b) => {
				return moment(b.createdAt)-moment(a.createdAt)
			})

			this.setState({
				fetchState: 'DONE',
				result: res
			})
		})
	}

	render () {
		const {result} = this.state

		return (
			<Container>
				{this.state.fetchState==='FETCHING' && <Loader size="huge" active={true}></Loader>}

				{result && result.Items.map((item) => {
					return <div key={item.id} >
						<AnswerRow {...item} defs={TO_ANSWER_GROUPS}/>
						<Divider></Divider>
					</div>
				})}
			</Container>

		)
	}
}