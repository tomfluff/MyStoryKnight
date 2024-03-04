import React from 'react'
import { TPremise } from '../types/Premise'
import { Card, Spoiler, Text } from '@mantine/core';
import ReadController from './ReadController';

type Props = {
    premise: TPremise;
}

const PremiseCard = ({ premise }: Props) => {
    return (
        <Card shadow="md" my={8} padding="sm" radius="md">
            <Card.Section mb="sm">
                <Text size="md" fw={500} p="xs" bg="violet" c="white">
                    {premise.setting.short}
                </Text>
            </Card.Section>
            <Spoiler maxHeight={50} showLabel="Show more" hideLabel="Hide">
                {premise.setting.long}
            </Spoiler>
            <Card.Section p="xs">
                <ReadController id="card" text={premise.setting.long} />
            </Card.Section>
        </Card>
    )
}

export default PremiseCard