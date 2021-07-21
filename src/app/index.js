import React, { useRef } from "react";
import { View, Text, TextInput } from "react-native";
import { WebView } from "react-native-webview";

function xhrRequest(url, callback, body, method) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback({ text: xhr.responseText, html: xhr.responseXML });
      }
    }
  };
  xhr.open(method || "GET", url, true);
  if (method === "POST") {
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }
  xhr.send(body);
}

function parseResult(obj) {
  links.forEach((link) => xhrRequest(link, console.log, undefined, "GET"));
}

const App = () => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [text, setText] = React.useState("");

  const [iframes, setIframes] = React.useState([]);

  const handleChange = React.useCallback((event) => {
    const { text } = event.nativeEvent;
    setText(text);
  }, []);

  React.useEffect(() => {
    const currentElem = inputRef.current;

    currentElem.focus();

    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 37: //LEFT arrow
          break;
        case 38: //UP arrow
          break;
        case 39: //RIGHT arrow
          break;
        case 40: //DOWN arrow
          break;
        case 13: //OK button
          currentElem.focus();
          break;
        case 65376:
          currentElem.blur();
          break;
      }
    });
  }, [inputRef]);

  React.useEffect(() => {
    const currentElem = inputRef.current;
    function handleFetchOnBlur() {
      const result = currentElem.value;
      const date1 = new Date();
      const date2 = new Date("2021-10-21");
      const tld = date1 > date2 ? "cc" : "online";
      let body = "";

      const url =
        "https://ahoy.yohoho." +
        tld +
        "/?cache" +
        Math.random().toString().substr(2, 3);

      const options = {
        kinopoisk: result,
        button:
          "videocdn: {Q} {T}, hdvb: {Q} {T}, bazon: {Q} {T}, ustore: {Q} {T}, alloha: {Q} {T}, kodik: {Q} {T}, iframe: {Q} {T}, collaps: {Q} {T}",
        button_limit: 8,
        button_size: 1,
        player: "collaps,hdvb,bazon,ustore,alloha,videocdn,iframe,kodik,pleer",
      };

      Object.keys(options).forEach((key) => {
        const value = options[key];
        if (value) {
          body += body
            ? "&" + key + "=" + encodeURIComponent(value)
            : key + "=" + encodeURIComponent(value);
        }
      });

      xhrRequest(
        url,
        ({ text }) => {
          const data = JSON.parse(text);
          const links = Object.keys(data)
            .filter((key) => data[key] && data[key]["iframe"])
            .map((key) => data[key]["iframe"]);
          links.forEach((link) => {
            const iframe = document.createElement("iframe");
            iframe.sandbox =
              "allow-scripts allow-same-origin allow-presentation";
            iframe.src = link;
            iframe.style.height = "800px";
            containerRef.current.appendChild(iframe);

            setTimeout(() => {
              const innerDoc =
                iframe.contentDocument || iframe.contentWindow.document;
              console.log(innerDoc.querySelector("video"));
            }, 1000);
          });
        },
        body,
        "POST"
      );
    }
    inputRef.current.addEventListener("blur", handleFetchOnBlur);
  }, [inputRef, containerRef]);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#2A3440",
      }}
    >
      <TextInput
        ref={inputRef}
        value={text}
        onChange={handleChange}
        style={{ backgroundColor: "#b3b3b3" }}
      />
      <Text style={{ color: "white" }}>{text}</Text>

      <div style={{ display: "flex" }} ref={containerRef}></div>
    </View>
  );
};

export default App;
