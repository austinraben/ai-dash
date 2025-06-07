import os
import json
import random
from dotenv import load_dotenv
from crewai import Agent, Task, Crew

load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

with open("data/categories.json", "r") as f:
    categories_data = json.load(f)
categories = categories_data["categories"]

prompt_generator = Agent(
    role="Prompt Generator",
    goal="Generate basic prompts for a naming game based on given categories",
    backstory="You are an expert at creating fun and easy prompts for games, using a dataset of categories to inspire your ideas.",
    verbose=True,
    allow_delegation=False
)

def generate_prompt_task(category):
    options = {
        "Geography": ["geographical places that start with", "geographical places that are"],
        "Food": ["foods that are"],
        "Basketball": ["players who have", "teams that have"],
        "American Football": ["players who have", "teams that have"],
        "Weird Facts": ["weird things that"]
    }
    adjectives = ["popular", "spicy", "cold", "historic", "unique"]
    football_accomplishments = ["Super Bowl wins", "Pro Bowl selections", "statistical milestones", "hall of fame inductions"]

    if category == "Geography":
        adjective = random.choice(adjectives)
        prompt_type = random.choice(options[category])
        return Task(
            description=f"""
                Generate a basic prompt for a naming game based on the category '{category}'.
                The prompt should start with 'Name' and have clear, non-debatable, and many possible answers.
                Use the format: 'Name {prompt_type} {adjective}' or a unique variation (e.g., geographical places like countries, cities, or US states).
            """,
            agent=prompt_generator,
            expected_output="A single prompt string starting with 'Name'."
        )
    elif category == "Food":
        adjective = random.choice(adjectives)
        return Task(
            description=f"""
                Generate a basic prompt for a naming game based on the category '{category}'.
                The prompt should start with 'Name' and have clear, non-debatable, and many possible answers.
                Use the format: 'Name foods that are {adjective}' or a unique variation.
            """,
            agent=prompt_generator,
            expected_output="A single prompt string starting with 'Name'."
        )
    elif category == "Basketball":
        level = random.choice(["NBA", "NCAAB"])
        specific_accomplishments = {
            "NBA": [
                "players who won MVP in the 2010s",
                "teams that won championships in the 1990s",
                "players who have 5+ All-NBA selections since 2000",
                "players who averaged a triple-double in a season",
                "teams that drafted a Rookie of the Year since 2010"
            ],
            "NCAAB": [
                "teams that won championships in the 2000s",
                "players who were named Final Four MVP since 2010",
                "teams that produced a #1 NBA draft pick in the 2010s",
                "teams that reached the Final Four 3+ times since 2000",
                "players who won the Wooden Award in the 2010s"
            ]
        }
        prompt_type = random.choice(options[category])
        accomplishment = random.choice(specific_accomplishments[level])
        return Task(
            description=f"""
                Generate a basic prompt for a naming game based on the category '{category}' at the {level} level.
                The prompt should start with 'Name' and have clear, non-debatable answers, with a manageable number of possible answers (5-10).
                Use the format: 'Name {prompt_type} {accomplishment}' or a unique variation.
            """,
            agent=prompt_generator,
            expected_output="A single prompt string starting with 'Name'."
        )
    elif category == "American Football":
        level = random.choice(["NFL", "NCAAF"])
        specific_accomplishments = {
            "NFL": [
                "players who won Super Bowl MVP in the 2010s",
                "teams that won Super Bowls in the 2000s",
                "quarterbacks with 5+ Pro Bowl selections since 2000",
                "players who have 100+ career sacks",
                "running backs who rushed for 2,000 yards in a season"
            ],
            "NCAAF": [
                "teams that won national championships in the 2010s",
                "players who won the Heisman Trophy since 2010",
                "teams that had a #1 NFL draft pick in the 2010s",
                "teams that went undefeated in a season since 2000",
                "quarterbacks who threw for 4,000+ yards in a season since 2010"
            ]
        }
        prompt_type = random.choice(options[category])
        accomplishment = random.choice(specific_accomplishments[level])
        return Task(
            description=f"""
                Generate a basic prompt for a naming game based on the category '{category}' at the {level} level.
                The prompt should start with 'Name' and have clear, non-debatable, and many possible answers.
                Use the format: 'Name {prompt_type} {accomplishment}' or a unique variation.
            """,
            agent=prompt_generator,
            expected_output="A single prompt string starting with 'Name'."
        )
    else:  # Weird Facts
        constraints = [
            "animals with unusual mating habits",
            "foods that are illegal in some countries",
            "historical events that sound fake",
            "inventions that failed spectacularly",
            "natural phenomena that defy logic"
        ]
        constraint = random.choice(constraints)
        return Task(
            description=f"""
                Generate a basic prompt for a naming game based on the category '{category}'.
                The prompt should start with 'Name' and have clear, non-debatable, and many possible answers.
                Use the format: 'Name {constraint}' or a unique variation (e.g., 'funny' is synonymous with 'weird').
            """,
            agent=prompt_generator,
            expected_output="A single prompt string starting with 'Name'."
        )

if __name__ == "__main__":
    test_category = categories[2]  # "Basketball"
    task = generate_prompt_task(test_category)
    crew = Crew(
        agents=[prompt_generator],
        tasks=[task],
        verbose=True
    )
    result = crew.kickoff()
    print(f"PROMPT: {result}")