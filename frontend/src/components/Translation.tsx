import React, { useState } from 'react'
import { usePreferencesStore } from '../stores/preferencesStore';
import getAxiosInstance from '../utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { Box, Text } from '@mantine/core';

type Props = {
    content: string;
}

const Translation = ({ content }: Props) => {
    const instance = getAxiosInstance();
    const sourceLanguage = "en";
    const targetLanguage = usePreferencesStore.use.language();
    const [translatedText, setTranslatedText] = useState<string>(content);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["translate", content, sourceLanguage, targetLanguage],
        queryFn: ({ signal }) => {
            return instance.get("/translate", {
                params: {
                    text: content,
                    src_lang: sourceLanguage,
                    tgt_lang: targetLanguage
                },
                signal
            }).then((res) => {
                setTranslatedText(res.data.data.text);
                return res.data.data.text;
            });
        },
        enabled: !!content && sourceLanguage !== targetLanguage,
        staleTime: Infinity,
        refetchOnMount: false
    });

    if (isLoading) return <Box>Loading...</Box>;
    if (isError) return <Box>Error...</Box>;
    return (
        <Box>{translatedText}</Box>
    )
}

export default Translation