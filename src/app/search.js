import React, { useRef } from "react";
import { View, Text, TextInput } from "react-native";

export const Search = ({ onRequest }) => {
  const inputRef = useRef(null);
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    const currentElem = inputRef.current;

    currentElem.focus();

    const handleBlur = () => {
      onRequest(currentElem.value);
    };

    const handleKeys = (e) => {
      console.log(e.keyCode);
      switch (e.keyCode) {
        case 37: // LEFT arrow
          console.log(getElement());
          break;
        case 38: // UP arrow
          break;
        case 39: // RIGHT arrow
          break;
        case 40: // DOWN arrow
          break;
        case 13: // OK button
          currentElem.focus();
          break;
        case 65376:
          currentElem.blur();
          break;
      }
    };

    currentElem.addEventListener("blur", handleBlur);
    document.addEventListener("keydown", handleKeys);

    return () => {
      currentElem.removeEventListener("blur", handleBlur);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [inputRef]);

  const handleChange = React.useCallback((event) => {
    const { text } = event.nativeEvent;
    setText(text);
  }, []);

  return (
    <View>
      <TextInput
        ref={inputRef}
        value={text}
        onChange={handleChange}
        style={{ backgroundColor: "#b3b3b3" }}
      />
      <Text style={{ color: "white" }}>{text}</Text>
    </View>
  );
};
