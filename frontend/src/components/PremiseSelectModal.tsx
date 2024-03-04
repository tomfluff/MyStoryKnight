import React, { useEffect } from "react";
import getAxiosInstance from "../utils/axiosInstance";
import { useMediaQuery } from "@mantine/hooks";
import { Accordion, Container, Modal, Text, Stack, Group, Button, Center, Loader } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TCharacter } from "../types/Character";
import { FaPlus } from "react-icons/fa";
import ReadController from "./ReadController";
import { setPremise, useAdventureStore } from "../stores/adventureStore";
import { TPremise } from "../types/Premise";

type Props = {
  display: boolean;
  finalAction: () => void;
  character: TCharacter | null;
};

const PremiseSelectModal = ({ character, display, finalAction }: Props) => {
  const instance = getAxiosInstance();
  const isMobile = useMediaQuery("(max-width: 50em)");

  const { data: premiseList, isError, isLoading } = useQuery({
    queryKey: ["premise", character?.fullname],
    queryFn: ({ signal }) => {
      return instance.post("/story/premise", { ...character }, { signal }).then((res) =>
        res.data.data.list)
    },
    enabled: !!character,
    staleTime: Infinity,
    refetchOnMount: false,
    // NOTE: React-Query storage and cache will only persist until refresh so need to check existing storage
  });

  const handlePremiseSelect = (premise: TPremise) => {
    setPremise(premise);
    finalAction();
  }

  return (
    <Modal
      size="lg"
      opened={display}
      onClose={finalAction}
      title="Select Story Premise"
      centered
      fullScreen={isMobile}
      closeOnEscape={!isLoading}
      withCloseButton={!isLoading}
      closeOnClickOutside={!isLoading}
    >
      <Container>
        {isLoading && <Center><Loader color="gray" type="dots" size="lg" /></Center>}
        {premiseList && premiseList.length > 0 &&
          <Accordion
            defaultValue={premiseList[0].setting.short}
            chevron={<FaPlus />}
          >
            {premiseList.map((premise: TPremise, index: number) => (
              <Accordion.Item key={index} value={premise.setting.short}>
                <Accordion.Control>{premise.setting.short}</Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <Text>{premise.setting.long}</Text>
                    <Group grow>
                      <ReadController text={premise.setting.long} />
                      <Button
                        onClick={() => handlePremiseSelect(premise)}>Start Adventure</Button>
                    </Group>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>}
      </Container>
    </Modal>
  );
};

export default PremiseSelectModal;
