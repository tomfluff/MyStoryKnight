import json
import os
import requests
import sys

from langcodes import Language

from openai import OpenAI

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils import logger_setup
from config import *

DEBUG = LLM_DEBUG

logger = logger_setup("llm", os.path.join(LOG_FOLDER, "llm.log"), debug=DEBUG)


class Storyteller:
    def __init__(self, key, org) -> None:
        self.llm = OpenAI(api_key=key, organization=org)
        self.gpt4 = MODEL_GPT4
        self.gpt3 = MODEL_GPT3
        self.vision = MODEL_VISION
        self.image_gen = MODEL_IMAGE_GEN
        self.stt = MODEL_STT
        self.tts = MODEL_TTS

        logger.info(f"LLM storyteller initialized.")
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
            logger.error(e)
        finally:
            logger.debug(f"Data string: '{datastr}'")

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

    def initialize_story(self, context):
        # Context is a JSON object with the following keys: character, premise
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are a helpful assistant and a great storyteller for children. Help me initialize a story.
1. Using the input context, initialize a story.
2. Generate the first part of the story.
    - Using simple and easily understandable language.
    - No longer than 5 sentences.
    - End with some event that will lead to the next part.
3. The story should be about the protagonist in the context.
4. Give a conside visual description of a key moment in the story part.
    - Describe the environment.
    - Describe what the protagonist sees.
5. Return as a JSON object.
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.


Example JSON object:
{
    "text": "Once upon a time there was a cat named Johnny who loved to eat tuna. One day when Johnny was playing with his toys, he heard a noise coming from the kitchen. He went to investigate and found that someone had stolen his tuna!",
    "keymoment": "A can of tune filled with tuna that is overflowing to the floor in a kitchen.",
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

    def terminate_story(self, context):
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are a helpful assistant and a great storyteller for children. Help me gracefully end a story.
1. Understand the input object, example:
    {
        "character": {
            "name": "Johnny the cat",
            "about": "Johnny the cat loves tuna."
        },
        "story": "Once upon a time there was a cat named Johnny who loved to eat tuna. One day when Johnny was playing with his toys, he heard a noise coming from the kitchen.",
    }
2. Generate the final part of the story.
    - Using simple and easily understandable language.
    - No longer than 10 sentences.
    - Reach a satisfying conclusion.
3. The story should be about the character in the context.
4. Give a consice visual description of a key moment in the story part.
    - Describe the environment.
    - Describe what the character sees.
5. Return as a JSON object.
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.

Example JSON object:
{
    "story": {
        "text": "Johnny goes to the kitchen and finds that someone has stolen his tuna! He decides to investigate and finds that the thief is a dog named Max. Johnny chases Max out of the house and into the street. Max runs away and Johnny returns home to eat his tuna.",
        "keymoment": "A kitchen with a window, a table, and a chair. An empty tuna can is dropped on the floor.",
    }
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
                        "text": str(context),
                    },
                ],
            },
        ]
        data = self.send_gpt3_request(messages)
        return self.__get_json_data(data)

    def generate_actions(self, context, n=2):
        # Generate choices based on a given context
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are a helpful assistant and a great storyteller for children. Help me generate 2 choices of how this story continues.
1. Understand the input object.
2. Generate %d different actions the character can perform based on the story.
3. Each action is defined by:
    - Action, a couple of words stating what action the character will perform.
    - Description, describes the action in more detail.
4. Return as a JSON object. 
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.

Here is an example JSON object:
{
    "list": [
        {
            "action": "Investigate",
            "desc": "Johnny decides to go to the kitchen to investigate the noise.",
        },
        {
            "action": "Ignore",
            "desc": "Johnny decides to ignore the noise and continue playing with his toys.",
        },
    ]
}
                        """
                        % (n),
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

    def generate_story_part(self, context):
        # Generate a story part based on the given context
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are a helpful assistant and a great storyteller for children. Help me generate a story part.
1. Understand the input object.
2. Generate a story part based on the context.
    - The part should contnuie the story, based on the action of the character.
    - Using simple and easily understandable language.
    - No longer than 5 sentences.
    - End with some event that will lead to the next part.
3. Return as a JSON object.
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.
    
Example JSON object:
{
    "text": "Once upon a time there was a cat named Johnny who loved to eat tuna. One day when Johnny was playing with his toys, he heard a noise coming from the kitchen. He went to investigate and found that someone had stolen his tuna!",
    "keymoment": "A can of tune filled with tuna that is overflowing to the floor in a kitchen.",
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
                        "text": str(context),
                    },
                ],
            },
        ]
        data = self.send_gpt4_request(messages)
        return self.__get_json_data(data)

    def generate_premise(self, character, n=2):
        # Generate a premise based on the given character
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are a helpful assistant. Help me generate a story premise for this character.
0. Understand the input character, example: {"name": "Johnny the cat", "about": "A cat who loves tuna."}.
1. Generate %d different story premises for this character.
    - Each premise will take place in a uniqly different setting.
2. For each premise include the following:
    - A setting.
    - A goal.
    - A conflict.
    - A resolution.
3. Return as a JSON object. 
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.

Example JSON object:
{
    "list": [
        {
            "setting": {"long":"A kingdom in the sky.","short": "Sky kingdom"},
            "goal": "To become a knight.",
            "conflict": "The character is not a noble.",
            "resolution": "The character becomes a knight by saving the princess.",
        },
    ]
}
                        """
                        % (n),
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
        data = self.send_gpt4_request(messages)
        return self.__get_json_data(data)

    def generate_character(self, drawing_url):
        messages = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are a helpful assistant. Help me understand the drawing in this photo.
