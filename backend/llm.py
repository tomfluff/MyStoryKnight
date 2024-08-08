import json
import os
from dotenv import load_dotenv
import requests
import sys
import random
import cv2
import base64
import numpy as np
import tempfile

from langcodes import Language

from openai import OpenAI

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils import logger_setup
from config import *

DEBUG = LLM_DEBUG

load_dotenv()
LOGGER = os.environ.get("LOGGER", "False").lower() in ("true", "1", "t")

if LOGGER:
    logger = logger_setup("llm", os.path.join(LOG_FOLDER, "llm.log"), debug=DEBUG)
else:
    logger = None


class Storyteller:
    def __init__(self, key, org) -> None:
        self.llm = OpenAI(api_key=key, organization=org)
        self.gpt4 = MODEL_GPT4
        self.gpt3 = MODEL_GPT3
        self.vision = MODEL_VISION
        self.image_gen = MODEL_IMAGE_GEN
        self.stt = MODEL_STT
        self.tts = MODEL_TTS

        if logger:
            logger.info(f"LLM storyteller initialized.")
        if logger:
            logger.debug(
                f"Modes: {self.gpt4}, {self.gpt3}, {self.vision}, {self.image_gen}, {self.stt}, {self.tts}"
            )

    def hello_world(self):
        messages = [
            {"role": "system", "content": "You are a helpful chatbot."},
            {"role": "user", "content": "Hello, who are you?"},
        ]
        return self.send_gpt4_request(messages)

    def __get_json_data(self, datastr):
        try:
            if datastr.strip().startswith("```json"):
                return json.loads(datastr.split("```json")[1].split("```")[0])
            elif datastr.strip().startswith("{"):
                return json.loads(datastr)
            else:
                raise Exception("Could not parse JSON data from string")
        except Exception as e:
            if logger:
                logger.error(e)
        finally:
            if logger:
                logger.debug(f"Data string: '{datastr}'")

    def __improve_prompt(
        self,
        prompt,
        usage="image generation model",
        info="Expand, add more details, and improve the prompt. Remove any mentions of names.",
        example="Childlike drawing with vivid colors of a cat looking at a food bowl.",
    ):
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are a helpful assistant. Help me improve the prompt for the usage of {usage}.
1. Understand the input prompt.
2. Improve the prompt for %s.
3. Make sure the prompt is safe, respectful, and does not violate any guidelines or policies.
4. %s
5. Output the improved prompt as one paragraph.

Example JSON output:
{
    "old_prompt": "...",
    "new_prompt": "%s",
}
"""
                        % (usage, info, example),
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Prompt: %s" % (prompt),
                    },
                ],
            },
        ]
        data = self.send_gpt3_request(messages)
        data = self.__get_json_data(data)
        if logger:
            logger.debug(f"Improved prompt: {data}")
        return data

    # -- Unimplemented Functions --

    def __inquire_drawing(self, data):
        # Send LLM request to inquire about the drawing (based on the data)
        pass

    def __analyze_feedback(self, feedback):
        # Analyze the user feedback (positive or negative, etc.)
        pass

    def __calc_story_part_score(self, story_part):
        # Get the score of a story part
        pass

    def __get_least_frequenct_word(self, story_part):
        # Get the least frequent word in the story part
        pass

    def __get_diff_story_elements(self, story_part):
        # Get the different story elements in the story part
        pass

    def __get_named_story_elements(self, story_part):
        # Get the named story elements in the story part
        pass

    def __check_ending_condition(self):
        # Check if the story should be finished
        pass

    # -- Storyteller Functions --

    def initialize_story(self, context, complexity):
        length = random.choice([1, 1, 1, 2, 2, 3, 4])
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You a great storyteller.
1. Using the input context, initialize a story.
2. Generate the first part of the story.
    - Not more than %d sentences.
3. %s
4. The story should be about the protagonist in the context.
5. Give a short visual description of a key moment in the story part.
    - Describe the environment.
    - Do not name the main character.
6. Categorize the sentiment of the new part. Choose from: 'happy', 'sad', 'neutral', 'shocking'.
7. Return as a JSON object.
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.


Example JSON object:
{
    "text": "Once upon a time there was a cat named Johnny who loved to eat tuna. One day when Johnny was playing with his toys, he heard a noise coming from the kitchen. He went to investigate and found that someone had stolen his tuna!",
    "keymoment": "A tuna-can filled with tuna that is overflowing to the floor in a kitchen.",
    "sentiment": "sad",
}
"""
                        % (length, complexity),
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": str(context),
                    },
                ],
            },
        ]
        data = self.send_gpt4_request(messages)
        return self.__get_json_data(data)

    def analyze_story_parts(self, context):
        # Send LLM request to analyze story parts based on a given context.
        story = context["story"]
        story_parts = context["story_parts"]
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are a helpful assistant and a great storyteller for children. Help me analyze this story.
0. Understand the input story which is the story so far, example: 
    [
        "Once upon a time in the vibrant city of Jubilantville, there lived a Super Happy Kid, a joyful young hero named after the infectious happiness that radiated from every fiber of their being. Their real name was a mystery, obscured by the aura of positivity that surrounded them. Super Happy Kid was known for their beaming smile, boundless energy, and an unwavering courage that inspired everyone fortunate enough to cross paths with them.",
        "The air in Jubilantville was tinged with excitement, as the city thrived on advanced technology, colorful skyscrapers, and an atmosphere of perpetual celebration. However, amidst the dazzling lights and joyous festivities, a subtle undercurrent of darkness began to emerge.",
        "Super Happy Kid, with their innate sense of optimism, became aware of a growing threat looming over Jubilantville—an evil force fueled by artificial intelligence. This menacing entity, driven by a desire to overshadow the city's jubilant spirit, had begun spreading its influence, turning once-happy citizens into mindless minions.",
    ]
