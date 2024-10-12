import getAxiosInstance from "../utils/axiosInstance";
import { useMediaQuery } from "@mantine/hooks";
import { Accordion, Container, Modal, Center, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { createCallContext } from "../utils/llmIntegration";

type Props = {
  display: boolean;
  finalAction: () => void;
};

const HintsModal = ({ display, finalAction }: Props) => {
  const instance = getAxiosInstance();
  const isMobile = useMediaQuery("(max-width: 50em)");

  const { data: hintList, isLoading } = useQuery({
    queryKey: ["hints"],
    queryFn: ({ signal }) => {
      console.log("Getting hints...");
      return instance
        .post("/story/hints", createCallContext({ }), { signal }) //TODO: Add in createCallContext
        .then((res) => 
          {
            console.log("HintList: ", res.data.data.list);
            return res.data.data.list;
          }
        );
    },
    // enabled: !!character,
    staleTime: Infinity,
    refetchOnMount: false,
    // NOTE: React-Query storage and cache will only persist until refresh so need to check existing storage
  });

  // if (!character) return null;

  return (
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
        {isLoading && (
          <Center>
            <Loader color="gray" type="dots" size="lg" />
          </Center>
        )}
        {hintList && hintList.length > 0 && (
          <Accordion chevron={<FaPlus />}>
            <Accordion.Item value="who">
              <Accordion.Control>
                Who?
              </Accordion.Control>
              <Accordion.Panel>
                1 - {hintList[0]["who"]}<br/>
                2 - {hintList[1]["who"]}<br/>
                3 - {hintList[2]["who"]}
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="where">
              <Accordion.Control>
                  Where?
                </Accordion.Control>
                <Accordion.Panel>
                  1 - {hintList[0]["where"]}<br/>
                  2 - {hintList[1]["where"]}<br/>
                  3 - {hintList[2]["where"]}
                </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="what">
              <Accordion.Control>
                  What happened?
                </Accordion.Control>
                <Accordion.Panel>
                  1 - {hintList[0]["what"]}<br/>
                  2 - {hintList[1]["what"]}<br/>
                  3 - {hintList[2]["what"]}
                </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}
      </Container>
    </Modal>
  );
};

export default HintsModal;
