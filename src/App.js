import React from 'react'

import './App.css'

import { Header, Button, Form } from 'semantic-ui-react'

let TOKENS = [
	"保齡球", "健美", "劍道", "合氣道", "吊環", "單槓", "地板操", "壘球", "射箭", "巧固球", "平衡木", "手球", "拳擊", "排球", "撐竿跳", "撞球", "擊劍", "曲棍球", "柔道", "桌球", "棒球", "標槍", "橄欖球", "水球", "游泳", "溜冰", "溜冰鞋A", "滑冰", "滑水", "滑草", "滑雪", "空手道", "籃球", "網球", "美式足球", "羽球", "自由車", "舉重", "蛙鏡", "角力", "賽跑", "足球", "跆拳道", "跨欄", "跳水", "跳箱", "跳遠", "跳馬", "跳高", "鉛球", "鏈球", "鐵餅", "雙槓", "雪車", "鞍馬", "韻律體操", "風浪板", "飛盤", "馬術", "馬表", "高低槓", "高爾夫",
]

let NUM_TOKENS_PER_TIME = 8
let TICK_INTERVAL = 1.5 // in secs

/**
 * Little helper function to shuffle an array
 * @param  {array} array
 * @return {array} Shuffleed array
 */
function shuffleArray(array) {
	let counter = array.length;

	while (counter > 0) {
	    let index = Math.floor(Math.random() * counter)

	    counter--

	    let temp = array[counter]
	    array[counter] = array[index]
	    array[index] = temp
	}

	return array;
}

class App extends React.Component {
	constructor (props) {
		super(props)

		this.tokens = TOKENS
		this.numTokensPerRound = NUM_TOKENS_PER_TIME
		this.tickInterval = TICK_INTERVAL

		this.state = {
			currTokenIdx: 0,
			currToken: null,
			answer: '',

			currStep: 'WAITING_TO_START' // WAITING_TO_START, SHOWING, ANSWERING, SHOW_RESULT
		}
	}

	chooseRandomTokens () {
		let candidateTokens = shuffleArray(this.tokens.slice(0))
		candidateTokens = candidateTokens.slice(0,  this.numTokensPerRound)

		return candidateTokens
	}

	startTick () {
		this.candidateTokens = this.chooseRandomTokens()

		this.setState({
			currTokenIdx: 0,
			currToken: this.candidateTokens[0]
		})

		setTimeout(() => {
			this.nextTick()
		}, this.tickInterval*1000)
	}

	nextTick () {
		let nextTokenIdx = this.state.currTokenIdx+1

		if (nextTokenIdx>=this.candidateTokens.length) {
			this.endTick()
		} else {
			this.setState({
				currTokenIdx: nextTokenIdx,
				currToken: this.candidateTokens[nextTokenIdx]
			})

			setTimeout(() => {
				this.nextTick()
			}, this.tickInterval*1000)
		}
	}

	endTick () {
		this.setState({
			currStep: 'ANSWERING'
		})
	}

	handleClickAnserDone () {
		this.setState({
			currStep: 'SHOW_RESULT'
		})
	}

	render () {
		if (this.state.currStep==='WAITING_TO_START') {
			return (
				<div className="text-block-wrapper">
					<Header size="huge">It's just a little test </Header>
					<Button onClick={() => {
						this.setState({currStep: 'SHOWING'})
						this.startTick()
					}}>Start</Button>
				</div>
			)
		}

		if (this.state.currStep==='SHOWING') {
			return (
				<div className="text-block-wrapper">
					<div>{this.state.currTokenIdx+1}/{this.numTokensPerRound}</div>
					<Header size="huge">{this.state.currToken}</Header>
				</div>
			)
		}

		if (this.state.currStep==='ANSWERING') {
			return (
				<div className="text-page-wrapper">
					<Header>Your answer</Header>
					<p>Explain goes to here</p>

					<Form className="answer-form">
						<Form.TextArea
							label='What do you remember?'
							placeholder='One line for one token'
							onChange={(e) => {
								this.setState({answer: e.target.value})
							}}/>

						<Form.Input
							label="Name"
							onChange={(e) => {
								this.setState({name: e.target.value})
							}}
						/>

						<Form.Input
							label="Age"
							type="number"
							onChange={(e) => {
								this.setState({age: e.target.value})
							}}
						/>

						<Button onClick={(e) => {
							e.preventDefault()
							this.handleClickAnserDone()
						}} primary={true}>Done</Button>
					</Form>
				</div>
			)
		}

		if (this.state.currStep==='SHOW_RESULT') {
			return (
				<div className="text-page-wrapper">
					<p>Thank you. {this.state.name} ({this.state.age})</p>

					<Header size="large">Displayed</Header>
					<div className="">
						{this.candidateTokens.map((s) => {
							return <div>{s}</div>
						})}
					</div>

					<Header size="large">You Answered</Header>
					<div className="">
						{this.state.answer.split("\n").map((s) => {
							return <div>{s}</div>
						})}
					</div>
				</div>
			)
		}
	}
}

export default App
