import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import fiveLetterWords from './fiveletterwords.json';

const LetterState = {
    AVAILABLE: 'available',
    FOUND: 'found',
    RULEDOUT: 'ruledout'
}

function Letter(props) {

    if (props.letterState === LetterState.AVAILABLE) {
        return (
            <button className="letterAVAILABLE" onClick={props.onClick}>
                {props.value}
            </button>
        );
    }
    else if (props.letterState === LetterState.RULEDOUT)  {
        return (
            <button className="letterRULEDOUT" onClick={props.onClick}>
                {props.value}
            </button>
        );
    }
    else {
        return (
            <button className="letterFOUND" onClick={props.onClick}>
                {props.value}
            </button>
        );
    }
}

class Board extends React.Component {

    renderLetter(i) {
        return (
            <Letter
                value={this.props.alphabet[i]}
                letterState={this.props.letterState[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderLetter(0)}
                    {this.renderLetter(1)}
                    {this.renderLetter(2)}
                    {this.renderLetter(3)}
                    {this.renderLetter(4)}
                    {this.renderLetter(5)}
                    {this.renderLetter(6)}
                    {this.renderLetter(7)}
                    {this.renderLetter(8)}
                    {this.renderLetter(9)}
                    {this.renderLetter(10)}
                    {this.renderLetter(11)}
                    {this.renderLetter(12)}
                    {this.renderLetter(13)}
                    {this.renderLetter(14)}
                    {this.renderLetter(15)}
                    {this.renderLetter(16)}
                    {this.renderLetter(17)}
                    {this.renderLetter(18)}
                    {this.renderLetter(19)}
                    {this.renderLetter(20)}
                    {this.renderLetter(21)}
                    {this.renderLetter(22)}
                    {this.renderLetter(23)}
                    {this.renderLetter(24)}
                    {this.renderLetter(25)}       
                </div>
            </div>
        );
    }
}


class Game extends React.Component {

    constructor(props) {
        super(props);

        //https://stackoverflow.com/questions/31272207/to-call-onchange-event-after-pressing-enter-key
        this.updateInputValue = this.updateInputValue.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        var allwords = Object.keys(fiveLetterWords);
        var wordidx = Math.floor(Math.random() * allwords.length);

        var mytarget = allwords[wordidx];
        while (!this.isLegalWord(mytarget)) {
            wordidx = Math.floor(Math.random() * allwords.length);
            mytarget = allwords[wordidx];
        }

        this.state = {
            alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            target: mytarget,
            letterState: Array(26).fill(LetterState.AVAILABLE),
            currentGuess: '',
            history: [],
            winner: false,
            showWarning: false
        };
    }

    handleClick(i) {
        let letterState = this.state.letterState.slice();

        if (letterState[i] === LetterState.AVAILABLE) {
            letterState[i] = LetterState.RULEDOUT;
        }
        else if (letterState[i] === LetterState.RULEDOUT) {
            letterState[i] = LetterState.FOUND;
        }
        else {
            letterState[i] = LetterState.AVAILABLE;
        }

        this.setState({
            alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            letterState: letterState
        });
    }

    getRuledOutList() {
        const alphachars = this.state.alphabet.slice();
        let ruledoutchars = [];
        let i = 0;
        this.state.letterState.forEach(function(letterState) {
            if (letterState === LetterState.RULEDOUT) {
               ruledoutchars.push(alphachars[i])
            }
            i++;
          });

          return ruledoutchars.join();
    }


    getFoundList() {
        const alphachars = this.state.alphabet.slice();
        let foundchars = [];
        let i = 0;
        this.state.letterState.forEach(function(letterState) {
            if (letterState === LetterState.FOUND) {
                foundchars.push(alphachars[i])
            }
            i++;
          });

          return foundchars.join();
    }

    handleKeyDown(e) {
        //console.log('do validate of '+e.key);
        if (e.key === 'Enter') {
            //console.log('Enter, validate '+this.state.currentGuess);
            this.onSubmit();
        }
        else {
            if (this.state.showWarning) {
                this.setState({
                    showWarning: false
                })
            }
        }
    }

    updateInputValue(evt) {
        //console.log('uiv: '+evt.target.value);

        var currentGuess = '';

        //if (/[a-z]/.test(evt.target.value)) {
            currentGuess = evt.target.value;
        //}

        this.setState({
            currentGuess: currentGuess
        });
    }

    charRepeats = function(str) {
        for (var i=0; i<str.length; i++) {
          if ( str.indexOf(str[i]) !== str.lastIndexOf(str[i]) ) {
            return true; // repeats
          }
        }
      return false;
    }
    
    isLegalWord(word) {
        if (word.length !== 5) {
            return false;
        }

        if (/[a-z]/.test(word)) {

            // now look through our dictionary
            if (fiveLetterWords[word]) {
                if (!this.charRepeats(word)) {
                    return true;
                }
            }
        }

        return false;
    }

    isLegalGuess(word) {
        if (word.length !== 5) {
            return false;
        }

        if (/[a-z]/.test(word)) {

            // now look through our dictionary
            if (fiveLetterWords[word]) {
                return true;
            }
        }

        return false;
    }

    onSubmit() {
        console.log("Current guess: "+this.state.currentGuess);
        const currentGuess = this.state.currentGuess.toLowerCase();
        const history = this.state.history.slice();
        
        if (this.state.winner === true) {
            return;
        }

        if (currentGuess === this.state.target) {
            this.setState({
                winner: true
            });
        }

        if (this.isLegalGuess(currentGuess)) {

            // compute the number of characters that match the target word
            const target = this.state.target;
            let count = 0;

            for (var i = 0; i < 5; i++) {
                const testchar = currentGuess.charAt(i);
                if (target.indexOf(testchar) >= 0) {
                    count++;
                }
              }
            //should I be using object.assign here? seems like simply setting the part of the state that changed works
            this.setState({
                history: history.concat([{
                    guess: currentGuess,
                    count: count
                }]),
                currentGuess: ''
            });
        }
        else {
            // splash up a warning
            this.setState({
                showWarning: true
            })
        }
    }

    render() {
        const history = this.state.history;
        const lastGuess = history[history.length-1] ? history[history.length-1].guess : '';

        const guesses = history.map((guess) =>
            <li key={guess.guess}><b>{guess.guess}</b> {guess.count}</li>
        );

        //<button type="button" disabled={this.state.winner} onClick={this.onSubmit} className="btn">Submit</button>
        const nextguessunlessover = (lastGuess === this.state.target) ? <div className="winner-text">WINNER!</div> :
            <div>
                <input type="text" value={this.state.currentGuess} onChange={this.updateInputValue} onKeyDown={this.handleKeyDown} />
                { this.state.showWarning ? <text className="warning-text">Invalid word</text> : null }
            </div>

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        alphabet={this.state.alphabet}
                        letterState={this.state.letterState}
                        onClick={(i) => this.handleClick(i)}
                    />
                    <div className="guess-status">
                        <table>
                            <col width="100"/>
                            <col width="80"/>
                            <tr>
                                <td><div className="letter-info">Ruled Out</div></td>
                                <td>{this.getRuledOutList()}</td>
                            </tr>
                            <tr>
                                <td><div className="letter-info">Discovered</div></td>
                                <td><div className="found-letter-info">{this.getFoundList()}</div></td>
                            </tr>
                        </table>
                    </div>

                    <div className="game-info">
                        <div>Word Guesses</div>
                        <ul>{guesses}</ul>
                        <div>{nextguessunlessover}</div>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  