1. Generate a consice visual descroption of the drawing.
    - The content.
    - The visual style.
2. Tell me what items are drawn.
3. Come up with a name for the character in the drawing.
4. Make up a short backstory about the character in the drawing, that inckudes the following:
    - Who is this character?
    - What are the dreams and goals of this character?
    - What are the fears and worries of this character?
    - What is the character's personality?
5. Return as a JSON object. 
    - No styling and all in ascii characters.
    - Use double quotes for keys and values.

Here is an example JSON object:
{
    'image': {
        'items': [
            {'name': 'cat', 'importance': 0.9},
            {'name': 'bowl', 'importance': 0.5}
        ],
        'desc': 'A cat looking at a food bowl.', 
        'style': 'Simple crayon drawing with bright colors.',
        'colors': [{'color':'black','usage':'the cat is black'}]
    }, 
    'character': {
        'fullname': 'Johnny the cat',
        'shortname': 'Johnny',
        'likes': ['tuna', 'playing with toys'],
        'dislikes': ['dogs', 'water'],
        'fears': ['being hungry', 'being alone'],
        'personality': ['friendly', 'gluttonous', 'playful'],
        'backstory': 'Johnny the cat loves tuna. He is always hungry and looking for food. He is a very friendly cat and loves to play with his toys.',
    }
}
                        """,
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": drawing_url,
                    },
                ],
            },
        ]
        data = self.send_vision_request(messages)
        return self.__get_json_data(data)

    def generate_story_image(self, story_part):
        content = story_part["content"]
        style = story_part["style"]

        prompt = f"Create an image based on the following prompt: {content}. The style of the image should be {style}."
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
                        "text": f"You are a helpful assistant. Help me translate this text from {source} to {target}.",
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": text,
                    },
                ],
            },
        ]

        response = self.send_gpt3_request(messages)
        return response

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
            logger.debug(
                f"Successfuly sent 'vision' LLM request with model={self.vision}"
            )

            jresponse = response.json()
            return jresponse["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(e)
            raise e

    def send_gpt4_request(self, request):
        try:
            response = self.llm.chat.completions.create(
                model=self.gpt4,
                messages=request,
                response_format={"type": "json_object"},
                max_tokens=1024,
                temperature=1.05,
                presence_penalty=0.25,
            )
            logger.debug(f"Successfuly sent 'chat' LLM request with model={self.gpt4}")

            jresponse = json.loads(response.model_dump_json())

            return jresponse["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(e)
            raise e

    def send_gpt3_request(self, request):
        try:
            response = self.llm.chat.completions.create(
                model=self.gpt3,
                messages=request,
                max_tokens=1024,
            )
            logger.debug(
                f"Successfuly sent 'fast chat' LLM request with model={self.gpt3}"
            )

            jresponse = json.loads(response.model_dump_json())

            return jresponse["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(e)
            raise e

    def send_image_request(self, request):
        try:
            response = self.llm.images.generate(
                model=self.image_gen,
                prompt=request,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            logger.debug(
                f"Successfuly sent 'image' LLM request with model={self.image_gen}"
            )

            image_url = response.data[0].url
            return image_url
        except Exception as e:
            logger.error(e)
            raise e

    def send_tts_request(self, text):
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
            "response_format": "mp3",
        }

        with requests.post(url, headers=headers, json=data, stream=True) as response:
            if response.status_code == 200:
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
                logger.debug(
                    f"Successfuly sent 'voice (translate)' LLM request with model={self.stt}"
                )
                return transcript.model_dump_json(indent=4)
            else:
                transcript = self.llm.audio.transcriptions.create(
                    model=self.stt,
                    file=audio_file,
                    response_format="verbose_json",
                )
                logger.debug(
                    f"Successfuly sent 'voice (transcribe)' LLM request with model={self.stt}"
                )
                return transcript.model_dump_json(indent=4)
