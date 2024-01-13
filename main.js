import React from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0";
const audio = document.getElementById("beep");
class App extends React.Component {
  constructor(props) {
    super(props);
    this.loop = undefined;
  }
  state = {
    breakCount: 5,
    sessionCount: 25,
    clockCount: 25 * 60,
    currentTimer: "Session",
    isPlaying: false
  };
  
  handlePlayPause = () => {
    const { isPlaying } = this.state;

    if (isPlaying) {
      clearInterval(this.loop);

      this.setState({
        isPlaying: false
      });
    } else {
      this.setState({
        isPlaying: true
      });

      this.loop = setInterval(() => {
        const {
          clockCount,
          currentTimer,
          breakCount,
          sessionCount
        } = this.state;

        if (clockCount === 0) {
          this.setState({
            currentTimer: currentTimer === "Session" ? "Break" : "Session",
            clockCount:
              currentTimer === "Session" ? breakCount * 60 : sessionCount * 60
          });

          audio.play();
        } else {
          this.setState({
            clockCount: clockCount - 1
          });
        }
      }, 1000);
    }
  };

  handleReset = () => {
    this.setState({
      breakCount: 5,
      sessionCount: 25,
      clockCount: 25 * 60,
      currentTimer: "Session",
      isPlaying: false
    });

    clearInterval(this.loop);

    audio.pause();
    audio.currentTime = 0;
  };

  componentWillUnmount() {
    clearInterval(this.loop);
  }

  convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${minutes}:${seconds}`;
  };

  handleLengthChange = (count, timerType) => {
    const {
      sessionCount,
      breakCount,
      isPlaying,
      currentTimer
    } = this.state;

    let newCount;

    if (timerType === "session") {
      newCount = sessionCount + count;
    } else {
      newCount = breakCount + count;
    }
    
    if (newCount > 0 && newCount < 61 && !isPlaying) {
      this.setState({
        [`${timerType}Count`]: newCount
      });

      if (currentTimer.toLowerCase() === timerType) {
        this.setState({
          clockCount: newCount * 60
        });
      }
    }
  };
  
  render() {
    const {
      breakCount,
      sessionCount,
      clockCount,
      currentTimer,
      isPlaying
    } = this.state;

    let handleLengthChange;
    
    const breakProps = {
      title: "Break",
      count: breakCount,
      handleDecrease: () => this.handleLengthChange(-1, "break"),
      handleIncrease: () => this.handleLengthChange(1, "break")
    };

    const sessionProps = {
      title: "Session",
      count: sessionCount,
      handleDecrease: () => this.handleLengthChange(-1, "session"),
      handleIncrease: () => this.handleLengthChange(1, "session")
    }; 

    return (
      <div id="main">
        <h1 id="session_timer">Session Timer</h1>

        

        <div className="clock-wrapper">
          <h1 id="timer-label">{currentTimer}</h1>
          <span id="time-left">{this.convertToTime(clockCount)}</span>
          <div className="flex">
            <button id="start_stop" onClick={this.handlePlayPause}>
              <h1>⏯️</h1>
            </button>
            <button id="reset" onClick={this.handleReset}>
              <h1>🔄</h1>
            </button>
          </div>
        </div>
        
        <div className="flex">
          <SetTimer {...sessionProps} />
          <SetTimer {...breakProps} />
        </div>
        
      </div>
    );
  }
}

const SetTimer = (props) => {
  const category = props.title.toLowerCase();
  return (
    <div className="time-adjustment-wrapper">
      <h2 id={`${category}-label`}>{props.title} Length</h2>
      <div className="flex plus-minus-wrapper">
        <button id={`${category}-decrement`}  onClick={props.handleDecrease}>
          <h1>⬇️</h1>
        </button>
        <span id={`${category}-length`}>{props.count}</span>
        <button id={`${category}-increment`}  onClick={props.handleIncrease}>
          <h1>⬆️</h1>
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
