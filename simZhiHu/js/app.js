var MainComponent=React.createClass({
	getInitialState:function(){
		var questions=[
			{
        key: 1,
        title:'产品经理与程序员矛盾的本质是什么？',
        description:'理性探讨，请勿撕逼。产品经理的主要工作职责是产品设计。接受来自其他部门的需求，经过设计后交付研发。但这里有好些职责不清楚的地方。',
        voteCount: 10,
    },{
        key: 2,
        title:'热爱编程是一种怎样的体验？',
        description:'别人对玩游戏感兴趣，我对写代码、看技术文章感兴趣；把泡github、stackoverflow、v2ex、reddit、csdn当做是兴趣爱好；遇到重复的工作，总想着能不能通过程序实现自动化；喝酒的时候把写代码当下酒菜，边喝边想边敲；不给工资我也会来加班；做梦都在写代码。',
        voteCount: 8,
    }
		];
		return{
			questions:questions,
			isDisplayed:false,
		}
	},
	displayNewQuestion:function(question){
		question.key=this.state.questions.length+1;
		var _questions=this.state.questions;
		_questions.push(question);
		this.setState({
			questions:_questions,
		})
	},
	displayed:function(){
		this.setState({
			isDisplayed:!this.state.isDisplayed
		})
	},
	voteUp:function(key){
		var questions=this.state.questions;
		for(var i=0;i<questions.length;i++){
			if(questions[i].key==key){
				questions[i].voteCount+=1;
			}
		}
		this.sortQuestion();
		this.setState({
			questions:questions
		})
	},
	voteDown:function(key){
		var questions=this.state.questions;
		for(var i=0;i<questions.length;i++){
			if(questions[i].key==key){

				questions[i].voteCount=(questions[i].voteCount<=0?0:questions[i].voteCount-1);
			}
		}
		this.sortQuestion();
		this.setState({
			questions:questions
		})
	},
	sortQuestion:function(){
		var newQuestions=this.state.questions.sort(function(a,b){
			return b.voteCount-a.voteCount
		})
		this.setState({
			questions:newQuestions
		})
	},
	render:function(){
		return(
			<div>
			<div className="jumbotron text-center">
          <div className="container">
            <h1>React问答</h1>
          <AddFormBtn displayed={this.displayed}/>
          </div>
      </div>
      <div className="main container">
        <QuestionForm isDisplayed={this.state.isDisplayed} displayNewQuestion={this.displayNewQuestion}/>
        <QuestionList questions={this.state.questions} voteUp={this.voteUp} voteDown={this.voteDown}/>
      </div>
      </div>
			)
	}
});

var AddFormBtn=React.createClass({
	render:function(){
		return (<button id="add-question-btn" className="btn btn-success" onClick={this.props.displayed}>添加问题</button>)
	}
});
var QuestionForm=React.createClass({
	addQuestion:function(e){
		e.preventDefault();
		var qTitle=this.refs.title.value;
		if(!qTitle){
			throw new Error("标题不能为空"); 
		}
		var qDescription=this.refs.description.value;
		if(!qDescription){
			throw new Error("问题描述不能为空"); 
		}

		var newQuestion={
			title:qTitle,
			description:qDescription,
			voteCount:0
		};
		this.refs.questionForm.reset();
		this.props.displayNewQuestion(newQuestion);

	},
	render:function(){
		var style={display:this.props.isDisplayed?'block':'none'};
		return(<form name="addQuestion" className="clearfix" style={style} ref="questionForm" onSubmit={this.addQuestion}>
          <div className="form-group">
            <label for="qtitle">问题</label>
            <input type="text" className="form-control" id="qtitle" placeholder="您的问题的标题" ref="title"/>
          </div>
          <textarea className="form-control" rows="3" placeholder="问题的描述" ref="description"></textarea>
          <button className="btn btn-success pull-right">确认</button>
          <button className="btn btn-default pull-right">取消</button>
        </form>)
	}
});
var QuestionList=React.createClass({
	render:function(){
		var arr=this.props.questions;
		var _arr=arr.map(function(item){
		return <QuestionItem key={item.key} 
		questionKey={item.key} 
		title={item.title} 
		description={item.description} 
		voteCount={item.voteCount} 
		voteUp={this.props.voteUp}
		voteDown={this.props.voteDown}/>
		}.bind(this))
		return (
			<div id="questions" className="">
			{_arr}
			</div>
		)
	
	}
})
var QuestionItem=React.createClass({
	_voteUp:function(e){
			var key=this.props.questionKey;
			this.props.voteUp(key);
	},
	_voteDown:function(e){
		var key=this.props.questionKey;
			this.props.voteDown(key);
	},
	render:function(){
		return(<div className="media" >
            <div className="media-left" >
              <button className="btn btn-default" onClick={this._voteUp}>
                <span className="glyphicon glyphicon-chevron-up"></span>
                <span className="vote-count">{this.props.voteCount}</span>
              </button>
              <button className="btn btn-default" onClick={this._voteDown}>
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
})
ReactDOM.render(<MainComponent/>,document.getElementById('app'));