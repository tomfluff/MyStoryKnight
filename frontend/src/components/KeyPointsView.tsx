import getAxiosInstance from "../utils/axiosInstance";
import { usePreferencesStore } from "../stores/preferencesStore";
import { useQuery } from "@tanstack/react-query";
import { TableData, Table, Loader, Center, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { getKeyPointsTable, useKeyPointsState } from "../stores/adventureStore";

// type Props = {
//   keypoints: TableData;
//   toTranslate: boolean;
//   setToTranslate: (val: boolean) => void;
// }

const KeyPointsView = () => {
  const instance = getAxiosInstance();
  const sourceLanguage = "en";
  const targetLanguage = usePreferencesStore.use.language();

  const [keyPoints, setKeyPoints] = useState(getKeyPointsTable());
  // console.log("useTableTranslation - content:", keyPoints);

  const [toTranslate, setToTranslate] = useState();

  useEffect(() => {
    setToTranslate(false);
    const unsubscribe = useKeyPointsState.subscribe((state) => {
      setKeyPoints(getKeyPointsTable());
      setToTranslate(true);
      console.log("useTableTranslation - toTranslate:", toTranslate);
    });
    return () => unsubscribe();
  }, []);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["translate", keyPoints, sourceLanguage, targetLanguage],
    queryFn: ({ signal }) => {
      if (sourceLanguage === targetLanguage) return keyPoints;
      setToTranslate(false);

      return instance
        .get("/translate", {
          params: {
            text: JSON.stringify(keyPoints),
            src_lang: sourceLanguage,
            tgt_lang: targetLanguage,
          },
          signal,
        })
        .then((res) => {
          console.log("useTableTranslation - res:", res);
          const jsonString = res.data.data.text.replace(/'/g, '"');
          const translatedKeyPoints: TableData = JSON.parse(jsonString);          
          console.log("useTableTranslation - translatedKeyPoints:", translatedKeyPoints);
          return translatedKeyPoints;
        }); 
    },
    enabled: !!keyPoints && keyPoints.body && keyPoints.body.length > 0 && toTranslate, //CONDITION HERE??
    staleTime: Infinity,
    refetchOnMount: false, //REFETCH HERE??
  });

  console.log("useTableTranslation - data:", data);
  console.log("useTableTranslation - toTranslate:", toTranslate);

  if (isLoading) {
    return (
      <Center>
        <Loader color="gray" size="xl" type="dots" />
      </Center>
    );
  }

  if (isError) {
    console.error("Error loading keypoints:", error);
    return (
      <Center>
        <Text c="red">Error loading keypoints</Text>
      </Center>
    );
  }

  return (
    <>
      <Table data={data}/>
    </>
  );
};

export default KeyPointsView;