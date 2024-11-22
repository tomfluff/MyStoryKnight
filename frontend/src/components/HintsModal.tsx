import getAxiosInstance from "../utils/axiosInstance";
import { useMediaQuery } from "@mantine/hooks";
import { Accordion, Box, Button, Container, Grid, Modal, Center, Loader } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { createCallContext } from "../utils/llmIntegration";
import { useEffect, useState } from "react";
import { usePreferencesStore } from "../stores/preferencesStore";

type Props = {
  display: boolean;
  ending: boolean;
  selectedHints: { [key: string]: string };
  setSelectedHints: (val: { [key: string]: string }) => void;
  finalAction: () => void;
};

const HintsModal = ({ display, ending, selectedHints = {}, setSelectedHints, finalAction }: Props) => {
  const instance = getAxiosInstance();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [hintList, setHintList] = useState<any[]>([]);
  const sourceLanguage = "en";
  const targetLanguage = usePreferencesStore.use.language();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["hints"],
    queryFn: ({ signal }) => {
      console.log("Getting hints...");
      if(ending) {
        return instance
          .post("/story/end_hints", {language: targetLanguage, context: createCallContext({ })}, { signal }) //TODO: Add in createCallContext
          .then((res) => 
            {
              console.log("HintList: ", res.data.data.list);
              return res.data.data.list;
            }
          );
      }
      return instance
        .post("/story/hints", {language: targetLanguage, context: createCallContext({ })}, { signal }) //TODO: Add in createCallContext
        .then((res) => {
            console.log("HintList: ", res.data.data.list);
            return res.data.data.list;
          }
        );
    },
    enabled: display,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    // NOTE: React-Query storage and cache will only persist until refresh so need to check existing storage
  });

  // const translate = useMutation({
  //   mutationKey: ["translate-hints"],
  //       mutationFn: (list: any) => { 
  //         return instance
  //             .get("/translate", {
  //               params: {
  //                 text: JSON.stringify(list),
  //                 src_lang: sourceLanguage,
  //                 tgt_lang: targetLanguage,
  //             }})
  //             .then((res) => {
  //               console.log("Translated hints: ", res);
  //               setHintList(JSON.parse(res.data.data.text)); 
  //             });
  //       },
  // });

  // if (!character) return null;
  useEffect(() => {
    if (data) {
      setHintList(data);
      // translate.mutate(data);
    }
  }, [data]);

  // useEffect(() => {
  //   if (selectedHints) {
  //     console.log("Selected hints: ", selectedHints);
  //     if (Object.keys(selectedHints).length === 0) {
  //       setHintList([]);
  //     }
  //   }
  // }, [selectedHints]) //LOOP -> check too many times

  // useEffect(() => {
  //   if (display) {
  //     refetch();
  //   } else {
  //     setHintList([]);
  //   }
  // }, [display, refetch]);

  const handleSelectHint = (category: string, hint: string) => {
    setSelectedHints((prev) => ({
      ...prev,
      [category]: hint,
    }));
    console.log("Selected hints: ", selectedHints);
  };

  const handleSelectEndHint = (category: string, hint: string) => {
    setSelectedHints({ [category]: hint });
    console.log("Selected EndHint: ", selectedHints);
  };

  const handleNewHints = () => {
    console.log("Deleting hints: ", selectedHints);
    setSelectedHints({});
    setHintList([]);
    refetch();
  };

  // console.log("hintList.length: ", hintList.length);
  // console.log("ending: ", ending);
  useEffect(() => {
    console.log("UseEffect for refetching hints...");
    // if (hintList.length === 3 && ending) {
    //   refetch();
    // }
    // if (hintList.length === 4 && !ending) {
    //   refetch();
    // }
    setHintList([]);
    refetch(); //TODO: check if right logic
  }, [ending]);

  if (!display) return null;

  // console.log("HintList: ", hintList);
  // console.log("Selected hints: ", selectedHints);

  return ( //TODO: render next to the camera window
    <Modal
      size="lg"
      opened={display}
      onClose={finalAction}
      title="Hints for your improvisation"
      centered
      fullScreen={isMobile}
      closeOnEscape={!isLoading}
      withCloseButton={!isLoading}
      closeOnClickOutside={!isLoading}
    >
      <Container>
        {(isLoading || hintList.length === 0) && (
          <Center>
            <Loader color="gray" type="dots" size="lg" />
          </Center>
        )}
        {hintList && hintList.length > 0 && (
          <Accordion chevron={<FaPlus />}>
              {!ending && hintList.length > 0 && Object.keys(hintList[0]).map((category) => (
                <Accordion.Item key={category} value={category}>
                  <Accordion.Control>
                    {category.charAt(0).toUpperCase() + category.slice(1)}?
                  </Accordion.Control>
                  <Accordion.Panel>
                    {hintList.map((hint: { [key: string]: string }, index: number) => (
                    <Box key={index} mb="sm">
                      <Grid align="center">
                        <Grid.Col span={10}>
                          <span>{index + 1} - {hint[category]}</span>
                        </Grid.Col>
                        <Grid.Col span={2}>
                          <Button
                            size="xs"
                            onClick={() => handleSelectHint(category, hint[category])}
                            disabled={selectedHints[category] !== undefined && hint[category] !== undefined && selectedHints[category] === hint[category]}>
                            Select
                          </Button>
                        </Grid.Col>
                      </Grid>
                     </Box>
                    ))}       
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
              {ending && hintList.length > 0 && Object.keys(hintList[0]).map((category) => (
                <Accordion.Item key={category} value={category}>
                  <Accordion.Control>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Accordion.Control>
                  <Accordion.Panel>
                    {hintList.map((hint: { [key: string]: string }, index: number) => (
                       <Box key={index} mb="sm">
                       <Grid align="center">
                         <Grid.Col span={10}>
                           <span>{index + 1} - {hint[category]}</span>
                         </Grid.Col>
                         <Grid.Col span={2}>
                           <Button
                             size="xs"
                             onClick={() => handleSelectEndHint(category, hint[category])}
                             disabled={Object.values(selectedHints).includes(hint[category])}>
                             Select
                           </Button>
                         </Grid.Col>
                       </Grid>
                      </Box>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
          </Accordion>
        )}
        <Box align="center" mt="md">
        <Button align="center" disabled={isLoading} onClick={finalAction} mr="md">
          Done
        </Button>
        <Button align="center" disabled={isLoading} onClick={handleNewHints}>
          New Hints
        </Button>
        </Box>
      </Container>
    </Modal>
  );
};

export default HintsModal;
