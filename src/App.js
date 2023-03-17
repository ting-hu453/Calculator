import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const keypads = [
    "AC",
    "%",
    "+/-",
    "/",
    7,
    8,
    9,
    "x",
    4,
    5,
    6,
    "+",
    1,
    2,
    3,
    "-",
    0,
    ".",
    "=",
  ];

  const keypadsMap = {
    gray: ["AC", "%", "+/-"],
    orange: ["/", "x", "+", "-"],
  };

  const [finalResult, setFinalResult] = useState();
  const [num, setNum] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const constructClassName = (keypad) => {
    if (keypadsMap["gray"].includes(keypad)) return "gray";
    else if (keypadsMap["orange"].includes(keypad)) return "orange";
    if (keypad === 0) return "zero";
  };

  const includeGray = (keypad) => {
    setNum((prev) => {
      var a = [...prev];
      if (keypadsMap["orange"].includes(a[a.length - 1])) {
        a.pop();
      }

      if (keypad === "+/-") {
        a[a.length - 1] = 0 - a[a.length - 1];
      } else if (keypad === "%") a[a.length - 1] = a[a.length - 1] / 100;
      else if (keypad === "AC") {
        a = [];
      }

      return a;
    });
  };

  const findFinalResult = () => {
    let tempNum = [...num];
    let numStack = [];
    let operatorStack = [];
    if (tempNum[tempNum.length - 1] !== "=" && tempNum.length !== 0) {
      keypadsMap["orange"].includes(tempNum[tempNum.length - 1].toString())
        ? (tempNum[tempNum.length - 1] = "=")
        : tempNum.push("=");
    }

    for (let i = 0; i < tempNum.length; i++) {
      if (!isNaN(tempNum[i])) {
        numStack.push(tempNum[i]);
      } else if (
        tempNum[i] === "+" ||
        tempNum[i] === "-" ||
        tempNum[i] === "="
      ) {
        if (operatorStack.length !== 0) {
          let topNum = numStack[numStack.length - 1];
          numStack.pop();
          let bottomNum = numStack[numStack.length - 1];
          numStack.pop();
          let operator = operatorStack[operatorStack.length - 1];
          operatorStack.pop();

          if (operator === "+") numStack.push(+topNum + +bottomNum);
          else if (operator === "-") numStack.push(+bottomNum - +topNum);

          if (tempNum[i] !== "=") operatorStack.push(tempNum[i]);
        } else operatorStack.push(tempNum[i]);
      } else {
        let topNum = numStack[numStack.length - 1];
        numStack.pop();
        let operator = tempNum[i];
        i = i + 1;
        if (operator === "x") numStack.push(+topNum * +tempNum[i]);
        else if (operator === "/") numStack.push(+topNum / +tempNum[i]);
      }
    }
    return numStack[0];
  };

  const handleKeypads = (e, keypad) => {
    if (keypad === "=") {
      setIsComplete(true);
    }

    if (keypad === "AC") {
      setNum([]);
      setIsComplete(false);
      setFinalResult();
    }

    if (!isComplete) {
      if (!isNaN(keypad)) {
        setNum((prev) => {
          var a = [...prev];
          if (!isNaN(a[a.length - 1])) {
            a[a.length - 1] = a[a.length - 1].toString() + keypad.toString();
            prev = a;
          } else {
            prev = [...a, keypad];
          }

          return prev;
        });
      } else if (keypadsMap["gray"].includes(keypad)) {
        includeGray(keypad);
      } else if (keypad === ".") {
        if (num.length === 0) {
          setNum((prev) => {
            var a = [...prev];
            if (!a[a.length - 1]) a.push(0 + keypad.toString());
            return a;
          });
        } else {
          setNum((prev) => {
            var a = [...prev];
            if (
              !a[a.length - 1].toString().includes(".") &&
              !keypadsMap["orange"].includes(a[a.length - 1].toString())
            )
              a[a.length - 1] = a[a.length - 1].toString() + keypad.toString();

            return a;
          });
        }
      } else {
        setNum((prev) => {
          var a = [...prev];
          !isNaN(a[a.length - 1]) ? a.push(keypad) : (a[a.length - 1] = keypad);
          return a;
        });
      }
    }
  };

  useEffect(() => {
    if (num.join("").length > 15) setIsComplete(true);
  }, [num]);

  useEffect(() => {
    setFinalResult(() => findFinalResult(num));
  }, [isComplete]);

  return (
    <div className="App">
      <div className="wrapper">
        <div className="wrapper-display">
          <div className="display">{num}</div>
          <div className="result">{finalResult}</div>
        </div>
        <div className="keypads">
          {" "}
          {keypads.map((keypad, index) => {
            return (
              <button
                key={index}
                className={`btn ${constructClassName(keypad)}`}
                onClick={(e) => {
                  handleKeypads(e, keypad);
                }}>
                {" "}
                {keypad}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