1. Understand the input story_parts, example:
    [
        {
            "text": "As the evil force continues to spread its influence, Super Happy Kid seeks the help of the city's brightest minds and together they devise a plan to counter the AI's manipulative tactics, utilizing advanced technology and their infectious positivity to combat the growing darkness.",
        },
        {
            "text": "Super Happy Kid realizes that the evil force is using advanced technology to manipulate the citizens and decides to confront the AI head-on, using their boundless energy and unwavering courage to outmatch the malevolent intelligence."
        }
    ]
2. Use the story to analyze each of the texts in story_parts
3. When analyzing each of the story_parts, generate the following information:
    - an intensity value between 0 and 10.
    - an emotion, e.g. 'happy', 'sad', etc.
    - a positioning, e.g. 'start', 'middle', 'end', etc.
    - a complexity value between 0 and 1.v
4. Return as a JSON object.
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.

Here is an example JSON object:
{
    "analytics": [
        {
            "intensity": "0.8",
            "emotion": "determined",
            "positioning": "middle",
            "complexity": "0.7",
        },
        {
            "intensity": "0.9",
            "emotion": "courageous",
            "positioning": "middle",
            "complexity": "0.8",
        },
    ]
}
                        """,
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": str(story),
                        "text": str(story_parts),
                    },
                ],
            },
        ]
        data = self.send_gpt3_request(messages)
        return self.__get_json_data(data)

    def terminate_story(self, context, complexity):
        endings = [
            "Ends in a plot twist.",
            "Ends with a moral lesson.",
            "Ends with a happy ending.",
            "Ends with a sad ending.",
        ]
        ending = random.choice(endings)
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You a great storyteller.
1. Understand the story so far.
2. Generate the final part of the story.
    - Reach a conclusion for the story.
    - %s
3. %s
5. Give a short visual description of a key moment in the story part.
    - Describe the environment.
    - Do not name the main character.
6. Categorize the sentiment of the new part. Choose from: 'happy', 'sad', 'neutral', 'shocking'.
7. Return as a JSON object.
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.

Example JSON object:
{
    "part": {
        "text": "He went to investigate and found that someone had stolen his tuna!",
        "keymoment": "A can of tune filled with tuna that is overflowing to the floor in a kitchen."
        "sentiment": "sad",
    }
}
"""
                        % (ending, complexity),
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": str(context),
                    },
                ],
            },
        ]
        data = self.send_gpt3_request(messages)
        return self.__get_json_data(data)

    def generate_actions(self, context, complexity, n=2):
        # Generate choices based on a given context
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You a great storyteller.
1. Understand the story so far.
2. Help me generate %d unique actions the main character may perform.
3. Each action should advance the current story somehow.
3. Action is defined by:
    - Title, few words describing the action.
    - Description, very short paragraph with more details.
4. %s
5. Return as a JSON object. 
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.

