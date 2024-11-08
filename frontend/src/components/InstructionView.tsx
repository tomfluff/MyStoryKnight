import {
  Center,
  Paper,
  Stack,
  Title,
  Divider,
  rem,
  Text,
  Button,
  Box,
  Grid,
  GridCol,
  Select,
  Flex,
} from "@mantine/core";
import { useAdventureStore } from "../stores/adventureStore";
import { initSession, useSessionStore } from "../stores/sessionStore";
import getAxiosInstance from "../utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import DrawingUploadModal from "./DrawingUploadModal";
import PremiseSelectModal from "./PremiseSelectModal";
import { SetStateAction, useState } from "react";
import StartImprovUploadModal from "./StartImprovUploadModal";

type InstructionViewProps = {
  setGameMode: (mode: string) => void;
  setIsStartedEndings: (mode: boolean) => void;
  setIsStarted3Things: (mode: boolean) => void;
}

const InstructionView = ({ setGameMode, setIsStartedEndings, setIsStarted3Things } : InstructionViewProps) => {
  const instance = getAxiosInstance();
  const session = useSessionStore.use.id();
  const character = useAdventureStore.use.character();
  const premise = useAdventureStore.use.premise();

  const [captureModal, { open: openCapture, close: closeCapture }] =
    useDisclosure();
  const [premiseModal, { open: openPremise, close: closePremise }] =
    useDisclosure();
  const [improvModal, { open: openImprov, close: closeImprov }] =
    useDisclosure();

  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const newSession = useMutation({
    mutationKey: ["session"],
    mutationFn: () => {
      return instance.get("/session").then((res) => res.data);
    },
    onSuccess: (data) => {
      initSession(data.data.id);
    },
  });

  const handleGameModeChange = (value: string | null) => {
    if (value !== null) {
      setGameMode(value);
      setSelectedMode(value);
    
      // Perform any action based on the selected value
      console.log('Selected game mode:', value);
    }
  };

  const handleStartEndings = () => {
    setIsStartedEndings(true);
    console.log('Started endings:', true);
  };

  return (
    <>
      <Center>
        <Stack align="center" mb={rem(20)}>
        <Paper withBorder p="xl" radius="lg" mt={rem(20)}>
          <Stack align="center" mb={rem(20)}>
            <Title order={3} fs="italic">
              Your Adventure Awaits
            </Title>
            <Divider size="sm" w={rem(128)} />
          </Stack>
          <Stack align="start" gap="sm">
            <Box opacity={!session ? 1 : 0.5}>
              <Text>
                1. Start a{" "}
                <Button
                  m="xs"
                  size="compact-md"
                  onClick={() => newSession.mutate()}
                  disabled={session != null}
                >
                  New Session
                </Button>{" "}
                to set up the system, and feel free to change the settings.
              </Text>
            </Box>

           
            <Box opacity={session != null && !character ? 1 : 0.5}>
              <Flex align="center">
              <Text mr="xs">
                2. Choose a game mode:</Text>
                <Select
                    m="xs"
                    placeholder="Game Mode"
                    data={[
                      { value: 'story', label: 'Story' },
                      { value: 'practice', label: 'Practice' },
                    ]}
                    disabled={session == null || character != null}
                    value={selectedMode}
                    onChange={handleGameModeChange}
                  />
              <Text>.</Text>
              </Flex>                  
            </Box>
          </Stack>
        </Paper>
        {(selectedMode=="story") && (
          <Grid>
            <Grid.Col span={6}>
              <Box opacity={session!=null ? 1 : 0.5}>
              <Paper withBorder p="xl" radius="lg" mt={rem(20)}>
                <Stack align="center" mb={rem(20)}>
                  <Title order={3} fs="italic">
                    Draw!
                  </Title>
                  <Divider size="sm" w={rem(128)} />
                </Stack>
                <Stack>
                  <Box opacity={session != null && !character ? 1 : 0.5}>
                    <Text>
                      3. Upload and{" "}
                      <Button
                        m="xs"
                        size="compact-md"
                        onClick={openCapture} //TODO: change from character to context (+character)
                        disabled={session == null || character != null}
                      >
                        Capture your Drawing
                      </Button>{" "}
                      to define the context of your story.
                    </Text>
                  </Box>
                  <Box
                    opacity={session != null && character != null && !premise ? 1 : 0.5}>
                    <Text>
                      4. Select a{" "}
                        <Button
                          m="xs"
                          size="compact-md"
                          onClick={openPremise}
                          disabled={character == null || premise != null}
                        >
                          Premise
                        </Button>{" "}
                      to set the stage for your story.
                    </Text>
                  </Box>
                </Stack>
              </Paper>
              </Box>
            </Grid.Col>
            <Grid.Col span={6}>
              <Box opacity={session!=null ? 1 : 0.5}>
              <Paper withBorder p="xl" radius="lg" mt={rem(20)}>
                <Stack align="center" mb={rem(20)}>
                  <Title order={3} fs="italic">
                    Improvise!
                  </Title>
                  <Divider size="sm" w={rem(128)} />
                </Stack>
                <Stack>
                  <Box>
                  <Text>
                    3. Voice and movements can be used to describe the context.
                  </Text>  
                  </Box>

                  <Box>
                    <Text>
                      4. Test your skills and {" "}
                      <Button
                          m="xs"
                          size="compact-md"
                          onClick={openImprov}
                          disabled={character != null || premise != null}
                        >
                        Improvise
                      </Button>{" "} 
                      to start the story!
                    </Text>
                  </Box>
                </Stack>
              </Paper>
              </Box>
            </Grid.Col>
          </Grid>
        )}
        {(selectedMode=="practice") && (
          <Grid>
          <Grid.Col span={6}>
            <Box opacity={session!=null ? 1 : 0.5}>
            <Paper withBorder p="xl" radius="lg" mt={rem(20)}>
              <Stack align="center" mb={rem(20)}>
                <Title order={3} fs="italic">
                  Three Things!
                </Title>
                <Divider size="sm" w={rem(128)} />
              </Stack>
              <Stack>
                <Box>
                  <Text mb={rem(20)}>
                    1. Train your reactivity!            
                  </Text>
                  <Text mb={rem(20)}>
                    2. You must always have a ready answer!            
                  </Text>
                  <Box style={{ textAlign: 'center' }}>
                  <Button
                          m="xs"
                          size="compact-md"
                          onClick={() => setIsStarted3Things(true)} //TODO: change
                          //TODO: add disabled?
                        >
                        Start!
                  </Button>{" "} 
                  </Box>
                </Box>
              </Stack>
            </Paper>
            </Box>
          </Grid.Col>
          <Grid.Col span={6}>
            <Box opacity={session!=null ? 1 : 0.5}>
            <Paper withBorder p="xl" radius="lg" mt={rem(20)}>
              <Stack align="center" mb={rem(20)}>
                <Title order={3} fs="italic">
                  Ending!
                </Title>
                <Divider size="sm" w={rem(128)} />
              </Stack>
              <Stack>
                <Box>
                  <Text mb={rem(20)}>
                    1. Try to conclude absurd stories!        
                  </Text>
                  <Text mb={rem(20)}>
                    2. Be creative!            
                  </Text>
                  <Box style={{ textAlign: 'center' }}>
                  <Button
                          m="xs"
                          size="compact-md"
                          onClick={handleStartEndings} //TODO: change
                          //TODO: add disabled?
                        >
                        Start!
                  </Button>{" "} 
                  </Box>
                </Box>
              </Stack>
            </Paper>
            </Box>
          </Grid.Col>
        </Grid>
        )}
        </Stack>
      </Center>
      <DrawingUploadModal display={captureModal} finalAction={closeCapture} />
      <PremiseSelectModal
        character={character}
        display={premiseModal}
        finalAction={closePremise}
      />
      <StartImprovUploadModal display={improvModal} finalAction={closeImprov} />
    </>
  );
};

export default InstructionView;
