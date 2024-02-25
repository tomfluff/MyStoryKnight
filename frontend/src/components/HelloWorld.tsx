import { useState } from "react";
import { useLogger } from "@mantine/hooks";
import { Button } from "@mantine/core";

const HelloWorld: React.FunctionComponent = () => {
  const [count, setCount] = useState(0);
  useLogger("Demo", [{ count, hello: "world" }]);
  return (
    <Button onClick={() => setCount((c) => c + 1)}>
      Update state ({count})
    </Button>
  );
};

export default HelloWorld;
