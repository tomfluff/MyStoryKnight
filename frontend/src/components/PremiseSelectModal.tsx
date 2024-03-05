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
import PremiseAccordionItem from "./PremiseAccordionItem";
import { createCallContext } from "../utils/llmIntegration";

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
        .post("/story/premise", createCallContext({ ...character }), { signal })
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
          <Accordion chevron={<FaPlus />}>
            {premiseList.map((premise: TPremise, index: number) => {
              return (
                <PremiseAccordionItem
                  premise={premise}
                  key={index}
                  onSelect={handlePremiseSelect}
                />
              );
            })}
          </Accordion>
        )}
      </Container>
    </Modal>
  );
};

export default PremiseSelectModal;
