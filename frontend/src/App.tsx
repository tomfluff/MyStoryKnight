import "./App.css";
import {
  AppShell,
  Box,
  Burger,
  Button,
  Center,
  Flex,
  FloatingIndicator,
  Group,
  Loader,
  ScrollArea,
  Table,
  TableData,
  Tabs,
  Text,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import StoryView from "./components/StoryView";
import { ColorSchemeToggle } from "./components/ColorSchemeToggle/ColorSchemeToggle";
import { resetSession, useSessionStore } from "./stores/sessionStore";
import { useAdventureStore, clearStore, getKeyPointsTable } from "./stores/adventureStore";
import { clearEndStore } from "./stores/practiceEndingsStore";
import CharacterCard from "./components/CharacterCard";
import { useEffect, useMemo, useState } from "react";
import PremiseCard from "./components/PremiseCard";
import PreferenceModal from "./components/PreferenceModal/PreferenceModal";
import { resetPreferences } from "./stores/preferencesStore";
import AboutModal from "./components/AboutModal/AboutModal";
import InstructionView from "./components/InstructionView";
import PracticeEndingsView from "./components/PracticeEndingsView";
import Practice3ThingsView from "./components/Practice3ThingsView";
import KeyPointsView from "./components/KeyPointsView";

function App() {
  const [opened, { toggle: toggleNavbar }] = useDisclosure(false);
  const sessionId = useSessionStore.use.id();
  const isSession = useMemo(() => sessionId !== null, [sessionId]);

  const reset = () => {
    clearStore();
    clearEndStore();
    setIsStartedEndings(false);
    setIsStarted3Things(false);
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

  const [gameMode, setGameMode] = useState<string | null> (null);
  const [isStartedEndings, setIsStartedEndings] = useState<boolean>(false);
  const [isStarted3Things, setIsStarted3Things] = useState<boolean>(false);

  const [tabRootRef, setTabRootRef] = useState<HTMLDivElement | null>(null);
  const [tabValue, setTabValue] = useState<string | null>('1');
  const [tabControlsRefs, setTabControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
  const setTabControlRef = (val: string) => (node: HTMLButtonElement) => {
    tabControlsRefs[val] = node;
    setTabControlsRefs(tabControlsRefs);
  };

  // const [keyPoints, setKeyPoints] = useState(getKeyPointsTable());
  // const [toTranslate, setToTranslate] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = useAdventureStore.subscribe((state) => {
  //     setKeyPoints(getKeyPointsTable());
  //     setToTranslate(true);
  //   });
  //   return () => unsubscribe();
  // }, []);

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 320,
        breakpoint: "xs",
        collapsed: { mobile: !opened },
      }}
      padding="sm"
    >
      <AppShell.Header p="md">
        <Flex justify="space-between" align="center" direction="row" h="100%">
          <Burger
            opened={opened}
            onClick={toggleNavbar}
            hiddenFrom="sm"
            size="sm"
          />
          <Text size="md">MyStoryKnight.</Text>
          <Group gap="sm">
            <Button disabled={!isSession} onClick={reset} color="orange">
              Reset
            </Button>
            <AboutModal />
            <PreferenceModal />
            <ColorSchemeToggle />
          </Group>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section
          grow
          mt="xs"
          component={ScrollArea}
          type="scroll"
          scrollHideDelay={500}
        >
          {(isCharacter || isPremise) && (<Tabs variant="none" value={tabValue} onChange={setTabValue}>
            <Tabs.List ref={setTabRootRef} justify="center" style={{position: "sticky"}}>
              <Tabs.Tab 
                value="1" 
                ref={setTabControlRef('1')} 
                size="compact-md" 
                style={() => ({
                      fontWeight: 500, 
                      zIndex: 1,
                      color: tabValue === '1' ? "white" : undefined,
                    })
                  }>
                Context
              </Tabs.Tab>
              <Tabs.Tab 
                value="2" 
                ref={setTabControlRef('2')} 
                size="compact-md" 
                style={() => ({
                  fontWeight: 500, 
                  zIndex: 1,
                  color: tabValue === '2' ? "white" : undefined,
                })
              }>
                Keypoints
              </Tabs.Tab>

              <FloatingIndicator 
                target={tabValue ? tabControlsRefs[tabValue] : null}
                parent={tabRootRef}
                style={(theme) => ({
                  backgroundColor: theme.colors.violet[6],
                  borderRadius: theme.radius.md,
                  boxShadow: theme.shadows.md,
                  // padding: '4px 8px', // Add padding to the indicator?
                  // transform: 'translateY(-50%)', // Adjust position?
                  // zIndex: 1,
                  // fontWeight: 900,
                  // color: tabValue ? theme.colors.violet[0] : theme.colors.violet[6],
                })}>
                </FloatingIndicator>
            </Tabs.List>

            <Tabs.Panel value="1">
              <Flex direction="column">
                {isCharacter && (
                  <CharacterCard image={image!} character={character!} />
                )}
                {isPremise && <PremiseCard premise={premise!} />}
              </Flex>
            </Tabs.Panel>
            <Tabs.Panel value="2">
              <KeyPointsView/>
              {/* <KeyPointsView keypoints={keyPoints} toTranslate={toTranslate} setToTranslate={setToTranslate}/> */}
              {/* {KPLoading && (
                <Loader color="white" size="sm" type="dots" p={0} m={0} />
              )}
              {!KPLoading && <Table data={translatedKP}/>}             */}
            </Tabs.Panel>
          </Tabs>)}

          
        </AppShell.Section>
        {/* <AppShell.Section>
          <Group justify="center" p="sm">
            <SpeechMonitor size="lg" feedback />
          </Group>
        </AppShell.Section> */}
      </AppShell.Navbar>
      <AppShell.Main w={rem("99vw")}>
        {(!isSession || !isCharacter || !isPremise) && !isStartedEndings && !isStarted3Things 
                                                      && <InstructionView 
                                                          setGameMode={setGameMode} 
                                                          setIsStartedEndings={setIsStartedEndings}
                                                          setIsStarted3Things={setIsStarted3Things}/>}
        {isSession && isCharacter && isPremise && gameMode === "story" && <StoryView />}
        {isSession && gameMode === "practice" && isStartedEndings && <PracticeEndingsView reset={reset}/>}
        {isSession && gameMode === "practice" && isStarted3Things && <Practice3ThingsView reset={reset}/>}
        {/* {isStartedEndings && <Text>isStartedEndings is true</Text>}
        {isStarted3Things && <Text>isStarted3Things is true</Text>}
        {gameMode === "practice" && <Text>gameMode is practice</Text>} */}
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
