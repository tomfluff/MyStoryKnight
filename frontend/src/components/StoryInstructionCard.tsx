import { TPremise } from "../types/Premise";
import { Card, Loader, Spoiler, Text } from "@mantine/core";
import ReadController from "./ReadController";
import useTranslation from "../hooks/useTranslation";
import { usePreferencesStore } from "../stores/preferencesStore";

const StoryInstructionCard = () => {
  const intro = {
    en: "HOW TO PLAY",
    it: "COME GIOCARE",
  }
  const instr = {
    en: "In the 'Context' tab you can read the character description and the premise of the story.\nIn the 'Keypoints' tab the key points of each part of the story are listed.\nYou can advance the story using your improvisational skills.\nAlternatively, you can use one of the two options proposed.\nRead the new developments and decide how to continue!\nHave fun!",
    it: "Nella scheda 'Context' puoi leggere la descrizione del personaggio e la premessa della storia.\nNella scheda 'Keypoints' vengono elencati i punti fondamentali di ogni parte di storia.\nPuoi portare avanti la storia usando le tue caoacità di improvvisazione.\nIn alternativa, puoi usare una delle due opzioni proposte.\nLeggi i nuovi sviluppi e decidi come continuare!\nBuon divertimento!",
  }

  const language = usePreferencesStore.use.language();
  const shorttext = intro[language === 'it' ? 'it' : 'en'];
  const longtext = instr[language === 'it' ? 'it' : 'en'];

  return (
    <Card shadow="md" my={8} padding="sm" radius="md">
      <Card.Section mb="sm">
        <Text size="md" fw={500} p="xs" bg="violet" c="white" align="center">
          {shorttext}
        </Text>
      </Card.Section>
      <Spoiler maxHeight={50} showLabel="Show more" hideLabel="Hide">
        <ol>
          {longtext.split('\n').map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ol>
      </Spoiler>
      <Card.Section p="xs">
        <ReadController id="card" text={longtext} />
      </Card.Section>
    </Card>
  );
};

export default StoryInstructionCard;
