import React from 'react'
import PropTypes from 'prop-types'
import { Header, Button, Form, Icon } from 'semantic-ui-react'

// Class for handle countdown style steps
class SecCountDownComponent extends React.Component {
	static propTypes = {
		secs: PropTypes.number.isRequired,
		onFinished: PropTypes.func
	}

	constructor (props) {
		super(props)
		this.state = {}
	}

	startTick () {
		this.setState({
			secsToGo: this.props.secs + 1
		}, () => {
			this.nextTick()
		})
	}

	nextTick () {
		let nextSecsToGo = this.state.secsToGo - 1
		if (nextSecsToGo) {
			this.setState({secsToGo: nextSecsToGo})

			this.timeoutHandler = setTimeout(() => {
				this.nextTick()
			}, 1000)
		} else {
			this.endTick()
		}
	}

	endTick () {
		if (this.timeoutHandler) {
			clearTimeout(this.timeoutHandler)
		}

		this.props.onFinished()
	}
}

class ExplainNButton extends React.Component {
	static propTypes = {
		pageTitle: PropTypes.string.isRequired,
		buttonText: PropTypes.string,
		onClick: PropTypes.func.isRequired
	}

	render () {
		return (
			<div className="text-block-wrapper">
				<div className="container">
					<Header size="huge">{this.props.pageTitle}</Header>
					<Button
						primary={true}
						style={{marginTop: "20px"}}
						onClick={this.props.onClick}>{this.props.buttonText || 'NEXT'}</Button>
				</div>
			</div>
		)
	}
}

class ExplainNCountDown extends SecCountDownComponent {
	static propTypes = {
		pageTitle: PropTypes.string.isRequired,
		onFinished: PropTypes.func.isRequired,
		secs: PropTypes.number,
	}

	componentDidMount () {
		this.startTick()
	}

	render () {
		return (
			<div className="text-block-wrapper">
				<div className="container">
					<Header size="huge">{this.props.pageTitle}</Header>
					<div>{this.state.secsToGo}</div>
				</div>
			</div>
		)
	}
}

class SlideShows extends React.Component {
	static propTypes = {
		tokens: PropTypes.array.isRequired,
		secsForEachToken: PropTypes.number,
		onFinished: PropTypes.func.isRequired
	}

	constructor (props) {
		super(props)
		this.state = {}
	}

	componentDidMount () {
		this.startTick()
	}

	startTick () {
		this.setState({
			numTokens: this.props.tokens.length,
			currTokenIdx: -1
		}, () => {
			this.nextTick()
		})
	}

	nextTick () {
		let tickInterval = this.props.secsForEachToken || 1
		let nextTokenIdx = this.state.currTokenIdx+1

		if (nextTokenIdx>=this.state.numTokens) {
			this.endTick()
		} else {
			this.setState({
				currTokenIdx: nextTokenIdx
			})

			setTimeout(() => {
				this.nextTick()
			}, tickInterval*1000)
		}
	}

	endTick () {
		this.props.onFinished()
	}

	render () {
		const {tokens} = this.props
		const {numTokens, currTokenIdx} = this.state

		return (
			<div className="text-block-wrapper">
				<div className="container">
					<div>{currTokenIdx+1}/{numTokens}</div>
					<Header size="huge">{tokens[currTokenIdx]}</Header>
				</div>
			</div>
		)
	}
}

class AnswerPage extends SecCountDownComponent {
	static propTypes = {
		pageTitle: PropTypes.string.isRequired,
		secs: PropTypes.number,
		onAnswerChange: PropTypes.func.isRequired,
		onFinished: PropTypes.func.isRequired
	}

	componentDidMount () {
		this.startTick()
	}

	render () {
		return (
			<div className="text-page-wrapper">
				<div className="container">
					<Header>{this.props.pageTitle}</Header>

					<Form className="answer-form">
						<Form.TextArea
							placeholder='每一行寫一個答案'
							onChange={(e) => {
								this.props.onAnswerChange(e.target.value)
							}}/>

						<Button onClick={(e) => {
							e.preventDefault()
							this.endTick()
						}} primary={true}>Done - {this.state.secsToGo}</Button>
					</Form>
				</div>
			</div>
		)
	}
}

class CountDownTimer extends SecCountDownComponent {
	static propTypes = {
		secs: PropTypes.number,
		onFinished: PropTypes.func.isRequired
	}

	componentDidMount () {
		this.startTick()
	}

	render () {
		const {secsToGo} = this.state

		return (
			<div className="text-block-wrapper">
				<div className="container">
					<Header size="huge">{secsToGo}</Header>
				</div>
			</div>
		)
	}
}

class ThankYouPage extends React.Component {
	static propTypes = {
		saveStatus: PropTypes.string.isRequired
	}

	render () {
		const {saveStatus} = this.props

		return (
			<div className="text-block-wrapper">
				<div className="container">
					<Header size="huge">非常謝謝你的參與！你的一小步，是我們遠離二一的一大步！</Header>

					{saveStatus==='SAVING' &&
						<Header className="result-message" size="medium">
							<Icon name="spinner" loading={true} color="orange" size="medium"/>
							<span>上傳中</span>
						</Header>
					}
					{saveStatus==='DONE' &&
						<Header className="result-message" size="medium" color="green">
							<Icon name="check" color="green" size="medium"/>
							<span>上傳完成！</span>
						</Header>
					}
					{saveStatus==='ERROR' &&
						<Header className="result-message" size="medium" color="red">
							<Icon name="exclamation circle" color="red" size="medium"/>
							<span>上傳失敗 QQ</span>
						</Header>
					}
				</div>
			</div>
		)
	}
}

export {ExplainNButton, ExplainNCountDown, SlideShows, AnswerPage, CountDownTimer, ThankYouPage}