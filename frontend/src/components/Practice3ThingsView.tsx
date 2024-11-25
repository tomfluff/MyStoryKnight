import { Box, Group, Stack, Grid, Center, Loader, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import getAxiosInstance from "../utils/axiosInstance";
import { appendStory, startStory, usePractice3ThingsStore } from "../stores/practice3ThingsStore";
import Practice3ThingsPart from "./Practice3ThingsPart";
import { useEffect, useState } from "react";

type Props = {
    reset: () => void;
};

const Practice3ThingsView = ({reset}: Props) => {
  const instance = getAxiosInstance();
  const { id, story } = usePractice3ThingsStore();
  const [next, setNext] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[]>([]); //array of questions
  const [cntQ, setCntQ] = useState<number>(0);
  let maxQ = 20;

  // console.log("Practice3ThingsView - id:", id);
  console.log("Practice3ThingsView - story:", story);
  console.log("Practice3ThingsView - next:", next);

  const { isError, isLoading, refetch } = useQuery({
    queryKey: ["practice-3things-init", id],
    queryFn: ({ signal }) => {
      return instance
        .post(
          "/practice/generate_questions",
          { maxQ: maxQ }, 
          { signal }
        )
        .then((res) => {
          console.log("Practice3ThingsView - res:", res);
          //generate like 20 questions, start with 1st
          setQuestions(res.data.data.parts);
          if (cntQ == 0) {
            startStory({ start: Date.now(), id: res.data.data.id, parts: [res.data.data.parts[cntQ]] });
          }
          else {
            appendStory(res.data.data.parts[0]);
          }
          setCntQ(1);
          return res.data.data;
        });
    },
    enabled: !story,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (next) {
      if (cntQ == maxQ) {
        console.log("Refetching...");
        refetch(); 
      }
      else {
        appendStory(questions[cntQ])
        setCntQ(cntQ + 1);
        console.log("CntQ:", cntQ);
      }
      setNext(false);
    }
  }, [next, refetch]);

  // console.log("Practice3ThingsView - isLoading:", isLoading);
  // console.log("Practice3ThingsView - isError:", isError);
  
  if (isLoading) {
    return (
      <Center>
        <Loader color="gray" size="xl" type="dots" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center>
        <Text c="red">Error loading questions</Text>
      </Center>
    );
  }

  if (!story) {
    console.log("No questions in Practice3ThingsView.");
    return null;
  }

  return (
    <Box component={Group} align="center" justify="center" pb="xl">
      <Grid w="100%">
        <Grid.Col span={{ sm: 12, md: 8 }} offset={{ sm: 0, md: 2 }}>
          <Stack>
            {story &&
              story.parts.length > 0 &&
              story.parts.map((part, i) => (
                <Practice3ThingsPart
                  key={i}
                  isNew={i === story.parts.length - 1} //disable textinput based on this?
                  part={part}
                  setNext={setNext}
                  reset={reset}
                />
              ))}
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default Practice3ThingsView;
