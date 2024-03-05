import { useState } from "react";
import getAxiosInstance from "../utils/axiosInstance";

const useTranslation = () => {
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
    return {}
}

export default useTranslation;