Here is an example JSON object:
{
    "list": [
        {
            "title": "Investigate",
            "desc": "Johnny decides to go to the kitchen to investigate the noise.",
        },
        {
            "title": "Ignore",
            "desc": "Johnny decides to ignore the noise and continue playing with his toys.",
        },
    ]
}
                        """
                        % (n * 2, complexity),
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": str(context),
                    },
                ],
            },
        ]
        data = self.send_gpt4_request(messages)
        return self.__get_json_data(data)

    def generate_story_part(self, context, complexity):
        # Generate a story part based on the given context
        length = random.choice([1, 1, 1, 2, 2, 3, 4])
        settings = [
            "Something bad happens to the main character.",
            "Introduce a new villain.",
            "Introduce a new friendly character.",
            "Move the story to a new location.",
            "End in a cliffhanger.",
        ]
        # Randomly select a setting from the list
        setting = random.choice(settings)
        convergence = random.choice([setting, "Direct the story towards the premise."])
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You a great storyteller.
1. Understand the input object, example:
    {
        "premise": "Johnny needs to find out who stole his tuna.",
        "story": "Once upon a time there was a cat named Johnny who loved to eat tuna. One day when Johnny was playing with his toys, he heard a noise coming from the kitchen.",
        "action": "Investigate",
    }
2. Understand the story so far.
2. Continue the story based on the main character performing the given action.
3. The next story part shoube be:
    - %s
    - %s
    - Not more than %d sentences.
4. Generate a short visual description of a key moment in the new part:
    - Describe the environment.
    - Do not name the main character.
5. Categorize the sentiment of the new part. Choose from: 'happy', 'sad', 'neutral', 'shocking'.
6. %s
7. Return as a JSON object.
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.
    
Example JSON object:
{
    "part": {
        "text": "He went to investigate and found that someone had stolen his tuna!",
        "keymoment": "A can of tune filled with tuna that is overflowing to the floor in a kitchen."
        "sentiment": "sad",
    }
}
"""
                        % (convergence, setting, length, complexity),
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": str(context),
                    },
                ],
            },
        ]
        data = self.send_gpt4_request(messages)
        return self.__get_json_data(data)

    def generate_premise(self, character, complexity, n=2):
        # Generate a premise based on the given character
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are a helpful assistant. Help me generate a story premise for this character.
0. Understand the input context.
1. Generate %d unique story locations.
2. For each premise include the following:
    - title, a short title for the premise.
    - desc, a short description of the premise.
3. %s
4. Return as a JSON object. 
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.

Example JSON object:
{
    "list": [
        {
            "title": "Sky kingdom",
            "desc": "A kingdom in the sky where the protagonist has to save the queen from an evil dragon."
        },
    ]
}
"""
                        % (n, complexity),
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": str(character),
                    },
                ],
            },
        ]
        data = self.send_gpt3_request(messages)
        return self.__get_json_data(data)

    def generate_character(self, drawing_url, complexity):
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are a helpful assistant. Help me understand the drawing in this photo.
1. Generate a short descroption of the drawing.
    - The contained content.
    - The visual style.
2. Tell me what items are drawn.
3. Name the character in the drawing.
4. Write a short backstory about the character in the drawing.
5. %s
6. Return as a JSON object. 
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.

Here is an example JSON object:
{
    'image': {
        'items': [
            {'name': 'cat', 'importance': 0.9}
        ],
        'content': 'A cat looking at a food bowl.', 
        'style': 'Simple crayon drawing with bright colors.',
        'colors': [
            {'color':'black','usage':'the cat is black'}
        ]
    }, 
    'character': {
        'fullname': 'Johnny the cat',
        'shortname': 'Johnny',
        'likes': ['tuna', 'playing'],
        'dislikes': ['dogs', 'water'],
        'fears': ['being hungry', 'being alone'],
        'personality': ['friendly', 'gluttonous', 'playful'],
        'backstory': 'Johnny the cat loves tuna. He is always hungry and looking for food. He is a very friendly cat and loves to play with his toys.',
    }
}
"""
                        % (complexity),
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": drawing_url},
                    },
                ],
            },
        ]
        data = self.send_vision_request(messages)
        return self.__get_json_data(data)

    def generate_story_image(self, story_part):
        content = story_part["content"]
        style = story_part["style"]

        prompt = f"""
{content}.
In the style of: {style}.
"""
        prompt = self.__improve_prompt(
            prompt, "image generation model to generate drawings"
        )
        prompt = prompt["new_prompt"]

        result = self.send_image_request(prompt)
        return {"prompt": prompt, "image_url": result}

    def translate_text(self, text, source_language="en", target_language="en"):
        source = Language.get(source_language)
        target = Language.get(target_language)
        # Translate the given text to the target language using LLM
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
Translate text from %s to %s.
1. Translate the given text.
2. Return the translated text in the target language.

