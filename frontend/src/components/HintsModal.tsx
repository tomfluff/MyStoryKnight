import getAxiosInstance from "../utils/axiosInstance";
import { useMediaQuery } from "@mantine/hooks";
import { Accordion, Container, Modal, Center, Loader } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { createCallContext } from "../utils/llmIntegration";
import { useEffect, useState } from "react";
import { usePreferencesStore } from "../stores/preferencesStore";

type Props = {
  display: boolean;
  ending: boolean;
  finalAction: () => void;
};

const HintsModal = ({ display, ending, finalAction }: Props) => {
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
          .post("/story/end_hints", createCallContext({ }), { signal }) //TODO: Add in createCallContext
          .then((res) => 
            {
              console.log("HintList: ", res.data.data.list);
              return res.data.data.list;
            }
          );
      }
      return instance
        .post("/story/hints", createCallContext({ }), { signal }) //TODO: Add in createCallContext
        .then((res) => {
            console.log("HintList: ", res.data.data.list);
            return res.data.data.list;
          }
        );
    },
    enabled: display,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    // NOTE: React-Query storage and cache will only persist until refresh so need to check existing storage
  });

  const translate = useMutation({
    mutationKey: ["translate-hints"],
        mutationFn: (list: any) => { 
          return instance
              .get("/translate", {
                params: {
                  text: JSON.stringify(list),
                  src_lang: sourceLanguage,
                  tgt_lang: targetLanguage,
              }})
              .then((res) => {
                console.log("Translated hints: ", res);
                setHintList(JSON.parse(res.data.data.text)); 
              });
        },
  });

  // if (!character) return null;
  useEffect(() => {
    if (data) {
      // setHintList(data);
      translate.mutate(data);
    }
  }, [data]);

  useEffect(() => {
    if (display) {
      refetch();
    } else {
      setHintList([]);
    }
  }, [display, refetch]);

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
                      <div key={index}>
                        {index + 1} - {hint[category]}
                        <br />
                      </div>
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
                      <div key={index}>
                        {index + 1} - {hint[category]}
                        <br />
                      </div>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
          </Accordion>
        )}
      </Container>
    </Modal>
  );
};

export default HintsModal;
