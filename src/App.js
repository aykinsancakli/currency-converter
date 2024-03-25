import { useState, useEffect } from "react";

export default function App() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChangeFrom(e) {
    setFrom(e.target.value);
  }

  function handleChangeTo(e) {
    setTo(e.target.value);
  }

  useEffect(
    function () {
      setOutput("");
      const delayFetch = setTimeout(() => {
        async function fetchCurrency() {
          setIsLoading(true);
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
          );
          const data = await res.json();
          setOutput(data.rates[`${to}`].toFixed(2));
          setIsLoading(false);
        }
        if (!amount || from === to) return setAmount("");
        fetchCurrency();
      }, 600);

      return () => clearTimeout(delayFetch);
    },
    [amount, from, to]
  );

  return (
    <div className="container">
      <Form
        amount={amount}
        setAmount={setAmount}
        from={from}
        setFrom={setFrom}
        to={to}
        output={output}
        isLoading={isLoading}
        onChangeFrom={handleChangeFrom}
        onChangeTo={handleChangeTo}
      />

      <Result
        amount={amount}
        from={from}
        to={to}
        output={output}
        isLoading={isLoading}
        key={amount}
      />
    </div>
  );
}

function Form({
  amount,
  setAmount,
  from,
  to,
  isLoading,
  onChangeFrom,
  onChangeTo,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const formattedDate = formatDate(currentTime);

  const hour = currentTime.getHours().toString().padStart(2, "0");
  const minute = currentTime.getMinutes().toString().padStart(2, "0");

  return (
    <div className="form">
      <div className="time">
        <p>{formattedDate}</p>
        <div className="hour">
          <p>{`${hour}:${minute}`}</p>
        </div>
      </div>

      <h1 className="heading-primary">
        <span className="main">Currency</span>{" "}
        <span className="sub">Converter</span>
      </h1>

      <div className="form-group">
        <p className="label">From</p>
        <select
          value={from}
          onChange={(e) => onChangeFrom(e)}
          disabled={isLoading}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="GBP">GBP</option>
          <option value="TRY">TRY</option>
        </select>
      </div>

      <div className="form-group">
        <p className="label">To</p>
        <select value={to} onChange={(e) => onChangeTo(e)} disabled={isLoading}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="GBP">GBP</option>
          <option value="TRY">TRY</option>
        </select>
      </div>

      <div className="form-group">
        <p className="label">Amount</p>
        <input
          placeholder={from !== to ? "150€" : "Choose a currency to convert!"}
          className={
            from !== to ? "input-amount" : "input-amount warning-wrapper"
          }
          type="text"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={isLoading || to === from}
        />
      </div>
    </div>
  );
}

function Result({ amount, from, to, output, isLoading }) {
  if (!output) {
    return null;
  }

  return (
    <div className="result-box">
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : amount === 0 || amount === "" ? (
        ""
      ) : (
        <p className="">
          {amount} {from} is equal {""}
          <span className="blue-wrapper">
            {output} {to}
          </span>
        </p>
      )}
    </div>
  );
}
