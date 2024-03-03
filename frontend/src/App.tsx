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
  useMantineColorScheme,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { FaMoon, FaSun, FaStar } from "react-icons/fa";
import SpeechMonitor from "./components/SpeechMonitor";
import StoryView from "./components/StoryView";

function App() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, { toggle: toggleNavbar }] = useDisclosure(false);

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
          <Button
            onClick={toggleColorScheme}
            variant="light"
            size="sm"
            radius="md"
            px="sm"
          >
            {colorScheme == "dark" ? <FaSun /> : <FaMoon />}
          </Button>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p={{ xs: "md", sm: "xs" }}>
        <AppShell.Section>
          <Stack gap="xs">
            <Button fullWidth>Restart session</Button>
            <Button fullWidth>New drawing</Button>
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
            <Card shadow="sm" my={8} padding="sm" radius="md" withBorder>
              <Card.Section mb="sm">
                <Skeleton h={128} />
              </Card.Section>
              <Text size="lg" fw={500}>
                Some Name
              </Text>
              <Spoiler maxHeight={100} showLabel="Show more" hideLabel="Hide">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit.
              </Spoiler>
            </Card>
            <Card shadow="md" my={8} padding="sm" radius="md">
              <Card.Section mb="sm">
                <Text size="md" fw={500} p="xs" bg="violet" c="white">
                  The Magestic Environment
                </Text>
              </Card.Section>
              <Spoiler maxHeight={50} showLabel="Show more" hideLabel="Hide">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit.
              </Spoiler>
            </Card>
          </Flex>
        </AppShell.Section>
        <AppShell.Section>
          <Group justify="center" p="sm">
            <Button variant="light" size="sm" radius="md">
              Log in
            </Button>
            <Button variant="light" size="sm" radius="md">
              Sign up
            </Button>
            <SpeechMonitor size="lg" feedback />
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main w="99vw">
        <StoryView />
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
