
var mainCom = ReactDOM.render(
	<QuestionApp />,
	document.getElementById('app')
)

var  QuestionApp= React.createClass({
	getInitialState:function(){
		var questions = [
			{
				key: 1,
				title:'产品经理与程序员矛盾的本质是什么？',
				description:'理性探讨，请勿撕逼。产品经理的主要工作职责是产品设计。接受来自其他部门的需求，经过设计后交付研发。但这里有好些职责不清楚的地方。',
				voteCount: 10,
			},
			{
				key: 2,
				title:'热爱编程是一种怎样的体验？',
				description:'别人对玩游戏感兴趣，我对写代码、看技术文章感兴趣；把泡github、stackoverflow、v2ex、reddit、csdn当做是兴趣爱好；遇到重复的工作，总想着能不能通过程序实现自动化；喝酒的时候把写代码当下酒菜，边喝边想边敲；不给工资我也会来加班；做梦都在写代码。',
				voteCount: 8,
			},
		];

		return {
			questions: questions,
			formDisplayed: false,
		}
	},
	onToggleForm:function(){
		this.setState({
			formDisplayed: !this.state.formDisplayed,
		})
	},
	onNewQuestion:function( newQuestion ){
		newQuestion.key = this.state.questions.length + 1;

		var newQuestions = this.state.questions.concat( newQuestion );

		newQuestions = this.sortQuestion( newQuestions );

		this.setState({
			questions: newQuestions,
		})
	},
	sortQuestion:function(questions){
		questions.sort(function(a,b){
			return b.voteCount - a.voteCount;
		});

		return questions;

	},
	onVote:function(key,newCount){
		var questions = _.uniq( this.state.questions );
		var index = _.findIndex( questions, function(qst){
			return qst.key == key;
		} )

		questions[index].voteCount = newCount;

		questions = this.sortQuestion(questions);

		this.setState({
			questions: questions
		})
	},
	render:function(){
		return (
		<div>
			<div className="jumbotron text-center">
			    <div className="container">
			      <h1>React 问答</h1>
			      <ShowAddButton onToggleForm={this.onToggleForm} />
			    </div>
			</div>
			<div className="main container">
			  <QuestionForm  
			  	onNewQuestion={this.onNewQuestion }
			  	onToggleForm={this.onToggleForm} 
			  	formDisplayed={this.state.formDisplayed } />
			  
			  <QuestionList onVote={this.onVote} questions={this.state.questions } />

			</div>
		</div>
		)
	}
})


var QuestionForm = React.createClass({
	handleForm:function(e){
		e.preventDefault();
		if(!this.refs.title.getDOMNode().value) return;

		var newQuestion = {
			title: this.refs.title.getDOMNode().value,
			description: this.refs.description.getDOMNode().value,
			voteCount: 0,
		}

		this.refs.addQuestionForm.getDOMNode().reset();

		this.props.onNewQuestion( newQuestion );
	},
	render:function(){
		var styleObj={
			display: this.props.formDisplayed ? 'block': 'none',
		}

		return (
			<form ref="addQuestionForm" style={ styleObj } name="addQuestion" className="clearfix" onSubmit={this.handleForm}>
			  <div className="form-group">
			    <label htmlFor="qtitle">问题</label>
			    <input ref="title" type="text" className="form-control" id="qtitle" placeholder="您的问题的标题" />
			  </div>
			  <textarea ref="description" className="form-control" rows="3" placeholder="问题的描述"></textarea>
			  <button className="btn btn-success pull-right">确认</button>
			  <a className="btn btn-default pull-right" onClick={this.props.onToggleForm}>取消</a>
			</form>
		)
	}
});
var QuestionItem= React.createClass({
	voteUp:function(e){

		var newCount = parseInt(this.props.voteCount ,10) + 1;
		this.props.onVote( this.props.questionKey, newCount )
	},
	voteDown:function(e){
		var newCount = parseInt(this.props.voteCount ,10) - 1;
		this.props.onVote( this.props.questionKey, newCount )
	},
	render:function(){
		return (
			<div className="media">
			  <div className="media-left">
			    <button className="btn btn-default" onClick={this.voteUp}>
			      <span className="glyphicon glyphicon-chevron-up"></span>
			      <span className="vote-count">{this.props.voteCount}</span>
			    </button>
			    <button className="btn btn-default"  onClick={this.voteDown}>
			      <span className="glyphicon glyphicon-chevron-down"></span>
			    </button>
			  </div>
			  <div className="media-body">
			    <h4 className="media-heading">{this.props.title}</h4>
			    <p>{this.props.description}</p>
			  </div>
			</div>
		)
	}
});



var QuestionList = React.createClass({
	render:function(){
		var questions = this.props.questions;
		if( !Array.isArray(questions) ) throw new Error('this.props.questions问题必须是数组');
		var questionComps = questions.map(function(qst){
			return <QuestionItem key={qst.key} 
				questionKey={qst.key}
				title={qst.title}
				description={qst.description}
				voteCount={qst.voteCount}
				onVote={ this.props.onVote }  />
		}.bind(this) );

		return (
			<div id="questions" className="">
			 {questionComps}
			</div>
		)
	}
})


var ShowAddButton = React.createClass({
	render:function(){
		return (
			<button id="add-question-btn" onClick={this.props.onToggleForm} className="btn btn-success">添加问题</button>
		)
	}
})