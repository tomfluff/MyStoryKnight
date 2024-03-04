import React from "react";
import { Card, Skeleton, Spoiler, Text, Image, rem } from "@mantine/core";
import { TCharacter } from "../types/Character";
import { TImage } from "../types/Image";
import ReadController from "./ReadController";

type Props = {
  image: TImage;
  character: TCharacter;
};

const CharacterCard = ({ image, character }: Props) => {
  return (
    <Card shadow="sm" my={8} padding="sm" radius="md" withBorder>
      <Card.Section mb="sm">
        <Image src={image.src} alt={image.desc} height={rem(128)} />
      </Card.Section>
      <Text size="lg" fw={500}>
        {character.fullname}
      </Text>
      <Spoiler maxHeight={100} showLabel="Show more" hideLabel="Hide">
        {character.backstory}
      </Spoiler>
      <Card.Section p="xs">
        <ReadController text={character.backstory} />
      </Card.Section>
    </Card>
  );
};

export default CharacterCard;