Example JSON object:
{
    "original": "...",
    "translation": "...",
}
"""
                        % (source, target),
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Original text: '%s'." % text,
                    },
                ],
            },
        ]

        response = self.send_gpt3_request(messages)
        response = self.__get_json_data(response)
        data = response["translation"]
        if logger:
            logger.debug(f"Translated text: {data}")
        return data
    
    def process_motion(self, frames):
        if logger:
            logger.debug(f"Processing motion...")

        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are a stunt coreographer. Help describe the most important motion presented in the video. What is the person doing?
                        """,
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """
Using JSON format, output: title, desctiption, emotion, action, keywords.
Example:
{
    "title": "Punch Demonstration",
    "description": "A person transitions from a neutral standing position to a ready fighting stance, punches several timesm, and returns back to a neutral standing position.",
    "emotion": "Focused",
    "action": "Punching",
    "keywords": ["punch", "fighting"]
}
""",
                    },
                ],
            },
            {
                "role": "user",
                "content": [
                    "These are video frames in order.",
                    *map(lambda frame: {"type": "image_url", "image_url": {
                    "url": f'data:image/jpg;base64,{frame}', "detail": "low"}},
                    frames)  
                ],
            }
        ]
        
        data = self.send_gpt4_request(messages)
        return self.__get_json_data(data)

    # -- LLM Request Functions --

    def send_vision_request(self, request):
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.llm.api_key}",
                "OpenAI-Organization": f"{self.llm.organization}",
            }
            payload = {
                "model": self.vision,
                "messages": request,
                "max_tokens": 1024,
            }
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload,
            )
            if logger:
                logger.debug(
                    f"Successfuly sent 'vision' LLM request with model={self.vision}"
                )
                logger.debug(
                    f"Response = {response.json()}"
                )

            jresponse = response.json()
            return jresponse["choices"][0]["message"]["content"]
        except Exception as e:
            if logger:
                logger.error(str(e) + str(response))
            raise e

    def send_gpt4_request(
        self, request, is_jason=True, temperature=1.0, presence_penalty=0.0
    ):
        try:
            response = self.llm.chat.completions.create(
                model=self.gpt4,
                messages=request,
                response_format={"type": "json_object"} if is_jason else None,
                max_tokens=1024,
                temperature=temperature,
                presence_penalty=presence_penalty,
            )
            if logger:
                logger.debug(
                    f"Successfuly sent 'chat' LLM request with model={self.gpt4}"
                )

            jresponse = json.loads(response.model_dump_json())

            return jresponse["choices"][0]["message"]["content"]
        except Exception as e:
            if logger:
                logger.error(e)
            raise e

    def send_gpt3_request(
        self, request, is_jason=True, temperature=1.0, presence_penalty=0.0
    ):
        try:
            response = self.llm.chat.completions.create(
                model=self.gpt3,
                messages=request,
                response_format={"type": "json_object"} if is_jason else None,
                max_tokens=1024,
                temperature=temperature,
                presence_penalty=presence_penalty,
            )
            if logger:
                logger.debug(
                    f"Successfuly sent 'fast chat' LLM request with model={self.gpt3}"
                )

            jresponse = json.loads(response.model_dump_json())

            return jresponse["choices"][0]["message"]["content"]
        except Exception as e:
            if logger:
                logger.error(e)
            raise e

    def send_image_request(self, request):
        try:
            response = self.llm.images.generate(
                model=self.image_gen,
                prompt=request,
                size=IMAGE_GEN_RESOLUTION,
                quality="standard",
                style="natural",
                n=1,
            )
            if logger:
                logger.debug(
                    f"Successfuly sent 'image' LLM request with model={self.image_gen}"
                )

            image_url = response.data[0].url
            return image_url
        except Exception as e:
            if logger:
                logger.error(e)
            raise e

    def send_tts_request(self, text, os="undetermined"):
        # Based on this answer: https://github.com/openai/openai-python/issues/864#issuecomment-1872681672
        url = "https://api.openai.com/v1/audio/speech"
        headers = {
            "Authorization": f"Bearer {self.llm.api_key}",
            "OpenAI-Organization": f"{self.llm.organization}",
        }
        data = {
            "model": self.tts,
            "input": text,
            "voice": "echo",
            "response_format": "mp3" if os == "ios" else "opus",
        }

        with requests.post(url, headers=headers, json=data, stream=True) as response:
            if response.status_code == 200:
                if logger:
                    logger.debug(
                        f"Successfuly sent 'speech' LLM request with model={self.tts}"
                    )
                for chunk in response.iter_content(chunk_size=4096):
                    yield chunk

    def send_stt_request(self, input, translate=False):
        # TODO: Maybe move to file-in-memory approach without saving/opening the file
        with open(input, "rb") as audio_file:
            if translate:
                transcript = self.llm.audio.translations.create(
                    model=self.stt,
                    file=audio_file,
                    response_format="verbose_json",
                )
                if logger:
                    logger.debug(
                        f"Successfuly sent 'voice (translate)' LLM request with model={self.stt}"
                    )
                return transcript.model_dump_json(indent=4)
            else:
                print("Transcribing...")
                transcript = self.llm.audio.transcriptions.create(
                    model=self.stt,
                    file=audio_file,
                    language="en",
                    prompt="This voice recording is from a presentation about reinforcement learning with robots.",
                    response_format="json",
                )
                print("Transcribed")
                if logger:
                    logger.debug(
                        f"Successfuly sent 'voice (transcribe)' LLM request with model={self.stt}"
                    )
                print("Dumping JSON")
                return transcript.model_dump_json(indent=4)
