import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";

const filterOptions = [
  { value: "alphabets", label: "Alphabets" },
  { value: "numbers", label: "Numbers" },
  { value: "highestAlphabet", label: "Highest Alphabet" },
];

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [isValidJson, setIsValidJson] = useState(true);
  const [filters, setFilters] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
    try {
      JSON.parse(e.target.value);
      setIsValidJson(true);
    } catch {
      setIsValidJson(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      const res = await axios.post("http://localhost:5000/api/filter", parsedData);
      setResponseData(res.data);
      setError("");
    } catch (err) {
      setError("Invalid JSON or API error.");
      setResponseData(null);
    }
  };

  const renderResponse = () => {
    if (!responseData) return null;

    return (
      <div>
        <h3>Filtered Response</h3>
        {filters.some((f) => f.value === "numbers") && (
          <p>Numbers: {responseData.numbers?.join(", ")}</p>
        )}
        {filters.some((f) => f.value === "alphabets") && (
          <p>Alphabets: {responseData.alphabets?.join(", ")}</p>
        )}
        {filters.some((f) => f.value === "highestAlphabet") && (
          <p>Highest Alphabet: {responseData.highestAlphabet}</p>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>JSON Data</h1>
      <textarea
        rows="4"
        cols="50"
        placeholder='Enter JSON e.g. { "data": ["A", "1", "Z", "2"] }'
        value={jsonInput}
        onChange={handleJsonChange}
        style={{ borderColor: isValidJson ? "black" : "red", width: "100%" }}
      />
      <br />
      <button onClick={handleSubmit} disabled={!isValidJson} style={{ marginTop: "10px" }}>
        Submit
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {responseData && (
        <>
          <h3>Multi Filter</h3>
          <Select
            options={filterOptions}
            isMulti
            onChange={setFilters}
          />
          {renderResponse()}
        </>
      )}
    </div>
  );
};

export default App;
