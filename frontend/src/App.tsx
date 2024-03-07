import "./App.css";
import {
  Anchor,
  AppShell,
  Box,
  Burger,
  Button,
  Card,
  Flex,
  Group,
  ScrollArea,
  Skeleton,
  Spoiler,
  Stack,
  Text,
  Modal,
  Popover,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import SpeechMonitor from "./components/SpeechMonitor";
import StoryView from "./components/StoryView";
import { ColorSchemeToggle } from "./components/ColorSchemeToggle/ColorSchemeToggle";
import WebcamUploadModal from "./components/WebcamUploadModal";
import getAxiosInstance from "./utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import {
  initSession,
  resetSession,
  useSessionStore,
} from "./stores/sessionStore";
import { useAdventureStore, clearStore } from "./stores/adventureStore";
import CharacterCard from "./components/CharacterCard";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PremiseSelectModal from "./components/PremiseSelectModal";
import PremiseCard from "./components/PremiseCard";
import PreferencePopover from "./components/PreferencePopover/PreferencePopover";
import PreferenceModal from "./components/PreferenceModal/PreferenceModal";
import { resetPreferences } from "./stores/preferencesStore";
import AboutModal from "./components/AboutModal/AboutModal";

function App() {
  const [opened, { toggle: toggleNavbar }] = useDisclosure(false);
  const [captureModal, { open: openCapture, close: closeCapture }] =
    useDisclosure();
  const [premiseModal, { open: openPremise, close: closePremise }] =
    useDisclosure();
  const instance = getAxiosInstance();
  const sessionId = useSessionStore.use.id();
  const isSession = useMemo(() => sessionId !== null, [sessionId]);

  const newSession = useMutation({
    mutationKey: ["session"],
    mutationFn: () => {
      return instance.get("/session").then((res) => res.data);
    },
    onSuccess: (data) => {
      console.log(data);
      initSession(data.data.id);
    },
  });

  const reset = () => {
    clearStore();
    resetSession();
    resetPreferences();
  };

  const image = useAdventureStore.use.image();
  const character = useAdventureStore.use.character();
  const isCharacter = useMemo(
    () => image !== null && character !== null,
    [image, character]
  );

  const premise = useAdventureStore.use.premise();
  const isPremise = useMemo(() => premise !== null, [premise]);

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="sm"
    >
      <AppShell.Header p={{ xs: "sm", sm: "md" }}>
        <Flex justify="space-between" align="center" direction="row" h="100%">
          <Burger
            opened={opened}
            onClick={toggleNavbar}
            hiddenFrom="sm"
            size="sm"
          />
          <Text size="md">MyStoryKnight.</Text>
          <Group gap="sm">
            <AboutModal />
            <PreferenceModal />
            <ColorSchemeToggle />
          </Group>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p={{ xs: "md", sm: "xs" }}>
        <AppShell.Section>
          <Stack gap="xs">
            <Group grow>
              <Button disabled={isSession} onClick={() => newSession.mutate()}>
                New Session
              </Button>
              <Button disabled={!isSession} onClick={reset} color="orange">
                Reset
              </Button>
            </Group>
            <Group grow>
              <Button
                onClick={openCapture}
                disabled={!isSession || isCharacter}
                fullWidth
              >
                Capture Drawing
              </Button>
              <Button
                onClick={openPremise}
                disabled={!isCharacter || isPremise}
                fullWidth
              >
                Select Premise
              </Button>
            </Group>
          </Stack>
        </AppShell.Section>
        <AppShell.Section
          grow
          mt="xs"
          component={ScrollArea}
          type="scroll"
          scrollHideDelay={500}
        >
          <Flex direction="column">
            {isCharacter && (
              <CharacterCard image={image!} character={character!} />
            )}
            {isPremise && <PremiseCard premise={premise!} />}
          </Flex>
        </AppShell.Section>
        {/* <AppShell.Section>
          <Group justify="center" p="sm">
            <Button variant="light" size="sm" radius="md">
              Log in
            </Button>
            <Button variant="light" size="sm" radius="md">
              Sign up
            </Button>
            <SpeechMonitor size="lg" feedback />
          </Group>
        </AppShell.Section> */}
      </AppShell.Navbar>
      <AppShell.Main w="99vw">
        <StoryView />
        <WebcamUploadModal display={captureModal} finalAction={closeCapture} />
        {image && character && (
          <PremiseSelectModal
            character={character}
            display={premiseModal}
            finalAction={closePremise}
          />
        )}
      </AppShell.Main>
      <AppShell.Footer p="sm">
        <Flex w="100%" h="100%" justify="center" align="center" gap="sm">
          <Box>
            <Text component="span" fw={500} fs="italic" ff="heading">
              MyStoryKnight.
            </Text>{" "}
            is a project by{" "}
            <Button
              component={Link}
              to="https://github.com/tomfluff"
              replace={false}
              radius="lg"
              size="compact-sm"
              variant="gradient"
              gradient={{ from: "violet", to: "grape", deg: 90 }}
              c="white"
              px="sm"
              leftSection={<FaStar />}
            >
              tomfluff
            </Button>
          </Box>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
}

export default App;
