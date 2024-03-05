import React, { useEffect } from "react";
import getAxiosInstance from "../utils/axiosInstance";
import { useMediaQuery } from "@mantine/hooks";
import {
  Accordion,
  Container,
  Modal,
  Text,
  Stack,
  Group,
  Button,
  Center,
  Loader,
} from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TCharacter } from "../types/Character";
import { FaPlus } from "react-icons/fa";
import ReadController from "./ReadController";
import { setPremise, useAdventureStore } from "../stores/adventureStore";
import { TPremise } from "../types/Premise";
import useTranslation from "../hooks/useTranslation";

type Props = {
  display: boolean;
  finalAction: () => void;
  character: TCharacter | null;
};

const PremiseSelectModal = ({ character, display, finalAction }: Props) => {
  const instance = getAxiosInstance();
  const isMobile = useMediaQuery("(max-width: 50em)");

  const {
    data: premiseList,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["premise", character?.fullname],
    queryFn: ({ signal }) => {
      return instance
        .post("/story/premise", { ...character }, { signal })
        .then((res) => res.data.data.list);
    },
    enabled: !!character,
    staleTime: Infinity,
    refetchOnMount: false,
    // NOTE: React-Query storage and cache will only persist until refresh so need to check existing storage
  });

  const handlePremiseSelect = (premise: TPremise) => {
    setPremise(premise);
    finalAction();
  };

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
        {isLoading && (
          <Center>
            <Loader color="gray" type="dots" size="lg" />
          </Center>
        )}
        {premiseList && premiseList.length > 0 && (
          <Accordion
            defaultValue={premiseList[0].setting.short}
            chevron={<FaPlus />}
          >
            {premiseList.map((premise: TPremise, index: number) => {
              const { data: shorttext, isLoading: shorttextLoading } =
                useTranslation(premise.setting.short);
              const { data: longtext, isLoading: longtextLoading } =
                useTranslation(premise.setting.long);
              if (shorttextLoading || longtextLoading)
                return (
                  <Loader key={index} color="gray" type="dots" size="lg" />
                );
              return (
                <Accordion.Item key={index} value={shorttext}>
                  <Accordion.Control>{shorttext}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack>
                      <Text>{longtext}</Text>
                      <Group grow>
                        <ReadController text={longtext} />
                        <Button onClick={() => handlePremiseSelect(premise)}>
                          Start Adventure
                        </Button>
                      </Group>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
        )}
      </Container>
    </Modal>
  );
};

export default PremiseSelectModal;
