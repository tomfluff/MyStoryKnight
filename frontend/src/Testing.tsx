import React, { useState } from "react";
import { Box, Container, Flex, Input, TextInput, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import ReadController from "./components/ReadController";

type Props = {};

const Testing = (props: Props) => {
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 500);
  return (
    <Box w="100%" h="100%">
      <Flex align="center" justify="center">
        <Container size="lg">
          <Title order={1}>Testing</Title>
          <TextInput
            label="Enter value to read"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          />
          <ReadController text={debounced} autoPlay />
        </Container>
      </Flex>
    </Box>
  );
};

export default Testing;
