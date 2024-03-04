import React from 'react'
import { Text, Button, Menu, Group, ActionIcon, rem, useMantineTheme, Popover, Stack } from '@mantine/core';
import { TAction } from '../types/Story';
import { FaEllipsisVertical } from "react-icons/fa6";
import ReadController from './ReadController';


const ActionButton = ({ action, desc }: TAction) => {

    const theme = useMantineTheme();
    return (
        <Group wrap="nowrap" gap={0}>
            <Button size="sm" style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
            }}>{action}</Button>
            <Popover width={300} position="top" withinPortal shadow="md">
                <Popover.Target>
                    <Button size="sm" px="xs"
                        color="violet.9"
                        style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                        }}>
                        <FaEllipsisVertical />
                    </Button>
                </Popover.Target>
                <Popover.Dropdown>
                    <Stack gap="xs">
                        <Text>{desc}</Text>
                        <ReadController id="action" text={desc} />
                    </Stack>
                </Popover.Dropdown>
            </Popover>
        </Group>
    )
}

export default ActionButton