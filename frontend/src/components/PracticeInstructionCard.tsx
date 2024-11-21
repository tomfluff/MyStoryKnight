import { TPremise } from "../types/Premise";
import { Card, Loader, Spoiler, Text } from "@mantine/core";
import ReadController from "./ReadController";
import useTranslation from "../hooks/useTranslation";
import { usePreferencesStore } from "../stores/preferencesStore";

type Props = {
  gameMode: string;
};

const PracticeInstructionCard = ({ gameMode }: Props) => {
  const intro = {
    en: "HOW TO PLAY",
    it: "COME GIOCARE",
  }
  const instr = {
    en: "Read the proposed story.\nInvent a conclusion for the story and act it out using your improvisation skills.\nRead the conclusion generated with your improvisation.\nIf you are satisfied, move on to the next story, otherwise you can try again.\nHave fun!",
    it: "Leggi la storia proposta.\nInventa una conclusione per la storia e mettila in atto tramite le tue capacità di improvvisazione.\nLeggi la conclusione generata con la tua improvvisazione.\nSe sei soddisfatto, passa alla storia successiva, altrimenti puoi riprovare.\nBuon divertimento!",
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

export default PracticeInstructionCard;
