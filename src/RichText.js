import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DropdownItem, Label, Input,Dropdown, DropdownMenu, DropdownToggle,Badge } from 'reactstrap';
import './RichText.css'

function getProjects(keyword) {
    const allProjects = ['Personal', 'Shopping', 'Work', 'Errands'];
    const result = allProjects
        .filter(function(x) {
            return x.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
        });
    return result;
}


function getProjectsAsync(keyword) {
    const result = getProjects(keyword);
    const delay = Math.random() * 800 + 200; // delay 200~1000ms
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, delay, result);
    });
}


export class RichText extends Component{
    index=[]
    cursor=-1;
    constructor(props){
        super(props);
        this.state={text:'',dropDownSwich:false,asyncData:''};
        this.inputHandle=this.inputHandle.bind(this)
        this.dropDownSwich=this.dropDownSwich.bind(this)
        this.toggle=this.toggle.bind(this);
        this.selectAItem=this.selectAItem.bind(this)
        this.clickHandler=this.clickHandler.bind(this)
        this.indexCollector=this.indexCollector.bind(this)
    }

    toggle(){}

    inputHandle(e){
        this.setState({text:e.target.value})
        this.dropDownSwich(e);
        this.adjustInputHeight(e.target)

    }


    clickHandler(e){
        this.cursor=e.target.selectionEnd;
        for(var i=0;i<this.index.length-1;i++){
            if(e.target.selectionEnd>this.index[i]&&e.target.selectionEnd<this.index[i+1]&&i%2==0){
                console.log('clicked')
                this.setState({dropDownSwich:!this.state.dropDownSwich})
            }
        }
    }

    adjustInputHeight(target){
        setTimeout(()=>{
            if(target.scrollHeight>target.clientHeight){
                target.style.height=target.scrollHeight+2+'px';
            }
        },0);
    }

    indexCollector(index){
        this.index=index;
    }

    dropDownSwich(e){
        var str=e.target.value;
        if(str.includes('#')){
            this.setState({dropDownSwich:true})
            console.log('keyword',str.split('#')[1].split(' ')[0])
            getProjectsAsync(str.split('#')[1].split(' ')[0]).then(res=>{
                console.log('async data',res)
                this.setState({asyncData:res})
            })
        }else{
            this.setState({dropDownSwich:false})
        }
    }

    selectAItem(e){
        const name = e.target.innerText;
        if(this.state.text.includes('#')){
            this.setState({text:this.state.text.split('#')[0]+'$'+name+'$'+this.state.text.split('#')[1]});
            this.setState({dropDownSwich:false});
        }else{
            for(var i=0;i<this.index.length-1;i++){
                if(this.cursor>this.index[i]&&this.cursor<this.index[i+1]&&i%2==0){
                    this.setState({text:
                        this.state.text.substr(0,this.index[i]+1)+name+this.state.text.substr(this.index[i+1])})
                    this.setState({dropDownSwich:false});
                }
            }

        }

    }


    render(){
        const inputStyle={
            position:'absolute',
            height: '15vh',
            color:'transparent',
            'backgroundColor':'transparent',
            'caretColor':'black',
            'pointerEvents':'auto',
            'zIndex':'10'
    };

        const avaliableItems=this.state.asyncData.length>0?this.state.asyncData.map((each,i)=>{
            if(i===0){
                return <DropdownItem key={i} className="item" onClick={this.selectAItem}>{each}</DropdownItem>
            }else {
                return <DropdownItem key={i} className="item" onClick={this.selectAItem}>{each}</DropdownItem>
            }
        }):<DropdownItem>Not Found</DropdownItem>;

        return(
            <div>

                <Dropdown isOpen={this.state.dropDownSwich} toggle={this.toggle} >
                    <DropdownToggle
                        tag="span"
                        onClick={this.toggle}
                        data-toggle="dropdown"
                        aria-expanded={this.state.dropDownSwich}
                    >
                        <Label for="exampleText">Text Area</Label>
                        <div className="parentdiv">
                            <Input ref="input" type="textarea" style={inputStyle}
                                   onClick={this.clickHandler} onChange={this.inputHandle} value={this.state.text}/>
                            <Displayer text={this.state.text}  indexCollector={this.indexCollector}></Displayer>
                        </div>
                    </DropdownToggle>
                    <DropdownMenu className="width" >
                        {avaliableItems}
                    </DropdownMenu>
                </Dropdown>
            </div>)
    }
}

export class Displayer extends Component{
    constructor(props){
        super(props);
        this.textDecorator=this.textDecorator.bind(this);
    }



    textDecorator(text){
        if(text.indexOf('$')!=text.lastIndexOf('$')){
            var textRemain=text;
            var ls=[];
            var key=0;
            while(textRemain.indexOf('$')!=textRemain.lastIndexOf('$')){
                ls.push(textRemain.substr(0,textRemain.indexOf('$')))
                textRemain=textRemain.substr(textRemain.indexOf('$')+1);
                ls.push(<Badge key={key} className="badge" color="success" onClick={this.handleClick}>
                    <span className="transparentSpan">$</span>{textRemain.substr(0,textRemain.indexOf('$'))}
                    <span className="transparentSpan">$</span></Badge>)
                key++;
                textRemain=textRemain.substr(textRemain.indexOf('$')+1);
            }
            var count=2*key;
            var index=[];
            for(var i=text.indexOf('$');i<=text.lastIndexOf('$');i++){
                if(text[i]==='$'&&index.length<count){
                    index.push(i)
                }

            }
            this.props.indexCollector(index)
            if(textRemain){
                ls.push(textRemain);
            }
            return ls;


        }else{
            return text;
        }
    }

    render(){
        const {text}=this.props
        return(
            <pre className="displayer" >{this.textDecorator(text)}</pre>
        );
    }

}
