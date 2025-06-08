import os
import json
import random
import sys
from crewai import Agent, Task, Crew
from dotenv import load_dotenv

load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

with open("data/categories.json", "r") as f:
    categories_data = json.load(f)
categories = categories_data["categories"]

prompt_generator = Agent(
    role="Prompt Generator",
    goal="Generate unique, short, and valid prompts for a naming game based on given categories",
    backstory="You’re a creative expert at crafting concise, fun prompts for games, ensuring variety and feasibility based on category data, avoiding repetition or impossible scenarios.",
    verbose=True,
    allow_delegation=False
)

def generate_prompt_task(category):
    if category == "Geography":
        description = f"Generate a short, unique prompt for a naming game in the Geography category. The prompt must be one sentence in the format 'Name [geographical locations] that [specific condition]', where [geographical locations] is a type like countries or cities, and [specific condition] is a clear, feasible constraint with 5-10 possible answers, avoiding subjective terms like 'most' or 'best'. Examples: 'Name islands that are also countries' or 'Name rivers that flow through deserts'. Avoid repetition from recent prompts."
    elif category == "Food":
        description = f"Generate a short, unique prompt for a naming game in the Food category. The prompt must be one sentence in the format 'Name [food items or dishes] that [specific attribute]', where [food items or dishes] is a type like desserts or soups, and [specific attribute] is a clear, feasible constraint with 5-10 possible answers, avoiding repetition (e.g., no consecutive sandwich prompts) and subjective terms like 'most' or 'best'. Examples: 'Name fruits that grow underwater' or 'Name spices used in curries'."
    elif category == "Basketball":
        description = f"Generate a short, unique prompt for a naming game in the Basketball category. The prompt must be one sentence in the format 'Name [players or teams] that [specific achievement]', where [players or teams] is either players or teams, and [specific achievement] is a clear, historically feasible constraint with 5-10 possible answers, avoiding impossible feats (e.g., 100% stats) or subjective terms like 'most' or 'best'. Examples: 'Name players who won MVP in the 2000s' or 'Name teams that reached the Finals twice'. Avoid repetition from recent prompts."
    elif category == "American Football":
        description = f"Generate a short, unique prompt for a naming game in the American Football category. The prompt must be one sentence in the format 'Name [players or teams] that [specific achievement]', where [players or teams] is either players or teams, and [specific achievement] is a clear, historically feasible constraint with 5-10 possible answers, avoiding subjective terms like 'most' or 'best'. Examples: 'Name quarterbacks who won Super Bowls' or 'Name teams that hosted a Super Bowl'. Avoid repetition from recent prompts."
    else:  # Weird Facts
        description = f"Generate a short, unique prompt for a naming game in the Weird Facts category. The prompt must be one sentence in the format 'Name [things] that [unusual trait]', where [things] is a category like animals or objects, and [unusual trait] is a clear, feasible constraint with 5-10 possible answers, avoiding subjective terms like 'most' or 'best'. Examples: 'Name fish that can walk on land' or 'Name plants that glow'. Avoid repetition from recent prompts."
    
    return Task(
        description=description,
        agent=prompt_generator,
        expected_output="A single prompt string starting with 'Name'."
    )

if __name__ == "__main__":
    args = sys.argv[1:]
    category_idx = args.index('--category') if '--category' in args else -1
    category = ' '.join(args[category_idx + 1:]) if category_idx != -1 and category_idx + 1 < len(args) else None
    if not category or category not in categories:
        print("ERROR: No valid category provided")
        sys.exit(1)
    task = generate_prompt_task(category)
    crew = Crew(
        agents=[prompt_generator],
        tasks=[task],
        verbose=True
    )
    result = crew.kickoff()
    print(f"PROMPT: {result}")