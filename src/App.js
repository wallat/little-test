import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import guid from 'guid'
import store from 'store'
import 'whatwg-fetch'
import {ExplainNButton, ExplainNCountDown, SlideShows, AnswerPage, CountDownTimer, ThankYouPage} from './steps.js'
import './App.css'

const END_POINT = 'https://gwvxd5rut2.execute-api.ap-northeast-1.amazonaws.com/prod/PinShunLittleTest'

class App extends React.Component {
	static propTypes = {
		groups: PropTypes.array.isRequired
	}

	constructor (props) {
		super(props)

		this.goNextStep = this.goNextStep.bind(this)

		// resolve deviceId
		let deviceId = store.get('deviceId')
		if ( !deviceId) {
			deviceId = guid.raw()
			store.set('deviceId', deviceId)
		}

		this.state = {
			testId: guid.raw(),
			deviceId: deviceId,
			groups: this.props.groups,
			userAnswers: [],
			saveStatus: 'SAVING'
		}
	}

	componentDidMount () {
		this.resolveTokens()
		this.goNextStep()
	}

	goNextStep() {
		const {currStep, groupIdx, groupStep, groups} = this.state

		if (currStep==='INTRO_PAGE') {
			this.setState({
				currStep: 'GROUPS',
				groupIdx: 0,
				groupStep: 'START_PAGE'
			})
		} else if (currStep==='THANK_YOU') {
			return null
		} else if (currStep==='GROUPS') {
			if (groupStep==='START_PAGE') {
				this.setState({groupStep: 'COUNT_DOWN'})
			} else if (groupStep==='COUNT_DOWN') {
				this.setState({groupStep: 'SLIDE_SHOW'})
			} else if (groupStep==='SLIDE_SHOW') {
				this.setState({groupStep: 'BEFORE_ANSER_PAGE'})
			} else if (groupStep==='BEFORE_ANSER_PAGE') {
				this.setState({groupStep: 'ANSER_PAGE'})
			} else if (groupStep==='ANSER_PAGE') {
				if (groupIdx<groups.length-1) { // has next
					this.setState({
						currStep: 'GROUPS',
						groupIdx: groupIdx+1,
						groupStep: 'START_PAGE'
					})
				} else {
					this.save() // save to server !
					this.setState({
						currStep: 'THANK_YOU'
					})
				}
			}
		} else {
			this.setState({
				currStep: 'INTRO_PAGE'
			})
		}
	}

	// choose which group to show and randomize the sequences
	resolveTokens () {
		let {groups} = this.state

		groups.forEach((group, idx) => {
			let tokenGroups = group.tokenGroups
			let randomTokenGroupIdx = Math.floor(Math.random()*tokenGroups.length)

			groups[idx].choosenTokenGroup = randomTokenGroupIdx

			groups[idx].tokens = [].concat(
               tokenGroups[randomTokenGroupIdx].STANDARD,
               tokenGroups[randomTokenGroupIdx].NONE_STANDARD)

			groups[idx].tokens = _.shuffle(groups[idx].tokens)
		})
	}

	// save result to the server
	save () {
		const state = this.state

		this.setState({saveStatus: 'SAVING'})

		// prepare groups
		const groups = state.groups
		let postGroups = []
		groups.forEach((group, idx) => {
			let answers = state.userAnswers[idx] || ''

			postGroups.push({
				tokens: group.tokens,
				answers: _.words(answers),
				choosenTokenGroup: group.choosenTokenGroup
			})
		})

		// prepare post body
		let postBody = {
			"Item": {
				id: state.testId,
				deviceId: state.deviceId,
				groups: postGroups
			}
		}

		console.log('post', postBody)
		console.log('json', JSON.stringify(postBody))

		fetch(END_POINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postBody)
		})
		.then((res) => { return res.json()})
		.then((res) => {
			console.log(res)
			this.setState({saveStatus: 'DONE'})
		})
		.catch((error) => {
			console.log(error)
			this.setState({saveStatus: 'ERROR'})
		})
	}

	render () {
		const {currStep, groupIdx, groupStep, groups} = this.state

		if (currStep==='INTRO_PAGE') {
			return <ExplainNButton
				pageTitle="謝謝你的參與，以下測驗會需要你記住一串水果/蔬菜，並且在一分鐘內回答記住的詞。"
				buttonText="準備好了"
				onClick={this.goNextStep}
			/>
		}

		if (currStep==='GROUPS') {
			let targetGroup = groups[groupIdx]

			if (groupStep==='START_PAGE') {
				return <ExplainNButton
					pageTitle={targetGroup.startPage.titleText}
					buttonText={targetGroup.startPage.buttonText}
					onClick={this.goNextStep}
				/>
			} else if (groupStep==='COUNT_DOWN') {
				return <CountDownTimer
					secs={3}
					onFinished={this.goNextStep}
				/>
			} else if (groupStep==='SLIDE_SHOW') {
				return <SlideShows
					tokens={targetGroup.tokens}
					secsForEachToken={1}
					onFinished={this.goNextStep}
				/>
			} else if (groupStep==='BEFORE_ANSER_PAGE') {
				return <ExplainNCountDown
					secs={5}
					pageTitle={targetGroup.beforeAnswerPage.titleText}
					onFinished={this.goNextStep}
				/>
			} else if (groupStep==='ANSER_PAGE') {
				return <AnswerPage
					secs={60}
					pageTitle={targetGroup.answerPage.titleText}
					onAnswerChange={(answer) => {
						let userAnswers = this.state.userAnswers
						userAnswers[groupIdx] = answer
						this.setState({userAnswers: userAnswers})
					}}
					onFinished={this.goNextStep}
				/>
			}
		}

		if (currStep==='THANK_YOU') {
			return <ThankYouPage
				saveStatus={this.state.saveStatus}
			/>
		}

		return <div></div>
	}
}

export default App
