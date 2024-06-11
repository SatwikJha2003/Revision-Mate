import './App.css';
import React from "react";
import axios from "axios"; 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      question_side: true,
      shuffled: false,
      index: 0
    }
  }

  componentDidMount() {
    // Get question and answers from Django
    axios.get("/revise/flashcards")
         .then((response) => {
            var cards = response.data;
            for (var i = 0; i < cards.length; i++) {
              var random_i = Math.floor(Math.random() * (i+1));
              var temp = cards[i];
              cards[i] = cards[random_i];
              cards[random_i] = temp;
            }
            this.setState({ cards });
            console.log(cards[0])
         });
  }

  // Function to shuffle cards array
  Shuffle = () => {
    for (var i = 0; i < this.state.cards.length; i++) {
      var random_i = Math.floor(Math.random() * (i+1));
      var temp = this.state.cards[i];
      this.state.cards[i] = this.state.cards[random_i];
      this.state.cards[random_i] = temp;
    }
    this.setState({shuffled: !this.state.shuffled})
  }

  // Function to change state of question_side to flip flashcard
  Flip = () => {
      this.setState({question_side: !this.state.question_side});
  }

  // Got to next question
  GoNext = () => {
    this.setState({index: (this.state.index + 1) % this.state.cards.length});
  }

  // Go to previous question
  GoPrevious = () => {
    this.setState({index: (this.state.index - 1 + this.state.cards.length) % this.state.cards.length});
  }

  render() {
    return (
      <div>
        <div onClick={this.Shuffle}>shuffle</div>
        <div onClick={this.Flip} className={"flashcard" +  (this.state.question_side ? "-question":"-answer")}>
          <div className="flashcard" key="{this.state.cards.length && this.state.cards[this.state.index].id}">
            <div className="question-side">{this.state.cards.length && this.state.cards[this.state.index].question}</div>
            <div className="answer-side">{this.state.cards.length && this.state.cards[this.state.index].answer}</div>
          </div>
        </div>
        <div onClick={this.GoNext}>next</div>
        <div onClick={this.GoPrevious}>previous</div>
      </div>
    );
  }
}

export default App;

{/*<div onClick={this.shuffle}>shuffle</div>
<div onClick={this.flip} className={"flashcard" +  (this.state.question_side ? "-question":"-answer")}>
  {this.state.cards.map((card) => {
    return(
      <div className="flashcard" key="{card.id}">
        <div className="question-side">{card.question}</div>
        <div className="answer-side">{card.answer}</div>
      </div>
    )
  })}
</div>*/}