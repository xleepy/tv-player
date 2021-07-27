import React, { useRef } from "react";
import { View } from "react-native";
import { Search } from "./search";

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

const App = () => {
  const containerRef = useRef(null);

  const handleFetchOnBlur = (id) => {
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
      kinopoisk: id,
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
          .filter((key) => data[key] && data[key].iframe)
          .map((key) => data[key].iframe);
        links.forEach((link) => {
          const iframe = document.createElement("iframe");
          iframe.sandbox = "allow-scripts allow-same-origin allow-presentation";
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
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#2A3440",
      }}
    >
      <Search onRequest={handleFetchOnBlur} />
      <div style={{ display: "flex" }} ref={containerRef}></div>
    </View>
  );
};

export default App;
