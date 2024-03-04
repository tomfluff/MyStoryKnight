import React from "react";
import getAxiosInstance from "../utils/axiosInstance";
import { useMediaQuery } from "@mantine/hooks";
import { Container, Modal } from "@mantine/core";

type Props = {
  display: boolean;
  finalAction: () => void;
};

const PremiseSelectModal = ({ display, finalAction }: Props) => {
  const instance = getAxiosInstance();
  const isMobile = useMediaQuery("(max-width: 50em)");
  return (
    <Modal
      size="lg"
      opened={display}
      onClose={finalAction}
      title="Select Story Premise"
      centered
      fullScreen={isMobile}
      //   closeOnEscape={!uploadImage.isPending}
      //   withCloseButton={!uploadImage.isPending}
      //   closeOnClickOutside={!uploadImage.isPending}
    >
      <Container></Container>
    </Modal>
  );
};

export default PremiseSelectModal;
